import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {BACKGROUND_COLOR, GREY, ORANGE} from '../constants/colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../constants/dimensions';
import Logo from '../assets/images/logo.jpg';
import Avatar from '../assets/images/avatar.jpg';

export default function VerificationScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.appName}>AEYE</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.subMain1}>
          <Image source={Avatar} style={styles.avatar} />
          <Text style={{fontSize: 18, fontWeight: 'bold', color: GREY}}>
            Leoith Grosie
          </Text>
        </View>
        <View style={styles.subMain2}>
          <TextInput
            placeholderTextColor={BACKGROUND_COLOR}
            style={styles.input}
            textAlign={'center'}
            placeholder="Product code"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TabNavigation')}>
            <Text style={{fontWeight: 'bold', color: '#fff'}}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subMain3}>
          <Text>To connect the device, enter the above code</Text>
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
    backgroundColor: BACKGROUND_COLOR,
    width: '100%',
    height: WINDOW_HEIGHT,
  },
  input: {
    marginTop: 14,
    width: WINDOW_WIDTH * 0.5,
    height: (WINDOW_WIDTH * 0.5) / 4,
    backgroundColor: 'rgba(106,198,107,0.3)',
    borderRadius: 35,
    alignItems: 'center',
  },
  button: {
    marginTop: 23,
    width: WINDOW_WIDTH * 0.5,
    height: (WINDOW_WIDTH * 0.5) / 4,
    backgroundColor: 'rgb(106,182,107)',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: WINDOW_WIDTH * 0.41,
    height: (WINDOW_WIDTH * 0.41 * 520) / 959,
  },
  appName: {
    fontSize: WINDOW_WIDTH * 0.1,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
  },
  title: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  main: {
    flex: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 25,
    width: WINDOW_WIDTH * 0.84,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  subMain1: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subMain2: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  subMain3: {
    flex: 1,
    justifyContent: 'center',
  },
  avatar: {
    width: WINDOW_WIDTH * 0.3,
    height: WINDOW_WIDTH * 0.3,
    marginBottom: 12,
    borderRadius: 300,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: ORANGE,
  },
});
