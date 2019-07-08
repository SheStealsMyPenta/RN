import * as types from '../constants/ActionTypes';

export function fetchStart() {
  return {
    type: types.FETCH_START
  };
}

export function fetchEnd() {
  return {
    type: types.FETCH_END
  };
}

export function fetchCancel() {
  return {
    type: types.FETCH_CANCEL
  };
}

export function fetchError() {
  return {
    type: types.FETCH_ERROR
  };
}
