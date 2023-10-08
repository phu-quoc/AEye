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
import {BACKGROUND_COLOR, GREEN_OPACITY, ORANGE} from '../constants/colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../constants/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

export default function ProfileScreen({navigation}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>
          Sign out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GREEN_OPACITY,
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
});
