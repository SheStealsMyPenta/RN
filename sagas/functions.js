import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';
import deviceinfo from 'react-native-device-info';

import apiClient from '../utils/ApiClient';
import { showError } from '../utils/Helper';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';

function* handleFetchFunctions(action) {
  const { payload: { username, token } } = action;
  let modelType = 'PHONE';
  if(deviceinfo.getModel().toLowerCase().indexOf('ipad')!==-1){
    modelType = 'PAD';
  }
  //yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathGetFunctions, {
      params: {
        device: modelType,
        username,
        token
      }
    });
    if (response && response.result && response.result.type == 'data' && response.result.functions) {
      yield put({
        type: types.FETCH_FUNCTIONS_SUCCESS,
        payload: response.result.functions
      });
    } else {
      throw new Error((response && response.msg) || '获取功能列表失败');
    }
  } catch (error) {
    showError(error);
  } finally {
    //yield put(fetchEnd());
  }
}

export function* watchFunctions() {
  yield all([takeLatest(types.FETCH_FUNCTIONS, handleFetchFunctions)]);
}
