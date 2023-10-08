import React from 'react';
import {PermissionsAndroid} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
export async function requestPhoneCall() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: 'App Call Phone Permission',
        message: 'App needs access to your call phone feature',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      SendIntentAndroid.sendPhoneCall('+84373728677', true);
    } else {
      console.log('Call Phone permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
