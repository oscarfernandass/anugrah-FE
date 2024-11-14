import { StyleSheet, Text, View,Image ,ScrollView, TouchableOpacity,ActivityIndicator, SectionList} from 'react-native'
import React, { useState,useEffect } from 'react'
import Start from '../../assets/icons/Start.svg';
import Play from '../../assets/icons/Play.svg';
import Read from '../../assets/icons/Read.svg';
import Lock from '../../assets/icons/Lock.svg';
import Tick from '../../assets/icons/Tick.svg';
import Pdf from '../../assets/icons/Pdf.svg';
import Download from '../../assets/icons/Download.svg';
import MaterialCard from '../../components/MaterialCard';
import { getCoursePage } from '../../api/api';
import  { useNavigation } from '@react-navigation/native';
const Resources = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getSectionizedData = ({resources, ...section}) => {
    return {...section, data : resources }
    }
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getCoursePage(107, 60570);
        console.log(response); // Inspect the response structure
        setData(response.msg.sections.map(getSectionizedData).filter(e => e?.data?.length ) || []); // Ensure the response is correctly structured
      } catch (error) {
        Alert(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  return (
    <>
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color="black" />
      </View>
    ) : (
    <ScrollView className="" style={styles.container}>
                {data.length > 0 ? (
            <SectionList
              sections={data}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              // ItemSeparatorComponent={() => </View>}
              renderSectionHeader={({section : {section_name}})=>{
                return (<View className="my-3">
                  <Text style={styles.tit}>{section_name}</Text>
                  </View>)
              }}
              renderSectionFooter={()=>(<View className="mt-4" />)}

              keyExtractor={(item, index) => item.id + index}
              renderItem={({ item, index , section }) => (
                <View>
                <MaterialCard
                  start={<Pdf />}
                  title={item.resource_name}
                  end= {<Download />} 
                  />
                  <View className={`h-[1px] bg-[#F2F2F2] ${section.data.length -1 == index ? 'w-[98%] mt-4': 'w-[90%]'}  self-end mb-4`}></View>
                </View>
              )}
            />
          ) : (
            <Text>No course data available.</Text>
          )}
    </ScrollView>
    )}
    </>
  )
}

export default Resources

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:15,
    paddingTop:0,
    backgroundColor:'white',
  },
  box1:{
    flexDirection:'column',
    gap:15,
    borderBottomColor:'lightgrey',
    borderBottomWidth:1,
  },
  box2:{
    gap:15,
    flexDirection:'column',
    // marginTop:20,
  },
  box3:{
    gap:15,
    flexDirection:'column',
    marginTop:'4%',
    paddingBottom:'10%',
  },
  tit:{
    color:'grey',
    fontSize:14,
  },
  text:{
    color:'black',
    fontWeight:'700',
    fontSize:15,
  },
  p:{
    color:'grey',
    fontSize:12,
  },
  but:{
    justifyContent:'center',
    alignItems:'center',
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
})