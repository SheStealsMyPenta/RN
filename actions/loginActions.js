import * as types from '../constants/ActionTypes';

export function requestLoginConfig(pathLoginConfig){
  return {
    type: types.REQUEST_LOGIN_CONFIG,
    payload: {
      pathLoginConfig
    }
  }
}

export function receiveLoginConfig(config){
  return {
    type: types.RECEIVE_LOGIN_CONFIG,
    payload: {
      config
    }
  }
}

export function requestLogin(pathLogin,userName,encryptPwd){
  return {
    type: types.REQUEST_LOGIN,
    payload:{
      pathLogin: pathLogin,
      user: userName,
      pwd: encryptPwd,
    }
  }
}

export function resetLoginStatus(){
  return {
    type: types.RESET_LOGIN_STATUS
  }
}

export function changePassword(newpwd,username,token,oldpwd) {
  return {
    type: types.CHANGE_PASSWORD,
    payload:{
      newpwd,
      username,
      token,
      oldpwd,
    }
  }
}