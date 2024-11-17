import React, { useState, useRef, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform ,PermissionsAndroid, Alert,Keyboard} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { rotate } from 'react-native-redash';
import call from '../../assets/images/call.png';
import micer from '../../assets/images/micer.png';
import { Buffer } from 'buffer';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import playIcon from '../../assets/images/play.png';
import voiceplay from '../../assets/images/voiceplay.png';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Vibration } from 'react-native';
import backl from '../../assets/images/backl.png';
import { useNavigation } from '@react-navigation/native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import BackgroundService from 'react-native-background-actions';
import { launchImageLibrary } from 'react-native-image-picker';
const ContactChat = () => {
    const navigation=useNavigation();
    const route=useRoute();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', sender: true },
    { id: '2', text: 'Hi, how can I help you?', sender: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [recording, setRecording] = useState(false);
  const [imagesend,setImageSend] = useState('');
  const flatListRef = useRef();

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled image picker');
        return;
      } else if (response.errorCode) {
        Alert.alert('Image Picker Error:', response.errorMessage);
        return;
      }
  
      if (response.assets && response.assets.length > 0) {
        console.log("Image", response.assets[0]);
        setImageSend(response.assets[0]); // Assuming `setProfileImage` updates your state
      }
    });
  };
  

  const makePhoneCall = async () => {
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
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // await BackgroundService.start(veryIntensiveTask, options);
        // startRecording();
        console.log(route?.params?.number);
        RNImmediatePhoneCall.immediatePhoneCall('+918098167783');
      } else {
        Alert.alert('Permission Denied', 'Cannot make a phone call without permission.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
      requestAudioPermission();
      initAudioRecord();
    }, []);
    
    
    useEffect(() => {
        // Scroll to the bottom whenever messages are updated
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages,]);

    const micScale = useSharedValue(1);
  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
}));


const requestAudioPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Record audio permission denied');
    }
};

const initAudioRecord = () => {
    const options = {
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: 'test.wav',
    };
    AudioRecord.init(options);
};

const startRecording = async () => {
    Vibration.vibrate(400)
    setRecording(true);
    micScale.value = withSpring(2.3);
    AudioRecord.start();
};

  const stopRecording = async () => {
    if (recording) {
      setRecording(false);
      micScale.value = withSpring(1);
      const audioFile = await AudioRecord.stop();
      sendAudioMessage(audioFile);
    //   setTimeout(async() => {
    //     await BackgroundService.stop();
    // }, 2000);
    }
  };

  const sendAudioMessage = (audioFile) => {
    setMessages([...messages, { id: Date.now().toString(), text: '', audioFile, sender: true }]);
  };

  const sendTextMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: true }]);
      setInputText('');
    }
  };

  const playAudio = (audioFile) => {
    const sound = new Sound(audioFile, '', (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      sound.play((success) => {
        if (!success) console.log('Playback failed');
      });
    });
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender ? styles.senderContainer : styles.receiverContainer]}>
      <Image
        source={item.sender?require('../../assets/images/prof.png'):route?.params?.image===null?require('../../assets/images/profile.png'):{uri:route?.params?.image}}
        style={[styles.avatar,{marginLeft:item.sender?4:0, marginRight:item.sender?0:4}]}
      />
            {item.text ? (
      <Text style={[styles.messageText, item.sender ? styles.senderText : styles.receiverText]}>
        {item.text}
      </Text>
      ) : (
        item.audioFile && (
          <TouchableOpacity onPress={() => playAudio(item.audioFile)}>
            <Image tintColor={'#0D69D7'} source={voiceplay} style={{width:60,height:60}} />
          </TouchableOpacity>
        )
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>{
                navigation.goBack();
            }}>
        <Image source={backl} style={{height:25,width:25,marginRight:3}} />
            </TouchableOpacity>
        <Image source={route?.params?.image===null?require('../../assets/images/profile.png'):{uri:route?.params?.image}} style={{width:40,height:40,borderRadius:50}}/>
        <Text style={styles.headerText}>{route?.params?.name}</Text>
        </View>
        <TouchableOpacity onPress={makePhoneCall} style={{marginRight:5}}>
        <Image source={call} style={{width:18,height:18}}/>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={[styles.inputContainer,
        // { paddingTop: marginBottom }
        ]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="gray"
        />
            <Animated.View style={micAnimatedStyle}>
        <TouchableOpacity onPressIn={startRecording} onPressOut={stopRecording} style={{justifyContent:'center',alignItems:'center',backgroundColor:'#0D69D7',padding:10,borderRadius:50}}>
                <Image source={micer} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
            </Animated.View>
        <TouchableOpacity onPress={sendTextMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ContactChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
      flexDirection:'row',
    height: 53,
    backgroundColor: '#0D69D7',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    // Shadow properties for Android
    elevation: 5,
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginLeft:5,
  },
  messageList: {
    flexGrow: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  senderContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  receiverContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 50,
    // marginHorizontal: 5,
    alignSelf:'flex-end'
  },
  messageText: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 50,
    fontSize: 16,
  },
  senderText: {
    backgroundColor: '#0D69D7',
    color: 'white',
  },
  receiverText: {
    backgroundColor: '#E5E5EA',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-evenly',
    gap:5,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    // marginRight: 10,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#0D69D7',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
