import React, { Component } from 'react';
import JPushModule from 'jpush-react-native';

import {
  View,
  Platform,
  Dimensions,
  Image,
  BackHandler,
  Alert,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from 'react-native-simple-store';

import gStyles from '../constants/Styles';
import gConfig from '../constants/Config';
import MainContainer from '../containers/MainContainer';
import ApprovalContainer from '../containers/ApprovalContainer';
import WorkContainer from '../containers/WorkContainer';
import TabIcon from '../components/TabIcon';
import { registerGlobal, unregisterGlobal } from '../utils/Helper';
import * as networkActions from '../actions/networkActions';
import * as userActions from '../actions/userActions';
import * as messageActions from '../actions/messageActions';

const { PNManager } = NativeModules;

// 报销界面顶部Tab配置
const MainTabContainer = TabNavigator(
  {
    todo: { screen: MainContainer },
    doing: { screen: MainContainer },
    passed: { screen: MainContainer },
    rejected: { screen: MainContainer }
  },
  {
    ...TabNavigator.Presets.AndroidTopTabs,
    swipeEnabled: Platform.OS === 'android' ? false : true,
    animationEnabled: false,
    lazy: true,
    initialRouteName: 'todo',
    tabBarPosition: 'top',
    tabBarOptions: {
      scrollEnabled: false,
      activeTintColor: gStyles.color.mColor,
      inactiveTintColor: gStyles.color.mTextColor,
      showIcon: false,
      style: {
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#fff'
      },
      indicatorStyle: {
        borderBottomColor: gStyles.color.mColor,
        borderBottomWidth: 2
      },
      tabStyle: {
        padding: 0
      },
      labelStyle: {
        fontSize: 16
      }
    }
  }
);

const normal = require('../img/tab_approval.png');
const selected = require('../img/tab_approval_selected.png');
// 主界面底部Tab配置
const RootTabContainer = TabNavigator(
  {
    Main: { screen: MainTabContainer, navigationOptions: { title: '报销' } },
    Approval: {
      screen: ApprovalContainer,
      navigationOptions: {
        title: '审批',
        tabBarIcon: ({ focused }) => (
          <View style={{ justifyContent: 'center' }}>
            <TabIcon source={focused ? selected : normal} size={24} />
          </View>
        )
      }
    },
    Work: { screen: WorkContainer }
  },
  {
    initialRouteName: 'Approval',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: gStyles.color.mColor,
      inactiveTintColor: gStyles.color.mTextColor,
      showIcon: true,
      style: {
        backgroundColor: '#fff',
        borderTopColor: gStyles.color.mBorderColor
      },
      indicatorStyle: {
        opacity: 0
      },
      tabStyle: {
        padding: 0
      },
      labelStyle: {
        fontSize: 16
      }
    }
  }
);

class HomeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialRouteName: 'Main',
    };
  }

  componentWillMount() {
    const { login, actions } = this.props;

    // 处理网络状态变更
    registerGlobal({ onNetworkChange: this.onNetworkChange });

    // 绑定消息推送用户
    if (Platform.OS == 'android') {
      // android
      PNManager.setUserLogin(login.auth.userID);
    } else {
      // ios
//       login.auth.userID !== '' ? (JPushModule.setAlias(login.auth.userID,this.success,this.fail)):null;
//       success=()=>{
//     NativeAppEventEmitter.addListener( 'ReceiveNotification', (message) => {JPushModule.setBadge(0,function(){
//     // console.log(message)
//
//     })} );
JPushModule.setAlias(login.auth.userID, () => {
      console.log("Set alias succeed");
    }, () => {
      console.log("Set alias failed");
    });
    
      store.get(gConfig.keyIosDeviceToken).then(deviceToken => {
        if (deviceToken) {
          actions.setUserLogin(
            login.auth.token,
            login.auth.userID,
            deviceToken
          );
        }
      });
    }


    /*
    BackHandler.addEventListener('hardwareBackPress', () => {
      console.log(this.props.navigation.state.routeName);
      Alert.alert('提示', '您是否确认退出？', [
        { text: '确认', onPress: () => BackHandler.exitApp() },
        { text: '取消', style: 'cancel' }
      ]);

      return true;
    });
    */
  }

  componentWillUnmount() {
    unregisterGlobal({ onNetworkChange: this.onNetworkChange });
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, user } = this.props;
    if (user && !user.headimgID && nextProps.user && nextProps.user.headimgID) {
      navigation.setParams({
        headimgID: nextProps.user.headimgID
      });
    }
  }
  componentDidMount() {}

  componentDidUpdate() {
    if (!this.inited) {
      /*
      setTimeout(() => {
        this.props.navigation.navigate('Approval');
      }, 2000);
      */
      this.inited = true;
    }
  }

  onNetworkChange = connectionInfo => {
    this.props.actions.setNetworkInfo(connectionInfo);
  };



  render() {
    return <RootTabContainer navigation={this.props.navigation} />;
  }
}
HomeContainer.router = RootTabContainer.router;

const mapStateToProps = state => {
  const { loading, login, user } = state;
  return {
    loading,
    login,
    user
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators(
    { ...networkActions, ...userActions, ...messageActions },
    dispatch
  );
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
