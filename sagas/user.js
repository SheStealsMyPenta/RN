import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';

import apiClient from '../utils/ApiClient';
import { showError } from '../utils/Helper';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';

function* handleFetchUser(action) {
  const { payload: { username, token } } = action;

  //yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathGetUser, { params: { token, username } });
    if (response &&response.result && response.result.type == 'data' && response.result.user) {
      yield put({
        type: types.FETCH_USER_SUCCESS,
        payload: response.result.user
      });
    } else {
      throw new Error((response && response.msg) || '获取用户信息失败');
    }
  } catch (error) {
    showError(error);
  } finally {
    //yield put(fetchEnd());
  }
}

export function* watchUser() {
  yield all([takeLatest(types.FETCH_USER, handleFetchUser)]);
}
