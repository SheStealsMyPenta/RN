import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import gStyles from '../constants/Styles';

const PageContent = ({ children, style, ...rest }) => (
  <ScrollView style={[styles.container, style]} bounces={false} {...rest}>
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: gStyles.color.bgColor
  }
});

export default PageContent;
