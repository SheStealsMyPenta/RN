import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';

import apiClient from '../utils/ApiClient';
import { showToast, showError, getResponseError } from '../utils/Helper';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';
import { getReimbStateFromCategory } from '../utils/FormHelper';

import { fetchSearchResultLoading } from '../actions/searchActions';

const LIST_COUNT_PER_REQUEST = 7;

function* handleFetchSearchResult(action) {
  let { payload: { token, defineID, type, category, queryParams, refreshing, start } } = action;

  let workflowstate, _sourcename;
  if (type == 'reimb') {
    workflowstate = getReimbStateFromCategory(category);
    _sourcename = 'BillMgr_list';
  } else {
    _sourcename = 'todo_list';
  }

  if (refreshing) {
    start = 0; // 刷新数据的时候，强制start为0
    yield put(fetchSearchResultLoading(type, category, false, true));
  } else {
    yield put(fetchSearchResultLoading(type, category, true, false));
  }

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathRestGet, {
      params: {
        token,
        _sourcename,
        _id: '',
        _define: defineID,
        _param: {
          workflowstate,
          start,
          end: start + LIST_COUNT_PER_REQUEST,
          queryParams
        },
        method: 'GET'
      }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_SEARCH_RESULT_SUCCESS,
        payload: response.result.data._info,
        meta: { refreshing }
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchSearchResultLoading(type, category, false, false));
  }
}

export function* watchSearch() {
  yield all([takeLatest(types.FETCH_SEARCH_RESULT, handleFetchSearchResult)]);
}
