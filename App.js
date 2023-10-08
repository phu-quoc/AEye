/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  View,
  Image,
  StyleSheet,
  Text,
  Platform,
  SafeAreaView,
} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import LoginScreen from './src/screen/LoginScreen';
import BluetoothScreen from './src/screen/BluetoothScreen';
import {BACKGROUND_COLOR, ORANGE} from './src/constants/colors';
import SignupScreen from './src/screen/SignupScreen';
import VerificationScreen from './src/screen/VerificationScreen';
import ScanningScreen from './src/screen/ScanningScreen';
import ConnectionScreen from './src/screen/ConnectionScreen';
import {WINDOW_HEIGHT} from './src/constants/dimensions';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProfileScreen from './src/screen/ProfileScreen';
import StatisticScreen from './src/screen/StatisticScreen';

export default function App() {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    // setTimeout(() => {
    //   setWaiting(!waiting);
    // }, 5000);
  }, []);
  const introductionComponent = () => {
    return (
      <View style={styles.intro}>
        <Text style={styles.appName}>AEYE</Text>
      </View>
    );
  };

  const TabNavigation = () => {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Profile') {
              iconName = focused ? 'user' : 'user-o';
              return <FontAwesome name={iconName} size={size} color={color} />;
            } else {
              iconName = focused ? 'analytics-sharp' : 'analytics-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }

            // You can return any component that you like here!
          },
          tabBarActiveTintColor: BACKGROUND_COLOR,
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false,
          tabBarStyle: {
            height: WINDOW_HEIGHT * 0.08,
          },
          // tabBarStyle: {
          //   height: WINDOW_HEIGHT * 0.08,
          // },
        })}>
        <Tab.Screen name="Home" component={ScanningScreen} />
        <Tab.Screen name="Statistics" component={StatisticScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={BACKGROUND_COLOR} barStyle="light-content" />
      <NavigationContainer>
        {!auth && (
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Verify" component={VerificationScreen} />
            <Stack.Screen name="TabNavigation" component={TabNavigation} />
          </Stack.Navigator>
        )}
        {auth && TabNavigation()}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#000',
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ORANGE,
    marginTop: 15,
  },
  intro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
