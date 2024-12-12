import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    FlatList,
  } from "react-native";
  import React, { useState, useEffect, useRef } from "react";
  import LottieView from "lottie-react-native";
  import Tts from "react-native-tts";
  import ground from "../../assets/images/ground.png";
  import send from "../../assets/images/send.png";
  import Voice from "@react-native-voice/voice";
  import LinearGradient from "react-native-linear-gradient";
  
  const InPerson = () => {
    const [inputText, setInputText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const lottieRef = useRef(null); // Reference to control the Lottie animation
    const [messages, setMessages] = useState([]);
    const [listening, setListening] = useState(false);
  
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
      const newMessage = { text: spokenText, sender: "assistant" };
      addMessage(newMessage);
    };
    const startListening = async () => {
        try {
          setListening(true);
          Voice.start("en-US");
        } catch (error) {
          console.error("Error starting Voice:", error);
        }
      };
      
      const stopListening = async () => {
        try {
          setListening(false);
          Voice.stop();
        } catch (error) {
          console.error("Error stopping Voice:", error);
        }
      };
      
      const onSpeechEnder = () => {
        setListening(false);
        // Restart listening after a brief delay for continuous input
        setTimeout(() => {
          if (!listening) {
            startListening();
          }
        }, 500); // Adjust delay as needed (e.g., 500ms)
      };
      
  
    useEffect(() => {
      const set = async () => {
        await Tts.setDefaultVoice("en-in-x-ene-network");
      };
      set();
    });
  
    const Speak = async (text) => {
      Tts.speak(text, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: "STREAM_MUSIC",
        },
      });
    };
  
    const addMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
  
    const handleSendText = () => {
      if (inputText.trim()) {
        Speak(inputText);
        Keyboard.dismiss();
        const newMessage = { text: inputText, sender: "user" };
        addMessage(newMessage);
  
        setInputText("");
      }
    };
  
    const renderItem = ({ item }) => {
      const sender = item.sender === "user";
  
      return (
        <View
          style={[
            styles.messageContainer,
            sender ? styles.userMessage : styles.assistantMessage,
          ]}
        >
          <Text
            style={[
              {
                fontSize: 16,
                color: sender ? "white" : "black",
                paddingHorizontal: 4,
              },
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ImageBackground source={ground} style={styles.container}>
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 0,
                backgroundColor: "white",
              }}
            >
              <Text style={[{ fontSize: 18, color: "black" }, styles.font]}>
                Continuous Speech Assistant
              </Text>
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
              <Image
                tintColor={"white"}
                source={send}
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={listening ? stopListening : startListening}
            style={styles.listenButton}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              {listening ? "Stop Listening" : "Start Listening"}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  };
  
  export default InPerson;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    font: {
      fontFamily: "Helvetica Neue",
    },
    inputContainer: {
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderTopWidth: 1,
      borderColor: "#ddd",
      backgroundColor: "white",
      position: "absolute",
      bottom: 0,
    },
    input: {
      flex: 1,
      fontSize: 16,
      padding: 10,
      borderRadius: 20,
      backgroundColor: "#F1F1F1",
      color: "black",
    },
    sendButton: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#0D69D7",
      padding: 10,
      borderRadius: 50,
    },
    sendIcon: {
      width: 20,
      height: 20,
      alignSelf: "center",
    },
    messageContainer: {
      maxWidth: "75%",
      padding: 6,
      borderRadius: 10,
      marginVertical: 6,
    },
    userMessage: {
      backgroundColor: "#0D69D7",
      alignSelf: "flex-end",
    },
    assistantMessage: {
      backgroundColor: "#F1F1F1",
      alignSelf: "flex-start",
    },
    chatContainer: {
      paddingHorizontal: 20,
      flexGrow: 1,
      justifyContent: "flex-end",
    },
    listenButton: {
      position: "absolute",
      bottom: 80,
      left: "40%",
      backgroundColor: "#0D69D7",
      padding: 10,
      borderRadius: 20,
    },
  });
  