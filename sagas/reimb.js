import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';

import apiClient from '../utils/ApiClient';
import { showToast, showShort, showError, getQueryString, getResponseError } from '../utils/Helper';
import { getReimbStateFromCategory } from '../utils/FormHelper';
import { fetchStart, fetchEnd } from '../actions/fetchActions';
import {
  fetchReimbListLoading,
  fetchReimbListData,
  fetchReimbDetailData,
  fetchReimbEditorData
} from '../actions/reimbActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';

const LIST_COUNT_PER_REQUEST = 10;

//import DataFormula from './DataFormular2';
function* handleFetchReimbTabs(action) {
  const { payload: { token } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathRestGet, { params: { token, _sourcename: 'BillMgr_funs' } });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_REIMB_TABS_SUCCESS,
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

function* handleFetchReimbList(action) {
  const { payload: { page, category, refreshing } } = action;

  if (refreshing) {
    yield put(fetchReimbListLoading(category, false, true));
  } else {
    yield put(fetchReimbListLoading(category, true, false));
  }

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathReimbList, { params: { seed: 1, results: 15, page: 1 } });
    yield put({
      type: types.FETCH_REIMB_LIST_SUCCESS,
      payload: response,
      meta: { page, category, refreshing }
    });
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchReimbListLoading(category, false, false));
  }
}

function* handleFetchReimbListTemplate(action) {
  const { payload: { token, category, id, updateTime } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      params: { token, _sourcename: 'BillMgr_define', _param: [{ id, updatetime: updateTime }] }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_REIMB_LIST_TEMPLATE_SUCCESS,
        payload: response.result.data,
        meta: { category }
      });

      // 请求表单初始化数据
      yield put(fetchReimbListData(token, category, id, true, 0));
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleFetchReimbListData(action) {
  let { payload: { token, category, id, refreshing, start } } = action;

  if (refreshing) {
    start = 0; // 刷新数据的时候，强制start为0
    yield put(fetchReimbListLoading(category, false, true));
  } else {
    yield put(fetchReimbListLoading(category, true, false));
  }

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathRestGet, {
      params: {
        token,
        _sourcename: 'BillMgr_list',
        _id: null,
        _define: id,
        _param: { workflowstate: getReimbStateFromCategory(category), start, end: start + LIST_COUNT_PER_REQUEST },
        method: 'GET'
      }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_REIMB_LIST_DATA_SUCCESS,
        payload: response.result.data,
        meta: { start, category, refreshing }
      });
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchReimbListLoading(category, false, false));
  }
}

function* handleFetchReimbDetailTemplate(action) {
  const { payload: { token, defineID, dataID, billType } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathRestGet, {
      params: { token, _sourcename: 'bill_define', _define: defineID, _id: dataID }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_REIMB_DETAIL_TEMPLATE_SUCCESS,
        payload: response.result.data
      });

      yield put(fetchReimbDetailData(token, defineID, dataID, billType));
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    showError(error);
  } finally {
    yield put(fetchEnd());
  }
}

