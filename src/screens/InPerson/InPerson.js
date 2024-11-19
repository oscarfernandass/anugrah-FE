import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import Tts from 'react-native-tts';
import ground from '../../assets/images/ground.png';
import send from '../../assets/images/send.png';

const InPerson = () => {
    const [inputText, setInputText] = useState('');
    const [speakText, setSpeakText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const lottieRef = useRef(null); // Reference to control the Lottie animation
    
    useEffect(()=>{
        const set=async()=>{
            await Tts.setDefaultVoice('en-in-x-ene-network');
        }
        set();
    })
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
    
        // Cleanup function to clear the timeout if the component is unmounted
        return () =>{
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

    const Speak = async(text) => {
        // await Tts.setDefaultVoice('ta-in-x-tac-network');
        Tts.speak(text, {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 1,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });
      };
    const handleSendText = () => {
        if (inputText.trim()) {
            Keyboard.dismiss();
            setSpeakText(inputText); // Update the displayed text
            Speak(inputText); // Start TTS
            setInputText(''); // Clear the input field
        } else {
            Alert.alert('Input Error', 'Please enter some text to speak!');
        }
    };

    const WelcomeMessage = () => {
        return (
            <View style={{ paddingTop: 10 }}>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    I am <Text style={styles.blueText}>Patrick</Text>
                </Text>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    <Text style={styles.blueText}>I speak</Text> on your behalf
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground source={ground} style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
                    <WelcomeMessage />
                    <View>

                    <LottieView
                        ref={lottieRef}
                        source={require('../../assets/lottie/patrick.json')}
                        autoPlay={false} // Disable autoplay
                        loop={false} // Animation should not loop
                        style={{ height: 280, width: 260, marginTop: -20, alignSelf: 'center' }}
                        />
                    {speakText && (
                        <View style={{ alignSelf: 'center', backgroundColor: '#0D69D7', borderRadius: 15, padding: 10,marginTop:-25}}>
                            <Text style={[styles.font, { color: 'white' }]}>{speakText}</Text>
                        </View>
                    )}
                    </View>
                </ScrollView>
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
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#F1F1F1',
        color: 'black',
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
});
