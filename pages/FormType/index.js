import React from 'react';
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  Platform,
  StyleSheet
} from 'react-native';

import Text from '../../components/Text';
import RemoteImage from '../../components/RemoteImage';
import { getRemoteImagePath } from '../../utils/Helper';
import gStyles from '../../constants/Styles';

class FormType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      items: this.props.items
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(() => {
      return {
        visible: nextProps.visible,
        items: nextProps.items
      };
    });
  }

  render() {
    let items = this.state.items || [];

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          this.props.requestCloseModal();
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.props.requestCloseModal();
          }}
        >
          <View style={styles.wrapper}>
            <View style={styles.container}>
              {items.map(value => {
                return (
                  <TouchableOpacity
                    key={value.id}
                    onPress={() => {
                      this.props.onItemClick(value);
                      this.props.requestCloseModal();
                    }}
                    style={styles.itemWrapper}
                  >
                    <RemoteImage
                      uri={getRemoteImagePath(value.imageID)}
                      style={styles.icon}
                    />
                    <Text style={styles.item}>{value.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.2)'
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    top: Platform.OS === 'android' ? 45 : 65,
    right: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 11,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  itemWrapper: {
    width: '100%',
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  icon: {
    marginRight: 15,
    width: 25,
    height: 25,
    borderRadius: 5
  },
  item: {
    fontSize: 15,
    paddingVertical: 9,
    color: gStyles.color.mTextColor,
    textAlignVertical: 'center'
  }
});

FormType.defaultProps = {
  requestCloseModal: () => {},
  onItemClick: () => {}
};

export default FormType;
