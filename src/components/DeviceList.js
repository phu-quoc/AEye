import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

export const DeviceList = ({peripheral, connect, disconnect}) => {
  const {name, id, rssi, connected} = peripheral;

  return (
    <>
      {name && (
        <View style={styles.deviceContainer}>
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{name}</Text>
            <Text style={styles.deviceInfo}>RSSI: {id}</Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              connected ? disconnect(peripheral) : connect(peripheral)
            }
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                {fontWeight: 'bold', fontSize: 16},
              ]}>
              {connected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 14,
  },
  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
