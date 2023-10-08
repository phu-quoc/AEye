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
  FlatList,
  TouchableHighlight,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import {BACKGROUND_COLOR, CREAM, DANGER, ORANGE} from '../constants/colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../constants/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from '../assets/images/avatar.jpg';
import Logo from '../assets/images/logo_grey.jpg';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ConnectionScreen({navigation}) {
  return (
    <View style={styles.container}>
      {/*<ImageBackground*/}
      {/*  source={require('../assets/images/connection_screen.png')}*/}
      {/*  style={{*/}
      {/*    width: WINDOW_WIDTH,*/}
      {/*    height: WINDOW_HEIGHT,*/}
      {/*    display: 'absolute',*/}
      {/*    top: 0,*/}
      {/*    left: 0,*/}
      {/*    bottom: 0,*/}
      {/*    right: 0,*/}
      {/*    alignItems: 'center',*/}
      {/*    justifyContent: 'center',*/}
      {/*  }}>*/}
      {/*  <View style={styles.container}>*/}
      <View style={styles.title}>
        <Image source={Avatar} style={styles.avatar} />
        <View style={{marginLeft: 11, marginTop: 5}}>
          <Text style={{fontSize: 16, color: CREAM}}>Hi, Leoith Grosie</Text>
          <Text style={{fontSize: 20, color: CREAM}}>Welcome Back</Text>
        </View>
        <MaterialCommunityIcons name="bell-circle" style={styles.icon} />
      </View>
      <View style={styles.content}>
        <View style={styles.subContent1}>
          <View style={styles.info}>
            <Image source={Avatar} style={styles.avatarLg} />

            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                Leoith Grosie
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}>
                <Text style={{color: '#fff', fontSize: 17}}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.subContent2}>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                marginTop: 10,
                // width: WINDOW_WIDTH * 0.75,
                fontWeight: 'bold',
              }}>
              E.A.R &lt; 0.3
            </Text>
            <Text
              style={{
                fontSize: 20,
                // marginTop: 25,
                // width: WINDOW_WIDTH * 0.75,
                fontWeight: 'bold',
              }}>
              DROWSINESS ALERT
            </Text>
          </View>
          <View style={styles.count}>
            <Text style={{fontSize: 50, fontWeight: 'bold', color: DANGER}}>
              2
            </Text>
          </View>
          <View style={styles.status}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
              DANGEROUS
            </Text>
          </View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '900',
              textAlign: 'center',
              width: '70%',
              color: DANGER,
            }}>
            Please stop your vehicle and take a rest
          </Text>
        </View>
      </View>
      {/*  </View>*/}
      {/*</ImageBackground>*/}
      <View style={{flex: 0.13}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF6E8',
    width: '100%',
    height: '100%',
    // opacity: 0.9,
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
  title: {
    flex: 0.22,
    backgroundColor: BACKGROUND_COLOR,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    // opacity: 0.3,
    flexDirection: 'row',
    paddingTop: 50,
  },
  content: {
    // backgroundColor: '#f0f',
    position: 'absolute',
    elevation: 999,
    top: WINDOW_HEIGHT / 6,
    left: WINDOW_WIDTH * 0.05,
    right: WINDOW_WIDTH * 0.05,
  },
  subContent1: {
    height: WINDOW_HEIGHT * 0.243,
    backgroundColor: '#fff',
    borderRadius: 20,
    // opacity: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  subContent2: {
    marginTop: 23,
    height: WINDOW_HEIGHT * 0.46,
    backgroundColor: '#fff',
    borderRadius: 20,
    // opacity: 0.3,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  avatar: {
    width: WINDOW_WIDTH * 0.12,
    height: WINDOW_WIDTH * 0.12,
    borderRadius: 30,
    marginLeft: WINDOW_WIDTH * 0.1,
    marginTop: 5,
  },
  avatarLg: {
    width: WINDOW_WIDTH * 0.25,
    height: WINDOW_WIDTH * 0.25,
    borderRadius: 100,
    // marginLeft: WINDOW_WIDTH * 0.1,
    marginTop: 5,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: ORANGE,
  },
  icon: {
    fontSize: WINDOW_WIDTH * 0.15,
    marginRight: WINDOW_WIDTH * 0.1,
    marginLeft: 'auto',
    color: CREAM,
  },
  groupIcon: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logo: {
    width: WINDOW_WIDTH * 0.18,
    height: (WINDOW_WIDTH * 0.18 * 520) / 959,
  },
  button: {
    marginTop: 20,
    width: WINDOW_WIDTH * 0.35,
    height: (WINDOW_WIDTH * 0.35) / 3,
    backgroundColor: ORANGE,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonConnect: {
    width: 100,
    height: 35,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 0,
  },
  count: {
    width: WINDOW_WIDTH * 0.34,
    height: WINDOW_WIDTH * 0.34,
    borderWidth: 8,
    borderRadius: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: DANGER,
  },
  status: {
    width: WINDOW_WIDTH * 0.45,
    height: (WINDOW_WIDTH * 0.45) / 3.5,
    backgroundColor: DANGER,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
