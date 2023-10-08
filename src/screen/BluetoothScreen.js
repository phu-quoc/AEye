import React, {useEffect, useState} from 'react';
import {
  Platform,
  NativeModules,
  NativeEventEmitter,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {WINDOW_WIDTH} from '../constants/dimensions';
import {ORANGE} from '../constants/colors';
import BleManager from 'react-native-ble-manager';
import {DeviceList} from '../components/DeviceList';
import {requestPhoneCall} from '../utils/requestPhoneCall';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
export default function BluetoothScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);

  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };

  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const requestBlePermissions = async () => {
        const status = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        ]);
        return status;
      };
      const checkBlePermissions = async () => {
        console.log('Permission granted');
        const bcPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        const bfPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        const balPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        );
        const aflPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return aflPermission && bcPermission && bfPermission && balPermission;
      };
      // checkBlePermissions().then(result => {
      //   if (!result) {
      requestBlePermissions().then(result => console.log(result));
      // }
      // })
    }
    BleManager.start({showAlert: false}).then(() => {
      // Success code
      console.log('Module initialized');
      handleGetConnectedDevices();
    });
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log(JSON.stringify(Array.from(peripherals.values())));
      },
    );

    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );

    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 2, false)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const connect = async peripheral => {
    try {
      const setup = async () => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        let devices = Array.from(peripherals.values());
        await setConnectedDevices(Array.from(devices));
        await setDiscoveredDevices(Array.from(devices));
        await startNotification(peripheral);
        ToastAndroid.show('Connected', ToastAndroid.SHORT);
        console.log('BLE device paired successfully');
      };
      await BleManager.connect(peripheral.id);
      await setup();
    } catch (e) {
      throw Error('failed to bond');
    }
  };
  const disconnect = peripheral => {
    BleManager.disconnect(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        let devices = Array.from(peripherals.values());
        setConnectedDevices(Array.from(devices));
        setDiscoveredDevices(Array.from(devices));
        // alert(`Disconnected from ${peripheral.name}`);
        ToastAndroid.show('Disconnected', ToastAndroid.SHORT);
      })
      .catch(() => {
        throw Error('fail to remove the bond');
      });
  };

  const startNotification = async peripheral => {
    // console.log(connectedDevices[0].id);
    // const connected = await BleManager.getConnectedPeripherals([]);
    if (peripheral === undefined) {
      return alert('Connection to device failed! Retry');
    }
    const peripheralInfo = await retrieveServices(peripheral);
    const {id, characteristics} = peripheralInfo;
    console.log(
      JSON.stringify(characteristics.find(el => el.characteristic === '2222')),
    );
    const characteristic = await characteristics.find(
      el => el.characteristic === '2222',
    );
    console.log(characteristic);
    await BleManager.startNotification(
      id,
      characteristic.service,
      characteristic.characteristic,
    );
    ToastAndroid.show('Start notification', ToastAndroid.SHORT);
    BleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({value, peripheral, characteristic, service}) => {
        console.log(`Received ${value} for characteristic ${characteristic}`);
        console.log(value[0]);
        console.log(value[0] === 1);

        if (value[0] === 1) {
          console.log('Error: System down');
          requestPhoneCall();
        }
      },
    );
  };

  const retrieveServices = async peripheral => {
    try {
      console.log('Retrieving services ' + peripheral.id);
      const peripheralInfo = await BleManager.retrieveServices(peripheral.id);
      return peripheralInfo;
      // .then(peripheralInfo => {
      //   console.log('Hello');
      //   // Success code
      //   console.log('Peripheral info:', peripheralInfo);
      // })
      // .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{pdadingHorizontal: 20}}>
        <Text style={[styles.title]}>React Native BLE Manager Tutorial</Text>
        <TouchableOpacity
          onPress={startScan}
          activeOpacity={0.5}
          style={styles.scanButton}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>
        </TouchableOpacity>
        {/*<TouchableOpacity*/}
        {/*  onPress={() => startNotification()}*/}
        {/*  activeOpacity={0.5}*/}
        {/*  style={styles.scanButton}>*/}
        {/*  <Text style={styles.scanButtonText}>*/}
        {/*    {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}

        <Text style={[styles.subtitle]}>Discovered Devices:</Text>
        {discoveredDevices.length > 0 ? (
          <FlatList
            data={discoveredDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connect}
                disconnect={disconnect}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
        )}

        <Text style={[styles.subtitle]}>Connected Devices:</Text>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connect}
                disconnect={disconnect}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No connected devices</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  emergencyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: WINDOW_WIDTH * 0.82,
    height: (WINDOW_WIDTH * 0.82) / 5,
    borderRadius: 35,
    backgroundColor: ORANGE,
  },
  emergencyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
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
