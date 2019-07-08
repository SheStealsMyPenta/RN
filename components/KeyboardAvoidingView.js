import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

const KAView = ({ children, ...rest }) => (
  <KeyboardAvoidingView behavior="padding" {...rest}>
    {children}
  </KeyboardAvoidingView>
);

export default KAView;
