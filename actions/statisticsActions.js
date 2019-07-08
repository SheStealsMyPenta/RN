import * as types from '../constants/ActionTypes';

export function resetStatisticsList() {
  return { type: types.RESET_STATISTICS_LIST };
}

export function fetchStatisticsListLoading(id, loading, refreshing) {
  return {
    type: types.FETCH_STATISTICS_LIST_LOADING,
    payload: {
      id,
      loading,
      refreshing
    }
  };
}

export function fetchStatisticsListTemplate(token, id, queryParams, updateTime) {
  return {
    type: types.FETCH_STATISTICS_LIST_TEMPLATE,
    payload: {
      token,
      id,
      queryParams,
      updateTime
    }
  };
}

export function fetchStatisticsListData(token, id, queryParams, refreshing, start) {
  return {
    type: types.FETCH_STATISTICS_LIST_DATA,
    payload: {
      token,
      id,
      queryParams,
      refreshing,
      start
    }
  };
}
