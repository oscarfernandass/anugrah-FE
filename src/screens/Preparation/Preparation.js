import BackgroundService from 'react-native-background-actions';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native'
import ground from '../../assets/images/ground.png';
import Input from '../../components/Input/input';
import useUploadResume from '../../api/uploadResume';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
const Preparation = () => {
    const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
    const veryIntensiveTask = async (taskDataArguments) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise( async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                console.log(i);
                await sleep(delay);
            }
        });
    };
    const options = {
        taskName: 'Uploading...',
        taskTitle: 'Uploading in background...',
        taskDesc: 'Please wait until we upload the documents',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: 'red',
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 1000,
        },
    };
    
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      }
    const getToken= async()=>{
        const token =await messaging().getToken();
        console.log("token",token);
    }
    useEffect(()=>{
        requestUserPermission();
        getToken();
    },[])
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [uploadError, setUploadError] = useState(false);

    const uploadPDF = async () => {
        await BackgroundService.start(veryIntensiveTask, options);
        setNameError(false);
        setUploadError(false);

        if (!name.trim()) {
            setNameError(true);
            return;
        }

        setLoading(true);
        try {
            const userName = await AsyncStorage.getItem('username');
            const response = await useUploadResume(name.trim(), userName);
            if (response.status === 'success') {
                await BackgroundService.updateNotification({taskDesc: 'Successfully uploaded document',taskTitle:'Upload successfull'});
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
                setTimeout(() => {
                    navigation.navigate('Jobs');
                }, 2000);
            } else {
                setUploadError(true);
            }
        } catch (error) {
            setUploadError(true);
        } finally {
            setLoading(false);
            setTimeout(async() => {
                await BackgroundService.stop();
            }, 10000);
        }
    }

    const WelcomeMessage = () => {
        return (
            <View style={{ paddingTop: 10 }}>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    Create <Text style={styles.blueText}>Knowledge Base</Text>
                </Text>
                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                    <Text style={styles.blueText}>Security</Text> is ensured
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100} // Adjust this offset as needed
        >
            <ImageBackground source={ground} style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1,paddingHorizontal:20 }}>
                    <WelcomeMessage/>
                    <LottieView source={require('../../assets/lottie/jet1.json')} autoPlay loop style={{ height: 280, width: 260, marginTop: -50, marginLeft: -30 }} />
                    {
                        loading ? (
                            <View>
                                <LottieView source={require('../../assets/lottie/loading.json')} autoPlay loop style={{ height: 250, width: 360, alignSelf: 'center' }} />
                                <Text style={[{ fontSize: 12, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>Uploading...</Text>
                            </View>
                        ) : success ? (
                            <View>
                                <LottieView source={require('../../assets/lottie/success.json')} autoPlay style={{ height: 360, width: 160, alignSelf: 'center', marginTop: -100 }} />
                                <Text style={[{ fontSize: 12, color: 'black', fontWeight: '400', letterSpacing: 0.2, alignSelf: 'center', marginTop: -110 }, styles.font]}>
                                    Upload Successful!
                                </Text>
                            </View>
                        ) : (
                            <View>
                                <Text style={[{ fontSize: 18, color: 'black', fontWeight: '600', letterSpacing: 0.2 }, styles.font]}>
                                    Upload <Text style={styles.blueText}>Document</Text>
                                </Text>
                                <View style={{ flexDirection: 'column', gap: 24, marginTop: 12 }}>
                                    <Input
                                        value={name}
                                        label="Document Name"
                                        labelStyle={styles.label}
                                        placeholder="e.g. hr policy document"
                                        containerStyle={styles.inputContainer}
                                        setValue={(val: String) => setName(val)}
                                    />
                                    {nameError && (
                                        <Text style={styles.errorText}>Document Name is required</Text>
                                    )}
                                    {uploadError && (
                                        <Text style={styles.errorText}>Failed to upload document. Please try again.</Text>
                                    )}
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%', backgroundColor: 'black', borderRadius: 4 }}
                                        onPress={uploadPDF}
                                    >
                                        <Text style={[{ color: 'white', fontSize: 15, paddingVertical: 14 }, styles.font]}>Create Knowledge Base</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default Preparation

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
        marginTop: -20,
        marginBottom: 12,
    },
})
