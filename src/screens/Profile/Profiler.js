import BackgroundService from 'react-native-background-actions';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import ground from '../../assets/images/ground.png';
import Input from '../../components/Input/input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import prof from '../../assets/images/prof.png';
import { postFeed } from '../../api/api';
import { useNavigation } from '@react-navigation/native';
const Profiler = () => {
  const navigation=useNavigation();
    const [des, setDes] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // New state for error message
    const [success,setSuccess]=useState(false);
    useEffect(() => {
        const fetch = async () => {
            const user = await AsyncStorage.getItem('username');
            setName(user);
        };
        fetch();
    }, []);

    const handleSendFeedback =async () => {
        if (des.trim() === '') {
            setError('Please provide feedback.'); // Set error message if feedback is empty
        } else {
          setLoading(true);
            try{
              const data={
                "username":name,
                "message":des
              }
              const response=await postFeed(data);
              if(response.message){
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
              }
            }catch(error){
              setError('Error occurred');
            }finally{
              setLoading(false);
            }
        }
    };

    const WelcomeMessage = () => {
        return (
            <View style={{ paddingTop: 14, flexDirection: 'row', alignItems: 'center' }}>
                <Image source={prof} style={{ height: 35, width: 35, borderRadius: 50 }} />
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2, marginLeft: 6 }, styles.font]}>
                    <Text style={styles.blueText}>{name} </Text>Profile
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <ImageBackground source={ground} style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
                    <WelcomeMessage />
                    <LottieView source={require('../../assets/lottie/king.json')} autoPlay loop style={{ height: 280, width: 260, marginTop: -25, marginLeft: -30 }} />
                    {loading ? (
                        <View>
                            <LottieView source={require('../../assets/lottie/loading.json')} style={{ height: 250, width: 360, alignSelf: 'center' }} />
                            <Text style={[{ fontSize: 12, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>Uploading...</Text>
                        </View>
                        ) : success ? (
                          <View>
                              <LottieView source={require('../../assets/lottie/success.json')} autoPlay style={{ height: 360, width: 160, alignSelf: 'center', marginTop: -100 }} />
                              <Text style={[{ fontSize: 12, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>
                                  Sent Successfully!
                              </Text>
                          </View>
                      ) : (
                        <View>
                            <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                                Part of <Text style={styles.blueText}>Docs Chat Community</Text>
                            </Text>
                            <View style={{ flexDirection: 'column', gap: 24, marginTop: 12 }}>
                                <Input
                                    value={des}
                                    label="Feedback"
                                    labelStyle={styles.label}
                                    placeholder="Leave us feedback"
                                    containerStyle={styles.inputContainer}
                                    setValue={(val: String) => setDes(val)}
                                    multiline={true}
                                    numberOfLines={6}
                                />
                                {error ? <Text style={styles.errorText}>{error}</Text> : null} 

                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%', backgroundColor: 'black', borderRadius: 4 }}
                                    onPress={handleSendFeedback} // Attach the validation handler here
                                >
                                    <Text style={[{ color: 'white', fontSize: 15, paddingVertical: 14 }, styles.font]}>Send Feedback</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%', backgroundColor: 'grey', borderRadius: 4 }}
                                    onPress={async()=>{
                                      await AsyncStorage.removeItem('loggedin');
                                      navigation.navigate('LoginScreen');
                                    }}
                                >
                                    <Text style={[{ color: 'white', fontSize: 15, paddingVertical: 14 }, styles.font]}>Sign Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default Profiler;

const styles = StyleSheet.create({
    inputContainer: {
        // marginBottom: 24,
    },
    label: {
        fontFamily: 'Lato-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        marginBottom: 8,
    },
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
    errorText: {
        fontFamily: 'Helvetica Neue',
        color: 'red',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 0,
    },
});
