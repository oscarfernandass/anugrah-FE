import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard, FlatList } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import Tts from 'react-native-tts';
import ground from '../../assets/images/ground.png';
import send from '../../assets/images/send.png';
import Voice from '@react-native-voice/voice';
import LinearGradient from 'react-native-linear-gradient';
import { Modal } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { translateText } from '../../api/api';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const InPerson = () => {
    const [inputText, setInputText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const lottieRef = useRef(null); // Reference to control the Lottie animation
    const [messages, setMessages] = useState([]);
    const [listening, setListening] = useState(false);
    const [isModal1Visible, setModal1Visible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);
    const [selectedOption1, setSelectedOption1] = useState({ key: 'english', value: 'en' });
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [translatedText, setTranslatedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastTap, setLastTap] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [gender,setGender]=useState(true);
    const handleCloseModal = () => setIsModalVisible(false);

    const toggleModal1 = () => setModal1Visible(!isModal1Visible);
    const toggleModal2 = () => setModal2Visible(!isModal2Visible);

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

      

    const options1 = [
        { key: 'english', value: 'en' },
        { key: 'hindi', value: 'hi' },
        { key: 'tamil', value: 'ta' },
        { key: 'malayalam', value: 'ml' },
        { key: 'telugu', value: 'te' },
        { key: 'kannada', value: 'kn' },
        { key: 'gujarati', value: 'gu' },
        { key: 'marathi', value: 'mr' },
        { key: 'punjabi', value: 'pa' },
        { key: 'bengali', value: 'bn' },
        { key: 'odia', value: 'or' },
        { key: 'assamese', value: 'as' },
        { key: 'urdu', value: 'ur' },
    ];



    const options2 = [
        { key: 'english', value: 'en' },
        { key: 'hindi', value: 'hi' },
        { key: 'tamil', value: 'ta' },
        { key: 'malayalam', value: 'ml' },
        { key: 'telugu', value: 'te' },
        { key: 'kannada', value: 'kn' },
        { key: 'gujarati', value: 'gu' },
        { key: 'marathi', value: 'mr' },
        { key: 'punjabi', value: 'pa' },
        { key: 'bengali', value: 'bn' },
        { key: 'odia', value: 'or' },
        { key: 'assamese', value: 'as' },
        { key: 'urdu', value: 'ur' },
    ];



    const selectOption1 = (option) => {
        setSelectedOption1(option);
        setModal1Visible(false);
    };

    const selectOption2 = (option) => {
        setSelectedOption2(option);
        setModal2Visible(false);
    };

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStarter;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechEnd = onSpeechEnder;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechStarter = () => setListening(true);
    const onSpeechResults = (event) => {
        const spokenText = event.value[0]; // Get the first recognized text
        console.log(spokenText);

        // Add the spoken text as a new message from the assistant
        const newMessage = { text: spokenText, sender: 'assistant' };
        addMessage(newMessage);

        // Add a "speak" message that will always be the last one
        setTimeout(() => addMessage({ text: "Tap and speak up endlessly! 😊", sender: 'assistant', type: 'speak' }), 1500);
    };



    const onSpeechEnder = () => setListening(false);
    const startListening = () => {
        try {
            Voice.start(`${selectedOption1.value}-${selectedOption1.value}`); // Start voice recognition for English (US)
        } catch (error) {
            console.error('Error starting Voice:', error);
        }
    };
    // useEffect(() => {
    //     startListening();
    // }, [selectedOption1, selectedOption2])


    useEffect(() => {
        const set = async () => {
            await Tts.setDefaultVoice(gender?'en-in-x-ene-network':'en-us-x-tpf-local');
        }
        set();
    },[gender])

    useEffect(() => {
        // Add TTS event listeners
        Tts.addEventListener('tts-start', onSpeechStart);
        Tts.addEventListener('tts-finish', onSpeechEnd);
        Tts.addEventListener('tts-cancel', onSpeechEnd);

        return () => {
            // Safely remove TTS event listeners
            Tts.removeAllListeners('tts-start');
            Tts.removeAllListeners('tts-finish');
            Tts.removeAllListeners('tts-cancel');
        };
    }, []);

    useEffect(() => {
        // Set a timeout to show the introduction after 3 seconds (or adjust as needed)
        const timeout = setTimeout(() => {
            Speak("Hello i am patrick")
        }, 1000); // 3-second delay (3000 milliseconds)
        const timeout1 = setTimeout(() => {
            Speak("i am your voice spreading assistant")
        }, 2000); // 3-second delay (3000 milliseconds)
        const timeout2 = setTimeout(() => {
            Speak("i speak on your behalf ")
        }, 2000); // 3-second delay (3000 milliseconds)
        setTimeout(() => addMessage({ text: "Tap and speak to convey your message 😄", sender: 'assistant', type: 'speak' }), 1500);


        // Cleanup function to clear the timeout if the component is unmounted
        return () => {
            clearTimeout(timeout)
            clearTimeout(timeout1)
            clearTimeout(timeout2)
        };
        // return () => clearTimeout(timeout1);
    }, []);

    const onSpeechStart = () => {
        setIsSpeaking(true);
        lottieRef.current?.play(); // Start the Lottie animation
    };

    const onSpeechEnd = () => {
        setIsSpeaking(false);
        lottieRef.current?.reset(); // Stop the animation
    };

    const Speak = async (text) => {
        // await Tts.setDefaultVoice('ta-in-x-tac-network');
        Tts.speak(text, {
            androidParams: {
                KEY_PARAM_PAN: -1,
                KEY_PARAM_VOLUME: 1,
                KEY_PARAM_STREAM: 'STREAM_MUSIC',
            },
        });
    };

    const addMessage = (message) => {
        // Remove any existing 'speak' messages before adding a new one
        setMessages((prev) => {
            const filteredMessages = prev.filter(msg => msg.type !== 'speak');
            return [...filteredMessages, message];
        });
    };


    const handleSendText = () => {
        if (inputText.trim()) {
            Speak(inputText);
            Keyboard.dismiss();
            const newMessage = { text: inputText, sender: 'user' };
            addMessage(newMessage);

            setInputText('');

            // Add a "speak" message that will be the last one
            setTimeout(() => addMessage({ text: "Tap and speak to convey your message 😄", sender: 'assistant', type: 'speak' }), 1500);
        }
    };


    const WelcomeMessage = () => {
        return (
            <View style={{ paddingTop: 0, paddingLeft: 5 }}>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    I am <Text style={styles.blueText}>Patrick</Text>
                </Text>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    <Text style={styles.blueText}>I speak</Text> on your behalf
                </Text>
                <TouchableOpacity onPress={()=>{
                    setGender(!gender)
                }} style={{justifyContent:'center',alignItems:'center',backgroundColor:'#0D69D7',borderRadius:8,marginTop:5,width:'50%'}}>
                <Text style={[{ fontSize: 18, color: 'white', fontWeight: '500', letterSpacing: 0.5 ,paddingVertical:3}, styles.font]}>
                    {gender?'Male':'Female'}
                </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderItem = ({ item }) => {
        const sender = item.sender === 'user';
    
        // Special case for "speak" message
        if (item.type === 'speak') {
            return (
                <TouchableOpacity onPress={startListening}>
                    <LinearGradient
                        colors={['#5F9EA0', '#088F8F']} // Gradient colors (you can customize them)
                        style={[styles.messageContainer, { flexDirection: 'row', borderBottomLeftRadius: 0 }]}>
                        <Text style={[{ fontSize: 16, color: 'white', paddingHorizontal: 4 }, styles.font]}>
                            {item.text}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            );
        }
    
        const handleDoubleTapMessage = () => {
            const now = Date.now();
            if (lastTap && now - lastTap < 300) {
                setLastTap(null);
                if (item.type !== 'speak') {
                    setIsModalVisible(true); // Show modal for non-speak messages
                    setLoading(true); // Show loading animation
                    Vibration.vibrate(200);
                    getTranslatedText(item.text).then((translated) => {
                        setTranslatedText(translated);
                        setLoading(false);
                    });
                }
            } else {
                setLastTap(now);
            }
        };
    
        return (
            <TouchableWithoutFeedback onPress={handleDoubleTapMessage}>
                <View
                    style={[
                        styles.messageContainer,
                        sender ? styles.userMessage : styles.assistantMessage,
                    ]}
                >
                    <Text
                        style={[
                            { fontSize: 16, color: sender ? 'white' : 'black', paddingHorizontal: 4 },
                            styles.font,
                        ]}
                    >
                        {item.text}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    



    return (
        <>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
            <ImageBackground source={ground} style={styles.container}>
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 0, backgroundColor: 'white' }}>
                        <WelcomeMessage />
                        <LottieView
                            ref={lottieRef}
                            source={require('../../assets/lottie/patrick.json')}
                            autoPlay={false} // Disable autoplay
                            loop={false} // Animation should not loop
                            style={{ height: 160, width: 160, marginTop: 0, marginLeft: -10 }}
                            />
                    </View>
                </View>
                {/* Option Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={toggleModal1} style={styles.optionButton}>
                        <Text style={styles.optionText}>
                            {selectedOption1?.key || 'Select Option 1'}
                        </Text>
                    </TouchableOpacity>
                    
                </View>

                {/* Modal for Option 1 */}
                <Modal
                    visible={isModal1Visible}
                    transparent={true}
                    animationType="fade"
                    >
                    <TouchableWithoutFeedback onPress={toggleModal1}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback >
                                <ScrollView contentContainerStyle={styles.modalContent}>
                                    {options1.map((option, index) => (
                                        <TouchableOpacity
                                        key={index}
                                        onPress={() => selectOption1(option)}
                                        style={styles.modalOption}
                                        >
                                            <Text style={styles.modalOptionText}>{option.key}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>


                {/* Modal for Option 2 */}


                <FlatList
                    data={[...messages].reverse()}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.chatContainer}
                    inverted
                    />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor="gray"
                        />
                    <TouchableOpacity onPress={handleSendText} style={styles.sendButton}>
                        <Image tintColor={'white'} source={send} style={styles.sendIcon} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContentt}>
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

export default InPerson;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    blueText: {
        color: '#0D69D7',
        fontSize: 19,
    },
    font: {
        fontFamily: 'Helvetica Neue',
    },
    inputContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: 5,
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#F1F1F1',
        color: 'black'
        // marginRight: 10,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D69D7',
        padding: 10,
        borderRadius: 50,
    },
    sendIcon: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        marginLeft: 3,
    },
    messageContainer: {
        maxWidth: '75%',
        padding: 6,
        borderRadius: 10,
        marginVertical: 6,

    },
    userMessage: {
        backgroundColor: '#0D69D7',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
    assistantMessage: {
        backgroundColor: '#F1F1F1',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
    },
    speakText: {
        color: '#0D69D7',
        marginTop: 2,
        fontSize: 12,
        alignSelf: 'flex-end',
        paddingRight: 4
    },
    chatContainer: {
        paddingHorizontal: 20,
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingTop: 80
    },
    optionButton: {
        flex: 1,
        backgroundColor: '#5F9EA0',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    optionText: {
        color: 'white',
        fontSize: 13,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        // padding: 20,
        width: '80%',
        // height: '50%',
        // height:200,
        // paddingVertical:40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#333',
    },
    modalCloseButton: {
        marginTop: 10,
        backgroundColor: '#5F9EA0',
        padding: 10,
        borderRadius: 5,
    },
    modalCloseText: {
        color: 'white',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // justifyContent: 'center',
        alignItems: 'center',
      },
      modalContentt: {
        width: '75%',
        padding: 20,
        top:60,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
});
