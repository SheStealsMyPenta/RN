import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStylePropTypes,
  TextStylePropsTypes,
  ImageStylePropTypes
} from 'react-native';
import PropTypes from 'prop-types';

import gStyles from '../../constants/Styles';
import ImageButton from '../../components/ImageButton';

const checkedImg = require('../../img/checked.png');
const normalImg = require('../../img/checkbox.png');
const arrow_right = require('../../img/arrow_right_grey.png');

class RadioItem extends React.Component {
  constructor(props) {
    super(props);
  }

  /*static propTypes={
    item: PropTypes.object,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    containerStyle: ViewStylePropTypes,
    imgStyle: ImageStylePropTypes,
    textStyle: TextStylePropTypes
  }*/

  static defaultProps = {
    item: {},
    onChange: {},
    checked: false,
    containerStyle: {
      flexDirection: 'row',
      height: 55,
      backgroundColor: 'white'
    },
    imgStyle: {
      marginLeft: 14,
      marginRight: 19,
      alignSelf: 'center',
      height: 22,
      width: 22
    },
    textContainer: {
      width: '70%',
      justifyContent: 'center'
    },
    textStyle: {
      fontSize: 14,
      color: gStyles.color.mTextColor,
      textAlign: 'left'
    },
    imageButtonContainer: {
      width: 40,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    imageButtonImg: {
      width: 10,
      height: 15,
      alignSelf: 'center'
    }
  };

  _onSelect = () => {
    //console.log('item props',this.props);
    const { item, checked } = this.props;
    this.props.onChange({ item, checked });
    //console.log('===',{key:value,title:title});
  };
  _requestChildren = () => {
    const { item, checked } = this.props;
    //console.log('@@@@====',this.props);
    this.props.requestChildren(item);
  };

  renderChildrenNode() {
    return (
      <TouchableOpacity
        style={this.props.containerStyle}
        onPress={this._onSelect}
      >
        <Image
          style={this.props.imgStyle}
          source={this.props.checked ? checkedImg : normalImg}
        />
        <View style={this.props.textContainer}>
          <Text style={this.props.textStyle}>
            {this.props.item.base_data_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderFatherNode() {
    return (
      <View style={this.props.containerStyle}>
        <Image
          style={this.props.imgStyle}
          source={this.props.checked ? checkedImg : normalImg}
        />
        <View style={this.props.textContainer}>
          <Text style={this.props.textStyle}>
            {this.props.item.base_data_name}
          </Text>
        </View>
        <ImageButton
          containerStyle={this.props.imageButtonContainer}
          style={this.props.imageButtonImg}
          source={arrow_right}
          onPress={this._requestChildren}
        />
      </View>
    );
  }

  render() {
    //console.log('radioItem check状态',this.props.checked);
    return (
      <View>
        {this.props.hasChildren
          ? this.renderFatherNode()
          : this.renderChildrenNode()}
      </View>
    );
  }
}

export default RadioItem;
