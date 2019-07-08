import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

const TabIcon = ({ source, size, tintColor }) => (
  <Image
    source={source}
    style={{ width: size, height: size, tintColor: tintColor }}
  />
);

TabIcon.propTypes = {
  size: PropTypes.number,
  tintColor: PropTypes.string
};

TabIcon.defaultProps = {
  size: 23
};

export default TabIcon;
