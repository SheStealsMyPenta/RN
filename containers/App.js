import React, { Component } from 'react';
import { View, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import gStyles from '../constants/Styles';

import Overlay from '../components/Overlay';
import WebViewPage from '../components/WebViewPage';
import ImageButton from '../components/ImageButton';
import TabIcon from '../components/TabIcon';

import HomeContainer from '../containers/HomeContainer';
//import MainContainer from '../containers/MainContainer';
//import ApprovalContainer from '../containers/ApprovalContainer';
//import WorkContainer from '../containers/WorkContainer';
import ApprovalProcessContainer from '../containers/ApprovalProcessContainer';
import MessageContainer from '../containers/MessageContainer';
import MessageDetailContainer from '../containers/MessageDetailContainer';
import SearchContainer from '../containers/SearchContainer';
import SearchResultContainer from '../containers/SearchResultContainer';
import FormDetailContainer from '../containers/FormDetailContainer';
import FormEditorContainer from '../containers/FormEditorContainer';
import FormPreviewerContainer from '../containers/FormPreviewerContainer';
import StatisticsContainer from '../containers/StatisticsContainer';

import Splash from '../pages/Splash';
import Guide from '../pages/Guide';
import Login from '../pages/Login';
import VpnLogin from '../pages/VpnLogin';
import ServerSetup from '../pages/ServerSetup';
import StatisticsDetail from '../pages/StatisticsDetail';
import StatisticsSearch from '../pages/StatisticsSearch';
import UserCenter from '../pages/UserCenter';
import Password from '../pages/Password';

import RemoteImage from '../components/RemoteImage';
import { getRemoteImagePath } from '../utils/Helper';

//import Test from '../pages/Test';

/*
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

// 主界面底部Tab配置
const RootTabContainer = TabNavigator(
  {
    Main: { screen: MainTabContainer, navigationOptions: { title: '报销' } },
    Approval: {
      screen: ApprovalContainer,
      navigationOptions: {
        title: '审批',
        tabBarIcon: ({ tintColor }) => <TabIcon source={require('../img/tab_approval.png')} tintColor={tintColor} />
      }
    },
    Work: { screen: WorkContainer }
  },
  {
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
        fontSize: 13
      }
    }
  }
);
*/

const App = StackNavigator(
  {
    Splash: { screen: Splash },
    Guide: { screen: Guide },
    Web: { screen: WebViewPage },
    Login: { screen: Login },
    VpnLogin: { screen: VpnLogin },
    ServerSetup: { screen: ServerSetup },
    Home: {
      screen: HomeContainer, //RootTabContainer,
      navigationOptions: ({ navigation }) => {
        global.log('查看头像图片id', navigation);
        const imageID =
          navigation.state && navigation.state.params
            ? navigation.state.params.headimgID
            : '';
        let ret = <View />;
        if (imageID) {
          ret = {
            headerLeft: (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DrawerOpen');
                }}
                style={{ width: 42, height: 42, marginLeft: 12 }}
                activeOpacity={1}
              >
                <RemoteImage
                  uri={getRemoteImagePath(imageID)}
                  style={{ width: 42, height: 42, borderRadius: 21 }}
                />
              </TouchableOpacity>
            )
          };
        } else {
          ret = {
            headerLeft: (
              <ImageButton
                onPress={() => {
                  navigation.navigate('DrawerOpen');
                }}
                source={require('../img/user_center.png')}
                style={{ width: 42, height: 42 }}
                containerStyle={{ marginLeft: 12 }}
              />
            )
          };
        }
        return ret;
      }
    },
    ApprovalProcess: { screen: ApprovalProcessContainer },
    FormDetail: { screen: FormDetailContainer },
    FormEditor: { screen: FormEditorContainer },
    FormPreviewer: { screen: FormPreviewerContainer },
    Message: { screen: MessageContainer },
    MessageDetail: { screen: MessageDetailContainer },
    Search: { screen: SearchContainer },
    SearchResult: { screen: SearchResultContainer },
    Statistics: { screen: StatisticsContainer },
    StatisticsDetail: { screen: StatisticsDetail },
    StatisticsSearch: { screen: StatisticsSearch },
    Password: { screen: Password }
    //Test
    //Test: { screen: Test }
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        height: Platform.OS === 'ios' ? 70 : 50,
        backgroundColor: gStyles.color.mColor
      },
      headerTitleStyle: {
        textAlign: 'center',
        alignSelf: 'center',
        color: gStyles.color.sColor,
        fontSize: 18
      }
    }
  }
);

export default App;
