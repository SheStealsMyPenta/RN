import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  Platform,
  PushNotificationIOS,
  NativeModules,
  NativeEventEmitter
} from 'react-native';
import store from 'react-native-simple-store';
import { InputItem, Checkbox, List, WhiteSpace } from 'antd-mobile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';

import gStyles from '../constants/Styles';
import gConfig from '../constants/Config';
import Button from '../components/Button';
import ImageButton from '../components/ImageButton';
import NavigationUtil from '../utils/NavigationUtil';
import PageFooter from '../components/PageFooter';
import PageContent from '../components/PageContent';
import PageWrapper from '../components/PageWrapper';
import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import { JSEncrypt } from 'jsencrypt';
import { showError, registerGlobal, unregisterGlobal } from '../utils/Helper';
import * as serverActions from '../actions/serverActions';
import * as loginActions from '../actions/loginActions';
import * as vpnActions from '../actions/vpnActions';
import * as fetchActions from '../actions/fetchActions';
import * as userActions from '../actions/userActions';
import * as networkActions from '../actions/networkActions';
import { showToast } from '../utils/Helper';
import {
  VPN_STATUS_QUERY_NOT_INIT,
  VPN_STATUS_UNSTART,
  VPN_STATUS_OK,
  VPN_STATUS_ONLINE,
  VPN_STATUS_LOGINING
} from '../constants/Constants';

const logoImg = require('../img/logo.png');
const userImg = require('../img/user.png');
const pwdImg = require('../img/password.png');
const vpnImg = require('../img/vpn.png');
const noVpnImg = require('../img/no_vpn.png');
const serverImg = require('../img/server.png');
const noServerImg = require('../img/no_server.png');
const pwdDigitsDisplay = 10;

const { VPNManager, PNManager } = NativeModules;
const vpnManagerEvents = new NativeEventEmitter(VPNManager);

