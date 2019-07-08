import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  Platform
} from "react-native";
import store from "react-native-simple-store";
import { InputItem } from "antd-mobile";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Button from "../components/Button";
import ImageButton from "../components/ImageButton";
import PageWrapper from "../components/PageWrapper";
import PageContent from "../components/PageContent";
import PageFooter from "../components/PageFooter";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import gStyles from "../constants/Styles";
import ReturnButton from "../components/ReturnButton";
import gConfig from "../constants/Config";
import * as vpnActions from "../actions/vpnActions";
import * as serverActions from "../actions/serverActions";
import * as fetchActions from "../actions/fetchActions";
import { showToast } from "../utils/Helper";
import {
  VPN_STATUS_UNSTART,
  VPN_STATUS_OK,
  VPN_STATUS_ONLINE,
  VPN_STATUS_LOGINING
} from "../constants/Constants";

const { VPNManager } = NativeModules;
const vpnManagerEvents = new NativeEventEmitter(VPNManager);

const userImg = require("../img/user.png");
const pwdImg = require("../img/password.png");
const vpnImg = require("../img/input_vpn.png");
const retImg = require("../img/arrow_left.png");

class VpnLogin extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "VPN登录验证",
    headerRight: <View />,
    headerLeft: <ReturnButton navigation={navigation} />
  });

  constructor(props) {
    super(props);
    this.state = {
      vpnLogoutSuccess: vpnManagerEvents.addListener(
        VPNManager.vpnLogoutSuccess,
        this.vpnLogoutSuccess
      ),
      vpnLogoutFailed: vpnManagerEvents.addListener(
        VPNManager.vpnLogoutFailed,
        this.vpnLogoutFailed
      ),

      address: "",
      user: "",
      pwd: "",
      errors: {},
      showStatus: false
    };
  }

  _validateInput = () => {
    let errors = {};
    if (this.state.user === "") {
      errors.user = true;
    }
    if (this.state.pwd === "") {
      errors.pwd = true;
    }
    if (!this._isValidUrl(this.state.address)) {
      errors.address = true;
    }
    return errors;
  };

  _isValidUrl = value => {
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/i;
    return reg.test(value);
  };

  _showErrorMsg = errors => {
    if (errors.address) {
      showToast("请输入VPN服务器地址");
    } else if (errors.user) {
      showToast("请输入用户名");
    } else if (errors.pwd) {
      showToast("请输入密码");
    }
  };

  onVpnChange = value => {
    this.setState({
      address: value
    });
  };

  onUserChange = value => {
    let filteredUserName = value.trim();
    this.setState({
      user: filteredUserName
    });
  };

  onPwdChange = value => {
    this.setState({
      pwd: value
    });
  };

  onLogin = () => {
    //VPNManager.login('124.127.106.198', 443, 'zhouyuzhou', '111111');
    let errors = this._validateInput();
    if (Object.keys(errors).length !== 0) {
      this.setState({
        errors: errors
      });
      this._showErrorMsg(errors);
    } else {
      VPNManager.getStatus(status => {
        if (status === VPN_STATUS_OK || status === VPN_STATUS_LOGINING) {
          showToast("VPN运行中，请先注销当前账号");
          return;
        }
        global.log(status);

        global.log("vpnLogin页面路径", this.props.navigation.state);
        store
          .get("isInit")
          .then(isInit => {
            if (isInit.isFirst==true) {
              // this.props.actions.validateServer(gConfig.pathServerValidation);
              store
                .save("vpn", {
                  address: this.state.address,
                  user: this.state.user,
                  pwd: this.state.pwd
                }).then(()=>{
                      this.props.navigation.navigate('ServerSetup');
                })
          
            }else {
              this.props.actions.fetchStart();
              this.props.actions.vpnLogin(
              this.state.address,
              this.state.user,
              this.state.pwd
            );
            }
          })

      });

      this.setState({
        errors: errors
      });
    }
  };

  vpnLoginSuccess = () => {
    global.log("vpnLogin页当前路径", this.props.navigation.state);
    const { routeName } = this.props.navigation.state;
    global.log("vpnLogin页vpnLoginSuccess");
    try {
      store
        .save("vpn", {
          address: this.state.address,
          user: this.state.user,
          pwd: this.state.pwd
        })
        .then(() => {
          this.props.actions.fetchEnd();
          this.props.actions.vpnLoginSuccess();
          showToast.showShort("VPN连接成功", false);
          //vpn连接成功，验证服务器
          store
            .get("isInit")
            .then(isInit => {
              if (isInit.first==true) {
                store.save("vpn", {
                    address: this.state.address,
                    user: this.state.user,
                    pwd: this.state.pwd
                  }).then(()=> {
                    this.props.navigation.navigate('ServerSetup');
                  });
                // this.props.actions.validateServer(gConfig.pathServerValidation);
              }else {
                this.props.actions.validateServer(gConfig.pathServerValidation);
              }
            })
            .then(() => {
              this.props.navigation.goBack();
            });
        });
    } catch (error) {
      showToast.showShort(error, false);
    }
  };

  vpnLoginFailed = () => {
    this.props.actions.fetchEnd();
    showToast.showShort("VPN登录验证失败");
  };

  //注销逻辑
  //1.退出成功：fetchEnd取消动画效果->vpnLogoutSuccess动作修改redux
  onLogout = () => {
    //VPNManager.getStatus(status => {
    //global.log('VPN状态',status);
    //if (status === VPN_STATUS_OK || status === VPN_STATUS_ONLINE) {
    this.props.actions.fetchStart();
    this.props.actions.vpnLogout();
    //} else {
    //  ToastUtil.showShort('请登录VPN');
    //}
    //})
  };

  vpnLogoutSuccess = () => {
    global.log("注销成功");
    this.props.actions.fetchEnd();
    this.props.actions.vpnLogoutSuccess();
    //store.delete("vpn");
    showToast("VPN注销成功");
  };
  vpnLogoutFailed = () => {
    global.log("注销失败");
    this.props.actions.fetchEnd();
    showToast("VPN注销失败");
  };

  componentWillMount() {
    VPNManager.getStatus(status => {
      if (status === VPN_STATUS_UNSTART) {
        VPNManager.initVPNModule();
      }
    });

    //global.log(vpnManagerEvents);

    global.log("VpnLogin: enter");
    store.get("vpn").then(vpn => {
      if (vpn) {
        this.setState({
          address: vpn.address,
          user: vpn.user,
          pwd: vpn.pwd
        });
      }
    });
  }

  componentDidMount() {
    /* VPNManager.getStatus(status => {
      global.log('current vpn status:', status);
    }); */
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.vpn.isConnected) {
      try {
        store
          .save("vpn", {
            address: this.state.address,
            user: this.state.user,
            pwd: this.state.pwd
          })
          .then(() => {
            this.props.navigation.goBack();
          });
      } catch (error) {
        showToast.showShort(error, false);
      }
    }
  }

  componentWillUnmount() {
    global.log("离开vpnLogin页面");
    this.state.vpnLogoutSuccess.remove();
    this.state.vpnLogoutFailed.remove();
  }

  render() {
    return (
      <PageWrapper>
        <KeyboardAvoidingView style={{ flex: 1, paddingBottom: 50 }} >
          <PageContent styel={styles.content}>
            <View>
              <View style={{ marginTop: 129 }} />
              <InputItem
                placeholder="192.168.1.1"
                style={styles.inputItem}
                autoCapitalize="none"
                selectionColor={gStyles.color.mColor}
                labelNumber={2.5}
                value={this.state.address}
                onChange={this.onVpnChange}
                error={this.state.errors.address}
              >
                <Image source={vpnImg} style={styles.inputIcon} />
              </InputItem>
              <InputItem
                autoCapitalize="none"
                selectionColor={gStyles.color.mColor}
                placeholder="用户名"
                labelNumber={2.5}
                style={styles.inputItem}
                value={this.state.user}
                onChange={this.onUserChange}
                error={this.state.errors.user}
              >
                <Image source={userImg} style={styles.inputIcon} />
              </InputItem>
              <InputItem
                selectionColor={gStyles.color.mColor}
                type="password"
                placeholder="密码"
                labelNumber={2.5}
                style={styles.inputItem}
                value={this.state.pwd}
                onChange={this.onPwdChange}
                error={this.state.errors.pwd}
              >
                <Image source={pwdImg} style={styles.inputIcon} />
              </InputItem>
            </View>

            <Button
              style={styles.buttonText}
              containerStyle={styles.button}
              text="确定"
              onPress={this.onLogin}
            />
            <Button
              style={styles.buttonText}
              containerStyle={styles.logoutButton}
              text="注销"
              onPress={this.onLogout}
            />
          </PageContent>
        </KeyboardAvoidingView>
      </PageWrapper>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "column",
    justifyContent: "center"
  },
  inputItem: {
    marginLeft: 0,
    marginBottom: 21,
    height: 44,
    width: "80%",
    borderColor: "#cccccc",
    borderStyle: "solid",
    borderWidth: 0.5,
    alignSelf: "center",
    borderRadius: 2.5
  },
  inputIcon: {
    alignSelf: "flex-start",
    resizeMode: "contain",
    width: 20,
    height: 20,
    marginLeft: 8
  },
  buttonContainer: {
    borderRadius: 10,
    alignSelf: "center",
    height: 44,
    width: "80%",
    backgroundColor: gStyles.color.mColor,
    marginTop: 21
  },
  button: {
    borderRadius: 10,
    alignSelf: "center",
    height: 44,
    width: "80%",
    backgroundColor: gStyles.color.mColor,
    marginTop: 21
  },
  logoutButton: {
    borderRadius: 10,
    alignSelf: "center",
    height: 44,
    width: "80%",
    backgroundColor: gStyles.color.mBorderColor,
    marginTop: 21
  },
  buttonText: {
    fontSize: 17,
    textAlign: "center",
    color: "white",
    alignSelf: "center",
    padding: 13
  },
  footer: {
    justifyContent: "space-around",
    alignItems: "flex-end",
    borderTopWidth: 0
  },
  textBottom: {
    color: gStyles.color.mTextColor,
    fontSize: 14,
    marginBottom: 16
  }
});

const mapStateToProps = state => {
  const { vpn } = state;
  return {
    vpn
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators(
    {
      ...vpnActions,
      ...serverActions,
      ...fetchActions
    },
    dispatch
  );
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VpnLogin);
