import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';

import apiClient from '../utils/ApiClient';
import { showError } from '../utils/Helper';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';

function* handleFetchNetlink(action) {
  const { payload: { token, title, id } } = action;

  //yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathGetNetLink, { params: { token, id } });
    if (response && response.result && response.result.type == 'data' && response.result.netlink) {
      yield put({
        type: types.FETCH_NETLINK_SUCCESS,
        payload: response.result.netlink,
        meta: { title, id }
      });
    } else {
      throw new Error((response && response.msg) || '获取链接地址失败');
    }
  } catch (error) {
    showError(error);
  } finally {
    //yield put(fetchEnd());
  }
}

export function* watchWork() {
  yield all([takeLatest(types.FETCH_NETLINK, handleFetchNetlink)]);
}
