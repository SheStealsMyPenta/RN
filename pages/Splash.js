import React from 'react';
import { View, Dimensions, Animated, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from 'react-native-simple-store';
import SplashScreen from 'react-native-splash-screen';

import NavigationUtil from '../utils/NavigationUtil';
import { registerGlobal, unregisterGlobal } from '../utils/Helper';
import * as networkActions from '../actions/networkActions';
import gConfig from '../constants/Config';
import * as serverActions from '../actions/serverActions';
import * as loginActions from '../actions/loginActions';
import * as vpnActions from '../actions/vpnActions';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;
const splashImg = require('../img/splash.png');

class Splash extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(1)
    };
  }

  _validateServer = () => {
    this.props.actions.validateServer(gConfig.pathServerValidation);
    //console.log('Login: end of request ServerValidation');
  }
  _validateVpnServer = () =>{
    this.props.actions.validateVpnServer(gConfig.vpnServer);
  }

  componentDidMount() {
    const { navigate } = this.props.navigation;
    /*Animated.timing(this.state.bounceValue, {
      toValue: 1.2,
      duration: 1500
    }).start();*/
    //this.props.actions.fetchConfig();
    this.timer = setTimeout(() => {
      store.get('isInit').then(isInit => {
        if (!isInit) {
          navigate('Guide', { isFirst: true });
        } else {
          if (isInit.server) {
            global.server = isInit.server;
          }
          // if(isInit.pnserver){
          //   global.pnserver = isInit.pnserver;
          // }
          NavigationUtil.reset(this.props.navigation, 'Login');
        }
        /*if(isInit.server){
          global.server = isInit.server;
        }*/
        SplashScreen.hide();
      });
    }, 1500);
  }

  componentWillMount() {
    registerGlobal({ onNetworkChange: this.onNetworkChange });
    //this._validateServer();
    //this._validateVpnServer();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    unregisterGlobal({ onNetworkChange: this.onNetworkChange });
  }

  onNetworkChange = connectionInfo => {
    this.props.actions.setNetworkInfo(connectionInfo);
  };

  render() {
    return (
      <View />
      /*
      <Animated.Image
        style={{
          width: maxWidth,
          height: maxHeight,
          transform: [{ scale: this.state.bounceValue }]
        }}
        source={splashImg}
      />
      */
    );
  }
}

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators(
    {
      ...networkActions,
      ...serverActions,
      ...loginActions,
      ...vpnActions
    },
    dispatch
  );
  return {
    actions
  };
};

export default connect(null, mapDispatchToProps)(Splash);
