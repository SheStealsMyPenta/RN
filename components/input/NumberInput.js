import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import _ from 'lodash';

import { InputItem } from 'antd-mobile';
import { isDefine } from '../../utils/Helper';

class NumberInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultValue != nextProps.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
    }
  }

  onChangeText = text => {
    let newText = '';
    let numbers = '0123456789.';

    let hasDot = false;
    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) == -1) continue;
      // 只允许一个小数点
      if (text[i] == '.') {
        if (hasDot) continue;
        hasDot = true;
      }

      newText = newText + text[i];
    }

    if (newText.length == 1 && newText[newText.length - 1] == '.') {
      this.setState({ value: '' });
    } else {
      this.setState({ value: newText });
    }
  };

  render() {
    return (
      <InputItem
        {...this.props}
        value={this.state.value}
        onChangeText={this.onChangeText}
        onEndEditing={e => {
          this.setState({ value: isDefine(this.state.value) ? String(parseFloat(this.state.value)) : '' });
          if (this.props.onEndEditing) this.props.onEndEditing(e);
        }}
        type={Platform.OS==='ios'?"number-pad":"numeric"}
        selectTextOnFocus={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default NumberInput;
