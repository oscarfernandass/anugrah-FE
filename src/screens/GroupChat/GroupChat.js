import React, { useEffect, useState } from 'react';
import { View ,Text,StyleSheet, ImageBackground, ScrollView} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ground from '../../assets/images/ground.png';
const generateID = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const GroupCha = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await AsyncStorage.getItem('username');
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const unsubscribeListener = firestore()
      .collection('groupMessages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const formattedMessages = querySnapshot.docs.map((doc) => {
          const message = doc.data();
          return {
            _id: doc.id,
            text: message.text,
            createdAt: message.createdAt.toDate(),
            user: {
              _id: message.senderId,
              name: message.senderName,
            },
          };
        });
        setMessages(formattedMessages); 
      });
  
    return () => unsubscribeListener();
  }, []);

  const onSend = async (newMessages = []) => {
    if (!user) return; 

    const message = {
      _id: generateID(),
      text: newMessages[0].text,
      createdAt: new Date(),
      senderId: user, 
      senderName: user,
    };
    await firestore()
      .collection('groupMessages')
      .add(message);
  };
  const WelcomeMessage = () => {
    return (
        <View style={{ paddingTop: 15 ,paddingLeft:20}}>
            <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                DocsChat <Text style={styles.blueText}>Community</Text>
            </Text>
            <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                <Text style={styles.blueText}>Connect</Text> with people
            </Text>
        </View>
    );
};
  return (
    <ImageBackground source={ground} style={{flex:1}}>
        {/* <ScrollView contentContainerStyle={{ flexGrow: 1,}}> */}
        <WelcomeMessage/>
      <GiftedChat
        textInputProps={{
            style: { color: 'black',width:'80%',alignSelf:'center' } 
        }}
        messages={messages}
        onSend={onSend}
        user={{
            _id: user,
        }}
        renderBubble={(props) => (
          <Bubble
          {...props}
          wrapperStyle={{
              left: { backgroundColor: 'lightgray' },
              right: { backgroundColor: '#0D69D7' },
            }}
            />
        )}
        />
        {/* </ScrollView> */}
    </ImageBackground>
  );
};

export default GroupCha;
const styles=StyleSheet.create({
  head:{
    color:'black',
    fontSize:28,
    padding:12,
    fontWeight:'600',
  },
  blueText: {
    color: '#0D69D7',
    fontSize: 19,
},
font: {
    fontFamily: 'Helvetica Neue',
},
})