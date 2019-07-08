import * as types from '../constants/ActionTypes';

const initialState = {
  /*
    id : {
    refreshing,
    loading,
    template,
    data,
    }
    */
};

function handleLoading(state, action) {
  let { payload: { id, loading, refreshing } } = action,
    listInfo = state[id];

  if (!listInfo) return state;

  let newInfo = Object.assign({}, listInfo, { loading, refreshing });

  return Object.assign({}, state, { [id]: newInfo });
}

function handleFetchListTemplateSuccess(state, action) {
  let { meta: { id }, payload } = action,
    template = payload;

  if (!template) {
    return state;
  }

  return Object.assign({}, state, { [id]: { template, refreshing: false, loading: false, data: [] } });
}

function handleFetchListDataSuccess(state, action) {
  let { meta: { id, refreshing }, payload } = action;
  let listInfo = state[id];

  if (!listInfo) return state;

  if (refreshing) {
    listInfo.data = [...payload.collections];
  } else {
    listInfo.data = [...listInfo.data, ...payload.collections];
  }
  listInfo.total = payload.total;

  return Object.assign({}, state, { [id]: listInfo });
}

export default function statistics(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_STATISTICS_LIST_LOADING:
      return handleLoading(state, action);
    case types.FETCH_STATISTICS_LIST_TEMPLATE_SUCCESS:
      return handleFetchListTemplateSuccess(state, action);
    case types.FETCH_STATISTICS_LIST_DATA_SUCCESS:
      return handleFetchListDataSuccess(state, action);
    default:
      return state;
  }
}
