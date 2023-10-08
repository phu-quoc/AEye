import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';

import Logo from '../assets/images/logo.jpg';
import {BACKGROUND_COLOR, ORANGE} from '../constants/colors';
import {
  APP_NAME_FONT_SIZE,
  LOGO_HEIGHT_MD,
  LOGO_WIDTH_MD,
  TITLE_FONT_SIZE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '../constants/dimensions';
import SignupScreen from './SignupScreen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from 'expo-checkbox';
import {useFocusEffect} from '@react-navigation/native';

export default function LoginScreen({navigation}) {
  const [isSelected, setSelection] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      changeNavigationBarColor(BACKGROUND_COLOR);
    }, []),
  );
  const startAnimation = useRef(new Animated.Value(0)).current;

  // Scaling Down Both logo and Title...
  const scaleLogo = useRef(new Animated.Value(1)).current;
  const scaleTitle = useRef(new Animated.Value(1)).current;
  const scaleAppName = useRef(new Animated.Value(1)).current;

  // Offset Animation....
  const moveLogo = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const moveTitle = useRef(new Animated.ValueXY({x: 0, y: -600})).current;
  const moveAppName = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  // Animating Content...
  const contentTransition = useRef(new Animated.Value(WINDOW_HEIGHT)).current;

  // Animation Done....
  useEffect(() => {
    // Starting Animation after 500ms....
    setTimeout(() => {
      // Parallel Animation...
      Animated.parallel([
        Animated.timing(startAnimation, {
          // For same Height for non-safe Area Devices...
          toValue: -WINDOW_HEIGHT,
          useNativeDriver: true,
        }),
        Animated.timing(scaleLogo, {
          // Scaling to 0.35
          toValue: 0.74,
          useNativeDriver: true,
        }),
        Animated.timing(scaleTitle, {
          // Scaling to 0.8
          toValue: TITLE_FONT_SIZE,
          useNativeDriver: true,
        }),
        Animated.timing(moveLogo, {
          // Moving to Right Most...
          toValue: {
            x: 0,
            y: WINDOW_HEIGHT / 2 + 227,
          },
          useNativeDriver: true,
        }),
        Animated.timing(moveTitle, {
          // Moving to Right Most...
          toValue: {
            x: 0,
            y: WINDOW_HEIGHT / 2 + 40,
          },
          useNativeDriver: true,
        }),
        Animated.timing(moveAppName, {
          // Moving to Right Most...
          toValue: {
            x: 0,
            y: WINDOW_HEIGHT / 2 + 226,
          },
          useNativeDriver: true,
        }),
        Animated.timing(contentTransition, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  }, []);

  const Login = () => {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={{flex: 1}}>
          <View style={styles.input}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={30}
              color="#fff"
              style={{marginLeft: 19, marginRight: 4}}
            />
            <TextInput
              onChange={() => {}}
              placeholder="Username"
              placeholderTextColor="#fff"
              style={{
                fontStyle: 'italic',
                fontSize: 17,
                color: '#fff',
                width: '80%',
              }}
            />
          </View>
          <View style={[styles.input, {marginTop: 19}]}>
            <MaterialCommunityIcons
              name="lock-reset"
              size={30}
              color="#fff"
              style={{marginLeft: 19, marginRight: 4}}
            />
            <TextInput
              onChange={() => {}}
              placeholder="Password"
              placeholderTextColor="#fff"
              secureTextEntry={true}
              style={{
                fontStyle: 'italic',
                fontSize: 17,
                color: '#fff',
                width: '80%',
              }}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 33}}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              color={isSelected ? ORANGE : undefined}
              style={{
                marginLeft: 20,
                backgroundColor: '#fff',
                borderColor: ORANGE,
                borderRadius: 5,
              }}
            />
            <Text
              style={{
                marginLeft: 12,
                fontSize: 16,
                color: '#fff',
              }}>
              Remember Password
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: 'rgba(255,255,255, 1)',
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
              },
            ]}
            onPress={() => {
              navigation.navigate('Verify');
              // props.setAuth(true);
            }}>
            <Text style={{fontSize: 20, fontWeight: '700', color: ORANGE}}>
              Login
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  color: '#fff',
                }}>
                Forgot Password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: 16,
                  color: '#fff',
                }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 0.13}} />
      </View>
    );
  };

  // Going to Move Up like Nav Bar...
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: BACKGROUND_COLOR,
      }}>
      <Animated.View
        style={{
          flex: 1,
          // backgroundColor: '#373733',
          zIndex: 1,
          transform: [{translateY: startAnimation}],
        }}>
        <Animated.View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animated.Image
            source={Logo}
            style={{
              width: LOGO_WIDTH_MD,
              height: LOGO_HEIGHT_MD,
              transform: [
                {translateX: moveLogo.x},
                {translateY: moveLogo.y},
                {scale: scaleLogo},
              ],
            }}
          />
          <Animated.Text
            style={{
              fontSize: 1,
              fontWeight: 'bold',
              color: 'white',
              transform: [{translateY: moveTitle.y}, {scale: scaleTitle}],
            }}>
            W E L C O M E
          </Animated.Text>
          <Animated.Text
            style={{
              fontSize: APP_NAME_FONT_SIZE,
              fontWeight: 'bold',
              color: 'white',
              transform: [{translateY: moveAppName.y}],
            }}>
            AEYE
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.04)',
          zIndex: 0,
          transform: [{translateY: contentTransition}],
        }}>
        {<Login />}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  input: {
    marginTop: 14,
    width: WINDOW_WIDTH * 0.8,
    height: (WINDOW_WIDTH * 0.8) / 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
