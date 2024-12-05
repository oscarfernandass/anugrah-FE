import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  Alert,
  Vibration,
  PermissionsAndroid,
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ContexProvider, AccountProvider } from './src/hooks/Context.js';
import Router from './src/stack/Router.js';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Shake from 'react-native-shake';
import Tts from 'react-native-tts';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const vibrationIntervalRef = useRef(null);
  const phoneCallTimeoutRef = useRef(null);

  useEffect(()=>{
    const set=async()=>{
        await Tts.setDefaultVoice('en-in-x-ene-network');
    }
    set();
  })

  useEffect(() => {
    const requestCallPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Phone Call Permission',
            message: 'This app needs access to make phone calls.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot make phone calls without permission.');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestCallPermission();
  }, []);

  useEffect(() => {
    const subscription = Shake.addListener(() => {
      setModalVisible(true);
      triggerPeriodicVibration();
      showAlertsAndSpeak();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const triggerPeriodicVibration = () => {
    let count = 0;
    vibrationIntervalRef.current = setInterval(() => {
      if (count >= 10) {
        clearInterval(vibrationIntervalRef.current);
        return;
      }
      Vibration.vibrate(1000);
      count++;
    }, 2000);
  };

  const showAlertsAndSpeak = () => {
    Speak('Danger detected! Danger detected!');
    Speak('Help! Help! This person is in danger!');
    Speak('Danger detected! Danger detected!');
    Speak('Calling emergency services.');
    phoneCallTimeoutRef.current = setTimeout(() => {
      makePhoneCall();
    }, 15000);
  };

  const makePhoneCall = async () => {
    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
      if (granted) {
        RNImmediatePhoneCall.immediatePhoneCall('+917695956720');
      } else {
        Alert.alert('Permission Denied', 'Cannot make a phone call without permission.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const Speak = (message) => {
    Tts.speak(message, {
      androidParams: {
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

  const closeModal = () => {
    setModalVisible(false);

    // Cancel all ongoing events
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
    }
    if (phoneCallTimeoutRef.current) {
      clearTimeout(phoneCallTimeoutRef.current);
    }
    Tts.stop(); // Stop TTS
  };

  return (
    <ContexProvider>
      <AccountProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <NavigationContainer>
                <Router />
              </NavigationContainer>
              {/* Modal */}
              <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Danger detected!</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Text style={styles.closeButtonText}>cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaView>
      </AccountProvider>
    </ContexProvider>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontFamily:'helvetica-neu',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
  },
  closeButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
