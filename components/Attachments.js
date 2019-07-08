import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Text from '../components/Text';
import ImageButton from '../components/ImageButton';
import { getFileImage, getSizeDescribe } from '../utils/Helper';

import gStyles from '../constants/Styles';

class Attachments extends Component {
  constructor(props) {
    super(props);
  }

  renderFile = (file, index) => {
    const { onFileClick, canDelete, onAttachmentDelete } = this.props;
    return (
      <TouchableOpacity key={index} style={styles.container} onPress={() => onFileClick(file)}>
        <Image source={getFileImage(file.name)} style={styles.icon} />
        <View style={{ flex: 1 }}>
          {index == 0 && <View style={styles.dividerWithoutBorder} />}
          {index != 0 && <View style={styles.dividerWithBorder} />}
          <View style={styles.right}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="middle">
              {file.name}
            </Text>
            <Text style={styles.size}>{getSizeDescribe(file.size)}</Text>
          </View>
          <View style={styles.dividerWithoutBorder} />
        </View>
        {canDelete && (
          <ImageButton
            containerStyle={styles.deleteButtonContainer}
            style={styles.deleteButton}
            source={require('../img/delete3.png')}
            onPress={() => onAttachmentDelete(index)}
          />
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const { files } = this.props;
    return (
      <View>
        {files.map((file, index) => {
          return this.renderFile(file, index);
        })}
      </View>
    );
  }
}

Attachments.defaultProps = {
  files: [],
  onFileClick: file => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 30,
    height: 30,
    margin: 12
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10
  },
  dividerWithoutBorder: {
    flex: 1,
    borderColor: 'transparent',
    borderTopWidth: StyleSheet.hairlineWidth
  },
  dividerWithBorder: {
    flex: 1,
    borderColor: gStyles.color.mBorderColor,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  name: {
    fontSize: 14,
    color: gStyles.color.mTextColor,
    marginBottom: 5,
    paddingRight: 5
  },
  size: {
    fontSize: 12,
    color: gStyles.color.sTextColor
  },
  deleteButtonContainer: {
    paddingHorizontal: 10
  },
  deleteButton: {
    width: 19,
    height: 19
  }
});

export default Attachments;
