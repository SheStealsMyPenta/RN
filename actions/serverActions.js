import * as types from '../constants/ActionTypes';

export function validateServer(pathServerValidation,modelType) {
  return {
    type: types.VALIDATE_SERVER,
    payload: {
      pathServerValidation,
      modelType,
    }
  };
}

export function validateServerSuccess(validationMsg){
  return {
    type: types.VALIDATE_SERVER_SUCCESS,
    payload: {
      validationMsg
    }
  };
}

export function validateServerFailure(){
  return {
    type: types.VALIDATE_SERVER_FAILURE
  }
}
