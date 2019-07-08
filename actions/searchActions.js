import * as types from '../constants/ActionTypes';

export function fetchSearchMeta(id) {
  return {
    type: types.FETCH_SEARCH_META,
    payload: {
      id
    }
  };
}

export function resetSearchResult() {
  return { type: types.RESET_SEARCH_RESULT };
}

export function fetchSearchResult(token, defineID, type, category, queryParams, refreshing, start) {
  return {
    type: types.FETCH_SEARCH_RESULT,
    payload: {
      token,
      defineID,
      type,
      category,
      queryParams,
      refreshing,
      start
    }
  };
}

export function fetchSearchResultLoading(category, loading, refreshing) {
  return {
    type: types.FETCH_SEARCH_RESULT_LOADING,
    payload: {
      category,
      loading,
      refreshing
    }
  };
}
