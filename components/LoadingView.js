import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import gStyles from '../constants/Styles';

const LoadingView = ({
  wrapperStyle,
  containerStyle,
  textStyle,
  activeOpacity = 1,
  indicatorSize = 'small',
  indicatorColor = gStyles.color.mColor
}) => (
  <TouchableOpacity activeOpacity={activeOpacity} style={[styles.wrapper, wrapperStyle]}>
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={indicatorSize} color={indicatorColor} />
      <Text style={[styles.text, textStyle]}>数据加载中…</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    marginLeft: 10,
    color: gStyles.color.sTextColor
  }
});

export default LoadingView;
