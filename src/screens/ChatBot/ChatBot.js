import React, { useState, useRef, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform ,PermissionsAndroid, Alert,Keyboard} from 'react-native';
import { useRoute } from '@react-navigation/native';
import call from '../../assets/images/call.png';
import micer from '../../assets/images/micer.png';
import { Buffer } from 'buffer';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import { Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import rob from '../../assets/images/rob.png';
const ChatBot = () => {
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

  useEffect(() => {
      requestAudioPermission();
      initAudioRecord();
    }, []);


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

  const sendTextMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: true }]);
      setInputText('');
    }
  };


  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender ? styles.senderContainer : styles.receiverContainer]}>
      {
        item.sender===false &&
        <Image
        source={rob}
        style={[styles.avatar,{marginLeft:item.sender?4:0, marginRight:item.sender?0:4}]}
        />
      }
            {item.text ? (
      <Text style={[styles.messageText, item.sender ? styles.senderText : styles.receiverText]}>
        {item.text}
      </Text>
      ):null}
    </View>
  );

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={[styles.inputContainer,
        ]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={{justifyContent:'center',alignItems:'center',backgroundColor:'#0D69D7',padding:10,borderRadius:50}}>
                <Image source={micer} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendTextMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBot;

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