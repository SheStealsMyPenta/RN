import * as types from '../constants/ActionTypes';

export function fetchFunctions(username, token) {
  return {
    type: types.FETCH_FUNCTIONS,
    payload: {
      username,
      token
    }
  };
}
