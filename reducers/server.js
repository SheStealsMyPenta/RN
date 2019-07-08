import * as types from '../constants/ActionTypes';

const initialState = {
  isValid: false,
  message: {}
};

export default function server(state = initialState, action) {
  switch (action.type) {
    case types.VALIDATE_SERVER_SUCCESS:
      return handleResponse(state, action);
    case types.VALIDATE_SERVER_FAILURE:
      return handleResponseFailure(state,action);
    default:
      return state;
  }
}

function handleResponse(state, action) {
  const {
    rsa,
    res
  } = action.payload.response;
  const publicKey = action.payload.response['pub-key'];
  let isValid = action.payload.isValid;
  let resList = [];
  for (let i = 0; i < res.length; i++) {
    let itemName = res[i].name;
    resList[itemName] = res[i].ref;
  }
  return Object.assign({}, state, {
    isValid: isValid,
    message: {
      publicKey,
      rsa,
      ...resList
    }
  });
}

function handleResponseFailure(state, action) {
  return Object.assign({},state,initialState);
}
