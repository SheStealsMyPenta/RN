import React from 'react';
import { StyleSheet } from 'react-native';
import { CachedImage } from 'react-native-img-cache';

const RemoteImage = ({ uri, style, ...rest }) => (
  <CachedImage source={{ uri }} style={[styles.image, style]} {...rest} />
);

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20
  }
});

export default RemoteImage;
