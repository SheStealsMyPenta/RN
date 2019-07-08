import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet } from 'react-native';

import ReturnButton from '../components/ReturnButton';
import ApprovalProcess from '../pages/ApprovalProcess';

import gStyles from '../constants/Styles';

import * as loadingActions from '../actions/loadingActions';
import * as reimbActions from '../actions/reimbActions';
import * as approvalActions from '../actions/approvalActions';

class ApprovalProcessContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <ReturnButton navigation={navigation} />,
    title: '审批流程',
    headerRight: <View />
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <ApprovalProcess {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  const { login, reimb, approval } = state;
  return {
    token: login.auth.token,
    reimb,
    approval
  };
}

function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({ ...loadingActions, ...reimbActions, ...approvalActions }, dispatch);
  return {
    actions
  };
}

const styles = StyleSheet.create({});

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalProcessContainer);
