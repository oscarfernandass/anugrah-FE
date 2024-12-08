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
import rob from '../../assets/images/rob.png';
import { translateText } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MessageItem = ({ item }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTap, setLastTap] = useState(null);

  useEffect(() => {
    if (item.text) {
      (async () => {
        const translated = await getTranslatedText(item.text);
        setTranslatedText(translated);
      })();
    }
  }, [item.text]);



  
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


  return (
    <>
    <View
      style={[
        styles.messageContainer,
        item.sender ? styles.senderContainer : styles.receiverContainer,
      ]}
    >
      {!item.sender && (
        <Image
          source={rob}
          style={[
            styles.avatar,
            { marginLeft: item.sender ? 0 : 0, marginRight: item.sender ? 0 : 4 },
          ]}
        />
      )}
      {item.image ? (
        <View
          style={[
            styles.imageMessage,
            { backgroundColor: item?.sender ? '#0D69D7' : '#E5E5EA' },
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.messageImage} />
          {item.text && (
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
            <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text
              style={{
                color: item?.sender ? 'white' : 'black',
                padding: 5,
                width: 150,
              }}
            >
              {item.text}
            </Text>
            </Animated.View>
        </TouchableWithoutFeedback>
          )}
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
        <Text
          style={[
            styles.messageText,
            item?.sender ? styles.senderText : styles.receiverText,
          ]}
        >
          {item.text}
        </Text>
        </TouchableWithoutFeedback>
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
    borderRadius: 8,
  },
  messageImage: {
    width: 160,
    height: 150,
    borderRadius: 10,
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

export default MessageItem;
