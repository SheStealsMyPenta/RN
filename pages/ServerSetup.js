import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
  PushNotificationIOS,
  NativeModules
} from 'react-native';
import store from 'react-native-simple-store';
import { InputItem } from 'antd-mobile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '../components/Button';
import ImageButton from '../components/ImageButton';
import PageWrapper from '../components/PageWrapper';
import PageContent from '../components/PageContent';
import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import PageFooter from '../components/PageFooter';
import gStyles from '../constants/Styles';
import { showToast, isImage } from '../utils/Helper';
import ReturnButton from '../components/ReturnButton';
import * as serverActions from '../actions/serverActions';
import gConfig from '../constants/Config';

//const retImg = require('../img/arrow_left.png');
const { PNManager } = NativeModules;

class ServerSetup extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '服务地址',
    headerRight: <View />,
    headerLeft: <ReturnButton navigation={navigation} />
  });

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      ipAddress: '',
      //pnAddress: '',
      errors: {}
    };
  }

  onErrorClick = () => {
    showToast('输入地址不正确，请重新输入');
  };

  _isValidIP = value => {
    let reg = /^((http:\/\/)|(https:\/\/))?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\:\d{1,})$/i;
    return reg.test(value);
  };

  _isValidDomain = value => {
    let reg = /^((http:\/\/)|(https:\/\/))?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+(\:\d{1,})$/;
    return reg.test(value);
  };

  onTextChange = value => {
    this.setState({
      address: `http://${value}`,
      ipAddress: value
    });
  };

/*   onPNChange = value => {
    this.setState({
      pnAddress: value
    });
  }; */

  _validateInput = () => {
    let errors = {},
      { ipAddress } = this.state;
    if (!this._isValidDomain(ipAddress) && !this._isValidIP(ipAddress)) {
      errors.ipAddress = true;
    }
    return errors;
  };

  onBtnClick = () => {
    //console.log(this.state.address);
    let errors = this._validateInput();
    if (Object.keys(errors).length !== 0) {
      this.setState({
        errors: errors
      });
      showToast('输入的地址不正确');
    } else {
      store
        .get("isInit")
        .then(isInit => {
          if (isInit.isFirst==true) {
            // this.props.actions.validateServer(gConfig.pathServerValidation);
            store
              .update('isInit', {
                server: this.state.address,
                //pnServer: pnServer
              })
              .then(() => {
                showToast('保存服务器地址成功');
                    this.props.navigation.navigate('Login');
              });

          } else {
            global.server = this.state.address; //应用服务器地址

            this.props.actions.validateServer(gConfig.pathServerValidation);

          }
        })
    }
  };

  getIPAddress = address => {
    return address.substring(7);
  };

  componentWillMount() {
    store.get('isInit').then(isInit => {
      if (isInit && isInit.server) {
        this.setState({
          address: isInit.server,
          ipAddress: this.getIPAddress(isInit.server),
          /* pnAddress: isInit.pnServer
            ? `${isInit.pnServer.ip}:${isInit.pnServer.port}`
            : '' */
        });
      }
    });
  }

  componentWillUnmount() {
    store.get('isInit').then(isInit => {
      global.server = isInit.server;
      /* if(isInit.pnServer){
        global.pnServer = isInit.pnServer;
      } */
    });
  }

  _validateServerSuccess = props => {
    //console.log('hahahahahaha',global.server,props);
    /* let pnServer = '';
    if (this.state.pnAddress) {
      let tmp = this.state.pnAddress.split(':');
      pnServer = {
        ip: tmp[0],
        port: tmp[1]
      };
    } */

    store
      .update('isInit', {
        server: this.state.address,
        //pnServer: pnServer
      })
      .then(() => {
        showToast('保存服务器地址成功');
      });
    props.navigation.goBack();
  };

  componentWillReceiveProps(nextProps) {
    //console.log('hahahaha',nextProps);
    //let {isValid} = nextProps.navigation.state.params;
    if (nextProps.server.isValid) {
      this._validateServerSuccess(nextProps);
    } else {
      showToast('保存服务器地址失败');
      store.get('isInit').then(isInit => {
        global.server = isInit.server;
        /* if(isInit.pnServer){
          global.pnServer = isInit.pnServer;
        }  */
      });
    }
  }

  render() {
    return (
      <PageWrapper>
        <KeyboardAvoidingView style={{ flex: 1, paddingBottom: 50 }}>
          <PageContent styel={styles.content}>
            <Text style={styles.titleText}>请输入服务器URL：</Text>
            <InputItem
              autoCapitalize="none"
              placeholder="192.168.1.1:2020"
              style={styles.inputItem}
              value={this.state.ipAddress}
              error={this.state.errors.ipAddress}
              onErrorClick={this.onErrorClick}
              onChange={this.onTextChange}
              onBlur={this.onBlur}
              autoFocus={true}
              labelNumber={4}
            >
            </InputItem>
            <View />
            {
              /* <InputItem
                autoCapitalize="none"
                placeholder="www.dofull.cn:15289"
                style={styles.inputItem}
                value={this.state.pnAddress}
                error={this.state.errors.pnAddress}
                onErrorClick={this.onErrorClick}
                onChange={this.onPNChange}
                onBlur={this.onBlur}
                labelNumber={4}
              >
                消息推送
              </InputItem> */
            }
            <Text style={styles.textSpec}>说明:</Text>
            <Text style={styles.textDetail}>服务器地址为: IP地址:端口号</Text>
            <Text style={styles.textDetail}>如:192.168.1.1为IP地址,</Text>
            <Text style={styles.textDetail}>{'     '}2020为端口号。</Text>
            <Button
              style={styles.buttonText}
              containerStyle={
                this.state.hasError ? styles.disabledButton : styles.button
              }
              text="确定"
              disabled={this.state.hasError}
              onPress={this.onBtnClick}
            />
          </PageContent>
        </KeyboardAvoidingView>
      </PageWrapper>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  titleText: {
    marginTop: 136,
    marginLeft: 38,
    fontSize: 17,
    color: gStyles.color.mTextColor,
    alignSelf: 'flex-start'
  },
  inputItem: {
    marginLeft: 0,
    marginTop: 21,
    paddingLeft: 13,
    paddingTop: 15,
    paddingBottom: 15,
    height: 44,
    width: '80%',
    borderColor: gStyles.color.mBorderColor,
    borderStyle: 'solid',
    borderWidth: 0.5,
    alignSelf: 'center',
    borderRadius: 2.5
  },
  textSpec: {
    marginLeft: 38,
    marginTop: 22,
    marginBottom: 10,
    fontSize: 13,
    color: gStyles.color.mTextColor,
    alignSelf: 'flex-start'
  },
  textDetail: {
    marginLeft: 67,
    marginBottom: 10,
    fontSize: 13,
    color: gStyles.color.mTextColor,
    alignSelf: 'flex-start'
  },
  button: {
    borderRadius: 10,
    alignSelf: 'center',
    height: 44,
    width: '80%',
    backgroundColor: gStyles.color.mColor,
    marginTop: 22
  },
  disabledButton: {
    borderRadius: 10,
    alignSelf: 'center',
    height: 44,
    width: '80%',
    backgroundColor: gStyles.color.tTextColor,
    marginTop: 22
  },
  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
    padding: 13
  }
});

const mapStateToProps = state => {
  const { server } = state;
  return {
    server
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators({ ...serverActions }, dispatch);
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerSetup);
