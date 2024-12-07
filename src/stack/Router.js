import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoadJWT } from '../utility/loadJWT';
import { useAuthContext } from '../hooks/Context';
import Spinner from '../components/Spinner.js';
import Notification from '../screens/Notification/Notification.js';
import DrawerRoute from './DrawerRoute.tsx';
import Onboarding from '../screens/Onboarding/Onboarding.tsx';
import { Register } from '../screens/Register';
import Qr from '../screens/Qr.js';
import ContactMain from '../screens/Contacts/ContactMain.js';
import Otp from '../screens/Otp.js';
import Login from '../screens/Onboarding.js';
import LinkerMain from '../screens/Linker/LinkerMain.js';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

const Stack = createNativeStackNavigator();

const Router = () => {

  ReceiveSharingIntent.getReceivedFiles(files => {
    console.log(files);
    setSharedUrl(files[0]?.weblink);
    // files returns as JSON Array example
    //[{ filePath: null, text: null, weblink: null, mimeType: null, contentUri: null, fileName: null, extension: null }]
  }, 
  (error) =>{
    console.log(error);
  }, 
  'ShareMedia' // share url protocol (must be unique to your app, suggest using your apple bundle id)
  );
  
  
  // To clear Intents
  ReceiveSharingIntent.clearReceivedFiles();

    const { authState } = useAuthContext();
    const [loadJWT, status] = useLoadJWT();
    const [authenticated, setAuthenticated] = useState('');
    const [loading, setLoading] = useState(true);
    const [sharedUrl, setSharedUrl] = useState(null);

    useEffect(() => {
        const fetchLoginStatus = async () => {
            try {
                const loggedIn = await AsyncStorage.getItem('loggedin');
                setAuthenticated(loggedIn);
            } catch (error) {
                console.error("Error fetching login status", error);
            } finally {
                setLoading(false);
            }
        };

        // Handle shared URL from ReceiveSharingIntent

        fetchLoginStatus();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    // Determine the initial route based on shared URL
    const initialRoute = sharedUrl
        ? 'LinkerMain'
        : authenticated === 'true'
        ? 'Home'
        : 'Onboarding';

    return (
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            {/* Shared URL route */}
            <Stack.Screen
                name='LinkerMain'
                component={LinkerMain}
                initialParams={{ sharedUrl }}
            />
            {/* Authenticated routes */}
            <Stack.Screen name='Home' component={DrawerRoute} />
            <Stack.Screen name='Notification' component={Notification} />
            {/* Unauthenticated routes */}
            <Stack.Screen name='ContactMain' component={ContactMain} />
            <Stack.Screen name='Onboarding' component={Onboarding} />
            <Stack.Screen name='LoginScreen' component={Login} />
            <Stack.Screen name='Register' component={Register} />
            <Stack.Screen name='Qr' component={Qr} />
            <Stack.Screen name='Otp' component={Otp} />
        </Stack.Navigator>
    );
};

export default Router;
