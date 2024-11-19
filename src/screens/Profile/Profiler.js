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
import Options from '../../components/Options';
import HeadWithTorsoIcon from '../../assets/icons/user-svgrepo.svg';
import SignOutIcon from '../../assets/icons/sign-out-svgrepo.svg';
import Terms from '../../assets/icons/terms_of_use.svg';
import ContactUs from '../../assets/icons/contact_us.svg';
import FAQ from '../../assets/icons/faq.svg';
import lang from '../../assets/icons/lang.png';
const Profiler = () => {
  const navigation=useNavigation();
    const [des, setDes] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // New state for error message
    const [success,setSuccess]=useState(false);


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
                            <View className="w-full mt-[-8]">
                            <View className="bg-[#EBEDF0] h-0.5 mt-9 mb-2 w-full" />
                            <Options
                                className="mt-6 w-full"
                                svgIcon={<HeadWithTorsoIcon />}
                                text="Personal Details"
                                textStyle={styles.font}
                                // onPress={OnPressPersonalDetails}
                            />
                            <Options
                                className="mt-6 w-full"
                                svgIcon={<Image source={lang} style={{height:23,width:23}}/>}
                                text="Language settings"
                                textStyle={styles.font}
                                onPress={()=>{
                                    navigation.navigate('Language')
                                }}
                            />
                            <Options
                                className="mt-6 w-full"
                                svgIcon={<Terms />}
                                text="Term and conditions"
                                textStyle={styles.font}

                                // onPress={OnPressPersonalDetails}
                            />
                            <Options
                                className="mt-6 w-full"
                                svgIcon={<FAQ />}
                                text="Frequenlty Asked Questions"
                                textStyle={styles.font}

                                // onPress={OnPressPersonalDetails}
                            />
                            <Options
                                className="mt-6 w-full"
                                svgIcon={<ContactUs />}
                                text="Personal Details"
                                textStyle={styles.font}

                                // onPress={OnPressPersonalDetails}
                            />
                            <Options
                                className="mt-5 w-full"
                                svgIcon={<SignOutIcon />}
                                text="Sign out"
                                textClassName="text-[#DE2929] "
                                hideArrow={true}
                                onPress={null}
                                textStyle={styles.font}
                            />
                            <View className="bg-[#EBEDF0] h-0.5 mt-9 mb-2 w-full" />
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
