import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard , FlatList} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import Tts from 'react-native-tts';
import ground from '../../assets/images/ground.png';
import send from '../../assets/images/send.png';
import Voice from '@react-native-voice/voice';
import LinearGradient from 'react-native-linear-gradient';
import add from '../../assets/images/add.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import { VideoToSign, VideoToDes, VideoToSumm } from '../../api/api';

const Linker = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [pages, setPages] = useState([]);
    const [currentPageId, setCurrentPageId] = useState(null);

    useEffect(() => {
        setLink();
    }, []);

    const setLink = () => {
        if (route?.params?.routeLink) {
            console.log("link came in linker", route?.params?.routeLink);
            setInputText(route?.params?.routeLink);
        }
    };

    const initializeApp = async () => {
        try {
            const savedPages = await AsyncStorage.getItem('pages');
            const parsedPages = savedPages ? JSON.parse(savedPages) : [];

            if (parsedPages.length === 0) {
                const defaultPage = { id: 1, name: 'Page 1', messages: [] };
                await AsyncStorage.setItem('pages', JSON.stringify([defaultPage]));
                setPages([defaultPage]);
                setCurrentPageId(1);
                setMessages([]);
            } else {
                setPages(parsedPages);

                const { pageId } = route.params || {};
                const selectedPage = parsedPages.find((page) => page.id === pageId);

                if (selectedPage) {
                    setCurrentPageId(pageId);
                    setMessages(selectedPage.messages || []);
                } else {
                    const firstPage = parsedPages[0];
                    setCurrentPageId(firstPage.id);
                    setMessages(firstPage.messages || []);
                }
            }
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    };

    useEffect(() => {
        initializeApp();
    }, []);

    useFocusEffect(
        useCallback(() => {
            initializeApp();
        }, [route.params?.pageId])
    );

    const savePages = async (updatedPages) => {
        try {
            await AsyncStorage.setItem('pages', JSON.stringify(updatedPages));
        } catch (error) {
            console.error('Failed to save pages:', error);
        }
    };

    const addMessage = (message) => {
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, message];
            const updatedPages = pages.map((page) =>
                page.id === currentPageId ? { ...page, messages: updatedMessages } : page
            );
            setPages(updatedPages);
            savePages(updatedPages);
            return updatedMessages;
        });
    };

    const handleSendText = () => {
        if (inputText.trim()) {
            Keyboard.dismiss();
            const newMessage = { text: inputText, sender: 'user' };
            addMessage(newMessage);

            setInputText('');
            setTimeout(() => addMessage({ text: 'Generate Description 😄', sender: 'assistant', type: 'description' }), 1500);
            setTimeout(() => addMessage({ text: 'Generate summary ✨', sender: 'assistant', type: 'summary' }), 2000);
            setTimeout(() => addMessage({ text: 'Generate sign language 🌈', sender: 'assistant', type: 'signLanguage' }), 2500);
        }
    };

    const handleAddPage = async () => {
        try {
            const newId = pages.length > 0 ? Math.max(...pages.map((page) => page.id)) + 1 : 1;
            const newPage = { id: newId, name: `Page ${newId}`, messages: [] };

            const updatedPages = [...pages, newPage];
            await AsyncStorage.setItem('pages', JSON.stringify(updatedPages));

            setPages(updatedPages);
            setCurrentPageId(newId);
            navigation.push('Linker', { pageId: newId });
        } catch (error) {
            console.error('Failed to add new page:', error);
        }
    };

    const WelcomeMessage = () => {
        const currentPage = pages.find((page) => page.id === currentPageId);
        const openPageList = () => navigation.push('PageList');
        return (
            <View style={{ paddingTop: 0, paddingLeft: 5 }}>
                <TouchableOpacity onPress={openPageList}>
                    <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                        Decrypt <Text style={styles.blueText}>link</Text>
                    </Text>
                </TouchableOpacity>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    <Text style={styles.blueText}>{currentPage?.name}</Text>
                </Text>
            </View>
        );
    };

    const handleTypeClick = async (type) => {
        setMessages((prevMessages) => {
            const filteredMessages = prevMessages.filter(
                (msg) => !['summary', 'description', 'signLanguage', 'loading'].includes(msg.type)
            );
            return [...filteredMessages];
        });

        const loadingMessage = { text: 'Loading...', sender: 'assistant', type: 'loading' };
        addMessage(loadingMessage);

        const lastUserMessage = [...messages].reverse().find((msg) => msg.sender === 'user');
        if (!lastUserMessage) {
            Alert.alert('No user message found to process.');
            return;
        }

        try {
            const data = {
                url: lastUserMessage.text,
                src: 'english',
                dest: 'english',
            };

            let response;
            if (type === 'summary') {
                response = await VideoToSumm(data);
            } else if (type === 'description') {
                response = await VideoToDes(data);
            } else if (type === 'signLanguage') {
                response = await VideoToSign(data);
            }

            setMessages((prevMessages) => {
                const updatedMessages = prevMessages.filter((msg) => msg.type !== 'loading');
                let resultMessage;

                if (type === 'summary' && response?.summary) {
                    const combinedResult1 = `${response.summary}`;
                    resultMessage = { text: combinedResult1, sender: 'assistant', type: 'result' };
                } else if (type === 'description' && response?.desc) {
                    const combinedResult2 = `${response.desc.tword} --${response.desc.emoji}`;
                    resultMessage = { text: combinedResult2, sender: 'assistant', type: 'result' };
                } else if (type === 'signLanguage' && response?.video_base64) {
                    resultMessage = { text: 'Sign language video ready!', sender: 'assistant', type: 'result' };
                } else {
                    resultMessage = { text: `Error: No result for ${type}.`, sender: 'assistant', type: 'error' };
                }

                return [...updatedMessages, resultMessage];
            });
        } catch (error) {
            console.error('Error while fetching data:', error);
            setMessages((prevMessages) => {
                const updatedMessages = prevMessages.filter((msg) => msg.type !== 'loading');
                const errorMessage = {
                    text: `Error: Unable to generate ${type}.`,
                    sender: 'assistant',
                    type: 'error',
                };
                return [...updatedMessages, errorMessage];
            });
        }
    };

    const renderItem = ({ item }) => {
        const sender = item.sender === 'user';
        const messageTypeStyle = {
            description: ['#5F9EA0', '#088F8F'],
            summary: ['#9D50BB', '#6E48AA'],
            signLanguage: ['#FF512F', '#DD2476'],
        };
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const containsUrl = urlRegex.test(item.text);

        if (item.type && ['summary', 'description', 'signLanguage'].includes(item.type)) {
            return (
                <TouchableOpacity onPress={() => handleTypeClick(item.type)}>
                    <LinearGradient
                        colors={messageTypeStyle[item.type] || ['#000', '#fff']}
                        style={[styles.messageContainer, { flexDirection: 'row', borderBottomLeftRadius: 0 }]}
                    >
                        <Text style={[{ fontSize: 16, color: 'white', paddingHorizontal: 4 }, styles.font]}>
                            {item.text}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            );
        }

        if (containsUrl) {
            return (
                <View
                    style={[
                        styles.messageContainer,
                        sender ? styles.userMessage : styles.assistantMessage,
                    ]}
                >
                    <LinkPreview text={item.text} />
                </View>
            );
        }

        return (
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
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground source={ground} style={styles.container}>
                <TouchableOpacity onPress={handleAddPage} 
                style={{position:'absolute', bottom:80,right:20,backgroundColor:'black',borderColor:'#0D69D7',borderWidth:4,borderRadius:10,justifyContent:'center',alignItems:'center',zIndex:100000,padding:8}}>
                    <Image source={add} tintColor={'white'} style={{width:30,height:30}} />
                </TouchableOpacity>
                <View style={{paddingHorizontal:20}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:0,backgroundColor:'transparent'}}>
                        <WelcomeMessage />
                        <LottieView
                            source={require('../../assets/lottie/linkes.json')}
                            autoPlay={true}
                            loop={true}
                            style={{ height: 90, width: 90 }}
                        />
                    </View>
                </View>
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
    );
};

export default Linker;


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
            paddingHorizontal:20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:'space-evenly',
            gap:5,
            padding: 10,
            borderTopWidth: 1,
            borderColor: '#ddd',
            backgroundColor: 'white',
            position:'absolute',
            bottom:0
        },
        input: {
            flex: 1,
            fontSize: 16,
            padding: 10,
            borderRadius: 20,
            backgroundColor: '#F1F1F1',
            color:'black'
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
            maxWidth: '70%',
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
            alignSelf:'flex-end',
            paddingRight:4
        },
        chatContainer: {
            paddingHorizontal: 20,
            flexGrow: 1,
            justifyContent: 'flex-end',
            paddingTop:160
        },
        pageListContainer: {
            backgroundColor: '#333',
            padding: 10,
            position:'absolute',
            zIndex:900000,
            height:'100%',
            width:'75%'
        },
        pageListItem: {
            padding: 10,
            backgroundColor: '#0D69D7',
            marginVertical: 5,
            borderRadius: 5,
        },
    });
