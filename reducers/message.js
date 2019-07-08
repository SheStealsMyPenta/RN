import * as types from '../constants/ActionTypes';

const initialState = {
  detail: null,
  page: 1,
  loading: false,
  refreshing: false,
  list: []
};

function handleFetchListSuccess(state, action) {
  let { meta: { page, refreshing }, payload } = action;
  let srcList = state.list,
    dstObj = Object.assign({}, state, { page, list: [] });

  if (refreshing) {
    dstObj.list = [...payload];
  } else {
    dstObj.list = [...srcList, ...payload];
  }

  return Object.assign({}, state, dstObj);
}

function handleLoading(state, action) {
  let { payload: { loading, refreshing } } = action;

  return Object.assign({}, state, { loading, refreshing });
}

function handleFetchDetailSuccess(state, action) {
  let { payload } = action;
  return Object.assign({}, state, {
    detail: payload
  });
}

export default function message(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_MESSAGE_LIST_SUCCESS:
      return handleFetchListSuccess(state, action);
    case types.FETCH_MESSAGE_LIST_LOADING:
      return handleLoading(state, action);
    case types.RESET_MESSAGE_DETAIL:
      return Object.assign({}, state, { detail: null });
    case types.FETCH_MESSAGE_DETAIL_SUCCESS:
      return handleFetchDetailSuccess(state, action);
    default:
      return state;
  }
}
