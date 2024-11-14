import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView,Image, ImageBackground } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons'; // Or use any other icon library
import { useNavigation } from '@react-navigation/native';
import ground from '../../assets/images/ground.png';
import Cross from '../../assets/icons/Cross.svg';
import Warn from '../../assets/icons/Warn.svg';
import Ques from '../../assets/icons/Ques.svg';
import Down from '../../assets/icons/Down.svg';
import { ScrollView } from 'react-native-gesture-handler';
const PaymentFailed = () => {
  const navigation = useNavigation();

  const handleTryAgain = () => {
    // Logic for handling try again action
    navigation.goBack();
    console.log('Try again pressed');
  };

  const handleDownloadReceipt = () => {
    // Logic for handling download receipt action
    console.log('Download receipt pressed');
  };

  const handleContactUs = () => {
    // Navigate to the contact page or handle the contact action
    console.log('Contact us pressed');
  };

  return (
    <ImageBackground className="pl-[20px] pr-[20px]" source={ground} style={styles.container}>
      {/* Close button */}
      <ScrollView>

      <TouchableOpacity className="h-[39px] w-[39px] mt-[30px]" style={styles.closeButton} onPress={() => navigation.navigate('HomeMain')}>
        <Cross/>
      </TouchableOpacity>

        <View className="mt-[27px] h-[155px] rounded-[12px]" style={styles.content}>
            <View className="mt-[16px]">
            <Warn />
            </View>
        <Text className="mt-[8px] text-[16px] font-[400] text-[#1A2233] leading-[30px]" style={styles.font}>Payment failed</Text>
        <Text className=" mt-[6px] text-[24px] font-[600] text-[#3F3F3F] leading[28.80px]" style={styles.font}>₹ 3,999</Text>
        </View>

        <View className="mt-[6px] h-[120px] rounded-[12px]" style={styles.content}>
        <Text className="mt-[16px] text-[14px] font-[400] text-[#737780] pl-[23.5] pr-[23.5] text-center leading-[20px]" style={styles.font}>Your payment has failed due to technical errors. Please try again to use different method to complete the payment.</Text>
        <Text className="mt-[8px] text-[14px] font-[500] text-[#737780] leading-[20px]" style={styles.font}>September 22, 2024</Text>
        </View>

        <View className="mt-[6px] rounded-[12px] " style={styles.content}>
            <View className="pl-[24px] pr-[24px] pt-[12px] pb-[12px]" style={{flexDirection:'row',alignSelf:'flex-start'}}>
                <Ques/>
                <View className="ml-[12px]" style={{flexDirection:'column'}}>
                <Text className=" text-[16px] font-[500] text-[#1A2233] leading-[20px]" style={styles.font}>Trouble with your payment?</Text>
                <Text className="mt-[8px] text-[14px] font-[500] text-[#838383] leading-[20px]" style={styles.font}>Contact us</Text>
                </View>
            </View>
        </View>

      </ScrollView>
        <View className="pl-[24px] pr-[24px]" style={{position: "absolute", bottom: 10, left: 0, right: 0,}}>
        <TouchableOpacity className="rounded-[8px] h-[48px]" style={styles.tryAgainButton} onPress={handleTryAgain}>
          <Text className=" text-[14px] font-[400] text-[#FFF] leading-[20px]" style={styles.font}>Try again</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-[12px] rounded-[8px] h-[48px]" style={styles.tryAgain} onPress={handleDownloadReceipt}>
            <Down/>
          <Text className=" text-[14px] font-[400] text-[#1A2233] ml-[12px]" style={styles.font}>Get PDF Receipt</Text>
        </TouchableOpacity>
        </View>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    font: {
        fontFamily: 'Helvetica Neue',
      },
  container: {
    flex: 1,
    backgroundColor: 'white',
    // alignItems: 'center',
    flexDirection:'column'
  },
  closeButton: {
    borderRadius:50,
    borderWidth:1,
    borderColor:'#ECECEC',
    justifyContent:'center',
    alignItems:'center'
  },
  content: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    // fontSize: 24,
    // fontWeight: 'bold',
    // color: '#FF6347',
  },
  amount: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 10,
    color: 'black',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#1E90FF',
    marginLeft: 10,
  },
  tryAgainButton: {
    backgroundColor: '#1A2233',
    justifyContent:'center',
    alignItems:'center'
  },
  tryAgain: {
    flexDirection:'row',
    backgroundColor: '#FFFFFF',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:'#1A2233'
  },
  tryAgainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pdfButton: {
    backgroundColor: '#1A2233',
    justifyContent:'center',
    alignItems:'center'
  },
  pdfButtonText: {
    marginLeft: 10,
    color: 'black',
    fontSize: 16,
  },
});

export default PaymentFailed;
