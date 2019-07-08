import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { InputItem, Checkbox, List } from 'antd-mobile';
import store from 'react-native-simple-store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {JSEncrypt} from 'jsencrypt';

import ReturnButton from '../../components/ReturnButton';
import Button from '../../components/Button';

import gStyles from '../../constants/Styles';
import gConfig from '../../constants/Config';
import * as loginActions from '../../actions/loginActions';
//import inputStyle from './inputStyle';
//import checkboxStyle from './checkboxStyle';
import ToastUtil from '../../utils/ToastUtil';

const CheckboxItem = Checkbox.CheckboxItem;

class Password extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '修改密码',
    headerLeft: <ReturnButton navigation={navigation} />,
    headerRight: <View />
  });

  constructor(props) {
    super(props);
    this.state={
      pwd:'',
      newPwd:'',
      confirmedPwd:'',
      errors:{},
      isShowPwd: false
    }
  }

  showPwd=()=>{
    let isShowPwd = !this.state.isShowPwd;
    this.setState({
      isShowPwd:isShowPwd
    })
  }

  onPwdChange=(value)=>{
    this.setState({
      pwd: value
    })
  }

  onNewPwdChange=(value)=>{
    this.setState({
      newPwd: value
    })
  }

  onConfirmedPwdChange=(value)=>{
    this.setState({
      confirmedPwd:value
    })
  }

  _validate = () => {
    let errors = {};
    if (!this.state.pwd) {
      errors.pwd = true;
    }
    if (!this.state.newPwd) {
      errors.newPwd = true;
    }
    if (this.state.pwd === this.state.newPwd) {
      errors.same = true;
    }
    if (!this.state.confirmedPwd) {
      errors.confirmedPwd = true;
    }
    if (this.state.newPwd !== this.state.confirmedPwd) {
      errors.compare = true;
    }
    return errors;
  }

  _showErrorMsg=(errors)=>{
    //console.log('errors:',errors);
    if (errors) {
      if (errors.pwd) {
        ToastUtil.showShort('请输入原密码', false);
      } else if (errors.newPwd) {
        ToastUtil.showShort('请输入新密码', false);
      } else if (errors.same) {
        ToastUtil.showShort('新密码不能与原密码相同',false)
      } else if (errors.confirmedPwd) {
        ToastUtil.showShort('请输入确认密码',false);
      } else if(errors.compare) {
        ToastUtil.showShort('两次输入的新密码不一致',false);
      }
    }
  }

  _encryptPassword = (publicKey, password) => {
    let encrypt = new JSEncrypt();
    if (publicKey) {
      encrypt.setPublicKey(publicKey);
      return encrypt.encrypt(password);
    } else {
      return '';
    }
  }

  onChangePassword=()=>{
    let errors = this._validate();
    if(Object.keys(errors).length !== 0){
      this.setState({
        errors: errors
      });
      this._showErrorMsg(errors);

    }else{
      this.setState({
        errors: errors
      });
      const {actions,login:{auth:{token,user}}} = this.props;
      actions.changePassword(this.state.newPwd,user,token,this.state.pwd);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.login.isPwdChanged){
      this.changePasswordSuccess();
    }
  }

  changePasswordSuccess=()=>{
    //更新本地存储的密码
    try{
      global.log('密码修改成功');
      //加密新密码,准备保存本地
      let encryptNewPwd = this._encryptPassword(gConfig.pubkey,this.state.newPwd);
      
      store.get('login').then((login)=>{
        store.update('login',{
          pwd: encryptNewPwd,
        })}).then(()=>{
        ToastUtil.showShort('密码修改成功',false);
        const {navigation} = this.props;
        navigation.goBack();
      });
    } catch (error){
      alert(error);
    }    
  }


  render() {
    let inputType = this.state.isShowPwd?'':'password';
    global.log(this.props);
    return (
      <View style={styles.container}> 
          <List>
          <InputItem 
            selectionColor={gStyles.color.mColor}
            type={inputType}
            placeholder='请输入密码'
            labelNumber={5}
            //styles={inputStyle}
            value = {this.state.pwd}
            onChange = {this.onPwdChange}
            error = {this.state.errors.pwd}
          >当前密码</InputItem>
          <InputItem 
            selectionColor={gStyles.color.mColor}
            type={inputType}
            placeholder='请输入新密码'
            //maxLength = {20}
            labelNumber={5}
            //styles={inputStyle}
            value = {this.state.newPwd}
            onChange = {this.onNewPwdChange}
            error = {this.state.errors.newPwd || this.state.errors.same || this.state.errors.compare}
          >新密码</InputItem>
          <InputItem 
            selectionColor={gStyles.color.mColor}
            type={inputType}
            placeholder='请输入确认密码'
            //maxLength = {20}
            labelNumber={5}
            //styles={inputStyle}
            value = {this.state.confirmedPwd}
            onChange = {this.onConfirmedPwdChange}
            error = {this.state.errors.confirmedPwd || this.state.errors.compare}
          >确认密码</InputItem>
          <CheckboxItem
            onChange={this.showPwd}
            //styles={checkboxStyle}
          >
            <Text style={{fontSize:14}}>显示密码</Text>
          </CheckboxItem>
          </List>
          <Button 
            containerStyle={styles.button} 
            style={styles.buttonText}
            onPress={this.onChangePassword}
            text={'确定'}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'white',
    marginTop: 9
  },
  row:{
    marginLeft:17,
    width:'100%',
    height:53,
  },
  button:{
    marginTop: 25,
    borderRadius: 5,
    alignSelf: 'center',
    height: 44,
    width: 309,
    backgroundColor: gStyles.color.mColor
  },
  buttonText:{
    fontSize: 17,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
  },
  checkboxText:{
    fontSize:14
  }
});

const mapStateToProps = state => {
  const { login } = state;
  return {
    login
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators(
    {
      ...loginActions
    },
    dispatch
  );
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Password);
