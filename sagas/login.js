import { takeEvery, put, take, call, fork, all, takeLatest } from 'redux-saga/effects';
import DeviceInfo from 'react-native-device-info';

import apiClient from '../utils/ApiClient';
import * as types from '../constants/ActionTypes';
import ToastUtil from '../utils/ToastUtil';
import gConfig from '../constants/Config';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import { showError } from '../utils/Helper';
import deviceinfo from 'react-native-device-info';


export function* requestLoginConfig(action) {
  const {
    pathLoginConfig
  } = action.payload;
  let modelType = 'PHONE';
  if(deviceinfo.getModel().toLowerCase().indexOf('ipad')!==-1){
    modelType = 'PAD';
  }
  //yield put(fetchStart());
  try {
    const response = yield call(apiClient.post, pathLoginConfig, {
      params: {
        device: modelType,
        config: 1
      }
    });
    if (response && response.updateInfo) {
      yield put({
        type: types.RECEIVE_LOGIN_CONFIG,
        payload: response
      });
    } else {
      throw new Error('读取服务器配置出错');
    }
  } catch (error) {
    showError(error);
  } finally {
    //yield put(fetchEnd());
  }
}

export function* requestLogin(action) {
  const {
    pathLogin,
    user,
    pwd
  } = action.payload;
  yield put(fetchStart());
  try {
    const response = yield call(apiClient.post, pathLogin, {
      params: {
        user: user,
        password: pwd
      }
    });
    if (response.result.type === 'data') {
      yield put({
        type: types.REQUEST_LOGIN_SUCCESS,
        payload: {
          user: user,
          response: response.result
        }
      });
    } else {
      throw new Error(response.result.msg);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleChangePassword(action) {
  const {payload: {newpwd,username,token,oldpwd}} = action;
  yield put(fetchStart());
  let response;
  try{
    response = yield call(apiClient.post, gConfig.pathChangePwd, {params:{newpwd,username,token,oldpwd}});
    if(response && response.result && response.result.type ==='data' && response.result.modifypwdresult.value){
      yield put({
        type: types.CHANGE_PASSWORD_SUCCESS
      })
    }else {
      throw new Error((response && response.msg) || '修改密码失败');
    }
  } catch(error){
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

export function* watchLogin() {
  yield all([
    takeLatest(types.REQUEST_LOGIN_CONFIG, requestLoginConfig),
    takeLatest(types.REQUEST_LOGIN, requestLogin),
    takeLatest(types.CHANGE_PASSWORD,handleChangePassword)
  ])
}
