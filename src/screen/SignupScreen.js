import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import {BACKGROUND_COLOR, ORANGE} from '../constants/colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../constants/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

export default function SignupScreen({navigation}) {
  const [isSelected, setSelection] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      changeNavigationBarColor('#ffffff');
    }, []),
  );
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Image
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
        />
        <Text style={{fontSize: 45, fontWeight: 'bold', color: '#fff'}}>
          Sign Up
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={styles.earLeft} />
        </View>
        <View style={styles.centerContent}>
          <View style={styles.subContent}>
            <TextInput
              placeholderTextColor={BACKGROUND_COLOR}
              style={styles.input}
              placeholder="Username"
            />
            <TextInput
              placeholderTextColor={BACKGROUND_COLOR}
              style={styles.input}
              placeholder="Email"
            />
            <TextInput
              placeholderTextColor={BACKGROUND_COLOR}
              style={styles.input}
              placeholder="Password"
            />
            <TextInput
              placeholderTextColor={BACKGROUND_COLOR}
              style={styles.input}
              placeholder="Confirm Password"
            />
            <TouchableOpacity style={styles.button}>
              <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => navigation.navigate('Login')}>
              <Text
                style={
                  {
                    // fontSize: 16,
                  }
                }>
                Already Have An Account?
              </Text>
              <Text
                style={{
                  marginLeft: 5,
                  // fontSize: 16,
                  color: ORANGE,
                }}>
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.earRight} />
        </View>
      </View>
      <View style={{flex: 0.13}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: WINDOW_WIDTH * 0.8,
    height: (WINDOW_WIDTH * 0.8) / 6.5,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 35,
    paddingLeft: 30,
    fontWeight: '500',
    fontSize: 16,
    color: BACKGROUND_COLOR,
  },
  title: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    width: WINDOW_WIDTH,
  },
  content: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContent: {
    height: '100%',
    borderTopWidth: 5,
    justifyContent: 'center',
  },
  subContent: {
    height: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 350,
  },
  button: {
    width: WINDOW_WIDTH * 0.45,
    height: (WINDOW_WIDTH * 0.45) / 3.5,
    backgroundColor: ORANGE,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  leftContent: {
    width: '10%',
    height: '120%',
  },
  rightContent: {
    width: '10%',
    height: '120%',
  },
  earLeft: {
    width: '100%',
    height: '9.1%',
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 100,
    backgroundColor: '#fff',
  },
  earRight: {
    width: '100%',
    height: '9.1%',
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 100,
    backgroundColor: '#fff',
  },
  logo: {
    width: WINDOW_WIDTH * 0.32,
    height: (WINDOW_WIDTH * 0.32 * 520) / 959,
    marginBottom: 20,
  },
});
