import * as types from '../constants/ActionTypes';

export function setNetworkInfo(info) {
  return {
    type: types.SET_NETWORK_INFO,
    payload: { info }
  };
}
