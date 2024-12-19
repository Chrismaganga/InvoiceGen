import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';

export default function Modal() {
  return (
    <>
      <ScreenContent path="screens/modal.tsx" title="Modal" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ScreenContent path="screens/Modal.tsx" title="Modal" />
    </>
  );
}
