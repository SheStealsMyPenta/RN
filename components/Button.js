import React from 'react';
import PropTypes from 'prop-types';
import { Image, ViewPropTypes, TouchableOpacity, StyleSheet } from 'react-native';

import Text from './Text';
import gStyles from '../constants/Styles';

const propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: Text.propTypes.style,
  containerStyle: ViewPropTypes.style,
  text: PropTypes.string,
  activeOpacity: PropTypes.number
};

const Button = ({ onPress, disabled, style, iconStyle, containerStyle, text, activeOpacity, icon = null }) => (
  <TouchableOpacity
    style={[styles.container, containerStyle]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={activeOpacity}
  >
    {icon && <Image style={[styles.icon, iconStyle]} source={icon} />}
    <Text style={[styles.text, style]}>{text}</Text>
  </TouchableOpacity>
);

Button.propTypes = propTypes;

Button.defaultProps = {
  onPress() {},
  disabled: false,
  activeOpacity: 0.5
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gStyles.color.mColor,
    borderRadius: 5
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: 'white',
    marginRight: 8
  },
  text: {
    color: 'white'
  }
});

export default Button;
