import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Otp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone, otp: correctOtp } = route.params; // Get phone and OTP from route params
  console.log(route?.params?.otp);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const enteredOtp = otp.join(''); // Combine the OTP digits into a single string

      if (enteredOtp !== correctOtp) {
        setErrorMessage('Invalid OTP. Please try again.');
        return;
      }

      // Store user information and navigate to Home
      await AsyncStorage.setItem('userphone', phone.trim());
      await AsyncStorage.setItem('loggedin', 'true');
      navigation.navigate('Home');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index) => {
    if (!otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {loading ? (
        <View>
          <LottieView
            source={require('../assets/lottie/loading.json')}
            autoPlay
            loop
            style={{ height: 250, width: 360, alignSelf: 'center' }}
          />
          <Text
            style={[
              {
                fontSize: 12,
                color: 'black',
                fontWeight: '400',
                letterSpacing: 0.2,
                alignSelf: 'center',
                marginTop: -110,
              },
              styles.font,
            ]}>
            Loading...
          </Text>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Enter OTP</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(index);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                />
              ))}
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    paddingVertical: 10,
    width: '14%',
    marginRight: 10,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});
