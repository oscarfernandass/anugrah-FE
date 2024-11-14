import { StyleSheet, Text, View, Image, ScrollView, ImageBackground } from 'react-native';
import React from 'react';
import profile from '../../assets/images/profile.png';
import certificate from '../../assets/images/certificate.png';
import lock from '../../assets/images/lock.png';
const Certificate = () => {
  return (
    <View className="pt-[16px] pb-[16px] pl-[16px] pr-[16px] flex-1" style={styles.container}>
      <View style={styles.box1}>
        <Image className="w-[91px] h-[91px] rounded-[91px]" source={profile} style={styles.profile} />
        <View className="ml-[8px]" style={styles.info}>
          <Text className="text-black text-left font-normal text-[24px]" style={styles.font} >Rohit Ransore</Text>
          <Text className="text-[#6D747A] font-normal text-[14px]" style={styles.font}>June 17, 2022</Text>
          <Text className="text-[#6D747A] font-normal text-[10px]" style={styles.font}>Approx Duration to complete</Text>
        </View>
      </View>
      <Text className="text-[#08090A] font-normal text-[16px] leading-[22px] mt-[24px]"style={styles.font}>
        Rohit’s account is certified and TechLearn certifies their successful completion of our: Complete Node.js For Dummies
      </Text>
      <Text className="text-[#6D747A] font-normal text-[12px] leading-[16px] mt-[16px]"style={styles.font}>
        <Text className="text-[#08090A] font-normal text-[12px] leading-[16px]"style={styles.font}>Course Description: </Text>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euis Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euiolor sit amet, consectetuer adipiscing elit, sedeuis Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euis
      </Text>
      <ImageBackground source={certificate} style={styles.certificate} >
      {/* <View style={styles.overlay} /> */}
        <View className="h-[48px] w-[283px] rounded-[20px]" style={styles.certBox}>
            <Image className="w-[20px] h-[20px]" source={lock} style={styles.lock}/>
            <Text className="text-[#08090A] font-normal text-[12px] w-[227px] ml-[4px]" style={styles.font}>Certificate will be unlocked once the course is completed and passed.</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

export default Certificate;

const styles = StyleSheet.create({
  font:{
    fontFamily: 'Helvetica Neue',
  },
  profile: {
    // borderRadius: 50,
    // width: 90,
    // height: 90,
  },
  container: {
    // padding: 15,
    flex:1,
    backgroundColor:'white',
  },
  box1: {
    flexDirection: 'row',
  },
  info: {
    // paddingLeft: 8,
  },
  tit: {
    fontSize: 26,
    color: 'black',
    fontWeight:'400'
  },
  tit2: {
    fontSize: 16,
    color: 'grey',
    paddingVertical: 3,
  },
  tit3: {
    fontSize: 15,
    color: 'grey',
  },
  des: {
    // fontSize: 18,
    // marginTop: 15,
    // color: 'black',
    // fontWeight:'400'
  },
  bold: {
    // color: 'black',
    // fontSize:15,
  },
  courseDescription: {
    // marginTop: 15,
    // fontSize: 14,
    // color: 'grey',
  },
  certificate:{
    marginTop:58,
    alignSelf:'center',
    width:'100%',
    flexGrow: 1,
    aspectRatio:1.42,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:8,
    marginBottom:50,
},
certBox:{
    backgroundColor:'white',
    flexDirection:'row',
    // borderRadius:23,
    justifyContent:'center',
    alignItems:'center',
    // padding:11,
    // borderWidth:2,
    // width:300,

  },
  lock:{
    height:20,
    width:20,
  },
  certPara:{
    color:'black',
    // paddingLeft:5,
  },
  overlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', 
    width:328,
    height:231,
    borderRadius: 8,
  }
});
