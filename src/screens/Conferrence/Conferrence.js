import { StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import speaking from '../../assets/lottie/speaking.json';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { groupAudio } from '../../api/api';
import { audioToTextApi } from '../../api/api';
const Conferrence = () => {
  const navigation = useNavigation();
  const recordingActive = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pointerIndex, setPointerIndex] = useState(0);
  const [langer, setLanger] = useState('english');
  const animationRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      getLanguage();
      return () => {
        // Optional cleanup logic, if necessary
      };
    }, [])
  );

  const getLanguage = async () => {
    const lang = await AsyncStorage.getItem('selectedLanguage2');
    setLanger(lang);
  };

  useEffect(() => {
    const initializeCall = async () => {
      try {
        await requestAudioPermission();
        initAudioRecord();
      } catch (error) {
        console.error('Error initializing call:', error);
      }
    };

    initializeCall();

    return () => {
      recordingActive.current = false; // Stop recording
      AudioRecord.stop(); // Stop any ongoing recording immediately
      setIsRecording(false);
    };
  }, []);

  const requestAudioPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Record audio permission denied');
    }
  };

  const initAudioRecord = () => {
    const options = {
      sampleRate: 32000, // default is 44100 but 32000 is adequate for accurate voice recognition
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only (see below)
      bufferSize: 4096,
      wavFile: 'call_audio.wav',
    };
    AudioRecord.init(options);
  };


  const recordAudioSegment = async (duration) => {
    AudioRecord.start();
    await new Promise((resolve) => setTimeout(resolve, duration * 1000));
    if (!recordingActive.current) {
      AudioRecord.stop();
      return null;
    }
    const filePath = await AudioRecord.stop();
    if (!filePath || typeof filePath !== 'string') {
      console.error('Invalid file path:', filePath);
      return null;
    }
    return filePath;
  };

  const startContinuousRecording = async () => {
    if (isRecording) {
      // Stop recording
      console.log('Stopping recording...');
      recordingActive.current = false;
      setIsRecording(false);
      animationRef.current?.reset(); // Stop the animation
      AudioRecord.stop(); // Ensure recording stops immediately
      return;
    }

    // Start recording
    console.log('Starting recording...');
    recordingActive.current = true;
    setIsRecording(true);
    animationRef.current?.play();

    try {
      while (recordingActive.current) {
        const pointerId = pointerIndex;
        console.log(`Starting segment recording for pointer: ${pointerId}`);
        const filePath = await recordAudioSegment(4);
        if (!filePath) {
          console.warn('Recording segment failed. Exiting...');
          break;
        }

        setPointerIndex((prev) => (prev + 1) % 2); // Toggle between 0 and 1
        await processAudioFile(filePath, pointerId);
      }
    } catch (error) {
      console.error('Error during continuous recording:', error);
    } finally {
      setIsRecording(false);
      animationRef.current?.reset();
    }
  };



  const processAudioFile = async (filePath, pointerId) => {
    if (!filePath) {
      console.warn(`No file path for pointer ${pointerId}. Skipping processing.`);
      return;
    }
    try {
      const fileData = await RNFS.readFile(filePath, 'base64');
      const data = { audio_base64: fileData, src: langer, dest: langer };
      const response = await groupAudio(data);
      // const response = await audioToTextApi(data);
      if (response) {
        console.log(JSON.stringify(response, 2));
      } else {
        console.warn(`No valid response for pointer ${pointerId}.`);
      }
    } catch (error) {
      console.error(`Error processing file for pointer ${pointerId}:`, error);
    }
  };

  const WelcomeMessage = () => {
    return (
      <View style={{ paddingTop: 10 }}>
        <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
          Group<Text style={styles.blueText}> Conference</Text>
        </Text>
        <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
          <Text style={styles.blueText}>extract </Text> individual audio
        </Text>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: '45%',
          top: 83,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 500000000000,
          borderRadius: 9,
          width: 120,
          transform: [{ translateX: -45 }],
        }}
        onPress={() => {
          navigation.navigate('LangCon');
        }}
      >
        <Text style={{ color: 'white', padding: 5, fontSize: 16 }}>{langer}</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <WelcomeMessage />
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <LottieView
            ref={animationRef}
            source={speaking}
            autoPlay={false}
            loop={true}
            style={{ height: 160, width: 160, alignSelf: 'center' }}
          />
          <TouchableOpacity onPress={startContinuousRecording} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', width: '100%', borderRadius: 8 }}>
            <Text style={[styles.font, { color: 'white', paddingVertical: 10 }]}>recognize meeting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Conferrence;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  blueText: {
    color: '#0D69D7',
    fontSize: 19,
  },
  font: {
    fontFamily: 'Helvetica Neue',
  },
});
