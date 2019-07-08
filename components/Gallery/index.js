import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';

import ImageViewer from '../../lib/ImageViewer';
import GalleryImage from './GalleryImage';

export default class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      shown: false
    };
  }

  openLightbox = index => {
    this.setState({
      index,
      shown: true
    });
  };

  hideLightbox = () => {
    this.setState({
      index: 0,
      shown: false
    });
  };

  render() {
    const { images, imagesPerRow, canDelete, onImageDelete } = this.props;
    const { index, shown } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        {(() =>
          images.map((image, idx) => (
            <GalleryImage
              index={idx}
              key={idx}
              onPress={this.openLightbox}
              uri={image}
              imagesPerRow={imagesPerRow}
              canDelete={canDelete}
              onImageDelete={onImageDelete}
            />
          )))()}
        <ImageViewer shown={shown} imageUrls={images} onClose={this.hideLightbox} index={index} />
      </View>
    );
  }
}

Gallery.propTypes = {
  images: PropTypes.array,
  imagesPerRow: PropTypes.number
};

Gallery.defaultProps = {
  images: [],
  imagesPerRow: 4,
  canDelete: false,
  onImageDelete: () => {}
};
