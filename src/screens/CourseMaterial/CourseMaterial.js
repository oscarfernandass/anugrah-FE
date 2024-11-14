import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, ToastAndroid, SectionList } from 'react-native';
import Play from '../../assets/icons/Play.svg';
import Read from '../../assets/icons/Read.svg';
import Lock from '../../assets/icons/Lock.svg';
import Tick from '../../assets/icons/Tick.svg';
import Download from '../../assets/icons/Download.svg';
import MaterialCard from '../../components/MaterialCard';
import { useNavigation } from '@react-navigation/native';
import { getCoursePage } from '../../api/api';
import Start from '../../assets/icons/Start.svg';
import Dot from '../../assets/icons/Dot.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { downloadFile } from './Download';

const CourseMaterial = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null); // State to track ongoing downloads
  const [downloadedFiles, setDownloadedFiles] = useState({}); // Track downloaded files
  const getSectionizedData = ({content, ...section}) => {
    return {...section, data : content }
    }
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getCoursePage(107, 60570);
        setData(response.msg.sections || []);
        console.log(JSON.stringify(response.msg.sections.map(getSectionizedData)));
        // Check AsyncStorage for previously downloaded files
        const storedFiles = await AsyncStorage.getItem('downloadedFiles');
        if (storedFiles) {
          setDownloadedFiles(JSON.parse(storedFiles));
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const generateDownloadKey = (sectionId, contentId) => `${sectionId}_${contentId}`;

  const getIcon = (type, content) => {
    if (!content) {
      return null;
    }

    switch (type) {
      case 'video':
        return <Play />;
      case 'assessment_link':
        return <Lock />;
      case 'reading_material':
        return <Read />;
      default:
        return null;
    }
  };

  const handlePress = async (sectionId, content) => {
    const downloadKey = generateDownloadKey(sectionId, content.id);
    if (downloadedFiles[downloadKey]) {
      // Open from AsyncStorage
      const filePath = downloadedFiles[downloadKey];
      ToastAndroid.show('Playing from downloads...', ToastAndroid.SHORT);
      console.log(filePath);
      navigation.navigate('VideoPlay', { content, localPath: filePath });
    } else {
      navigation.navigate('VideoPlay', { content });
    }
  };
  

  const handleDownload = async (sectionId, content) => {
    const downloadKey = generateDownloadKey(sectionId, content.id);
    ToastAndroid.show('Downloading...', ToastAndroid.SHORT);
    setDownloading(downloadKey); // Start downloading state
  
    try {
      const filePath = await downloadFile(content.content); // Await the downloadFile function
      if (filePath) {
        // Update the downloadedFiles state and AsyncStorage
        const newDownloadedFiles = { ...downloadedFiles, [downloadKey]: filePath };
        setDownloadedFiles(newDownloadedFiles);
        await AsyncStorage.setItem('downloadedFiles', JSON.stringify(newDownloadedFiles));
        
        // Show success message
        ToastAndroid.show('Download completed!', ToastAndroid.SHORT);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setDownloading(null); // Stop downloading state
    }
  };
  
  
  

  const firstSection = data.length > 0 ? data[0] : null;
  const firstContent = firstSection && firstSection.content.length > 0 ? firstSection.content[0] : null;

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color="black" />
        </View>
      ) : (
        <ScrollView className="pl-[16px] pr-[16px]" style={styles.container}>
          {firstContent && (
            <View className="pb-[31px]" style={styles.box1}>
              <Text className="mt-[16px] text-[12px] font-[400] leading-[16px] text-[#939CA3]" style={[styles.tit, styles.font]}>Up Next</Text>
              <View className="mt-[16px]" style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                  {getIcon(firstContent.type, firstContent)}
                  <View style={{ flexDirection: 'column' }}>
                    <Text className="text-[14px] font-[500] leading-[20px] text-left" style={[styles.text, styles.font]}>{firstContent.title}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <Text className="text-[12px] font-[400] leading-[16px] text-[#6D747A] mr-[8px]" style={[styles.p, styles.font]}>Video</Text>
                      <Dot style={{ alignSelf: 'center', marginBottom: 3.5, width: 3, height: 3, paddingTop: 6.5, paddingBottom: 6.5 }} />
                      <Text className="text-[12px] font-[400] leading-[16px] text-[#6D747A] ml-[8px]" style={[styles.p, styles.font]}>{firstContent.duration}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.but}
                  onPress={() => handlePress(firstSection.id, firstContent)}
                >
                  <Start />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {data.length > 0 ? (
            <SectionList
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              sections={data.map(getSectionizedData)}
              keyExtractor={(item, index) => item.id + index}
              ItemSeparatorComponent={() => <View className="h-[1px] bg-[#F2F2F2] w-[90%] self-end mt-[20px]"></View>}
              renderSectionHeader={({section : {section_name}})=>{
                return (<View>
                  <View className="mb-8 h-[1px] w-[99%] self-end bg-[#F2F2F2]"/>
                  <Text style={styles.tit}>{section_name}</Text>
                  </View>)
              }}
              renderSectionFooter={()=>(<View className="mt-8" />)}
              renderItem={({ item, index, section }) => {
                const downloadKey = generateDownloadKey(section.id, item.id);
              console.log(downloadKey);
                return item && item.id ? (
                  <MaterialCard
                    key={index}
                    title={typeof item.title === 'string' ? item.title : 'Untitled Content'}
                    sub={
                      item.type === 'video'
                        ? 'Video'
                        : item.type === 'assessment_link'
                          ? 'Quiz'
                          : item.type === 'reading_material'
                            ? 'Reading'
                            : ''
                    }
                    duration={
                      item.type === 'video'
                        ? `${item.duration}`
                        : item.type === 'assessment_link'
                          ? '10 Questions'
                          : item.type === 'reading_material'
                            ? '5 min'
                            : ''
                    }
                    start={getIcon(item.type, item)}
                    end={
                      item.type !== 'assessment_link' ? (
                        downloading === downloadKey ? (
                          <ActivityIndicator size={26} color="#2E6BE5" />
                        ) : downloadedFiles[downloadKey] ? (
                          <Tick />
                        ) : (
                          <TouchableOpacity onPress={() => handleDownload(section.id, item)}>
                            <Download />
                          </TouchableOpacity>
                        )
                      ) : null
                    }
                    onPress={() => {
                      if (item.type === 'video') {
                        handlePress(section.id, item);
                      }
                    }}
                  />
                ) : null;
              }}
            />
          ) : (
            <Text>No course data available.</Text>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default CourseMaterial;

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Helvetica Neue',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  section: {
    flexDirection: 'column',
  },
  tit: {
    color: '#939CA3',
  },
  text: {
    color: 'black',
  },
  p: {
    color: '#6D747A',
  },
  but: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    opacity: 0.5,
  },
  box1: {
    flexDirection: 'column',
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
  },
});
