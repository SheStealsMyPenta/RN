import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, View, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Text from '../components/Text';

const ImageButton = ({ onPress, disabled, source, style, containerStyle, hint = 0 }) => (
  <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} disabled={disabled}>
    {hint > 0 && (
      <View style={styles.hintContainer}>
        <Text style={styles.hint}>{hint}</Text>
      </View>
    )}
    <Image style={[styles.image, style]} source={source} />
  </TouchableOpacity>
);

ImageButton.defaultProps = {
  onPress() {},
  disabled: false
};

const styles = StyleSheet.create({
  container: {},
  hintContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -9,
    right: -9,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'red',
    zIndex: 1
  },
  hint: {
    color: 'white',
    fontSize: 10
  },
  image: {
    width: 20,
    height: 20
  }
});

export default ImageButton;
