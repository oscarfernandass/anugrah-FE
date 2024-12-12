import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Text } from 'react-native';
import { ZegoUIKitPrebuiltCall, GROUP_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn'
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import { audioToTextApi } from '../../api/api';
// import { ZegoLayoutMode } from '@zegocloud/zego-uikit-rn';
const GroupCall = ({user, onTextReceived, onEndCall, callID,lang }) => {
  console.log(callID);
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
      sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
      channels: 1,        // 1 or 2, default 1
      bitsPerSample: 16,  // 8 or 16, default 16
      audioSource: 6,     // android only (see below)
      bufferSize: 4096,
      wavFile: 'call_audio.wav',
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
        const data = { audio_base64: fileData, src: lang, dest: lang};
        const response = await audioToTextApi(data);
        if (response) {
            const tword1 = response.tword;
            const emoji= response?.emoji;
            const emotion= response?.emotion;
                setTranslatedText(tword1);
                onTextReceived?.(tword1, emoji, emotion);
            } else {
                console.warn(`No valid tword for pointer ${pointerId}.`);
            }
    } catch (error) {
        console.error(`Error processing file for pointer ${pointerId}:`, error);
    }
};


const group=user;
  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={231756352}
        appSign={'0d8a3035128597c551008b5fb440f8e43b5b58c83c2b6f40062a1e38e5c8d3eb'}
        userID={group}
        userName={group}
        callID={callID}
        config={{
          ...GROUP_VIDEO_CALL_CONFIG,
          onEndCall: () => {
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

export default GroupCall;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        height:100,
        width:'100%',
        // left:'45%',
        position:'absolute',
        // top:60,
        zIndex:4000000,
        // opacity:1,
    }
    // container:{
    //     flex:1,
    //     justifyContent:'center',
    //     alignItems:'center',
    //     // height:100
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