import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';

import apiClient from '../utils/ApiClient';
import { showToast, showError, getQueryString, getResponseError } from '../utils/Helper';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';

import { fetchStatisticsListLoading, fetchStatisticsListData } from '../actions/statisticsActions';

const LIST_COUNT_PER_REQUEST = 7;

function* handleFetchStatisticsListTemplate(action) {
  const { payload: { token, id, queryParams, updateTime } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathQueryGetDefine, {
      params: { token, id, updateTime }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_STATISTICS_LIST_TEMPLATE_SUCCESS,
        payload: response.result.define,
        meta: { id }
      });

      // 请求表单初始化数据
      yield put(fetchStatisticsListData(token, id, queryParams, true, 0));
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleFetchStatisticsListData(action) {
  let { payload: { token, id, queryParams, refreshing, start } } = action;

  if (refreshing) {
    start = 0; // 刷新数据的时候，强制start为0
    yield put(fetchStatisticsListLoading(id, false, true));
  } else {
    yield put(fetchStatisticsListLoading(id, true, false));
  }

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathQueryGetListData, {
      params: {
        token,
        id,
        query_params_type: 'default',
        query_params: queryParams,
        start,
        end: start + LIST_COUNT_PER_REQUEST
      }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_STATISTICS_LIST_DATA_SUCCESS,
        payload: response.result.query_results,
        meta: { id, refreshing }
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchStatisticsListLoading(id, false, false));
  }
}

export function* watchStatistics() {
  yield all([
    takeLatest(types.FETCH_STATISTICS_LIST_TEMPLATE, handleFetchStatisticsListTemplate),
    takeLatest(types.FETCH_STATISTICS_LIST_DATA, handleFetchStatisticsListData)
  ]);
}
