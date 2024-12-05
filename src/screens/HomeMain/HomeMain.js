import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Link, useNavigation } from '@react-navigation/native';
import HomeLearn from './HomeLearn';
import Preparation from '../Linker/Linker.js';
import Notifi from '../../assets/icons/Notifi.svg';
import Mail from '../../assets/icons/Mail.svg';
import LearnMain from './LearnMain';
import ho from '../../assets/images/ho.png';
import base from '../../assets/images/base.png';
import { useAccountContext } from '../../hooks/Context.js';
const Tab = createBottomTabNavigator();
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import Notification from '../Notification/Notification.js';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Profile from '../../components/Profile.js';
import ChatBot from '../ChatBot/ChatBot.js';
import kno from '../../assets/images/kno.png';
import kis from '../../assets/images/kis.png';
import magnus from '../../assets/images/magnus.png';
import Magnus from '../Magnus/Magnus.js';
import ContactMain from '../Contacts/ContactMain.js';
import InPerson from '../InPerson/InPerson.js';
import mac from '../../assets/images/mac.png';
import yout from '../../assets/images/yout.png';
import pers from '../../assets/images/pers.png';
import { Line } from 'react-native-svg';
import Linker from '../Linker/Linker.js';
import LinkerMain from '../Linker/LinkerMain.js';
const HomeMain = () => {
  const navigation = useNavigation();
  const { account } = useAccountContext() ;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { ...styles.tabBar },
      }}
    >
      <Tab.Screen
        name="Learn"
        component={LearnMain}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={[
              styles.iconContainer, 
            ]}
            // className="w-[116px] h-[48px] p-[6px] gap-[0px] rounded-tl-[40px] "
            >
              {
                <View style={{backgroundColor: focused?'#0D69D7':null ,paddingVertical:4,paddingHorizontal:'8%',borderRadius:6}}>
                  <Image
                    source={ho}
                    style={{ tintColor: 'white' , }}
                    className="w-[26px] h-[26px]"
                  />
                </View>
              }
              <Text style={[{ fontSize:13, color:'white',marginTop:-5},styles.font]}
              className="font-[600]"
              >Home</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="LinkerMain"
        component={LinkerMain}
        options={{
          headerLeft: () => (
            <Profile />
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 15 }}
            onPress={()=>{
              navigation.navigate('Notification');
            }}
            >
              <Notifi />
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerShown: true,
          headerTitle: 'AnugraH',
          headerTitleStyle: [{
            fontSize: 20, // Adjust font size
            fontWeight: '600', // Make text bold
            color: '#0D69D7', // Set text color
            letterSpacing: 3, // Adjust spacing between letters
      
          },styles.font],
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={[
              styles.iconContainer, 
            ]}
            // className="w-[116px] h-[48px] p-[6px] gap-[0px] rounded-tl-[40px] "
            >
              {
                <View style={{backgroundColor: focused?'#0D69D7':null ,paddingVertical:4,paddingHorizontal:'8%',borderRadius:6}}>
                  <Image
                    source={yout}
                    style={{ tintColor: 'white' , }}
                    className="w-[28px] h-[28px]"
                  />
                </View>
              }
              <Text style={[{ fontSize:13, color:'white',marginTop:-5},styles.font]}
              className="font-[600]"
              >Link</Text>
            </View>
          ),
        }}
      />

<Tab.Screen
        name="ContactMain"
        component={ContactMain}
        options={{
          headerLeft: () => (
            <Profile />
          ),
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 15 }}
            onPress={()=>{
              navigation.navigate('Notification');
            }}
            >
              <Notifi />
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={[
              styles.iconContainer, 
            ]}
            // className="w-[116px] h-[48px] p-[6px] gap-[0px] rounded-tl-[40px] "
            >
              {
                <View style={{backgroundColor: focused?'#0D69D7':null ,paddingVertical:5,paddingHorizontal:'8%',borderRadius:6}}>
                  <Image
                    source={mac}
                    style={{ tintColor: 'white'}}
                    className="w-[28px] h-[28px]"
                  />
                </View>
              }
              <Text style={[{ fontSize:13, color:'white',marginTop:-5},styles.font]}
              className="font-[600]"
              >Call</Text>
            </View>
          ),
        }}
      />


      <Tab.Screen
        name="InPerson"
        component={InPerson}
        options={{
          headerLeft: () => (
            <Profile />
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              {/* <TouchableOpacity style={{ marginRight: 0 }}>
                <Mail />
              </TouchableOpacity> */}
              <TouchableOpacity style={{ marginRight: 0 }} 
              onPress={()=>{
                navigation.navigate('Notification');
              }}
              >
                <Notifi />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: '',
          headerShown: true,
          headerTitle: 'AnugraH',
          headerTitleStyle: [{
            fontSize: 20, // Adjust font size
            fontWeight: '600', // Make text bold
            color: '#0D69D7', // Set text color
            letterSpacing: 3, // Adjust spacing between letters
      
          },styles.font],
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={[
              styles.iconContainer, 
            ]}
            // className="w-[116px] h-[48px] p-[6px] gap-[0px] rounded-tl-[40px] "
            >
              {
                <View style={{backgroundColor: focused?'#0D69D7':null ,paddingVertical:4,paddingHorizontal:'8%',borderRadius:6}}>
                  <Image
                    source={pers}
                    style={{ tintColor: 'white' , }}
                    className="w-[28px] h-[28px]"
                  />
                </View>
              }
              <Text style={[{ fontSize:13, color:'white',marginTop:-5},styles.font]}
              className="font-[600]"
              >Inperson</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ChatBot"
        component={ChatBot}
        options={{
          headerLeft: () => (
            <Profile />
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              {/* <TouchableOpacity style={{ marginRight: 0 }}>
                <Mail />
              </TouchableOpacity> */}
              <TouchableOpacity style={{ marginRight: 0 }} 
              onPress={()=>{
                navigation.navigate('Notification');
              }}
              >
                <Notifi />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: '',
          headerShown: true,
          headerTitle: 'AnugraH',
          headerTitleStyle: [{
            fontSize: 20, // Adjust font size
            fontWeight: '500', // Make text bold
            color: '#0D69D7', // Set text color
            letterSpacing: 3, // Adjust spacing between letters
      
          },styles.font],
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={[
              styles.iconContainer, 
            ]}
            // className="w-[116px] h-[48px] p-[6px] gap-[0px] rounded-tl-[40px] "
            >
              {
                <View style={{backgroundColor: focused?'#0D69D7':null ,paddingVertical:4,paddingHorizontal:'8%',borderRadius:6}}>
                  <Image
                    source={kis}
                    style={{ tintColor: 'white' , }}
                    className="w-[26px] h-[26px]"
                  />
                </View>
              }
              <Text style={[{ fontSize:13, color:'white',marginTop:-5},styles.font]}
              className="font-[600]"
              >ChatBot</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
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
    marginRight: 20,
    height: 45,
    width: 45,
  },
  navStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
  },
  tabBar: {
    height: 60,
    backgroundColor:'black'
  },
  iconContainer: {
    flexDirection:'column',
    justifyContent: 'center',
    // justifyContent:'space-evenly',
    marginTop:5,
    alignItems: 'center',
    // padding: '1%',
    // borderRadius:50,
    // width:115,
    // paddingVertical:'3%'
    // paddingHorizontal:50
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
});

export default HomeMain;
