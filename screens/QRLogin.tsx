import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as SecureStore from 'expo-secure-store';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

import { triggerAuthToken } from '../api/index';
import { AuthState } from '../features/auth/authSlice';


interface QRLoginProps {
  navigation: any;
}

const QRLogin: React.FC<QRLoginProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  const userDetails = useSelector<RootState, AuthState['user_details']>(
    (state) => state.Auth.user_details
  );

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const sessionToken = await SecureStore.getItemAsync('session_token');
      if (!sessionToken || !userDetails) {
        Alert.alert('Error', 'Missing session token or user details.');
        return;
      }

      const channel = `private-${data}`;
      const response = await triggerAuthToken(sessionToken, channel, userDetails._id);

      if (response.success) {
        Alert.alert('Login Successful', 'You are now logged in!', [
          { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
        ]);
      } else {
        Alert.alert('Error', 'Invalid QR Code or Session Token');
      }
    } catch (error) {
      console.error('Error during QR Code login:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('session_token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permissions...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera. Please enable permissions in settings.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log in using QR Code</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={styles.camera}
      />
      {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  camera: {
    height: '50%',
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  logoutButton: {
    marginTop: 30,
    width: 170,
  },
});

export default QRLogin;
