import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import Input from '../components/Input/input';
import SecondaryButton from '../components/Buttons/secondary';
import ChevronLeft from '../assets/icons/chevron-left.svg';
import Facebook from '../assets/icons/facebook.svg';
import Google from '../assets/icons/google.svg';
import wel from '../assets/lottie/wel.json';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import neo from '../assets/images/neo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from 'react-native-phone-number-input';
import torn from '../assets/images/torn.png';
import skcet from '../assets/images/skcet.png';
import { verifyOtp } from '../api/api';

  const Login=()=>{
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(''); // New state for login error
  const [phone, setphone] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const navigation = useNavigation();

  const validateFields = () => {
    let isValid = true;

    if (userName.trim() === '') {
      setUserNameError('Username is required');
      isValid = false;
    } else {
      setUserNameError('');
    }
    
    if (phone.trim === '' || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setPhoneError('Valid 10-digit phone number is required');
      isValid = false;
    } else {
      setPhoneError('');
    }
    

    return isValid;
  };

  const handleLogin = async () => {
    setLoading(true);
    if (validateFields()) {
      try {
        setLoginError(''); // Reset login error on new login attempt
  
        const response = await verifyOtp({ number: phone.trim() });
        if (response && response.otp) {
          // Save the phone number to AsyncStorage
          // Navigate to the Otp page, passing the phone number and OTP
          navigation.navigate('Otp', {
            phone: phone.trim(),
            otp: response.otp,
          });
        } else {
          Alert.alert('Login Failed', 'Invalid phone number or OTP generation failed.');
        }
      } catch (e) {
        console.error('Login error:', e);
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false); // Stop loading spinner
    }
  };
  
  return (
    <>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View className="mb-8 ml-1">
            <Text className="text-[24px] font-[Poppins-SemiBold] font-semibold mt-4 text-[#000000]">
              Welcome back!
            </Text>
            <Text className="text-[12px] font-[Lato] mt-2 text-[#000000]">
              Sign in to your account
            </Text>
          </View>
          <LottieView source={wel} autoPlay loop style={{ width: 150, height: 150 }} />
        </View>
            <Text style={{letterSpacing:2}} className="text-[28px] mt-[-55px] py-3 font-[700] font-[Helvetica Neue] text-[#0D69D7]">
              Anugrah
            </Text>
        {
          loading ? (
            <>
            <View>
              <LottieView source={require('../assets/lottie/loading.json')} autoPlay loop style={{ height: 250, width: 360, alignSelf: 'center' }} />
              <Text style={[{ fontSize: 12, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>Loading...</Text>
            </View>
            {/* <View> */}
            {/* </View> */}
            </>
          ) : (
            <View style={{marginTop:-12}}>
              <>
                <Input
                  value={userName}
                  label="Username"
                  labelStyle={styles.label}
                  placeholder="e.g. name@123"
                  containerStyle={styles.inputmargin}
                  setValue={(val: String) => setUserName(val)}
                  />
                {userNameError ? <Text style={styles.errorText}>{userNameError}</Text> : null}
                <Text style={styles.label}>Phone</Text>
                <PhoneInput
                defaultValue={phone}
                defaultCode="IN"
                layout="second"
                placeholder="Enter your phone number"
                onChangeText={text => {
                  setphone(text);
                }}
                containerStyle={[
                  styles.phoneInput,
                ]}
                textContainerStyle={styles.phoneTextContainer}
                codeTextStyle={styles.phoneCode}
                textInputStyle={styles.phoneText}
                textInputProps={{
                  placeholderTextColor: '#6D747A',
                  maxLength: 10, // Restrict input to 10 digits
                }}
                />
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null} 
              </>
              <TouchableOpacity
                className="bg-black flex items-center mt-8 mb-4 justify-center border rounded-md"
                onPress={handleLogin}
              >
                <Text className="text-white h-[48px] text-[16px] py-3 font-medium font-[Poppins]">
                  Sign in
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white flex items-center text-center mb-4 justify-center border rounded-md">
                <Text style={{letterSpacing:1.5}} className="h-[48px] text-[16px] py-3 font-[500] font-[Helvetica Neue] text-[#0D69D7]">
                  Redefine Possible
                </Text>
              </TouchableOpacity>
              <View style={styles.signinTextContainer}>
                <Text style={styles.signinText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Register');
                }}>
                  <Text style={styles.signinActionText}>Create account</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <Text style={styles.dividerText}>in collab and partner with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.twoColumn}>
                <SecondaryButton containerStyle={styles.socialButton}>
                <Image tintColor={'#0D69D7'} source={torn} style={{ width: 18, height: 18 }} />
                <Text className="text-[#08090A] font-[Lato] font-[400] text-[16px] ml-[2px]">
                    Cyklones
                  </Text>
                </SecondaryButton>
                <SecondaryButton containerStyle={styles.socialButton}>
                  <Image source={skcet} style={{ width: 22, height: 22 }} />
                  <Text className="text-[#08090A] font-[Lato] font-[400] text-[16px] ml-[2px]">
                    SKCET
                  </Text>
                </SecondaryButton>
              </View>
            </View>
          )}
      </ScrollView>
    </>
  );
}
export default Login;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    // marginBottom: 10,
    marginTop:2,
  },
  container: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  inputmargin: {
    marginBottom: 0,
  },
  signinTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  signinText: {
    color: '#08090A',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Lato',
  },
  signinActionText: {
    color: '#0D69D7',
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    lineHeight: 20,
  },
  dividerContainer: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dividerText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: '600',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    position: 'relative',
    zIndex: 10,
    fontFamily: 'Lato-Bold',
  },
  divider: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    height: 1,
    backgroundColor: '#CED4DA',
    zIndex: 1,
  },
  twoColumn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap:10
  },
  socialButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  phoneInput: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CED4DA',
    // marginTop:12,
    // marginBottom:12,
    justifyContent:'center',
    alignItems:'center',
    // paddingLeft: 10,
    height:55
  },
  paddingvertical: {
    // paddingVertical: 2,
  },
  phoneTextContainer: {
    backgroundColor: '#fff',
    paddingLeft: 0,
    height:55
  },
  phoneCode: {
    fontWeight: '400',
    fontSize: 14,
    height:55
  },
  phoneText: {
    fontWeight: '400',
    paddingLeft: 16,
    fontSize: 14,
    paddingVertical:5,
    borderLeftWidth: 1,
    borderColor: '#08090A',
    height:55
  },
  label: {
    fontFamily: 'Lato-Bold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 8,
    color:'black',
    marginTop:8,
  },
});