function* handleFetchReimbDetailData(action) {
  const { payload: { token, defineID, dataID, billType } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.get, gConfig.pathRestGet, {
      params: {
        token,
        _sourcename: 'bill_data',
        _define: defineID,
        _id: dataID,
        _param: {
          bill_type: billType
        },
      }
    });

    //if (response && response.result && response.result.code != -1 && response.result.type === 'data') {
    if (response && response.result && response.result.type === 'data' && response.result.data) {
      yield put({
        type: types.FETCH_REIMB_DETAIL_DATA_SUCCESS,
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

function* handleFetchReimbEditorData(action) {
  const { payload: { token, defineID, dataID, billType } } = action;

  //yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      params: {
        token,
        _sourcename: 'bill_data',
        _define: defineID,
        _id: dataID,
        _param: {
          bill_type: billType
        },
      }
    });

    if (response && response.result && response.result.type === 'data') {
      yield put({
        type: types.FETCH_REIMB_EDITOR_DATA_SUCCESS,
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

function* handleSaveReimbEditorData(action) {
  const { payload: { token, data } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathSaveBill, {
      params: { token },
      data: { bill_data: data }
    });

    if (response && response.result && response.result.type === 'data') {
      showToast('保存成功！');
      yield put({
        type: types.SAVE_REIMB_EDITOR_DATA_SUCCESS,
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

function* handleFetchReimbEditorTemplate(action) {
  const { payload: { token, defineID, dataID, billType } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      params: { token, _sourcename: 'bill_define', _define: defineID, _id: dataID }
    });

    if (response && response.result && response.result.type === 'data') {
      // 保存模板数据
      yield put({
        type: types.FETCH_REIMB_EDITOR_TEMPLATE_SUCCESS,
        payload: response.result.data
      });

      // 请求表单初始化数据
      yield put(fetchReimbEditorData(token, defineID, dataID, billType));
      /*
      yield put({
        type: types.FETCH_REIMB_EDITOR_DATA,
        payload: {
          token,
          id
        }
      });
      */
    } else {
      throw getResponseError(response);
    }
  } catch (error) {
    yield put(fetchEnd());
    showError(error);
  } finally {
    //yield put(fetchEnd());
  }
}

function* handleFetchReimbEditorFormula(action) {
  const { payload: { token, id, defineId, data } } = action;

  yield put(fetchStart());

  let response;
  /*let tData = `_sourcename=bill_field_change&_define=1ED1F70F586570D52C9523396BC6F7D6&_param=${JSON.stringify(
    DataFormula
  )}`;
  let tData = getQueryString({
    _param: JSON.stringify(DataFormula)
  });
  //console.log(tData);
  */
  try {
    response = yield call(apiClient.post, gConfig.pathRestGet, {
      //params: { token, _sourcename: 'bill_field_change', _id: id, _define:'' },
      //params: { token, _sourcename: 'bill_field_change', _id: '', _define:'1ED1F70F586570D52C9523396BC6F7D6' },
      params: {
        token,
        _sourcename: 'bill_field_change',
        _define: defineId
        //_define: '1ED1F70F586570D52C9523396BC6F7D6'
      },
      //data: `_param=${JSON.stringify(data)}`
      /*data: `_sourcename=bill_field_change&_define=1ED1F70F586570D52C9523396BC6F7D6&_param=${JSON.stringify(
        DataFormula
      )}`*/
      //data: tData
      data: {
        _param: data
        //_param: DataFormula
      }
    });

    if (response && response.result && response.result.type === 'data') {
      // 保存模板数据
      yield put({
        type: types.FETCH_REIMB_EDITOR_FORMULA_SUCCESS,
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

function* handleSubmitEditor(action) {
  const { payload: { token, billId, dataId } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathSubmitBill, {
      params: { token, bill_id: billId, data_id: dataId, bill_state: 1, _param: '' }
    });

    if (
      response &&
      response.result &&
      response.result.type === 'data' &&
      response.result.data &&
      response.result.data._info
    ) {
      showToast('提交表单成功！');
      yield put({
        type: types.SUBMIT_EDITOR_SUCCESS,
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

function* handleSubmitEditorUsers(action) {
  const { payload: { token, billId, dataId, users } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathSubmitBill, {
      params: { token, bill_id: billId, data_id: dataId, bill_state: users.state, _param: users }
    });

    if (
      response &&
      response.result &&
      response.result.type === 'data' &&
      response.result.data &&
      response.result.data._info
    ) {
      showToast('提交用户成功！');
      yield put({
        type: types.SUBMIT_EDITOR_USERS_SUCCESS,
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

function* handleSubmitReimb(action) {
  const { payload: { token, billId, dataId } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathSubmitBill, {
      params: { token, bill_id: billId, data_id: dataId, bill_state: 1, _param: '' }
    });

    if (
      response &&
      response.result &&
      response.result.type === 'data' &&
      response.result.data &&
      response.result.data._info
    ) {
      showToast('提交表单成功！');
      yield put({
        type: types.SUBMIT_REIMB_SUCCESS,
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

function* handleSubmitReimbUsers(action) {
  const { payload: { token, billId, dataId, users } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathSubmitBill, {
      params: { token, bill_id: billId, data_id: dataId, bill_state: users.state, _param: users }
    });

    if (
      response &&
      response.result &&
      response.result.type === 'data' &&
      response.result.data &&
      response.result.data._info
    ) {
      showToast('提交用户成功！');
      yield put({
        type: types.SUBMIT_REIMB_USERS_SUCCESS,
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

function* handleDeleteReimb(action) {
  const { payload: { token, billId, dataId } } = action;

  yield put(fetchStart());

  let response;
  try {
    response = yield call(apiClient.post, gConfig.pathDeleteBill, {
      params: { token, bill_id: billId, data_id: dataId }
    });

    if (response && response.result && response.result.type === 'data' && response.result.delete_result) {
      if (response.result.delete_result.value) {
        showToast('删除成功！');
        yield put({
          type: types.DELETE_REIMB_SUCCESS,
          payload: response.result.data
        });
      } else {
        throw new Error('删除失败！');
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

export function* watchReimb() {
  yield all([
    takeLatest(types.FETCH_REIMB_TABS, handleFetchReimbTabs),
    takeLatest(types.FETCH_REIMB_LIST, handleFetchReimbList),
    takeLatest(types.FETCH_REIMB_LIST_TEMPLATE, handleFetchReimbListTemplate),
    takeLatest(types.FETCH_REIMB_LIST_DATA, handleFetchReimbListData),
    takeLatest(types.FETCH_REIMB_DETAIL_TEMPLATE, handleFetchReimbDetailTemplate),
    takeLatest(types.FETCH_REIMB_DETAIL_DATA, handleFetchReimbDetailData),
    takeLatest(types.FETCH_REIMB_EDITOR_DATA, handleFetchReimbEditorData),
    takeLatest(types.SAVE_REIMB_EDITOR_DATA, handleSaveReimbEditorData),
    takeLatest(types.FETCH_REIMB_EDITOR_TEMPLATE, handleFetchReimbEditorTemplate),
    takeLatest(types.FETCH_REIMB_EDITOR_FORMULA, handleFetchReimbEditorFormula),
    takeLatest(types.SUBMIT_EDITOR, handleSubmitEditor),
    takeLatest(types.SUBMIT_EDITOR_USERS, handleSubmitEditorUsers),
    takeLatest(types.SUBMIT_REIMB, handleSubmitReimb),
    takeLatest(types.SUBMIT_REIMB_USERS, handleSubmitReimbUsers),
    takeLatest(types.DELETE_REIMB, handleDeleteReimb)
  ]);
}
