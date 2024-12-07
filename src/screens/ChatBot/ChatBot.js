import React, { useState, useRef, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform ,PermissionsAndroid, Alert,Keyboard} from 'react-native';
import { useRoute } from '@react-navigation/native';
import micer from '../../assets/images/micer.png';
import AudioRecord from 'react-native-audio-record';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import rob from '../../assets/images/rob.png';
import attach from '../../assets/images/attach.png';
import send from '../../assets/images/send.png';
import { chatBotApi } from '../../api/api';

const ChatBot = () => {
  const navigation=useNavigation();
  const route=useRoute();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', sender: true },
    { id: '2', text: 'Hi, how can I help you?', sender: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [imagesend,setImageSend] = useState('');
  const flatListRef = useRef();

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 0.8, // Adjust quality as needed (0.0 to 1.0 for JPEG compression)
      includeBase64: true, // Include base64 data
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
        const selectedImage = response.assets[0];
        if (selectedImage.fileName && !selectedImage.fileName.endsWith('.jpg')) {
          // Rename the file to end with .jpg (optional for clarity)
          selectedImage.fileName = selectedImage.fileName.replace(/\.[^/.]+$/, ".jpg");
        }
  
        setImageSend(selectedImage); // Update state with the selected image
        console.log("Selected Image (JPEG):", selectedImage);
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

const sendTextOrImageMessage = async () => {
  if (imagesend || inputText.trim()) {
    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: true,
      image: imagesend ? imagesend.uri : null,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    setInputText('');
    setImageSend(null);
    const data = {
      text: inputText.trim() || "describe this image",
      image: imagesend?.base64 ,
    };

    try {
      // Call the chatBotApi
      const apiResponse = await chatBotApi(data);
      if (apiResponse && apiResponse.response) {
        const botMessage = {
          id: Date.now().toString(),
          text: apiResponse.response,
          sender: false,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        Alert.alert('Error', 'Failed to get a response from the server.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Something went wrong while sending the message.');
    }
  } else {
    Alert.alert('Error', 'Please enter a message or select an image to send.');
  }
};




  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender ? styles.senderContainer : styles.receiverContainer]}>
      {
        item.sender===false &&
        <Image
        source={rob}
        style={[styles.avatar,{marginLeft:item.sender?0:0, marginRight:item.sender?0:4}]}
        />
      }
      {item.image ? (
          <View style={[styles.imageMessage,{backgroundColor:item?.sender?'#0D69D7':'#E5E5EA'}]}>
            <Image
              source={{ uri: item.image}}
              style={styles.messageImage}
            />
            {item.text && (
                  <Text
                    style={[
                      // styles.messageText,
                      { color: item?.sender ? 'white' : 'black',padding:5,width:150 },
                    ]}
                  >
                    {item.text}
                  </Text>
            )}
          </View>
        ) : (
            <Text
              style={[
                styles.messageText,
                item?.sender ? styles.senderText : styles.receiverText,
              ]}
            >
              {item.text}
            </Text>
        )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={[...messages].reverse()}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
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
        <TouchableOpacity style={{justifyContent:'center',alignItems:'center',backgroundColor:'#0D69D7',padding:10,borderRadius:50}}>
                <Image source={micer} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
            <TouchableOpacity onPress={sendTextOrImageMessage} style={{justifyContent:'center',alignItems:'center',backgroundColor:'#0D69D7',padding:10,borderRadius:50}}>
                <Image tintColor={'white'} source={send} style={{ width: 20, height: 20,alignSelf:'center',marginLeft:3 }} />
        </TouchableOpacity>
      </View>
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
  imagePreviewContainer: {
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
    borderRadius: 10,
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
  imageMessage: {
    // alignItems: 'center',
    // backgroundColor: '#E5E5EA',
    padding: 4,
    // width:'55%',
    borderRadius: 8,
  },
  messageImage: {
    width: 160,
    height: 150,
    borderRadius: 10,
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