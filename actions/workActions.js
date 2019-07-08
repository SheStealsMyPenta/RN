import * as types from '../constants/ActionTypes';

export function fetchNetlink(token, title, id) {
  return {
    type: types.FETCH_NETLINK,
    payload: {
      token,
      title,
      id
    }
  };
}
