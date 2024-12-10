import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Text } from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import { audioToTextApi } from '../../api/api';
// import { ZegoLayoutMode } from '@zegocloud/zego-uikit-rn';
const AudioCall = ({ onTextReceived, onEndCall, numberu, callID }) => {
  const recordingActive = useRef(true);
  const [pointerIndex, setPointerIndex] = useState(0);
  const [translatedText, setTranslatedText] = useState('');

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
      AudioRecord.stop(); // Stop any ongoing recording immediately
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
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'call_audio.wav',
      audioSource: 1,
    };
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

const processAudioFile = async (filePath, pointerId) => {
    if (!filePath) {
        console.warn(`No file path for pointer ${pointerId}. Skipping processing.`);
        return;
    }
    try {
        const fileData = await RNFS.readFile(filePath, 'base64');
        const data = { audio_base64: fileData, src: 'english', dest: 'tamil' };
        const response = await audioToTextApi(data);
        if (response) {
            const tword1 = response.tword;
                setTranslatedText(tword1);
                onTextReceived?.(tword1);
            } else {
                console.warn(`No valid tword for pointer ${pointerId}.`);
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
        userID={numberu}
        userName={numberu}
        callID={callID}
        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          turnOnCameraWhenJoining: false,
          onCallEnd: () => {
            console.log('Call ended.');
            recordingActive.current = false; // Stop background recording
            AudioRecord.stop(); // Ensure ongoing recording stops immediately
            onEndCall();
          },
        }}
      />
    </View>
  );
};

export default AudioCall;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:50,
        left:'45%',
        position:'absolute',
        top:50,
        zIndex:4000000,
        opacity:0.7,
    }
    // container:{
    //     flex:1,
    //     justifyContent:'center',
    //     alignItems:'center'
    // }
//   container: {
//     position:'relative',
//     height:50,
//     backgroundColor:'transparent'
// },
// flex: 1,
// alignItems: 'center',
// justifyContent: 'center',
//   translatedTextContainer: {
//     position: 'absolute',
//     bottom: 30,
//     width: '100%',
//     backgroundColor: '#0D69D7',
//     padding: 10,
//     alignItems: 'center',
//     borderRadius:10,
//   },
//   translatedText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//   },
});