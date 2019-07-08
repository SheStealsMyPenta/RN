import React, { Component } from 'react';
import { View, Platform, Dimensions } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import gStyles from '../constants/Styles';

import Overlay from '../components/Overlay';
import LoadingView from '../components/LoadingView';
import App from './App';
import UserCenter from '../pages/UserCenter';

class Arena extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.loading > 0
    });
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <App navigation={this.props.navigation} />
        {this.state.visible ? (
          <LoadingView
            visible={this.state.visible}
            indicatorColor={gStyles.color.mColor}
            indicatorSize="large"
            wrapperStyle={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0
              /*backgroundColor: 'rgba(255, 255, 255, .1)'*/
            }}
            textStyle={{
              color: gStyles.color.mColor,
              fontSize: 15
            }}
          />
        ) : (
          <View />
        )}
      </View>
    );
  }
}
Arena.router = App.router;

const mapStateToProps = state => {
  const { loading } = state;
  return {
    loading
  };
};

const AppWrapper = DrawerNavigator(
  {
    Arena: {
      screen: connect(mapStateToProps)(Arena)
    }
  },
  {
    contentComponent: UserCenter,
    contentOptions: {},
    useNativeAnimations: false
  }
);

export default AppWrapper;
