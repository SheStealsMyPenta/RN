import React, { Component } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import SignatureCapture from './SignatureCapture';

import Text from '../components/Text';
import Button from '../components/Button';
import gStyles from '../constants/Styles';

class Signature extends Component {
  constructor(props) {
    super(props);
  }

  reset = () => {
    this.SC.resetImage();
  };
  save = () => {
    this.SC.saveImage();
  };
  cancel = () => {
    this.props.requestCloseModal();
  };

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.requestCloseModal();
        }}
      >
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.emptyArea}
            activeOpacity={1}
            onPress={() => {
              this.props.requestCloseModal();
            }}
          />
          <View style={styles.container}>
            <SignatureCapture
              style={styles.signature}
              ref={ref => (this.SC = ref)}
              viewMode={'portrait'}
              saveImageFileInExtStorage={true}
              showBorder={false}
              showTitleLabel={false}
              showNativeButtons={false}
              onSaveEvent={this.props.onSaveEvent}
            />
            <View style={styles.buttons}>
              <Button
                containerStyle={styles.buttonContainer}
                style={styles.button}
                text="重置"
                onPress={() => {
                  this.reset();
                }}
              />
              <Button
                containerStyle={styles.buttonContainer}
                style={styles.button}
                text="确认"
                onPress={() => {
                  this.save();
                }}
              />
              <Button
                containerStyle={styles.buttonContainer}
                style={styles.button}
                text="取消"
                onPress={() => {
                  this.cancel();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

Signature.defaultProps = {
  visible: false,
  requestCloseModal: () => {},
  onSaveEvent: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 2
  },
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.2)'
  },
  emptyArea: {
    flex: 1
  },
  signature: {
    flex: 2
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: gStyles.color.mBorderColor
  },
  buttonContainer: {
    width: 80,
    height: 35
  },
  button: {
    fontSize: 18
  }
});

export default Signature;
