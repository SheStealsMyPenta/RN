import * as types from '../constants/ActionTypes';

export function fetchApprovalTabs(token) {
  return {
    type: types.FETCH_APPROVAL_TABS,
    payload: {
      token
    }
  };
}

export function fetchApprovalListLoading(id, loading, refreshing) {
  return {
    type: types.FETCH_APPROVAL_LIST_LOADING,
    payload: {
      id,
      loading,
      refreshing
    }
  };
}

export function fetchApprovalListTemplate(token, id, updateTime) {
  return {
    type: types.FETCH_APPROVAL_LIST_TEMPLATE,
    payload: {
      token,
      id,
      updateTime
    }
  };
}

export function fetchApprovalListData(token, id, refreshing, start) {
  return {
    type: types.FETCH_APPROVAL_LIST_DATA,
    payload: {
      token,
      id,
      refreshing,
      start
    }
  };
}

export function deleteApprovalListItem(id, eid) {
  return {
    type: types.DELETE_APPROVAL_LIST_ITEM,
    payload: {
      id,
      eid
    }
  };
}

export function doApprovalAgree(token, id) {
  return {
    type: types.DO_APPROVAL_AGREE,
    payload: {
      token,
      id
    }
  };
}

export function doApprovalAgreeData(token, id, data) {
  return {
    type: types.DO_APPROVAL_AGREE_DATA,
    payload: {
      token,
      id,
      data
    }
  };
}

export function doApprovalDisagree(token, id) {
  return {
    type: types.DO_APPROVAL_DISAGREE,
    payload: {
      token,
      id
    }
  };
}

export function doApprovalDisagreeData(token, id, data) {
  return {
    type: types.DO_APPROVAL_DISAGREE_DATA,
    payload: {
      token,
      id,
      data
    }
  };
}

export function resetApprovalProcess() {
  return {
    type: types.RESET_APPROVAL_PROCESS
  };
}

export function fetchApprovalProcess(token, defineID, dataID) {
  return {
    type: types.FETCH_APPROVAL_PROCESS,
    payload: {
      token,
      defineID,
      dataID
    }
  };
}
