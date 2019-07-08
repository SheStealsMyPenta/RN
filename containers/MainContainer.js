import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  BackHandler,
  Alert,
  NativeModules,
  PushNotificationIOS
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TabNavigator } from 'react-navigation';

import gStyles from '../constants/Styles';
import TabIcon from '../components/TabIcon';
import ImageButton from '../components/ImageButton';
import Main from '../pages/Main';

import * as loadingActions from '../actions/loadingActions';
import * as userActions from '../actions/userActions';
import * as functionsActions from '../actions/functionsActions';
import * as reimbActions from '../actions/reimbActions';

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: gStyles.size.headerRightMargin
  },
  headerRightImageContainer: {
    padding: gStyles.size.headerIconPadding
  }
});

const normal = require('../img/tab_reimb.png');
const selected = require('../img/tab_reimb_selected.png');
class MainContainer extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    let title;
    switch (navigation.state.routeName) {
      case 'todo':
        title = '待提交';
        break;
      case 'doing':
        title = '审批中';
        break;
      case 'passed':
        title = '已通过';
        break;
      case 'rejected':
        title = '已驳回';
        break;
      default:
    }
    return {
      title,
      headerLeft: <View />,
      headerRight: (
        <View style={styles.headerRightContainer}>
          <ImageButton
            source={require('../img/bell.png')}
            onPress={() => {
              navigation.navigate('Message');
            }}
            containerStyle={styles.headerRightImageContainer}
          />
          <ImageButton
            source={require('../img/search.png')}
            onPress={() => {
              navigation.state.params.search &&
                navigation.state.params.search();
            }}
            containerStyle={styles.headerRightImageContainer}
          />
          <ImageButton
            source={require('../img/add.png')}
            onPress={() => {
              navigation.state.params &&
                navigation.state.params.openPopMenu &&
                navigation.state.params.openPopMenu();
            }}
            containerStyle={styles.headerRightImageContainer}
          />
        </View>
      ),
      tabBarIcon: ({ focused }) => (
        <TabIcon source={focused?selected:normal} size={23} />
      )
    };
  };

  componentWillMount() {
    const { login, actions, reimb: { tabs } } = this.props;

    if (!tabs || tabs.length == 0) {
      actions.fetchReimbTabs(login.auth.token);
      //actions.fetchUser(login.auth.user, login.auth.token);
      actions.fetchFunctions(login.auth.user, login.auth.token);
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

  componentWillReceiveProps(nextProps){
    
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { reimb: { tabs } } = this.props;
    if (tabs && tabs.length > 0) {
      return <Main {...this.props} />;
    } else {
      return <View />;
    }
  }
}

const mapStateToProps = state => {
  const { login, functions, reimb, user } = state;
  return {
    login,
    functions,
    reimb,
    user
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators(
    { ...loadingActions, ...reimbActions, ...userActions, ...functionsActions },
    dispatch
  );
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
