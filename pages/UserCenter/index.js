import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Platform, Alert, NativeModules, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from 'react-native-simple-store';

import gConfig from '../../constants/Config';
import NavigationUtil from '../../utils/NavigationUtil';
import RemoteImage from '../../components/RemoteImage';

import Text from '../../components/Text';
import gStyles from '../../constants/Styles';
import * as loginActions from '../../actions/loginActions';
import { getRemoteImagePath } from '../../utils/Helper';
import * as messageActions from '../../actions/messageActions';

const { PNManager } = NativeModules;

class UserCenter extends Component {
  static navigationOptions = ({ navigation }) => ({
    
  });

  constructor(props) {
    super(props);
  }

  onChangePassword = () => {
    const { navigation } = this.props;

    navigation.navigate('Password');
  };

  onClearCache = () => {
    Alert.alert('提示', '客户端缓存清理完毕', [{ text: '确定' }]);
  };

  onUpgrade = () => {
    Alert.alert('版本更新', '您已是最新版本，无需更新', [{ text: '确定' }]);
  };

  onShowVersion = () => {
    const { navigation } = this.props;

    Alert.alert('版本信息', '当前程序版本:v' + DeviceInfo.getVersion(), [{ text: '确定' }]);
  };

  onLogout = () => {
    Alert.alert('', '是否退出登录', [
      {
        text: '取消',
        style: 'cancel'
      },
      {
        text: '确定',
        onPress: () => {
          this.props.actions.resetLoginStatus();
        }
      }
    ]);
    //loginActions.resetLoginStatus();
  };

  

  componentWillReceiveProps(nextProps) {
    const { login, actions, navigation } = this.props;
    if (login.isSuccess && !nextProps.login.isSuccess) {
      //NavigationUtil.reset(navigation, 'Login');
      store
        .update('login', {
          autoLogin: false
        })
        .then(() => {
          //navigation.navigate('Login');

          // 退出登陆不接受消息推送
          if (Platform.OS == 'android') {
            PNManager.setUserLogout(login.auth.userID);
          } else {
            store.get(gConfig.keyIosDeviceToken).then(deviceToken => {
              if (deviceToken) {
                actions.setUserLogout(login.auth.token, login.auth.userID, deviceToken);
              }
            });
          }

          NavigationUtil.reset(navigation, 'Login');
        });
    }
  }
  render() {
    const { user } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          { user.headimgID ?
            <RemoteImage uri={getRemoteImagePath(user.headimgID)} style={styles.headerImage} />:
            <Image style={styles.headerImage} source={require('../../img/user_center2.png')} />}         
          <View style={styles.headerRight}>
            <Text style={styles.name}>{user.title}</Text>
            <Text style={styles.department}>{user.defaultorgTitle}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.listItem} onPress={this.onChangePassword}>
          <Image style={styles.listImage} source={require('../../img/key.png')} />
          <Text style={styles.listTitle}>修改密码</Text>
          <Image style={styles.listArrow} source={require('../../img/arrow_right.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={this.onClearCache}>
          <Image style={styles.listImage} source={require('../../img/cache.png')} />
          <Text style={styles.listTitle}>清理缓存</Text>
          <Image style={styles.listArrow} source={require('../../img/arrow_right.png')} />
        </TouchableOpacity>
        {Platform.OS === 'android' && (
          <TouchableOpacity style={styles.listItem} onPress={this.onUpgrade}>
            <Image style={styles.listImage} source={require('../../img/upgrade.png')} />
            <Text style={styles.listTitle}>检查更新</Text>
            <Image style={styles.listArrow} source={require('../../img/arrow_right.png')} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.listItem} onPress={this.onShowVersion}>
          <Image style={styles.listImage} source={require('../../img/information.png')} />
          <Text style={styles.listTitle}>版本信息</Text>
          <Image style={styles.listArrow} source={require('../../img/arrow_right.png')} />
        </TouchableOpacity>
        <View style={styles.logout}>
          <TouchableOpacity style={styles.logoutWrapper} onPress={this.onLogout}>
            <Image style={styles.logoutImage} source={require('../../img/exit.png')} />
            <Text style={styles.logoutTitle}>退出登陆</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: Platform.OS === 'ios' ? 35 : 15,
    paddingBottom: 15,
    backgroundColor: gStyles.color.mColor
  },
  headerImage: {
    width: 65,
    height: 65,
    marginRight: 15,
    borderRadius: 32,
  },
  headerRight: {
    flex: 1
  },
  name: {
    fontSize: 18,
    color: gStyles.color.sColor,
    marginBottom: 10
  },
  department: {
    fontSize: 15,
    color: gStyles.color.sColor
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderBottomColor: gStyles.color.mBorderColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  listImage: {
    width: 23,
    height: 23,
    marginRight: 20
  },
  listArrow: {
    width: 8,
    height: 15,
    marginLeft: 10
  },
  listTitle: {
    flex: 1,
    fontSize: 17,
    color: gStyles.color.mTextColor
  },
  logout: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  logoutWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28
  },
  logoutImage: {
    width: 23,
    height: 23,
    marginRight: 20
  },
  logoutTitle: {
    fontSize: 17,
    color: gStyles.color.mColor
  }
});

const mapStateToProps = state => {
  const { login, user } = state;
  return {
    login,
    user
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators(
    {
      ...loginActions,
      ...messageActions
    },
    dispatch
  );
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCenter);
