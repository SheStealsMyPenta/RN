import React from 'react';
import { View, StyleSheet } from 'react-native';

import gStyles from '../constants/Styles';

const PageWrapper = ({ children, style, ...rest }) => (
  <View style={[styles.container, style]} {...rest}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: gStyles.color.bgColor
  }
});

export default PageWrapper;
