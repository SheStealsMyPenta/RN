import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet } from 'react-native';

import ReturnButton from '../components/ReturnButton';
import ImageButton from '../components/ImageButton';
import Message from '../pages/Message';

import gStyles from '../constants/Styles';

import * as loadingActions from '../actions/loadingActions';
import * as messageActions from '../actions/messageActions';

class MessageContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <ReturnButton navigation={navigation} />,
    title: '消息中心',
    headerRight: <View />
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Message {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  const { message } = state;
  return {
    message
  };
}

function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({ ...loadingActions, ...messageActions }, dispatch);
  return {
    actions
  };
}

const styles = StyleSheet.create({});

export default connect(mapStateToProps, mapDispatchToProps)(MessageContainer);
