import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

import ImageButton from '../ImageButton';

const WIDTH = Dimensions.get('window').width;

export default class GalleryImage extends Component {
  render() {
    const { uri, index, onPress, imagesPerRow, canDelete, onImageDelete } = this.props;
    let imageMargin = 5,
      imageWidth = (WIDTH - 2 * imageMargin * imagesPerRow) / imagesPerRow;
    return (
      <TouchableOpacity
        onPress={() => onPress(index)}
        activeOpacity={0.8}
        style={{
          borderRadius: 0,
          backgroundColor: 'transparent',
          width: imageWidth,
          height: imageWidth,
          marginTop: imageMargin,
          marginHorizontal: imageMargin
        }}
      >
        {canDelete && (
          <ImageButton
            containerStyle={styles.deleteContainer}
            style={styles.deleteButton}
            source={require('../../img/delete3.png')}
            onPress={() => onImageDelete(index)}
          />
        )}
        <Image
          source={{ uri }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: imageWidth,
            height: imageWidth,
            resizeMode: 'cover',
            borderRadius: 5
          }}
        />
      </TouchableOpacity>
    );
  }
}

GalleryImage.propTypes = {
  uri: PropTypes.string,
  index: PropTypes.number,
  onPress: PropTypes.func,
  imagesPerRow: PropTypes.number
};

styles = StyleSheet.create({
  deleteContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1000
  },
  deleteButton: {
    width: 19,
    height: 19
  }
});
