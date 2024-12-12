import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Vibration,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateText } from '../../api/api';
import { doc, updateDoc } from 'firebase/firestore'; // Ensure you have this imported
import Tts from 'react-native-tts';
import { database, storage } from '../../../firebase';

const RenderMessage = ({ item, senderPhoneNumber, route, playAudio, voiceplay , chatPath}) => {

  const [vise,setVise]=useState(false);
  useEffect(() => {
    const handleTTS = async () => {
      if (item.sender !== senderPhoneNumber && item.speakaudio) {
        // Speak the message
        await Speak(item.text);

        // Update Firestore to mark speakaudio as false
        try {
          const messageRef = doc(database, 'chats', chatPath, 'messages', item.id);
          await updateDoc(messageRef, { speakaudio: false });
        } catch (error) {
          console.error('Error updating speakaudio status:', error);
        }
      }
    };

    handleTTS();
  }, [item.speakaudio, item.sender, senderPhoneNumber, item.text, database, chatPath]);
  // useEffect(() => {
  //   if (item.text) {
  //     (async () => {
  //       const translated = await getTranslatedText(item.text);
  //       setTranslatedText(translated);
  //     })();
  //   }
  // }, [item.text]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isSender = item.sender === senderPhoneNumber;
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTap, setLastTap] = useState(null);

  const getTranslatedText = async (text) => {
    setLoading(true);
    try {
      const targetlang = (await AsyncStorage.getItem('selectedLanguage')) || 'english';
      const data = JSON.stringify({ text, targetlang });
      const response = await translateText(data);
      return response?.translated_text || 'Translation not available';
    } catch (error) {
      console.error('Translation failed:', error);
      return 'Translation error';
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      setLastTap(null);
      setIsModalVisible(true); // Show modal immediately
      setLoading(true); // Show loading animation
      Vibration.vibrate(200);
      getTranslatedText(item.text).then((translated) => {
        setTranslatedText(translated);
        setLoading(false);
      });
    } else {
      setLastTap(now);
    }
  };
  

  const handleCloseModal = () => setIsModalVisible(false);
  const Speak = async (text) => {
    try {
      Tts.speak(text, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    } catch (error) {
      console.error('Error during TTS:', error);
    }
  };



  return (
    <>
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.senderContainer : styles.receiverContainer,
        ]}
      >
        <Image
          source={
            isSender
              ? require('../../assets/images/prof.png')
              : route?.params?.image
              ? { uri: route?.params?.image }
              : require('../../assets/images/profile.png')
          }
          style={[
            styles.avatar,
            { marginLeft: isSender ? 4 : 0, marginRight: isSender ? 0 : 4 },
          ]}
        />
        {item.base64Image ? (
          <View
            style={[
              styles.imageMessage,
              { backgroundColor: isSender ? '#0D69D7' : '#E5E5EA' },
            ]}
          >
            <Image
              source={{ uri: `data:image/webp;base64,${item.base64Image}` }}
              style={styles.messageImage}
            />
            {item.text && (
              <TouchableWithoutFeedback onPress={handleDoubleTap}>
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <Text
                    style={[
                      styles.messageText,
                      { color: isSender ? 'white' : 'black' },
                    ]}
                  >
                    {item.text}
                  </Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            )}
          </View>
        ) : item.base64Audio ? (
          <TouchableOpacity onPress={() => playAudio(item.base64Audio)}>
            <Image
              tintColor={isSender ? '#0D69D7' : '#E5E5EA'}
              source={voiceplay}
              style={styles.audioIcon}
            />
          </TouchableOpacity>
        ) : (
          <TouchableWithoutFeedback onPress={handleDoubleTap}>
            <Text
              style={[
                styles.messageText,
                isSender ? styles.senderText : styles.receiverText,
              ]}
            >
              {item.text}
            </Text>
          </TouchableWithoutFeedback>
        )}
        {item?.emoji&&(
            <TouchableOpacity style={{backgroundColor:'black',justifyContent:'center',alignItems:'center',borderRadius:10}} onPress={()=>{
              setVise(!vise);
            }}>
              <Text style={{color:'white',fontSize:12,padding:5}}>{vise?item.emotion:item.emoji}</Text>
            </TouchableOpacity>
        )}
      </View>
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text
                  style={[
                    {
                      fontSize: 18,
                      color: 'black',
                      fontWeight: '500',
                      letterSpacing: 0.2,
                    },
                    styles.font,
                  ]}
                >
                  Magic <Text style={styles.blueText}>Tap</Text>
                </Text>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 16,
                      color: 'black',
                      textAlign: 'center',
                    }}
                  >
                    {translatedText}
                  </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Helvetica Neue',
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
    alignSelf: 'flex-end',
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
    padding: 4,
    borderRadius: 10,
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  audioIcon: {
    width: 60,
    height: 60,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '75%',
    padding: 20,
    top:60,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  blueText: {
    color: '#0D69D7',
    fontSize: 19,
  },
});

export default RenderMessage;
