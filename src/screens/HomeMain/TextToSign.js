import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import PermissionsAndroid from 'react-native/Libraries/PermissionsAndroid/PermissionsAndroid';
import AudioRecord from 'react-native-audio-record';
import {audioToTextApi} from '../../api/api';
import LottieView from 'lottie-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const TextToSign = () => {
  const [inputText, setInputText] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingActive = useRef(false);
  const lottieRef = useRef(null);

  const requestAudioPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Record audio permission denied');
      return false;
    }
    return true;
  };

  const initAudioRecord = () => {
    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'continuous_audio.wav',
      audioSource: 1,
    };
    AudioRecord.init(options);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      const permissionGranted = await requestAudioPermission();
      if (permissionGranted) {
        initAudioRecord();
        recordingActive.current = true;
        AudioRecord.start();
        console.log('Recording started...');
        setIsRecording(true);
        lottieRef.current?.play(); // Start animation
      }
    } else {
      if (recordingActive.current) {
        recordingActive.current = false;
        const audioFile = await AudioRecord.stop();
        console.log('Recording stopped. File saved at:', audioFile);
        await processAudioFile(audioFile);
      }
      setIsRecording(false);
      lottieRef.current?.reset(); // Reset animation
    }
  };

  const processAudioFile = async filePath => {
    try {
      const fileData = await RNFS.readFile(filePath, 'base64');
      const data = {
        audio_base64: fileData,
        src: 'english',
        dest: 'tamil',
      };
      const response = await audioToTextApi(data);
      console.log('Response:', response);
      if (response?.recognized_text?.length > 0) {
        setInputText(response.recognized_text);
      }
    } catch (error) {
      console.error('Error processing audio file:', error);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a word to translate.');
      return;
    }

    setLoading(true);
    setVideoUri('');

    try {
      const response = await fetch(
        'https://roughy-included-partially.ngrok-free.app/text-to-sign',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({text: inputText}),
        },
      );

      const data = await response.json();

      if (response.ok && data.video_base64) {
        const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/video.mp4`;

        const fileExists = await RNFetchBlob.fs.exists(filePath);
        if (fileExists) {
          await RNFetchBlob.fs.unlink(filePath);
        }

        const path = await RNFetchBlob.fs.createFile(
          filePath,
          data.video_base64,
          'base64',
        );
        setVideoUri(`file://${path}`);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch translation.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={toggleRecording}>
        <LottieView
          ref={lottieRef}
          source={require('../../assets/lottie/mic3.json')}
          loop
          style={styles.lottieView}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        placeholder="Type here to translate..."
        value={inputText}
        onChangeText={setInputText}
        multiline={true}
        textAlignVertical="top"
      />

      <View style={styles.translateContainer}>
        <TouchableOpacity
          style={styles.translateButton}
          onPress={handleTranslate}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.translateButtonText}>Translate</Text>
          )}
        </TouchableOpacity>
      </View>

      {videoUri ? (
        <Video
          source={{uri: videoUri}}
          style={styles.videoPlayer}
          controls={true}
          resizeMode="contain"
          onError={e => console.log('Video Error: ', e)}
        />
      ) : null}
      <View style={{height:30}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#f8f9fa',
  },
  textInput: {
    minHeight: height * 0.15,
    maxHeight: height * 0.3,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.03,
    marginBottom: height * 0.02,
    backgroundColor: '#fff',
    color: '#000',
    textAlignVertical: 'top',
  },
  lottieView: {
    height: width * 0.4,
    width: width * 0.4,
    alignSelf: 'center',
    marginBottom: height * 0.02,
  },
  translateContainer: {
    marginTop: height * 0.02,
  },
  translateButton: {
    backgroundColor: '#28a745',
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
  },
  translateButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  videoPlayer: {
    width: '100%',
    height: height * 0.4,
    backgroundColor: 'black',
    marginTop: height * 0.02,
  },
});

export default TextToSign;