import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import { useLoadJWT } from '../utility/loadJWT'
import Spinner from '../components/Spinner.js';
import { useAuthContext } from '../hooks/Context';
import Notification from '../screens/Notification/Notification.js';
import DrawerRoute from './DrawerRoute.tsx';
import Onboarding from '../screens/Onboarding/Onboarding.tsx';
import { Login } from '../screens/Onboarding.js';
import { Register } from '../screens/Register';
import Qr from '../screens/Qr.js';
import Mfa from '../screens/Mfa.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Contacts from '../screens/Contacts/Contacts.js';
import ContactMain from '../screens/Contacts/ContactMain.js';
const Stack = createNativeStackNavigator();

const Router = () => {
    const { authState } = useAuthContext()
    const [loadJWT, status] = useLoadJWT()
    const [authenticated, setAuthenticated] = useState('')
    const [loading, setLoading] = useState(true);

    // Refactor the useEffect to handle async properly
    useEffect(() => {
        const fetchLoginStatus = async () => {
            try {
                const loggedIn = await AsyncStorage.getItem('loggedin');
                setAuthenticated(loggedIn);
            } catch (error) {
                console.error("Error fetching login status", error);
            } finally {
                setLoading(false); // Ensure loading state is handled
            }
        };

        fetchLoginStatus();

        // Optionally, you can return a cleanup function if required
        return () => {
            // Cleanup code, if needed
        };
    }, []);  // Empty dependency array means this runs only on mount

    if (loading) {
        return <Spinner />
    }

    if (authenticated === 'true') {
        return (
            <Stack.Navigator initialRouteName={'Home'} screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Home' component={DrawerRoute} options={{ headerShown: false }} />
                <Stack.Screen name='Notification' component={Notification} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }

    return (
        <Stack.Navigator initialRouteName={'Onboarding'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name='ContactMain' component={ContactMain} options={{ headerShown: false }} />
            <Stack.Screen name='Onboarding' component={Onboarding} options={{ headerShown: false }} />
            <Stack.Screen name='LoginScreen' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
            <Stack.Screen name='Qr' component={Qr} options={{ headerShown: false }} />
            <Stack.Screen name='Mfa' component={Mfa} options={{ headerShown: false }} />
            <Stack.Screen name='Home' component={DrawerRoute} options={{ headerShown: false }} />
            <Stack.Screen name='Notification' component={Notification} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default Router;
