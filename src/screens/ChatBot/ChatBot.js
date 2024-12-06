import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import { chatBotApi } from '../../api/api';
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [marginBottom, setMarginBottom] = useState(0);
  const [voice, setVoice] = useState(false);
  const [user, setUser] = useState({
    _id: 1,
    name: 'User',
    avatar: 'https://img.freepik.com/premium-vector/3d-chat-bot-robot_685294-11.jpg',
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setMarginBottom(-60);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setMarginBottom(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onSend = async (newMessages = []) => {
    const updatedMessages = GiftedChat.append(messages, newMessages);
    setMessages(updatedMessages);
    await AsyncStorage.setItem('groupMessages', JSON.stringify(updatedMessages));

    const userMessage = newMessages[0]?.text;
    const data = { text: userMessage };

    try {
      const response = await chatBotApi(data);
      if (response?.response) {
        if (voice) {
          Speak(response.response);
        }

        const botMessage = {
          _id: Math.random().toString(),
          text: response.response,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'ChatBot',
            avatar: 'https://img.freepik.com/premium-vector/3d-chat-bot-robot_685294-11.jpg',
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

  const Speak = async (text) => {
    await Tts.setDefaultVoice('en-us-x-tpf-local');
    Tts.speak(text, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.5,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

  const renderAvatar = (props) => {
    return (
      <Avatar
        {...props}
        imageStyle={{
          left: { width: 36, height: 36, borderRadius: 18 },
          right: { width: 36, height: 36, borderRadius: 18 },
        }}
      />
    );
  };

  const renderBubble = (props) => {
    const isBotMessage = props.currentMessage.user._id === 2;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isBotMessage && voice) {
            Speak(props.currentMessage.text);
          }
        }}
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
      >
        <Bubble
          {...props}
          wrapperStyle={{
            left: { backgroundColor: 'lightgray' },
            right: { backgroundColor: '#0D69D7' },
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flexGrow: 1, marginBottom: marginBottom }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[styles.header, styles.font]}>
          Chat <Text style={styles.blueText}>Bot</Text>
        </Text>
        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            setVoice(!voice);
            Tts.stop();
          }}
        >
          <Text style={[styles.voiceStatus, styles.font, { color: voice ? '#0D69D7' : 'red' }]}>
            {voice ? 'Voice Enabled' : 'Voice Disabled'}
          </Text>
        </TouchableOpacity>
      </View>
      <GiftedChat
        textInputProps={{
          style: { color: 'black', width: '80%' },
        }}
        messages={messages}
        onSend={onSend}
        user={user}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
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
  header: {
    fontSize: 22,
    color: 'black',
    fontWeight: '600',
    letterSpacing: 0.2,
    paddingLeft: 20,
    paddingTop: 10,
  },
  voiceStatus: {
    fontSize: 12,
    paddingRight: 20,
    fontWeight: '700',
  },
});