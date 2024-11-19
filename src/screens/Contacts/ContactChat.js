import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import attach from '../../assets/images/attach.png';
import send from '../../assets/images/send.png';
import input from '../../components/Input/input';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { database , storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onSnapshot, query, orderBy} from 'firebase/firestore';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const ContactChat = () => {
    const navigation=useNavigation();
    const route=useRoute();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [recording, setRecording] = useState(false);
  const [imagesend,setImageSend] = useState('');
  const [senderPhoneNumber, setSenderPhoneNumber] = useState('');
  const userPhoneNumber = route?.params?.number?.trim()?.replace(/^\+91/, '');
  useFocusEffect(
    useCallback(() => {
      const initializeAudio = async () => {
        await requestAudioPermission();
        await initAudioRecord();
      };
  
      initializeAudio();
  
      return () => {
        // Optional cleanup logic, if necessary
      };
    }, [])
  );
    useEffect(()=>{
      const setUser=async()=>{
        const number=await AsyncStorage.getItem('userphone');
        setSenderPhoneNumber(number);
      }
      setUser();
    })

  useEffect(() => {
    if (!senderPhoneNumber || !userPhoneNumber) return;
  
    const chatPath = `${senderPhoneNumber}_${userPhoneNumber}`;
    const q = query(
      collection(database, 'chats', chatPath, 'messages'),
      orderBy('timestamp', 'asc')
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });
  
    return unsubscribe;
  }, [senderPhoneNumber, userPhoneNumber]);
  

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
        console.log('User cancelled image picker');
        return;
      } else if (response.errorCode) {
        Alert.alert('Image Picker Error:', response.errorMessage);
        return;
      }
  
      if (response.assets && response.assets.length > 0) {
        console.log("Image", response.assets[0]);
        setImageSend(response.assets[0]); 
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
        console.log(route?.params?.number);
        RNImmediatePhoneCall.immediatePhoneCall('+918098167783');
      } else {
        Alert.alert('Permission Denied', 'Cannot make a phone call without permission.');
      }
    } catch (err) {
      console.warn(err);
    }
  };


    const micScale = useSharedValue(1);
  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
}));


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
    }
  };

  const sendAudioMessage = async (audioFile) => {
    if (!senderPhoneNumber || !userPhoneNumber) {
      console.error('Sender or receiver phone number is missing.');
      return;
    }
  
    try {
      // Read the file as Base64
      const base64Audio = await RNFS.readFile(audioFile, 'base64'); // Convert audio to Base64
      console.log(base64Audio,"????????????????????")
      const newMessage = {
        text: '',
        base64Audio: base64Audio, // Save as Base64
        sender: senderPhoneNumber,
        receiver: userPhoneNumber,
        timestamp: serverTimestamp(),
      };
  
      const chatPath = `${senderPhoneNumber}_${userPhoneNumber}`;
      await addDoc(collection(database, 'chats', chatPath, 'messages'), newMessage);
  
      console.log('Audio message sent successfully!');
    } catch (error) {
      console.error('Error sending audio message:', error);
    }
  };
  

  const sendTextOrImageMessage = async () => {
    if (!senderPhoneNumber || !userPhoneNumber) {
      console.error('Sender or receiver phone number is missing.');
      return;
    }
  
    // Save current inputs to local variables
    const textToSend = inputText.trim();
    const imageToSend = imagesend?.base64;
  
    // Clear inputs immediately
    setInputText('');
    setImageSend(null);
  
    if (textToSend || imageToSend) {
      const newMessage = {
        text: textToSend,
        base64Image: imageToSend || null, // Store the base64 string
        sender: senderPhoneNumber,
        receiver: userPhoneNumber,
        timestamp: serverTimestamp(),
      };
  
      try {
        const chatPath = `${senderPhoneNumber}_${userPhoneNumber}`;
        await addDoc(collection(database, 'chats', chatPath, 'messages'), newMessage);
        console.log('Message sent successfully!');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  


  

const playAudio = async (base64Audio) => {
  if (!base64Audio) {
    console.error('No audio data to play.');
    return;
  }

  try {
    // Generate a unique file path to save the audio
    const filePath = `${RNFS.CachesDirectoryPath}/audio_${Date.now()}.wav`;

    // Write the Base64 audio data to the file
    await RNFS.writeFile(filePath, base64Audio, 'base64');

    // Create a new Sound object to play the file
    const sound = new Sound(filePath, '', (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }

      sound.play((success) => {
        if (!success) {
          console.error('Failed to play the sound');
        }
        sound.release(); // Release resource after playing
      });
    });
  } catch (error) {
    console.error('Error playing audio:', error);
  }
};

  

  const renderMessage = ({ item }) => {
    const isSender = item.sender === senderPhoneNumber; // Check if the message was sent by the logged-in user
  
    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.senderContainer : styles.receiverContainer,
        ]}
      >
        <Image
          source={
            isSender
              ? require('../../assets/images/prof.png') // Sender's profile image
              : route?.params?.image
              ? { uri: route?.params?.image } // Receiver's image from route
              : require('../../assets/images/profile.png') // Default profile image
          }
          style={[
            styles.avatar,
            { marginLeft: isSender ? 4 : 0, marginRight: isSender ? 0 : 4 },
          ]}
        />
        {item.base64Image ? (
          <View
            style={{
              alignItems: isSender ? 'flex-end' : 'flex-start',
              backgroundColor: isSender ? '#0D69D7' : '#E5E5EA',
              width: 158,
              padding: 4,
              borderRadius: 10,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Image
              source={{ uri: `data:image/webp;base64,${item.base64Image}` }}
              style={{ width: 150, height: 150, borderRadius: 10, alignSelf: 'center' }}
            />
            {item.text ? (
              <Text
                style={{
                  color: isSender ? 'white' : 'black',
                  alignSelf: 'flex-start',
                  fontSize: 16,
                  paddingVertical: 0,
                }}
              >
                {item.text}
              </Text>
            ) : null}
          </View>
        ) : item.base64Audio ? (
          <TouchableOpacity onPress={() => playAudio(item.base64Audio)}>
            <Image
              tintColor={isSender ? '#0D69D7' : '#E5E5EA'}
              source={voiceplay}
              style={{ width: 60, height: 60 }}
            />
          </TouchableOpacity>
        ) : (
          <Text
            style={[
              styles.messageText,
              isSender ? styles.senderText : styles.receiverText,
            ]}
          >
            {item.text}
          </Text>
        )}
      </View>
    );
  };

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
        data={[...messages].reverse()}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        // onContentSizeChange={() => flatListRef.current.scrollToStart({ animated: true })}
        inverted
      />
      <View style={[styles.inputContainer,
        // { paddingTop: marginBottom }
        ]}>


        {imagesend && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: imagesend.uri }}
              style={styles.imagePreview}
              />
            <TouchableOpacity
              style={{
                position: 'absolute', // Correct spelling from 'obsolute' to 'absolute'
                top: 2, // Adjust padding from the top edge of the image
                right: 2, 
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                borderRadius: 50, 
                paddingHorizontal: 7,
                justifyContent:'center',
                alignItems:'center'
              }}
              onPress={() => setImageSend(null)}
              >
              <Text style={[styles.removeImageText, { color: 'white',alignSelf:'center',fontWeight:'800',marginTop:-1}]}>
                x
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputCon}>
          <TouchableOpacity onPress={selectImage} style={{justifyContent:'center',alignItems:'center',backgroundColor:'#0D69D7',padding:10,borderRadius:50}}>
                <Image tintColor={'white'} source={attach} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
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
            <TouchableOpacity onPress={sendTextOrImageMessage} style={{justifyContent:'center',alignItems:'center',backgroundColor:'#0D69D7',padding:10,borderRadius:50}}>
                <Image tintColor={'white'} source={send} style={{ width: 20, height: 20,alignSelf:'center',marginLeft:3 }} />
        </TouchableOpacity>
      </View>
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
  imagePreviewContainer: {
    // flexDirection:'column',
    // alignItems: 'center',
    // marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    alignSelf:'flex-start'
    // marginRight: 5,
  },
  removeImageText: {
    fontSize: 16,
    color: 'black',
    // fontWeight: 'bold',
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'space-evenly',
    gap:5,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  inputCon:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-evenly',
    gap:5,
    // padding: 10,
    // borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#F1F1F1',
    color:'black'
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