class Login extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pwd: '',
      encryptPwd: '',
      token: '',
      isSavePwd: false,
      isAutoLogin: false,
      errors: {},

      vpnLoginSuccess: vpnManagerEvents.addListener(
        VPNManager.vpnLoginSuccess,
        this.vpnLoginSuccess
      ),
      vpnLoginFailed: vpnManagerEvents.addListener(
        VPNManager.vpnLoginFailed,
        this.vpnLoginFailed
      ),
      vpnError: vpnManagerEvents.addListener(VPNManager.vpnError, errCode => {
        this.props.actions.fetchEnd();
        showToast(`VPN登录验证出错，错误码: ${errCode}`);
      })
    };
  }

  // android启动消息推送服务，iOS请求权限并获取device token
  startPush = () => {
    if (Platform.OS == 'android') {
      // android
      //PNManager.startPush('47.92.128.157', '5222', '', '__app_client__', '135790');
      PNManager.clearBadge(); // 清除桌面图标消息数量
      //PNManager.startPush('bx.chinacfi.net', '15289', '', '__app_client__', '135790');
      PNManager.startPush(
        'bx.chinacfi.net',
        '15289',
        '',
        '__app_client__',
        '135790'
      );
    } else {
      // ios
      PushNotificationIOS.addEventListener('register', deviceToken => {
        store.save(gConfig.keyIosDeviceToken, deviceToken);
      });
      PushNotificationIOS.requestPermissions();
    }
  };

  _validateServer = () => {
    this.props.actions.validateServer(gConfig.pathServerValidation);
    //console.log('Login: end of request ServerValidation');
  };
  _validateVpnServer = () => {
    //this.props.actions.validateVpnServer(gConfig.vpnServer);
  };
  onLoginBtnClick = () => {
    store.get('isInit').then(isInit => {
      if (isInit && isInit.server) {
        this._onLogin(this.props.server);
      } else {
        showToast('请配置服务器地址');
      }
    });
  };
  _onLogin = propsServer => {
    //global.log('登录函数',server);
    let errors = this._validateInput();
    //用户输入验证
    if (Object.keys(errors).length !== 0) {
      this.setState({
        errors: errors
      });
      showToast('请输入用户名和密码', false);
      //用户输入正确,准备登录
    } else {
      let publicKey = propsServer.message.publicKey;
      let encryptPwd;
      let placeholder = this.state.encryptPwd.substring(0, pwdDigitsDisplay);
      if (this.state.pwd !== placeholder) {
        encryptPwd = this._encryptPassword(publicKey, this.state.pwd);
      } else {
        let pwd = this._decryptPassword(
          gConfig.privatekey,
          this.state.encryptPwd
        );
        global.log('客户端解密后的密码', pwd, publicKey);
        encryptPwd = this._encryptPassword(publicKey, pwd);
        global.log('服务端加密后的密码', encryptPwd, publicKey);
      }
      this.props.actions.requestLogin(
        gConfig.pathLogin,
        this.state.user,
        encryptPwd
      );
    }
  };

  _validateInput = () => {
    let errors = {};
    if (this.state.user === '') {
      errors.user = true;
    }
    if (this.state.pwd === '') {
      errors.pwd = true;
    }
    return errors;
  };
  _encryptPassword = (publicKey, password) => {
    let encrypt = new JSEncrypt();
    if (publicKey) {
      encrypt.setPublicKey(publicKey);
      return encrypt.encrypt(password);
    } else {
      return '';
    }
  };
  _decryptPassword = (privatekey, encryptPwd) => {
    global.log('开始rsa解密');
    let decrypt = new JSEncrypt();
    if (privatekey) {
      decrypt.setPrivateKey(privatekey);
      let pwd = decrypt.decrypt(encryptPwd);
      global.log('完成rsa解密');
      return pwd;
    } else {
      return '';
    }
  };

  _loginSuccess = props => {
    const { navigation, login, actions } = props;
    actions.fetchUser(login.auth.user, login.auth.token);
    let placeholder = this.state.encryptPwd.substring(0, pwdDigitsDisplay);
    let encryptPwd;
    if (this.state.pwd !== placeholder) {
      encryptPwd = this._encryptPassword(gConfig.pubkey, this.state.pwd);
    } else {
      encryptPwd = this.state.encryptPwd;
    }

    //判断是否保存密码
    if (this.state.isSavePwd) {
      store.update('login', {
        pwd: encryptPwd,
        token: props.login.auth.token
      });
    } else {
      store.update('login', {
        pwd: ''
      });
    }
    //处理跳转
    NavigationUtil.reset(navigation, 'Home');
    //props.navigation.navigate('Home');
  };

  _loginFailure = () => {
    //弹出登录失败提示
  };

  onUserChange = value => {
    let filteredUserName = value.trim();
    this.setState({
      user: filteredUserName
    });
  };

  onSaveUser = value => {
    store.get('login').then(login => {
      //本地存储已存在，更新值
      if (login) {
        store.update('login', {
          user: this.state.user
        });
      } else {
        //本地存储不存在，新建节点
        store.save('login', {
          user: this.state.user
        });
      }
    });
  };

  onPwdChange = value => {
    //let filteredPwd = value.trim();
    this.setState({
      pwd: value
    });
  };

  /*onSavePwd = (value) =>{
    let publicKey = this.props.server.message.publicKey;
    let encryptPwd = '';
    if(this.state.pwd<1000){
      encryptPwd = this._encryptPassword(publicKey, this.state.pwd);
    }else{
      encryptPwd = this.state.pwd;
    }
    store.get('login').then((login)=>{
      if(login){
        store.update('login',{
          pwd:encryptPwd
        })
      }else{
        store.save('login',{
          pwd:encryptPwd
        })
      }
    })
  }*/

  onSavePwdCheckedChange = value => {
    let checked = value.target.checked;
    this.setState({
      isSavePwd: checked,
      isAutoLogin: checked ? this.state.isAutoLogin : false
    });
    store.get('login').then(login => {
      if (login) {
        //本地存储存在，保存勾选状态到本地
        store.update('login', {
          savePwd: checked
        });
        //本地存储不存在，新建节点
      } else {
        store.save('login', {
          savePwd: checked
        });
      }
    });
  };

  onAutoLoginCheckedChange = value => {
    let checked = value.target.checked;
    this.setState({
      isAutoLogin: checked,
      isSavePwd: checked ? true : this.state.isSavePwd
    });
    global.log('自动登录：', value);
    store.get('login').then(login => {
      if (login) {
        store.update('login', {
          autoLogin: checked
        });
      } else {
        store.save('login', {
          autoLogin: checked
        });
      }
    });
  };

  onNetworkChange = connectionInfo => {
    this.props.actions.setNetworkInfo(connectionInfo);
  };

  vpnLogin = vpn => {
    VPNManager.getStatus(status => {
      if (status === VPN_STATUS_OK || status === VPN_STATUS_LOGINING) {
        return;
      }
      global.log(status);
      this.props.actions.fetchStart();
      this.props.actions.vpnLogin(vpn.address, vpn.user, vpn.pwd);
    });
  };

  vpnLoginSuccess = () => {
    try {
      this.props.actions.fetchEnd();
      this.props.actions.vpnLoginSuccess();

      showToast('VPN连接成功');
      //vpn连接成功，验证服务器
      store.get('isInit').then(isInit => {
        if (isInit.server) {
          this._validateServer();
        }
      });
    } catch (error) {
      showToast(error);
    }
  };

  vpnLoginFailed = () => {
    this.props.actions.fetchEnd();
    showToast('VPN登录验证失败');
  };

  componentWillMount() {
    global.log('Login: enter page');
    registerGlobal({
      onNetworkChange: this.onNetworkChange
    });

    global.log('启动vpn模块');
    VPNManager.getStatus(status => {
      if (
        status === VPN_STATUS_UNSTART ||
        status === VPN_STATUS_QUERY_NOT_INIT
      ) {
        VPNManager.initVPNModule();
      }
    });

    // 启动消息推送服务
    global.log('login启动推送服务');
    this.startPush();

    //读取本地用户名、密码、checkbox状态
    store.get('login').then(login => {
      global.log('本地存储', login);
      if (login && login.user && login.pwd && login.token) {
        //let decryptPwd = this._decryptPassword(gConfig.privatekey,login.pwd);
        //global.log('加密和解密后的密码',login.pwd,decryptPwd);
        this.setState(
          {
            isSavePwd: login.savePwd ? login.savePwd : false,
            isAutoLogin: login.autoLogin ? login.autoLogin : false,
            user: login.user,
            pwd: login.pwd ? login.pwd.substring(0, pwdDigitsDisplay) : '',
            encryptPwd: login.pwd,
            token: login.token
          },
          () => global.log('login页加载state', this.state)
        );
      }
    });
  }

  componentWillUnmount() {
    global.log('离开login页面');
    unregisterGlobal({
      onNetworkChange: this.onNetworkChange
    });

    this.state.vpnLoginSuccess.remove();
    this.state.vpnLoginFailed.remove();
    this.state.vpnError.remove();
  }

  componentDidMount() {
    store.get('vpn').then(vpn => {
      global.log('准备vpn自动登录');
      if (vpn && vpn.address && vpn.user && vpn.pwd) {
        global.log('登录页开始vpnLogin');
        this.vpnLogin(vpn);
      } else {
        store.get('isInit').then(isInit => {
          if (isInit.server) {
            this._validateServer();
          }
        });
      }
    });
  }

  componentDidUpdate(prevProps, preState) {}

  componentWillReceiveProps(nextProps) {
    //处理自动登录
    global.log(
      '判断是否可以自动登录',
      this.state.isAutoLogin,
      this.props.server.isValid,
      nextProps.server.isValid
    );
    if (//首次登录时自动登录
      this.state.isAutoLogin &&
      (!this.props.server.isValid && nextProps.server.isValid)
    ) {
      global.log('准备自动登录');
      this._onLogin(nextProps.server);
    }
    //登录成功
    if (nextProps.login.isSuccess) {
      this._loginSuccess(nextProps);
    }
  }

  goToBasedata = () => {
    this.props.navigation.navigate('Test');
  };

  render() {
    return (
      <PageWrapper>
        <KeyboardAvoidingView style={{ flex: 1, paddingBottom: 50 }}>
          <PageContent>
            <View>
              <Image source={logoImg} style={styles.logo} />
              <InputItem
                autoCapitalize="none"
                selectionColor={gStyles.color.mColor}
                placeholder="用户名"
                labelNumber={2.5}
                style={styles.inputItem}
                value={this.state.user}
                onChange={this.onUserChange}
                onBlur={this.onSaveUser}
                error={this.state.errors.user}
                clear
              >
                <Image source={userImg} style={styles.inputIcon} />
              </InputItem>
              <View />
              <InputItem
                selectionColor={gStyles.color.mColor}
                type="password"
                placeholder="请输入密码"
                labelNumber={2.5}
                style={styles.inputItem}
                value={this.state.pwd}
                onChange={this.onPwdChange}
                onBlur={this.onSaveEncryptPwd}
                error={this.state.errors.pwd}
                clear
              >
                <Image source={pwdImg} style={styles.inputIcon} />
              </InputItem>
            </View>
            <View style={styles.checkBoxContainer}>
              <Checkbox
                defaultChecked={false}
                checked={this.state.isSavePwd}
                onChange={this.onSavePwdCheckedChange}
              >
                记住密码
              </Checkbox>
              <Checkbox
                defaultChecked={false}
                checked={this.state.isAutoLogin}
                onChange={this.onAutoLoginCheckedChange}
              >
                自动登录
              </Checkbox>
            </View>
            <Button
              style={styles.buttonText}
              containerStyle={styles.button}
              text="登录"
              onPress={this.onLoginBtnClick}
            />
          </PageContent>
        </KeyboardAvoidingView>
        <PageFooter style={styles.iconButtonContainer}>
          <ImageButton
            style={styles.icon}
            containerStyle={styles.iconButton}
            source={this.props.server.isValid ? serverImg : noServerImg}
            onPress={() => {
              this.props.navigation.navigate('ServerSetup');
            }}
          />
          <ImageButton
            style={styles.icon}
            containerStyle={styles.iconButton}
            source={this.props.vpn.isConnected ? vpnImg : noVpnImg}
            onPress={() => {
              this.props.navigation.navigate('VpnLogin');
            }}
          />
        </PageFooter>
      </PageWrapper>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    width: 115,
    height: 101,
    marginTop: Platform.OS === 'android' ? 100 : 80,
    marginBottom: 30
  },
  inputItem: {
    marginLeft: 0,
    marginTop: 21,
    height: 44,
    width: '80%',
    borderColor: '#cccccc',
    borderStyle: 'solid',
    borderWidth: 0.5,
    alignSelf: 'center',
    borderRadius: 2.5
  },
  inputIcon: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 20,
    height: 20
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 13,
    marginBottom: 26
    //alignSelf: 'center'
  },
  checkBox: {
    fontSize: 18
  },
  button: {
    borderRadius: 10,
    alignSelf: 'center',
    height: 44,
    width: '80%',
    backgroundColor: gStyles.color.mColor
  },
  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    //textAlignVertical: 'center',
    //alignItems: 'center',
    color: 'white',
    alignSelf: 'center',
    padding: 13
  },
  iconButtonContainer: {
    justifyContent: 'space-between',
    borderTopWidth: 0
  },
  icon: {
    width: 22,
    height: 22,
    marginHorizontal: 12,
    marginBottom: 15
  }
});

const mapStateToProps = state => {
  const { server, login, vpn } = state;
  return {
    server,
    login,
    vpn
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators(
    {
      ...serverActions,
      ...loginActions,
      ...vpnActions,
      ...networkActions,
      ...fetchActions,
      ...userActions
    },
    dispatch
  );
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
//export default Login;
