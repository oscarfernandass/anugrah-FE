import React from 'react';
import { View, Text, Button, StyleSheet, Image ,TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
const {useAuthContext} = require('../../hooks/Context');
import { useNavigation } from '@react-navigation/native';
import Contactss from './Contacts';
import ContactChat from './ContactChat';
import { CardStyleInterpolators } from '@react-navigation/stack';
import Call from './Call';
import NewChat from './NewChat';
import AudioCall from './AudioCall';
const ContactMain = () => {
  const navigation=useNavigation();
  const{logout}=useAuthContext();
  return (
    <Stack.Navigator
    screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // for a horizontal slide
        gestureEnabled: true,
        gestureDirection: 'horizontal', // direction of the slide
      }}
    >
      <Stack.Screen
        name="Contacts"
        component={Contactss}
        options={{
          headerShown: false,
          headerTitle: '',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ContactChat"
        component={ContactChat}
        options={{
          headerShown: false,
          headerTitle: '',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Call"
        component={Call}
        options={{
          headerShown: false,
          headerTitle: '',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="AudioCall"
        component={AudioCall}
        options={{
          headerShown: false,
          headerTitle: '',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="NewChat"
        component={NewChat}
        options={{
          headerShown: false,
          headerTitle: '',
          headerTitleAlign: 'center',
        }}
      />

    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  prof: {
    width: 40,
    height: 40,
    borderRadius: 50,
    margin: 20,
  },
  notifi: {
    // marginRight: 10,
    height: 45,
    width: 45,
  },
  back: {
    height: 20, 
    width: 10, 
    marginLeft: 5, 
    marginRight:10,
  },
});

export default ContactMain;
