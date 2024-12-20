import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

const VideoPlaying = () => {

  const items = [
    {
      icon: require('./assets/play_icon.png'),
      title: 'Introduction to UX Design',
      subtitle: 'Video • 5 min',
      tick: true,
    },
    {
      icon: require('./assets/reading_icon.png'),
      title: 'Difference between UI/UX design?',
      subtitle: 'Reading • 5 min',
      tick: true,
    },
    {
      icon: require('./assets/play_icon.png'),
      title: 'What is the UX design process?',
      subtitle: 'Video • 5 min',
      tick: false,
    },
    {
      icon: require('./assets/play_icon.png'),
      title: 'What is design thinking?',
      subtitle: 'Video • 5 min',
      tick: false,
    },
    {
      icon: require('./assets/lock_icon.png'),
      title: 'Assessment',
      subtitle: 'Quiz • 10 Questions',
      tick: false,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft}>
          <Image source={require('./assets/back_arrow.png')} style={styles.icon} />
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
        <Image source={require('./assets/menu_icon.png')} style={styles.icon} />
      </View>

      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
          <Image source={require('./assets/thumbnail.png')} style={styles.thumbnail} />
      </View>
      {/* Generated by AI */}
      {/* <LinearGradient colors={['rgba(144, 104, 193, 0.1)', 'rgba(27, 161, 227, 0.1)']} style={styles.generatedByAI}> */}
      {/* </LinearGradient> */}

      <View style={styles.generatedByAI}>
        <Image source={require('./assets/ai_icon.png')} style={styles.aiIcon} />
        <Text style={styles.generatedText}>Generated by AI</Text>
      </View>

      {/* Main Content */}
      <Text style={styles.title}>What is the UX design process?</Text>
      {/* <Text style={styles.subTitle}>Video • 5 min</Text> */}
      <View style={styles.videoInfoContainer}>
        <Text style={styles.videoInfo}>Video</Text>
        <Image source={require('./assets/ellipse-3.png')} style={styles.dotIcon} />
        <Text style={styles.videoInfo}>5 min</Text>
      </View>

      {/* Horizontal Line */}
      <View style={styles.line} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>01 - Getting Started</Text>

        {items.map((item, index) => (
           <View key={index}>
           <View style={styles.item}>
             <Image source={item.icon} style={styles.icon} />
             <TouchableOpacity style={styles.textContainer}>
               <Text style={styles.itemTitle}>{item.title}</Text>
               <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
             </TouchableOpacity>
             {item.tick && <Image source={require('./assets/tick_icon.png')} style={styles.icon} />}
           </View>
            {index < items.length - 1 && <View style={styles.itemLine} />}
          </View>
        ))}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 16,
    marginTop:48,
    marginBottom:20,
    marginHorizontal:15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 6,
    color: "#999",
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  thumbnailContainer: {
    width:400,
    height:250,
    marginBottom:18,
  },
  thumbnail: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  generatedByAI: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent:'center',
    // padding: 16,
    paddingHorizontal: 8,  
    paddingVertical: 4,
    backgroundColor: '#e0e0e0',
    width:120,
    height:26,
    borderRadius: 16,
    marginLeft:18,
    marginBottom:-12,
  },
  aiIcon: {
    width: 13,
    height: 13,
    top:2,
    // resizeMode: 'contain',
  },
  generatedText: {
    marginLeft: 4,
    fontSize: 11,
  },
  title: {
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  line: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 16,
    marginHorizontal:9,
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 14,
    // fontWeight: 'bold',
    color: "#939ca3",
    marginBottom: 8,
    marginTop:10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    // borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemLine: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 25,
    marginLeft:44,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  itemTitle: {
    fontSize: 14,
    color: "#000",
    fontWeight:'bold',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#555',
    color: "#6d747a",
  },



  videoInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -11,
    marginLeft:18,
    marginBottom:13,
  },
  videoInfo: {
    fontSize: 12,
    // fontFamily: FontFamily.body16Medium,
    color: "#6d747a",
    lineHeight: 16,
    fontSize:12,
  },
  dotIcon: {
    width: 3,
    height: 3,
    marginHorizontal: 6,
  },
});

export default VideoPlaying;
