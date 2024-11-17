import React from 'react';
import { View, Text, Button, StyleSheet, Image ,TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeLearn from './HomeLearn';
import Notifi from '../../assets/icons/Notifi.svg';
const Stack = createStackNavigator();
const {useAuthContext} = require('../../hooks/Context');
import { useNavigation } from '@react-navigation/native';
import PersonalizedButton from '../../components/PersonalizedButton';
import Notification from '../Notification/Notification';
import Profile from '../../components/Profile';
const LearnMain = () => {
  const navigation=useNavigation();
  const{logout}=useAuthContext();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeLearn"
        component={HomeLearn}
        options={{
          headerLeft: () => (
            <Profile />
          ),
          headerRight: () => (
            <PersonalizedButton>
              <TouchableOpacity style={{ marginRight: 15 }}
                onPress={() => {
                  navigation.navigate('Notification');
                }}
              >
                <Notifi />
              </TouchableOpacity>
            </PersonalizedButton>
          ),
          headerShown: true,
          headerTitle: 'AnugraH',
          headerTitleStyle: [{
            fontSize: 20, // Adjust font size
            fontWeight: '600', // Make text bold
            color: '#0D69D7', // Set text color
            letterSpacing: 3, // Adjust spacing between letters
      
          },styles.font],
          headerTitleAlign: 'center',
        }}
      />
{/* <Stack.Screen
        name="CourseLanding"
        component={CourseLanding}
        options={{
          headerRight: () => (
            <PersonalizedButton>
              <TouchableOpacity style={{ marginRight: 15 }}
                onPress={() => {
                  navigation.navigate('Notification');
                }}
                >
                <Notifi />
              </TouchableOpacity>
            </PersonalizedButton>
          ),
          headerShown: true,
          headerTitle:() => null,
          headerBackImage: () => (
              <Back/>
          ),
        }}
      />
<Stack.Screen
        name="PostCourse"
        component={PostCourse}
        options={{
          headerRight: () => (
            <TouchableOpacity style={{marginRight:15}}>
            <Threedot  />
          </TouchableOpacity>
          ),
          headerShown: false,
          headerTitle:() => null,
          headerBackImage: () => (
              <Back/>
          ),
        }}
      />
<Stack.Screen
        name="VideoPlay"
        component={VideoPlay}
        options={{
          headerRight: () => (
            <TouchableOpacity style={{marginRight:15}}>
            <Threedot  />
          </TouchableOpacity>
          ),
          headerShown: false,
          headerTitle:() => null,
          headerBackImage: () => (
              <Back/>
          ),
        }}
      /> */}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  font:{
    fontFamily: 'Helvetica Neue',
  },
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

export default LearnMain;
