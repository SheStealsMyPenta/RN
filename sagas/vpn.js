import { takeEvery, put, take, call, fork, all, takeLatest } from 'redux-saga/effects';
import {NativeModules} from 'react-native';

import apiClient from '../utils/ApiClient';
import * as types from '../constants/ActionTypes';
import ToastUtil from '../utils/ToastUtil';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import { showError } from '../utils/Helper';

const {VPNManager} = NativeModules;
export function* vpnLogin(action) {
  const {host,port,name,password} = action.payload;
  //yield put(fetchStart());
  try {
    yield VPNManager.login(host,port,name,password);
  } catch (error) {
    showError(error);
  } finally {
    //yield put(fetchEnd());
  }
}

export function* vpnLogout(action) {
  try {
    yield VPNManager.logout();
  } catch (error) {
    showError(error);
  } finally {
    //yield put(fetchEnd());
  }
}

export function* watchVpn() {
  yield all([
    takeLatest(types.VPN_LOGIN, vpnLogin),
    takeLatest(types.VPN_LOGOUT,vpnLogout),
  ])
}