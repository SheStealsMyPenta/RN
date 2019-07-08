import * as types from '../constants/ActionTypes';

export function fetchReimbTabs(token) {
  return {
    type: types.FETCH_REIMB_TABS,
    payload: {
      token
    }
  };
}

export function fetchReimbList(category, refreshing, page = 1) {
  return {
    type: types.FETCH_REIMB_LIST,
    payload: {
      category,
      refreshing,
      page
    }
  };
}

export function fetchReimbListTemplate(token, category, id, updateTime) {
  return {
    type: types.FETCH_REIMB_LIST_TEMPLATE,
    payload: {
      token,
      category,
      id,
      updateTime
    }
  };
}

export function fetchReimbListData(token, category, id, refreshing, start) {
  return {
    type: types.FETCH_REIMB_LIST_DATA,
    payload: {
      token,
      category,
      id,
      refreshing,
      start
    }
  };
}

export function fetchReimbListLoading(category, loading, refreshing) {
  return {
    type: types.FETCH_REIMB_LIST_LOADING,
    payload: {
      category,
      loading,
      refreshing
    }
  };
}

export function deleteReimbListItem(category, id) {
  return {
    type: types.DELETE_REIMB_LIST_ITEM,
    payload: {
      category,
      id
    }
  };
}

export function resetReimbDetail() {
  return { type: types.RESET_REIMB_DETAIL };
}

export function fetchReimbDetailTemplate(token, defineID, dataID, billType) {
  return {
    type: types.FETCH_REIMB_DETAIL_TEMPLATE,
    payload: {
      token,
      defineID,
      dataID,
      billType,
    }
  };
}

export function fetchReimbDetailData(token, defineID, dataID, billType) {
  return {
    type: types.FETCH_REIMB_DETAIL_DATA,
    payload: {
      token,
      defineID,
      dataID,
      billType,
    }
  };
}

export function resetReimbEditor(step) {
  return {
    type: types.RESET_REIMB_EDITOR,
    payload: {
      step
    }
  };
}

export function fetchReimbEditorData(token, defineID, dataID, billType) {
  return {
    type: types.FETCH_REIMB_EDITOR_DATA,
    payload: {
      token,
      defineID,
      dataID,
      billType,
    }
  };
}

export function saveReimbEditorData(token, data) {
  return {
    type: types.SAVE_REIMB_EDITOR_DATA,
    payload: {
      token,
      data
    }
  };
}

export function fetchReimbEditorTemplate(token, defineID, dataID, billType) {
  return {
    type: types.FETCH_REIMB_EDITOR_TEMPLATE,
    payload: {
      token,
      defineID,
      dataID,
      billType,
    }
  };
}

export function fetchReimbEditorFormula(token, id, defineId, data) {
  return {
    type: types.FETCH_REIMB_EDITOR_FORMULA,
    payload: {
      token,
      id,
      defineId,
      data
    }
  };
}

export function submitEditor(token, billId, dataId) {
  return {
    type: types.SUBMIT_EDITOR,
    payload: {
      token,
      billId,
      dataId
    }
  };
}

export function submitEditorUsers(token, billId, dataId, users) {
  return {
    type: types.SUBMIT_EDITOR_USERS,
    payload: {
      token,
      billId,
      dataId,
      users
    }
  };
}

export function submitReimb(token, billId, dataId) {
  return {
    type: types.SUBMIT_REIMB,
    payload: {
      token,
      billId,
      dataId
    }
  };
}

export function submitReimbUsers(token, billId, dataId, users) {
  return {
    type: types.SUBMIT_REIMB_USERS,
    payload: {
      token,
      billId,
      dataId,
      users
    }
  };
}

export function deleteReimb(token, billId, dataId) {
  return {
    type: types.DELETE_REIMB,
    payload: {
      token,
      billId,
      dataId
    }
  };
}

export function markDetailFinished() {
  return {
    type: types.MARK_REIMB_DETAIL_FINISHED
  };
}
