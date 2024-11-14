import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity, Button } from 'react-native';
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuery } from '../../api/api';
import Tts from 'react-native-tts';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [marginBottom, setMarginBottom] = useState(0); // State to handle marginBottom adjustment
  const [voice,setVoice]=useState(false);
  const [user, setUser] = useState({
    _id: 1,
    name: 'User',
    avatar: 'https://img.freepik.com/premium-vector/3d-chat-bot-robot_685294-11.jpg', // User's profile image (can be a static URL or dynamic based on logged-in user)
  });

  // Listen for keyboard show/hide events and adjust marginBottom
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setMarginBottom(-60); // Adjust marginBottom when keyboard is shown
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setMarginBottom(0); // Reset marginBottom when keyboard is hidden
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Function to handle sending the message and receiving the chatbot's response
  const onSend = async (newMessages = []) => {
    // Add the user's message to the chat
    const updatedMessages = GiftedChat.append(messages, newMessages);
    setMessages(updatedMessages);
    await AsyncStorage.setItem('groupMessages', JSON.stringify(updatedMessages));

    // Send the message to the API and handle the chatbot's reply
    const userMessage = newMessages[0]?.text;
    const data = { query: userMessage };

    try {
      const response = await getQuery(data);
      if (response?.response) {
        if(voice){
          Speak(response?.response);
        }
        // Append the chatbot's response to the chat
        const botMessage = {
          _id: Math.random().toString(),
          text: response.response, // API response
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'ChatBot',
            avatar: 'https://img.freepik.com/premium-vector/3d-chat-bot-robot_685294-11.jpg', // Chatbot's profile image
          },
        };
        const updatedMessagesWithBot = GiftedChat.append(updatedMessages, [botMessage]);
        setMessages(updatedMessagesWithBot);
        await AsyncStorage.setItem('groupMessages', JSON.stringify(updatedMessagesWithBot));
      }
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await AsyncStorage.getItem('groupMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    };

    loadMessages();
  }, []);

  // Function to handle TTS playback
  const Speak = async(text) => {
    // await Tts.setDefaultVoice('ta-in-x-tac-network');
    await Tts.setDefaultVoice('en-us-x-tpf-local');
    Tts.speak(text, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.5,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

  // Explicitly render avatar for each user (user and chatbot)
  const renderAvatar = (props) => {
    return (
        
      <Avatar
        {...props}
        imageStyle={{
          left: { width: 36, height: 36, borderRadius: 18 }, // Avatar size for left (bot)
          right: { width: 36, height: 36, borderRadius: 18 }, // Avatar size for right (user)
        }}
      />
    );
  };

  const renderBubble = (props) => {
    const isBotMessage=true; // Check if the message is from the chatbot
    if (isBotMessage) {
      return (


          <Bubble
            {...props}
            wrapperStyle={{
                left: { backgroundColor: 'lightgray' }, // Customize chatbot message style
            }}
          />

      );
    }

    return (
        <TouchableOpacity
        onPress={() => {
          // Pass the chatbot's message text to TTS for playback
          Tts.speak(props.currentMessage.text, {
            androidParams: {
              KEY_PARAM_PAN: -1, // Left/right channel balance (optional)
              KEY_PARAM_VOLUME: 0.5, // Volume level (0.0 to 1.0)
              KEY_PARAM_STREAM: 'STREAM_MUSIC', // Use the music stream for playback
            },
          });
        }}
        style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
      >
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#0D69D7' }, // Customize user message style
        }}
      />
                  <View style={{height:20,width:20,backgroundColor:'black'}}>
            </View>
        </TouchableOpacity>
    );
  };
  
  return (
    <View style={{ flexGrow: 1, marginBottom: marginBottom }}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      <Text style={[{ fontSize: 22, color: 'black', fontWeight: '600', letterSpacing: 0.2, paddingLeft: 20, paddingTop: 10 }, styles.font]}>
        Chat <Text style={styles.blueText}>Bot</Text>
      </Text>
      <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={async()=>{
            // const voices = await Tts.voices();
            // console.log(voices);
        setVoice(!voice);
        Tts.stop();
      }}>
        <Text style={[{fontSize:12,color:voice?'#0D69D7':'red',paddingRight:20,fontWeight:'700'},styles.font]}>
          {voice?'voice enabled':'voice disabled'}
          </Text>
      </TouchableOpacity>
      </View>
      <GiftedChat
        textInputProps={{
          style: { color: 'black', width: '80%' },
        }}
        messages={messages}
        onSend={onSend}
        user={user} // Set user with profile image
        renderBubble={renderBubble} // Render custom bubble with TTS
        renderAvatar={renderAvatar} // Explicitly render avatar
      />
    </View>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  blueText: {
    color: '#0D69D7',
    fontSize: 22,
  },
  font: {
    fontFamily: 'Helvetica Neue',
  },
  head: {
    color: 'black',
    fontSize: 28,
    paddingLeft: 20,
    paddingTop: 10,
    fontWeight: '600',
    fontFamily: 'Helvetica Neue',
  },
});
