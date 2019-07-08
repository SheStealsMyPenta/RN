import * as types from '../constants/ActionTypes';

const initialState = {
  isSuccess: false,
  isPwdChanged: false,
  config: {},
  auth: {
    user: '',
    token: '',
    userID:'',
    userType:''
  },
  service: {},
  appVersion: {
    android_version: {},
    ios_version: {}
  }
};

export default function login(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_LOGIN_CONFIG:
      return handleConfig(state, action);
    case types.REQUEST_LOGIN_SUCCESS:
      return handleLoginSuccess(state, action);
    case types.RESET_LOGIN_STATUS:
      return handleResetLoginStatus(state, action);
    case types.CHANGE_PASSWORD_SUCCESS:
      return handleChangePasswordSuccess(state,action);
    default:
      return state;
  }
}

function handleConfig(state, action) {
  let {
    android_version,
    ios_version
  } = action.payload.updateInfo;
  return Object.assign({}, state, {
    config: action.payload.portalResource,
    appVersion: {
      android_version,
      ios_version
    }
  });
}

function handleLoginSuccess(state, action) {
  let token = action.payload.response.token.value;
  let user = action.payload.response.user;
  let userName = action.payload.user;
  //let {userID,userType} = action.payload.response.user;
  let service = action.payload.response.service.format;
  return Object.assign({}, state, {
    isSuccess: true,
    auth: {
      user: userName,
      token: token,
      userID: user.userid,
      userType: user.usertype
    },
    service: service
  });
}

function handleResetLoginStatus(state, action){
  return Object.assign({}, state, {
    isSuccess: false,
    auth:{
      token: {}
    },
    service: {},
    appVersion:{}
  });
}

function handleChangePasswordSuccess(state,action) {
  return Object.assign({},state,{
    isPwdChanged: true
  })
}