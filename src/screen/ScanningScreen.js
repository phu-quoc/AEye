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
  PermissionsAndroid,
  ToastAndroid,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import {
  BACKGROUND_COLOR,
  CREAM,
  DANGER,
  GREEN_OPACITY,
  GREY,
  ORANGE,
  WARNING,
} from '../constants/colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../constants/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from '../assets/images/avatar.jpg';
import Logo from '../assets/images/logo_grey.jpg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {useFocusEffect} from '@react-navigation/native';
import BleManager from 'react-native-ble-manager';
import {requestPhoneCall} from '../utils/requestPhoneCall';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function ScanningScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [isConnected, setConnection] = useState(false);
  const [count, setCount] = useState(0);
  const [color, setColor] = useState(BACKGROUND_COLOR);

  useFocusEffect(
    React.useCallback(() => {
      changeNavigationBarColor('#ffffff');
    }, []),
  );

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
      requestBlePermissions().then(result => console.log(result));
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
        ToastAndroid.show('Connected', ToastAndroid.SHORT);
        await startNotification(peripheral);
        await setConnection(true);
        console.log('BLE device paired successfully');
      };
      await BleManager.connect(peripheral.id);
      await setup();
    } catch (e) {
      ToastAndroid.show('Connection fail', ToastAndroid.SHORT);
    }
  };
  const disconnect = peripheral => {
    BleManager.disconnect(peripheral.id)
      .then(() => {
        // peripheral.connected = false;
        // peripherals.set(peripheral.id, peripheral);
        // let devices = Array.from(peripherals.values());
        setConnectedDevices([]);
        setDiscoveredDevices([]);
        startScan();
        // alert(`Disconnected from ${peripheral.name}`);
        setConnection(false);
        ToastAndroid.show('Disconnected', ToastAndroid.SHORT);
      })
      .catch(() => {
        ToastAndroid.show('Disconnection action failed', ToastAndroid.SHORT);
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
    let c = 0;
    BleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({value, peripheral, characteristic, service}) => {
        console.log(`Received ${value} for characteristic ${characteristic}`);
        console.log(value[0]);
        console.log(value[0] === 1);

        if (value[0] === 1) {
          console.log('Alert: Request Phone Call');
          requestPhoneCall();
        } else if (value[0] === 2) {
          console.log(`Alert: Drowsiness ${count + 1}`);
          c + 1 === 1 ? setColor(WARNING) : setColor(DANGER);
          setCount(++c);
          console.log(count);
        }
      },
    );
  };

  const retrieveServices = async peripheral => {
    try {
      console.log('Retrieving services ' + peripheral.id);
      const peripheralInfo = await BleManager.retrieveServices(peripheral.id);
      return peripheralInfo;
    } catch (e) {
      console.log(e);
    }
  };
  const Device = ({peripheral, connect}) => {
    const {name, id, rssi, connected} = peripheral;
    return (
      <>
        {name && (
          <View
            style={{
              flexDirection: 'row',
              width: WINDOW_WIDTH * 0.75,
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Ionicons
              name="car-sport-sharp"
              style={{fontSize: 40, color: BACKGROUND_COLOR}}
            />
            <Text
              style={{
                color: BACKGROUND_COLOR,
                fontWeight: '500',
                marginLeft: 15,
              }}>
              {name}
            </Text>
            <TouchableOpacity
              style={styles.buttonConnect}
              onPress={() => connect(peripheral)}>
              <Text style={{color: '#fff'}}>Connect</Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  const DiscoveredDevices = () => {
    return (
      <View style={styles.subContent2}>
        <Text
          style={{
            fontSize: 20,
            marginTop: 25,
            width: WINDOW_WIDTH * 0.75,
            fontWeight: 'bold',
            color: GREY,
          }}>
          Discovered devices
        </Text>
        {discoveredDevices.length > 0 ? (
          <FlatList
            data={discoveredDevices}
            renderItem={({item}) => (
              <Device peripheral={item} connect={connect} />
            )}
            showsVerticalScrollIndicator={false}
            style={{marginTop: 25}}
          />
        ) : (
          <View style={{height: '100%', justifyContent: 'center'}}>
            <Text style={{color: GREY}}>No Bluetooth devices found</Text>
          </View>
        )}
      </View>
    );
  };

  const Tracking = () => {
    return (
      <View style={[styles.subContent2, {justifyContent: 'space-around'}]}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              marginTop: 10,
              fontWeight: 'bold',
              color: GREY,
            }}>
            E.A.R &lt; 0.3
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: GREY,
            }}>
            DROWSINESS ALERT
          </Text>
        </View>
        <View style={[styles.count, {borderColor: color}]}>
          <Text style={{fontSize: 50, fontWeight: 'bold', color: color}}>
            {count}
            {console.log('Count: ' + count)}
          </Text>
        </View>
        <View style={[styles.status, {backgroundColor: color}]}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
            {count === 0 && 'SAFE'}
            {count === 1 && 'WARNING'}
            {count >= 2 && 'DANGEROUS'}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '900',
            textAlign: 'center',
            width: '70%',
            color: color,
          }}>
          {count === 0 && 'Wishing you a safe journey'}
          {count === 1 && 'You show signs of drowsiness'}
          {count >= 2 && 'Please stop your vehicle and take a rest'}
        </Text>
      </View>
    );
  };

  const ScanDevices = () => {
    return (
      <>
        <View style={styles.subContent1}>
          <View style={styles.groupIcon}>
            <Ionicons
              name="phone-portrait"
              style={{fontSize: 50, color: ORANGE}}
            />
            <MaterialCommunityIcons
              name="bluetooth-connect"
              style={{fontSize: 50, color: ORANGE}}
            />
            <Image source={Logo} style={styles.logo} />
          </View>
          <View style={{width: '100%', alignItems: 'center'}}>
            <TouchableOpacity style={styles.button} onPress={startScan}>
              <Text style={{color: '#fff', fontSize: 17}}>
                {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
  const ConnectedDevices = ({peripheral, disconnect}) => {
    return (
      <>
        <View style={[styles.subContent1, {alignItems: 'center'}]}>
          <View style={styles.info}>
            <Image source={Avatar} style={styles.avatarLg} />

            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 22, fontWeight: 'bold', color: GREY}}>
                Leoith Grosie
              </Text>
              <TouchableOpacity
                onPress={() => disconnect(peripheral)}
                style={[
                  styles.button,
                  {
                    marginTop: 20,
                    width: WINDOW_WIDTH * 0.35,
                    height: (WINDOW_WIDTH * 0.35) / 3,
                  },
                ]}>
                <Text style={{color: '#fff', fontSize: 17}}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Image source={Avatar} style={styles.avatar} />
        <View style={{marginLeft: 11, marginTop: 5}}>
          <Text style={{fontSize: 16, color: CREAM}}>Hi, Leoith Grosie</Text>
          <Text style={{fontSize: 20, color: CREAM}}>Welcome Back</Text>
        </View>
        <MaterialCommunityIcons name="bell-circle" style={styles.icon} />
      </View>
      <View style={styles.content}>
        {/*<View style={styles.subContent2}>*/}
        {!isConnected && (
          <>
            <ScanDevices />
            <DiscoveredDevices />
          </>
        )}
        {isConnected && (
          <>
            <ConnectedDevices
              peripheral={connectedDevices[0]}
              disconnect={disconnect}
            />
            <Tracking />
          </>
        )}
        {/*</View>*/}
      </View>
      <View style={{flex: 0.13}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN_OPACITY,
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
    flexDirection: 'row',
    paddingTop: 50,
  },
  content: {
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
    justifyContent: 'space-evenly',
  },
  subContent2: {
    marginTop: 23,
    height: WINDOW_HEIGHT * 0.46,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
  },
  avatar: {
    width: WINDOW_WIDTH * 0.12,
    height: WINDOW_WIDTH * 0.12,
    borderRadius: 30,
    marginLeft: WINDOW_WIDTH * 0.1,
    marginTop: 5,
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
    marginTop: 23,
    width: WINDOW_WIDTH * 0.7,
    height: (WINDOW_WIDTH * 0.7) / 5,
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
  },
  status: {
    width: WINDOW_WIDTH * 0.45,
    height: (WINDOW_WIDTH * 0.45) / 3.5,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
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
});
