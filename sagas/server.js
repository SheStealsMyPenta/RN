import { takeLatest, put, take, call, fork } from 'redux-saga/effects';
import deviceinfo from 'react-native-device-info';

import apiClient from '../utils/ApiClient';
import * as types from '../constants/ActionTypes';
import ToastUtil from '../utils/ToastUtil';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import {receiveServerValidation} from '../actions/serverActions';
import {requestLoginConfig} from '../actions/loginActions';
import { showError } from '../utils/Helper';
import gConfig from '../constants/Config';

export function* requestServerValidation(action) {
  const {
    pathServerValidation
  } = action.payload;
  let modelType = 'PHONE';
  if(deviceinfo.getModel().toLowerCase().indexOf('ipad')!==-1){
    modelType = 'PAD';
  }
  yield put(fetchStart());

  try {
    const response = yield call(apiClient.get, pathServerValidation, {
      params: {
        device: modelType,
        serverValidation: 1,
      }
    });
    if (response && response.result.type === 'data') {
      yield put({
        type: types.VALIDATE_SERVER_SUCCESS,
        payload: {
          response: response.result,
          isValid: true
        }
      });
      yield put(requestLoginConfig(gConfig.pathLoginConfig));
    } else {
      yield put({
        type: types.VALIDATE_SERVER_FAILURE
      })
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

export function* watchRequestServerValidation() {
  yield takeLatest(types.VALIDATE_SERVER, requestServerValidation);
}
