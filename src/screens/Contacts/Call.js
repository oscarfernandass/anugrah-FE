import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Text, Vibration, Button } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
const Call = () => {
  const websocket = useRef(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await requestAudioPermission();
        setupWebSocket();
      } catch (error) {
        console.error('Error initializing call:', error);
      }
    };

    initialize();

    return () => {
      cleanup();
    };
  }, []);

  const requestAudioPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Record audio permission denied');
      throw new Error('Permission denied');
    }
  };

  const setupWebSocket = () => {
    websocket.current = new WebSocket('ws://33f9-152-58-212-123.ngrok-free.app');

    websocket.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Server response:', data);
    };

    websocket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const startRecording = () => {
    Vibration.vibrate(400);
    setRecording(true);

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'temp.wav', // Temporary file to save the audio
    };

    AudioRecord.init(options);
    AudioRecord.start();
    console.log('Recording started...');
  };

  const stopRecording = async () => {
    if (recording) {
      setRecording(false);
      const audioFile = await AudioRecord.stop(); // Stop recording and get the file path
      console.log('Recording stopped. Audio saved at:', audioFile);
      sendAudioMessage(audioFile);
    }
  };

  const sendAudioMessage = async (audioFile) => {
    try {
      // Read the recorded file as Base64
      const base64Audio = await RNFS.readFile(audioFile, 'base64');
      console.log('Encoded Audio:', base64Audio);

      if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({ audio_data: base64Audio });
        websocket.current.send(payload);
        console.log('Audio data sent:', payload);
      } else {
        console.warn('WebSocket is not open. Cannot send audio data.');
      }
    } catch (error) {
      console.error('Error sending audio message:', error);
    }
  };

  const cleanup = () => {
    if (websocket.current) {
      websocket.current.close();
    }
    AudioRecord.stop();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.transcription}>Audio Recorder</Text>
      <Button title="Start Recording" onPress={startRecording} disabled={recording} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'blue'
  },
  transcription: {
    color:'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Call;
