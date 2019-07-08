import React from 'react';
import { View, StyleSheet } from 'react-native';

import gStyles from '../constants/Styles';

const PageFooter = ({ children, style, ...rest }) => (
  <View style={[styles.container, style]} {...rest}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: gStyles.color.mBorderColor,
    backgroundColor: gStyles.color.bgColor,
    width: '100%',
    height: gStyles.size.footerHeight
  }
});

export default PageFooter;
