import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import gStyles from '../constants/Styles';

const LoadingViewFinish = ({ containerStyle, textStyle }) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={[styles.text, textStyle]}>没有更多数据了…</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    marginVertical: 10,
    color: gStyles.color.sTextColor
  }
});

export default LoadingViewFinish;
