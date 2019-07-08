import * as types from '../constants/ActionTypes';

const initialState = {
  total: 1,
  loading: false,
  refreshing: false,
  list: []
};

function handleLoading(state, action) {
  let { payload: { loading, refreshing } } = action;

  return Object.assign({}, state, {
    loading,
    refreshing
  });
}

function handleFetchSearchResultSuccess(state, action) {
  let { meta: { refreshing }, payload } = action;

  if (refreshing) {
    return Object.assign({}, state, {
      total: payload.total,
      list: payload.collections
    });
  } else {
    return Object.assign({}, state, {
      total: payload.total,
      list: [...state.list, ...payload.collections]
    });
  }
}

export default function search(state = initialState, action) {
  switch (action.type) {
    case types.RESET_SEARCH_RESULT:
      return Object.assign({}, state, {
        total: 1,
        loading: false,
        refreshing: false,
        list: []
      });
    case types.FETCH_SEARCH_RESULT_LOADING:
      return handleLoading(state, action);
    case types.FETCH_SEARCH_RESULT_SUCCESS:
      return handleFetchSearchResultSuccess(state, action);
    default:
      return state;
  }
}
