import * as types from '../constants/ActionTypes';

export function setUserLogin(token, user, deviceToken) {
  return {
    type: types.SET_USER_LOGIN,
    payload: {
      token,
      user,
      deviceToken
    }
  };
}

export function setUserLogout(token, user, deviceToken) {
  return {
    type: types.SET_USER_LOGOUT,
    payload: {
      token,
      user,
      deviceToken
    }
  };
}

export function fetchMessageList(refreshing, page = 1) {
  return {
    type: types.FETCH_MESSAGE_LIST,
    payload: {
      refreshing,
      page
    }
  };
}

export function fetchMessageListLoading(loading, refreshing) {
  return {
    type: types.FETCH_MESSAGE_LIST_LOADING,
    payload: {
      loading,
      refreshing
    }
  };
}

export function resetMessageDetail() {
  return { type: types.RESET_MESSAGE_DETAIL };
}

export function fetchMessageDetail(messageId = 1) {
  return {
    type: types.FETCH_MESSAGE_DETAIL,
    payload: {
      messageId
    }
  };
}
