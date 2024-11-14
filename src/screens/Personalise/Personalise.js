import { Image, ScrollView, Text, View, TouchableOpacity,StyleSheet } from 'react-native';
import React from 'react';
import img from '../../assets/images/img.png';
import ticken from '../../assets/images/ticken.png';
import { useNavigation } from '@react-navigation/native';
const Personalise = () => {
    const navigation=useNavigation();
  return (
    <ScrollView contentContainerStyle={{flexDirection: 'column', backgroundColor: 'white' }}>
      <Image source={img} className="h-[256px] w-full" />
      <View className="pl-[24px] pr-[24px] mt-[24px]">
        <TouchableOpacity className="rounded-[16px] h-[28px] w-[152px] bg-[#FFAFDE] justify-center items-center">
          <Text className="text-[10px] italic font-[400] text-left text-[#1A2233]" style={styles.font} >Personalize Your Experience</Text>
        </TouchableOpacity>
        <Text className="mt-[8px] text-[24px] font-[700] text-left text-[#1A2233]" style={styles.font} >
          Make your learning experience unique to you.
        </Text>
        <Text className="mt-[8px] text-[12px] font-[400] text-left text-[#737780] leading-[16px]" style={styles.font}>
          Tell us about your likes and dislikes, and our AI will tailor the experience based on those examples.
        </Text>
        <Text className="mt-[32px] text-[14px] font-[700] leading-[18px] text-left text-[#1A2233]" style={styles.font}>
          How it works?
        </Text>
        <View className="pt-[12px] gap-[10px]" style={{flexDirection:'column'}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Image className="w-[19.5px] h-[19.5px]" source={ticken} />
          <Text className="ml-[12px] text-[14px] font-[400] text-[#737780]" style={styles.font}>Examples based on your favourite sport</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Image className="w-[19.5px] h-[19.5px]" source={ticken} />
          <Text className="ml-[12px] text-[14px] font-[400] text-[#737780]" style={styles.font}>AI avatar of your favourite character</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Image className="w-[19.5px] h-[19.5px]" source={ticken} />
          <Text className="ml-[12px] text-[14px] font-[400] text-[#737780]" style={styles.font}>Learning based on your likes/dislikes</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Image className="w-[19.5px] h-[19.5px]" source={ticken} />
          <Text className="ml-[12px] text-[14px] font-[400] text-[#737780]" style={styles.font}>Examples based on your favourite sport</Text>
            </View>

        </View>
        <TouchableOpacity className="mt-[32px] w-[100%] h-[48px] bg-[#1A2233] rounded-[8px] justify-center items-center"
        onPress={()=>{
        navigation.navigate('Personalisation');
        }}
        >
        <Text className="text-[14px] font-[400] text-[#FFFFFF] " style={styles.font}>Tell us about your taste</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-[16px] pb-[46px] justify-center items-center"
        onPress={()=>{
            navigation.navigate('Home');
        }}
        >
          <Text className="text-[14px] font-light text-[#999999]" style={styles.font}>I'll do it later</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Personalise;
const styles=StyleSheet.create({
    font:{
        fontFamily: 'Helvetica Neue',
      },
})
