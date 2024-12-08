import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Text } from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { useRoute, useNavigation } from '@react-navigation/native';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import { audioToTextApi } from '../../api/api';
import { useRef } from 'react';
const Call = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const number = route?.params?.number;
  const recordingActive = useRef(true);
  const [pointerIndex, setPointerIndex] = useState(0);
  const [translatedText, setTranslatedText] = useState(''); // For displaying `tword`

  useEffect(() => {
    const initializeCall = async () => {
      try {
        await requestAudioPermission();
        initAudioRecord();
        startContinuousRecording();
      } catch (error) {
        console.error('Error initializing call:', error);
      }
    };

    initializeCall();

    return () => {
      recordingActive.current = false; // Stop recording
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
      sampleRate: 16000,  // The sample rate of the audio
      channels: 1,        // Mono channel for microphone
      bitsPerSample: 16,  // Bits per sample
      wavFile: 'call_audio.wav',  // Output file path
      audioSource: 1,     // Audio source set to MIC (1 for default microphone)
    };
  
    // Initialize the audio record with the given options
    AudioRecord.init(options);
  };

  const startContinuousRecording = async () => {
    while (recordingActive.current) {
      const pointerId = pointerIndex;
      const filePath = await recordAudioSegment(4);
      setPointerIndex((prev) => (prev + 1) % 2);
      processAudioFile(filePath, pointerId);
    }
  };

  const recordAudioSegment = async (duration) => {
    AudioRecord.start();
    await new Promise((resolve) => setTimeout(resolve, duration * 1000));
    const filePath = await AudioRecord.stop();
    return filePath;
  };

  const processAudioFile = async (filePath, pointerId) => {
    try {
      const fileData = await RNFS.readFile(filePath, 'base64');
      const data = {
        audio_base64: fileData,
        src: 'english',
        dest: 'tamil',
      };
      const response = await audioToTextApi(data);
      if (response?.recognized_text?.length > 0) {
        const tword = response.recognized_text[0].tword;
        setTranslatedText(tword); // Set the translated text
      }
    } catch (error) {
      console.error(`Error processing file for pointer ${pointerId}:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={231756352}
        appSign={'0d8a3035128597c551008b5fb440f8e43b5b58c83c2b6f40062a1e38e5c8d3eb'}
        userID={number}
        userName={number}
        callID={'uygfbbwdjcnjnissuduybe'}
        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onCallEnd: () => {
            console.log('Call ended.');
            recordingActive.current = false;
            navigation.goBack();
          },
        }}
      />
      {translatedText ? (
        <View style={styles.translatedTextContainer}>
          <Text style={styles.translatedText}>{translatedText}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default Call;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  translatedTextContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    backgroundColor: '#0D69D7',
    padding: 10,
    alignItems: 'center',
    borderRadius:10,
  },
  translatedText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});