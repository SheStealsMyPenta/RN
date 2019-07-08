import * as types from '../constants/ActionTypes';


export function vpnLogin(host,name,password,port=443){
  return {
    type: types.VPN_LOGIN,
    payload: {
      host,
      port,
      name,
      password
    }
  }
}

export function vpnLogout(){
  return {
    type: types.VPN_LOGOUT
  }
}

export function vpnLogoutSuccess(){
  return {
    type: types.VPN_LOGOUT_SUCCESS
  }
}

export function vpnLoginSuccess(){
  return {
    type: types.VPN_LOGIN_SUCCESS
  }
}

export function vpnReloginFailure(){
  return {
    type: types.VPN_RELOGIN_FAILURE
  }
}
