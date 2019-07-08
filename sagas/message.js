import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';

import apiClient from '../utils/ApiClient';
import { showError } from '../utils/Helper';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import { fetchMessageListLoading } from '../actions/messageActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';

function* handleUserLogin(action) {
  const { payload: { token, user, deviceToken } } = action;

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathDeviceToken, {
      data: { cmd: 'cmd_login', user: user, token: deviceToken },
      fetchConfig: { url: `${global.pnServer.ip}:${global.pnServer.port}${gConfig.pathDeviceToken}` }
    });
  } catch (error) {
  } finally {
  }
}

function* handleUserLogout(action) {
  const { payload: { token, user, deviceToken } } = action;

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathDeviceToken, {
      data: { cmd: 'cmd_logout', user: user, token: deviceToken },
      fetchConfig: { url: `${global.pnServer.ip}:${global.pnServer.port}${gConfig.pathDeviceToken}` }
    });
  } catch (error) {
  } finally {
  }
}

function* handleFetchMessageList(action) {
  const { payload: { page, refreshing } } = action;

  if (refreshing) {
    yield put(fetchMessageListLoading(false, true));
  } else {
    yield put(fetchMessageListLoading(true, false));
  }

  let response;
  try {
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchMessageListLoading(false, false));
  }
}

function* handleFetchMessageDetail(action) {
  const { payload: { messageId } } = action;

  yield put(fetchStart());

  let response;
  try {
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

export function* watchMessage() {
  yield all([
    takeLatest(types.SET_USER_LOGIN, handleUserLogin),
    takeLatest(types.SET_USER_LOGOUT, handleUserLogout),
    takeLatest(types.FETCH_MESSAGE_LIST, handleFetchMessageList),
    takeLatest(types.FETCH_MESSAGE_DETAIL, handleFetchMessageDetail)
  ]);
}
