import * as types from '../constants/ActionTypes';

const initialState = {};

function handleFetchFunctionsSuccess(state, action) {
  let { payload } = action;
  return Object.assign({}, state, payload);
}

export default function functions(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_FUNCTIONS_SUCCESS:
      return handleFetchFunctionsSuccess(state, action);
    default:
      return state;
  }
}
