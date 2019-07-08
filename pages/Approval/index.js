import React from 'react';
import PropTypes from 'prop-types';
import {
  DeviceEventEmitter,
  InteractionManager,
  FlatList,
  ListView,
  StyleSheet,
  View,
  Text,
  Platform,
  ActivityIndicator
} from 'react-native';
import { TabNavigator } from 'react-navigation';

import PageWrapper from '../../components/PageWrapper';
import ToastUtil from '../../utils/ToastUtil';
import ListItem from './ListItem';
import Tabview from './Tabview';


import gStyles from '../../constants/Styles';

const tabConfig = {
  ...TabNavigator.Presets.AndroidTopTabs,
  swipeEnabled: Platform.OS === 'android' ? false : true,
  animationEnabled: false,
  lazy: true,
  tabBarPosition: 'top',
  tabBarOptions: {
    scrollEnabled: true,
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
      width: 125,
      padding: 0
    },
    labelStyle: {
      fontSize: 16
    }
  }
};


class Approval extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.currentId = -1;
    this.Tabs = null;
  }

  componentWillMount() {
    const { navigation, login, actions } = this.props;
    actions.fetchApprovalTabs(login.auth.token);

    navigation.setParams({
      search: this.search
    });

    if(login.auth.userType<1){
      navigation.navigate('Main');
    }
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  search = () => {
    //console.log('search' + this.currentId);
    const { login, navigation, actions, approval } = this.props;
    //let listObj = reimb[`${navigation.state.routeName}List`];

    console.log(approval, this.currentId);
    navigation.navigate('Search', {
      type: 'approval',
      category: this.currentId,
      defineID: this.currentId,
      template: approval.list[this.currentId].template
    });
  };

  getTabsData = (tabs = []) => {
    return tabs.map(item => ({
      id: item.id,
      title: item.title,
      count: item.count,
      showCount: item.isneedshowcount,
      updateTime: item.updatetime
    }));
  };

  getTabsScreens = (data = []) => {
    let s = data.map(item => {
      return {
        [item.id]: {
          screen: Tabview,
          navigationOptions: {
            title: item.title
          }
        }
      };
    });
    console.log('getTabsScreens', ...s);

    return Object.assign(...s);
  };

  render() {
    const { navigation, approval } = this.props;

    let tabsData = this.getTabsData(approval.tabs);

    if (!tabsData || tabsData.length == 0) {
      return <View />;
    }

    if (this.Tabs == null) {
      this.Tabs = TabNavigator(this.getTabsScreens(tabsData), tabConfig);
      this.currentId = tabsData[0].id;
    }

    let Tabs = this.Tabs;
    return (
      <Tabs
        screenProps={{ ...this.props, tabsData }}
        onNavigationStateChange={(prevState, currentState) => {
          this.currentId = currentState.routes[currentState.index].routeName;
          console.log('onNavigationStateChange****', prevState, currentState, currentState.index);
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  }
});

export default Approval;
