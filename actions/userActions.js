import * as types from '../constants/ActionTypes';

export function fetchUser(username, token) {
  return {
    type: types.FETCH_USER,
    payload: {
      username,
      token
    }
  };
}
