import * as types from '../constants/ActionTypes';

const initialState = {
  tabs: [],
  list: {
    /*
    id : {
    refreshing,
    loading,
    template,
    data,
    }
    */
  }
};

function handleFetchTabsSuccess(state, action) {
  let { payload: { _info: tabs } } = action;

  return Object.assign({}, state, { tabs });
}

function handleFetchListTemplateSuccess(state, action) {
  let { payload } = action,
    {id} = action.meta,
    template = null;
    for(let index=0;index<payload._info.length;index++){
      if(id===payload._info[index].id){
        template = payload._info[index];
        break;
      }
    }
  if (!template) {
    return state;
  }

  let list = Object.assign({}, state.list, { [template.id]: { template, refreshing: true, loading: false, data: [] } });

  return Object.assign({}, state, { list });
}

function handleFetchListDataSuccess(state, action) {
  let { meta: { id, refreshing }, payload } = action;
  let tabInfo = state.list[id];

  if (!tabInfo) return state;

  if (refreshing) {
    tabInfo.data = [...payload._info.collections];
  } else {
    tabInfo.data = [...tabInfo.data, ...payload._info.collections];
  }
  tabInfo.total = payload._info.total;

  return Object.assign({}, state);
}

function handleDeleteListItem(state, action) {
  let { payload: { id, eid } } = action;
  let tabInfo = state.list[id];

  if (!tabInfo) return state;

  tabInfo.data = tabInfo.data.filter(item => item.id != eid);

  return Object.assign({}, state);
}

function handleLoading(state, action) {
  let { payload: { id, loading, refreshing } } = action,
    tabInfo = state.list[id];

  if (!tabInfo) return state;

  let newInfo = Object.assign({}, tabInfo, { loading, refreshing }),
    list = Object.assign({}, state.list, { [id]: newInfo });

  return Object.assign({}, state, { list });
}

function handleFetchProcessSuccess(state, action) {
  let { payload } = action;
  return Object.assign({}, state, {
    process: payload
  });
}

export default function approval(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_APPROVAL_TABS_SUCCESS:
      return handleFetchTabsSuccess(state, action);

    case types.FETCH_APPROVAL_LIST_TEMPLATE_SUCCESS:
      return handleFetchListTemplateSuccess(state, action);

    case types.FETCH_APPROVAL_LIST_DATA_SUCCESS:
      return handleFetchListDataSuccess(state, action);

    case types.DELETE_APPROVAL_LIST_ITEM:
      return handleDeleteListItem(state, action);

    case types.FETCH_APPROVAL_LIST_LOADING:
      return handleLoading(state, action);

    case types.RESET_APPROVAL_PROCESS:
      return Object.assign({}, state, { process: null });
    case types.FETCH_APPROVAL_PROCESS_SUCCESS:
      return handleFetchProcessSuccess(state, action);
    default:
      return state;
  }
}
