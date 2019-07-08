import * as types from '../constants/ActionTypes';

export function fetchBasedataDefine(baseDataName, token){
  return {
    type: types.FETCH_BASEDATA_DEFINE,
    payload: {
      baseDataName,
      token
    }
  }
}

export function fetchBasedataList(baseDataName,
  token, userID, parentID = '', authType = '', filter = '') {
  return {
    type: types.FETCH_BASEDATA_LIST,
    payload: {
      baseDataName,
      parentID,
      token,
      userID,
      authType,
      filter,
    }
  }
}

export function fetchBasedataListLoading(loading) {
  return {
    type: types.FETCH_BASEDATA_LIST_LOADING,
    payload: {
      loading
    }
  };
}

export function fetchBasedataListMore(baseDataName, parentID, act, token) {
  return {
    type: types.FETCH_BASEDATA_LIST_MORE,
    payload: {
      act,
      token,
    },
    meta:{
      baseDataName,
      parentID,
    }
  }
}

export function clearBasedata(){
  return {
    type: types.CLEAR_BASEDATA
  }
}

export function searchBasedataList(baseDataName, token, keyword,
  parentID = '', authType = '') {
  return {
    type: types.SEARCH_BASEDATA_LIST,
    payload: {
      parentID,
      authType,
      baseDataName,
      token,
      keyword,
    }
  }
}

export function searchBasedataListMore(baseDataName, parentID, act, token) {
  return {
    type: types.SEARCH_BASEDATA_LIST_MORE,
    payload: {
      act,
      token,
    },
    meta: {
      baseDataName,
      parentID,
    }
  }
}

export function clearBasedataList(){
  return {
    type: types.CLEAR_BASEDATA_LIST
  }
}

export function clearSearchBasedataResult(){
  return {
    type: types.CLEAR_SEARCH_BASEDATA_RESULT
  }
}
