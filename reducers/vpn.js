import * as types from '../constants/ActionTypes';

const initialState = {
  isConnected: false
};

export default function vpn(state = initialState, action) {
  switch (action.type) {
    case types.VPN_LOGIN_SUCCESS:
      return handleVpnLoginSuccess(state, action);
    case types.VPN_LOGOUT_SUCCESS:
      return handleVpnLogoutSuccess(state, action);
    case types.VPN_RELOGIN_FAILURE:
      return handleVpnReloginFailure(state, action);
    default:
      return state;
  }
}

function handleVpnLogoutSuccess(state, action) {
  return Object.assign({}, state, {
    isConnected: false
  });
}

function handleVpnLoginSuccess(state, action) {
  //const isConnected = action.payload.isConnected;
  return Object.assign({}, state, {
    isConnected: true
  });
}

function handleVpnReloginFailure(state, action) {
  return Object.assign({}, state, {
    isConnected: false
  })
}
