import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Vibration
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateText } from '../../api/api';
import LottieView from 'lottie-react-native';

const RenderMessage = ({ item, senderPhoneNumber, route, playAudio, voiceplay }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const isSender = item.sender === senderPhoneNumber;
    const [translatedText, setTranslatedText] = useState("");
    const [loading, setLoading] = useState(false);
    const getTranslatedText = async (text) => {
        setLoading(true);
        try {
          // Fetch the target language from AsyncStorage
          const targetlang = (await AsyncStorage.getItem('selectedLanguage')) || 'english'; // Default to English
          const data = JSON.stringify({
            text, // Pass the actual message text
            targetlang, // Dynamically set the target language
          });
          const response = await translateText(data);
          console.log(response?.translated_text);
          return response?.translated_text || 'Translation not available';
        } catch (error) {
          console.error('Translation failed:', error);
          return 'Translation error';
        } finally {
            setLoading(false);
        }
      };
      
      const handleLongPress = async () => {
        const translated = await getTranslatedText(item.text); // Pass item.text for translation
        setTranslatedText(translated); // Update the translated text state
        Vibration.vibrate(300);
        setIsModalVisible(true);
      };
      
  const handleCloseModal = () => setIsModalVisible(false);

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
          <View style={[styles.imageMessage,{backgroundColor:isSender?'#0D69D7':'#E5E5EA'}]}>
            <Image
              source={{ uri: `data:image/webp;base64,${item.base64Image}` }}
              style={styles.messageImage}
            />
            {item.text && (
              <TouchableWithoutFeedback onPressIn={handleLongPress} onPressOut={handleCloseModal}>
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
          <TouchableWithoutFeedback onPressIn={handleLongPress} onPressOut={handleCloseModal}>
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
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        >
        <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
            <Text
                style={[
                { fontSize: 18, color: 'black', fontWeight: '500', letterSpacing: 0.2 },
                styles.font,
                ]}
            >
                Magic <Text style={styles.blueText}>Touch</Text>
            </Text>
            {
                loading ? (
                            <View>
                                <LottieView source={require('../../assets/lottie/loading.json')} autoPlay loop style={{ height: 80, width: 80, alignSelf: 'center' }} />
                                <Text style={[{ fontSize: 8, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>translating...</Text>
                            </View>
                        ) : (
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
                        )
            }
            </View>
        </View>
        </Modal>

    </>
  );
};

const styles = StyleSheet.create({
    font:{
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
  imageMessage: {
    // alignItems: 'center',
    // backgroundColor: '#E5E5EA',
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
    top:60,
    width: '75%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  blueText: {
    color: '#0D69D7',
    fontSize:19
  },
});

export default RenderMessage;
