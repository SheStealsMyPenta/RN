import * as types from '../constants/ActionTypes';

/*
*
*/

const initialState = {
  info: null
};

function mapNetworkInfo(info) {
  let type = 'none';

  info = info.toLowerCase();
  switch (info) {
    case 'none':
      type = 'none';
    case 'wifi':
      type = 'wifi';
    case 'wifi':
      type = 'wifi';
      break;
    case 'bluetooth':
      type = 'bluetooth';
      break;
    case 'ethernet':
      type = 'ethernet';
      break;
    case 'dummy':
      type = 'dummy';
      break;
    case 'vpn':
      type = 'vpn';
      break;
    case 'unknown':
      type = 'unknown';
      break;
    default:
      type = 'cell';
  }

  return type;
}

export default function network(state = initialState, action) {
  switch (action.type) {
    case types.SET_NETWORK_INFO:
      return { info: mapNetworkInfo(action.payload.info) };
    default:
      return state;
  }
}
