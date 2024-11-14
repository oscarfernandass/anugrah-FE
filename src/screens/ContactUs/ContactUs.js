import { StyleSheet, Text, TouchableOpacity, View , Linking} from 'react-native'
import React from 'react'
const Email=()=>{
  return(
    <>
    <TouchableOpacity onPress={()=>{
      Linking.openURL('mailto:hello@techlearn.com');
    }}>
    <Text className="text-[#2F6CE5] font-normal text-[14px] leading-[20px] font-['Helvetica Neue']" style={styles.font}>hello@techlearn.com</Text>
    </TouchableOpacity>
    </>
  )
}

const ContactUs = () => {
  return (
    <View className="pl-[16px] pr-[16px] pt-[16px] pb-[16px]" style={styles.container}>
      <Text className="text-black font-normal text-[24px] leading-[30px]" style={styles.font}>Contact us</Text>
      <Text className="text-[#6D747A] font-normal text-[14px] leading-[20px] " style={styles.font}>Hi, You can reach us out with email at </Text>
      <View style={styles.fl}>
      <Email/>
      <Text className="text-[#6D747A] font-normal text-[14px] leading-[20px] " style={styles.font}>. Thanks  </Text>
      </View>
    </View>
  )
}

export default ContactUs

const styles = StyleSheet.create({
  font:{
    fontFamily: 'Helvetica Neue',
  },
  container:{
    flex:1,
    // padding:15,
    // flexDirection:'row',
    backgroundColor:'white',
  },
  fl:{
    flexDirection:'row',
  },
  title:{
    // fontSize:27,
    // fontWeight:'400',
    // color:'black'
  },
  email:{
    fontSize:16,
    color:'#0D69D7',
  },
  para:{
    fontSize:16,
    color:'grey',
  }
})