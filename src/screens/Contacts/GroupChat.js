import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, PermissionsAndroid, Alert, Keyboard, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import call from '../../assets/images/call.png';
import micer from '../../assets/images/micer.png';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import voiceplay from '../../assets/images/voiceplay.png';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Vibration } from 'react-native';
import backl from '../../assets/images/backl.png';
import { useNavigation } from '@react-navigation/native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { launchImageLibrary } from 'react-native-image-picker';
import attach from '../../assets/images/attach.png';
import send from '../../assets/images/send.png';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { database, storage } from '../../../firebase';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import video from '../../assets/images/video.png';
import muter from '../../assets/images/muter.png';
import sounder from '../../assets/images/sounder.png';
import back from '../../assets/images/back.jpg';
import GroupCall from './GroupCall';
import Tts from 'react-native-tts';
import LinearGradient from 'react-native-linear-gradient';
import VideoCall from './VideoCall';
import { postBlock } from '../../api/api';
import RenderGroupMessage from './RenderGroupMessage';

const GroupChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [recording, setRecording] = useState(false);
  const [imagesend, setImageSend] = useState('');
  const [senderPhoneNumber, setSenderPhoneNumber] = useState('');
  const [audioVisible, setAudioVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [audioSound, setAudioSound] = useState(false);
  const flex = route?.params?.roomName?.trim();
  const myName= route?.params?.urName?.trim();
  const[langer,setLanger]=useState('english');
  useFocusEffect(
    useCallback(() => {
      const initializeAudio = async () => {
        await requestAudioPermission();
        await initAudioRecord();
      };
      initializeAudio();
      getLanguage();
      // setTimeout(() => {
      //   setVideoVisible(true);
      // }, 1000);
      return () => {
        // Optional cleanup logic, if necessary
      };
    }, [])
  );
  const getLanguage=async()=>{
    const lang=await AsyncStorage.getItem('selectedLanguage1');
    setLanger(lang);
  }
  useEffect(() => {
    const setUser = async () => {
      const number = await AsyncStorage.getItem('userphone');
      setSenderPhoneNumber(number);
      console.log(number, "???")
    }
    setUser();
  })
  useEffect(() => {
    const setUser = async () => {
      const number = await AsyncStorage.getItem('userphone');
      setSenderPhoneNumber(number);
      console.log(number, "???",)
    }
    setUser();
  },)

  const callID = flex;
  useEffect(() => {
    if (!senderPhoneNumber) return;

    const chatPath = flex;
    const q = query(
      collection(database, 'groupchats', chatPath, 'messages'),
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
  }, [senderPhoneNumber]);


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
    setAudioVisible(true);
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
      sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
      channels: 1,        // 1 or 2, default 1
      bitsPerSample: 16,  // 8 or 16, default 16
      audioSource: 6,     // android only (see below)
      bufferSize: 4096,
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
    if (!senderPhoneNumber) {
      console.error('Sender or receiver phone number is missing.');
      return;
    }

    try {
      // Read the file as Base64
      const base64Audio = await RNFS.readFile(audioFile, 'base64'); // Convert audio to Base64
      console.log(base64Audio, "????????????????????")
      const newMessage = {
        text: '',
        base64Audio: base64Audio, // Save as Base64
        sender: senderPhoneNumber,
        myName: myName,
        timestamp: serverTimestamp(),
      };

      const chatPath = flex;
      await addDoc(collection(database, 'gorupchats', chatPath, 'messages'), newMessage);

      console.log('Audio message sent successfully!');
    } catch (error) {
      console.error('Error sending audio message:', error);
    }
  };


  const sendTextOrImageMessage = async () => {
    if (!senderPhoneNumber) {
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
        myName: myName,
        speakaudio: audioSound ? true : false,
        timestamp: serverTimestamp(),
      };

      try {
        const chatPath = flex;
        await addDoc(collection(database, 'groupchats', chatPath, 'messages'), newMessage);
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


  const handleTextReceived = async (text, emoji, emotion) => {
    if (text) {
      const newMessage = {
        text: text,
        base64Image: null, // Store the base64 string
        sender: senderPhoneNumber,
        myName:myName,
        speakaudio: audioSound ? true : false,
        emoji: emoji || '',
        emotion: emotion || '',
        timestamp: serverTimestamp(),
      };
      try {
        const chatPath = flex;
        await addDoc(collection(database, 'groupchats', chatPath, 'messages'), newMessage);
        console.log('Message sent successfully!');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleEndAudioCall = () => {
    console.log('Call ended');
    setAudioVisible(false);
    // Handle call end here (e.g., navigate back)
  };
  const handleEndVideoCall = () => {
    console.log('Call ended');
    setVideoVisible(false);
    // Handle call end here (e.g., navigate back)
  };

  useEffect(() => {
    const set = async () => {
      await Tts.setDefaultVoice('en-in-x-ene-network');
    }
    set();
  })
  const chatPath = flex;
  return (
    <>
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: '45%', // Move to the middle of the screen
          top: 43, // Vertical position
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 500000000000,
          borderRadius: 9,
          width:120,
          transform: [{ translateX: -45 }], // Shift back by half of the element's width
        }}
        onPress={()=>{
          navigation.navigate('Langer');
        }}
      >
        <Text style={{ color: 'white', padding: 5, fontSize: 16 }}>{langer}</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ImageBackground source={back} style={styles.container}>
          <LinearGradient
            // colors={['#4a148c', '#7b1fa2']}
            colors={['black', 'black']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}

            style={styles.header}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => {
                navigation.goBack();
              }}>
                <Image source={backl} style={{ height: 25, width: 25, marginRight: 3 }} />
              </TouchableOpacity>
              <Image source={route?.params?.image === null ? require('../../assets/images/profile.png') : { uri: route?.params?.image }} style={{ width: 40, height: 40, borderRadius: 50 }} />
              <Text style={styles.headerText}>
                {flex}
              </Text>

            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16
              }}
            >
              {!videoVisible && (
                <TouchableOpacity onPress={() => {
                  setVideoVisible(true);
                  // navigation.navigate('VideoCall', { number: userPhoneNumber, callID: callID })
                }} style={{ marginRight: 0 }}>
                  <Image tintColor={'white'} source={video} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
              )}
              
            </View>

          </LinearGradient>

          {

            videoVisible && (
              <View>
                <GroupCall user={senderPhoneNumber} lang={langer} callID={callID} onTextReceived={handleTextReceived} onEndCall={handleEndVideoCall} />
              </View>
            )
          }
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            renderItem={({ item }) => (
              <RenderGroupMessage
                item={item}
                senderPhoneNumber={senderPhoneNumber}
                route={route}
                playAudio={playAudio}
                voiceplay={voiceplay}
                chatPath={chatPath}
              />
            )}
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
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={() => setImageSend(null)}
                >
                  <Text style={[styles.removeImageText, { color: 'white', alignSelf: 'center', fontWeight: '800', marginTop: -1 }]}>
                    x
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputCon}>
              <TouchableOpacity onPress={selectImage} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D69D7', padding: 10, borderRadius: 50 }}>
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
                <TouchableOpacity onPressIn={startRecording} onPressOut={stopRecording} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D69D7', padding: 10, borderRadius: 50 }}>
                  <Image source={micer} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity onPress={sendTextOrImageMessage} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D69D7', padding: 10, borderRadius: 50 }}>
                <Image tintColor={'white'} source={send} style={{ width: 20, height: 20, alignSelf: 'center', marginLeft: 3 }} />
              </TouchableOpacity>
            </View>
          </View>

        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Helvetica Neue',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    flexDirection: 'column'
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
    alignSelf: 'flex-start'
    // marginRight: 5,
  },
  removeImageText: {
    fontSize: 16,
    color: 'black',
    // fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    height: 53,
    backgroundColor: '#0D69D7',
    justifyContent: 'space-between',
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
    marginLeft: 5,
    // width:'65%'
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
    alignSelf: 'flex-end'
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
    justifyContent: 'space-evenly',
    gap: 5,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  inputCon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 5,
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
    color: 'black'
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