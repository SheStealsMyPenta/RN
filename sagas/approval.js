import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';

import apiClient from '../utils/ApiClient';
import { showToast, showShort, showError, getQueryString, getResponseError } from '../utils/Helper';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import { fetchApprovalListLoading } from '../actions/approvalActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';

const LIST_COUNT_PER_REQUEST = 5;

function* handleFetchApprovalTabs(action) {
  const { payload: { token } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathRestGet, { params: { token, _sourcename: 'todo_funs' } });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_APPROVAL_TABS_SUCCESS,
        payload: response.result.data
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleFetchApprovalListTemplate(action) {
  const { payload: { token, id, updateTime } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      params: { token, _sourcename: 'todo_define', _param: [{ id, updatetime: updateTime }] }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_APPROVAL_LIST_TEMPLATE_SUCCESS,
        payload: response.result.data,
        meta: {id},
      });

      // 请求表单初始化数据
      yield put({
        type: types.FETCH_APPROVAL_LIST_DATA,
        payload: {
          token,
          id,
          refreshing: true,
          start: 0
        }
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleFetchApprovalListData(action) {
  let { payload: { token, id, refreshing, start } } = action;

  if (refreshing) {
    start = 0; // 刷新数据的时候，强制start为0
    yield put(fetchApprovalListLoading(id, false, true));
  } else {
    yield put(fetchApprovalListLoading(id, true, false));
  }

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathRestGet, {
      params: { token, _sourcename: 'todo_list', _define: id, _param: { start, end: start + LIST_COUNT_PER_REQUEST } }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_APPROVAL_LIST_DATA_SUCCESS,
        payload: response.result.data,
        meta: { id, refreshing }
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchApprovalListLoading(id, false, false));
  }
}

function* handleDoApprovalAgree(action) {
  const { payload: { token, id } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      params: {
        token,
        _sourcename: 'todo_item',
        _id: '',
        _define: '',
        _method: 'PUT',
        _param: {
          id,
          actionName: 'mt_todo_single_complete',
          state: 1,
          buttonName: 'mt_todo_single_complete',
          urgent: false,
          fields: {}
        }
      }
    });

    if (response && response.result && response.result.type === 'data' && response.result.data) {
      if (response.result.data._result) {
        //showToast('处理成功！');
        yield put({
          type: types.DO_APPROVAL_AGREE_SUCCESS,
          payload: response.result.data._info
        });
      } else {
        let msg = (response.result.data._info && response.result.data._info.alertMsg) || '处理失败';
        showShort(`${msg}`, true);
      }
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleDoApprovalAgreeData(action) {
  const { payload: { token, id, data } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      params: {
        token,
        _sourcename: 'todo_item',
        _id: '',
        _define: '',
        _method: 'PUT',
        _param: {
          id,
          actionName: 'mt_todo_single_complete',
          state: 1,
          buttonName: 'mt_todo_single_complete',
          urgent: false,
          fields: {},
          ...data
        }
      }
    });

    if (
      response &&
      response.result &&
      response.result.type === 'data' &&
      response.result.data &&
      response.result.data._result
    ) {
      showToast('处理成功！');
      yield put({
        type: types.DO_APPROVAL_AGREE_DATA_SUCCESS,
        payload: response.result.data._info
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleDoApprovalDisagree(action) {
  const { payload: { token, id } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      params: {
        token,
        _sourcename: 'todo_item',
        _id: '',
        _define: '',
        _method: 'PUT',
        _param: {
          id,
          actionName: 'mt_todo_single_complete',
          state: 99,
          buttonName: 'mt_todo_single_complete',
          urgent: false,
          fields: {}
        }
      }
    });

    if (response && response.result && response.result.type === 'data' && response.result.data) {
      if (response.result.data._result) {
        yield put({
          type: types.DO_APPROVAL_DISAGREE_SUCCESS,
          payload: response.result.data._info
        });
      } else {
        let msg = (response.result.data._info && response.result.data._info.alertMsg) || '处理失败';
        showShort(`${msg}`, true);
      }
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleDoApprovalDisagreeData(action) {
  const { payload: { token, id, data } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      params: {
        token,
        _sourcename: 'todo_item',
        _id: '',
        _define: '',
        _method: 'PUT',
        _param: {
          id,
          actionName: 'mt_todo_single_complete',
          state: 1,
          buttonName: 'mt_todo_single_complete',
          urgent: false,
          fields: {},
          ...data
        }
      }
    });

    if (
      response &&
      response.result &&
      response.result.type === 'data' &&
      response.result.data &&
      response.result.data._result
    ) {
      showToast('处理成功！');
      yield put({
        type: types.DO_APPROVAL_DISAGREE_DATA_SUCCESS,
        payload: response.result.data._info
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleFetchApprovalProcess(action) {
  const { payload: { token, defineID, dataID } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathRestGet, {
      params: { token, _sourcename: 'todo_trace', _id: dataID, _define: defineID, _param: null, _method: 'GET' }
    });

    if (
      response &&
      response.result &&
      response.result.type === 'data' &&
      response.result.data &&
      response.result.data._info
    ) {
      yield put({
        type: types.FETCH_APPROVAL_PROCESS_SUCCESS,
        payload: response.result.data._info
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

export function* watchApproval() {
  yield all([
    takeLatest(types.FETCH_APPROVAL_TABS, handleFetchApprovalTabs),
    takeLatest(types.FETCH_APPROVAL_LIST_TEMPLATE, handleFetchApprovalListTemplate),
    takeLatest(types.FETCH_APPROVAL_LIST_DATA, handleFetchApprovalListData),
    takeLatest(types.DO_APPROVAL_AGREE, handleDoApprovalAgree),
    takeLatest(types.DO_APPROVAL_AGREE_DATA, handleDoApprovalAgreeData),
    takeLatest(types.DO_APPROVAL_DISAGREE, handleDoApprovalDisagree),
    takeLatest(types.DO_APPROVAL_DISAGREE_DATA, handleDoApprovalDisagreeData),
    takeLatest(types.FETCH_APPROVAL_PROCESS, handleFetchApprovalProcess)
  ]);
}
