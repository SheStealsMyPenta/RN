import * as types from '../constants/ActionTypes';

const initialState = {};

function handleFetchUserSuccess(state, action) {
  let { payload } = action;
  return Object.assign({}, state, payload);
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_USER_SUCCESS:
      return handleFetchUserSuccess(state, action);
    default:
      return state;
  }
}
