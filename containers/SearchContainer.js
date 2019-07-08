import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet } from 'react-native';

import ReturnButton from '../components/ReturnButton';
import ImageButton from '../components/ImageButton';
import Search from '../pages/Search';

import gStyles from '../constants/Styles';

import * as loadingActions from '../actions/loadingActions';
import * as searchActions from '../actions/searchActions';

class SearchContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <ReturnButton navigation={navigation} />,
    title: '搜索',
    headerRight: <View />
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Search {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  const { login, search } = state;
  return {
    login,
    search
  };
}

function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({ ...loadingActions, ...searchActions }, dispatch);
  return {
    actions
  };
}

const styles = StyleSheet.create({});

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
