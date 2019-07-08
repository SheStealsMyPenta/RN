import * as types from '../constants/ActionTypes';

export function showLoading() {
  return {
    type: types.LOADING_SHOW
  };
}

export function hideLoading() {
  return {
    type: types.LOADING_HIDE
  };
}
