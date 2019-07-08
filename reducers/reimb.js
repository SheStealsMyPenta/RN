import * as types from '../constants/ActionTypes';
import { updateFormulaResultToEditor } from '../utils/FormHelper';
import {
  STEP_INITIAL,
  STEP_SAVED,
  STEP_USERS,
  STEP_AGREE_1,
  STEP_AGREE_2,
  STEP_DISAGREE_1,
  STEP_DISAGREE_2,
  STEP_SUBMITTED,
  STEP_DELETED
} from '../constants/Constants';

const initialState = {
  tabs: [],
  detail: {
    inited: false,
    finished: false,
    step: STEP_INITIAL,
    template: {},
    data: {},
    agree: {},
    disagree: {},
    users: {}
  },
  editor: {
    inited: false,
    step: STEP_INITIAL,
    template: {},
    data: {},
    formula: [],
    users: {}
  },
  todoList: {
    total: 1,
    loading: false,
    refreshing: false,
    template: null,
    list: []
  },
  doingList: {
    total: 1,
    loading: false,
    refreshing: false,
    template: null,
    list: []
  },
  passedList: {
    total: 1,
    loading: false,
    refreshing: false,
    template: null,
    list: []
  },
  rejectedList: {
    total: 1,
    loading: false,
    refreshing: false,
    template: null,
    list: []
  }
};

function getListKey(category) {
  return `${category}List`;
}

function handleFetchTabsSuccess(state, action) {
  let { payload: { _info: tabs } } = action;

  return Object.assign({}, state, { tabs });
}

function handleFetchListTemplateSuccess(state, action) {
  let { meta: { category }, payload } = action,
    template = payload._info[0];

  if (!template) {
    return state;
  }

  let key = getListKey(category),
    newList = Object.assign({}, state[key], { template });

  return Object.assign({}, state, { [key]: newList });
}

function handleFetchListDataSuccess(state, action) {
  let { meta: { category, refreshing }, payload } = action;

  let key = getListKey(category),
    srcList = state[key].list,
    dstObj = Object.assign({}, state[key], { list: [] });

  if (refreshing) {
    dstObj.list = [...payload._info.collections];
  } else {
    dstObj.list = [...srcList, ...payload._info.collections];
  }
  dstObj.total = payload._info.total;

  return Object.assign({}, state, {
    [key]: dstObj
  });

  /*
  return state;
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
  */
}

function handleFetchListSuccess(state, action) {
  let { meta: { page, category, refreshing }, payload } = action;
  let key = getListKey(category),
    srcList = state[key].list,
    dstObj = Object.assign({}, state[key], { page, list: [] });

  if (refreshing) {
    dstObj.list = [...payload];
  } else {
    dstObj.list = [...srcList, ...payload];
  }

  return Object.assign({}, state, {
    [key]: dstObj
  });
}

function handleLoading(state, action) {
  let { payload: { category, loading, refreshing } } = action;
  let key = getListKey(category),
    listObj = state[key],
    dstObj = Object.assign({}, listObj, { loading, refreshing });

  return Object.assign({}, state, {
    [key]: dstObj
  });
}

function handleDeleteListItem(state, action) {
  let { payload: { category, id } } = action;

  console.log(action);
  let key = getListKey(category),
    listObj = state[key],
    listData = listObj.list.filter(item => item.id != id),
    dstObj = Object.assign({}, listObj, { list: listData });

  return Object.assign({}, state, {
    [key]: dstObj
  });
}

function handleFetchDetailTemplateSuccess(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    template: payload
  });
  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleFetchDetailDataSuccess(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    inited: true,
    data: payload
  });

  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleMarkDetailFinished(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    finished: true
  });

  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleSubmitReimbSuccess(state, action) {
  let { payload } = action;

  let newDetail;

  if (payload.isSelectUser) {
    newDetail = Object.assign({}, state.detail, {
      step: STEP_USERS,
      users: payload
    });
  } else {
    newDetail = Object.assign({}, state.detail, {
      step: STEP_SUBMITTED
    });
  }

  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleSubmitReimbUsersSuccess(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    step: STEP_SUBMITTED
  });

  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleDeleteReimbSuccess(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    step: STEP_DELETED
  });

  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleFetchEditorTemplateSuccess(state, action) {
  let { payload } = action;

  let newEditor = Object.assign({}, state.editor, {
    template: payload
  });

  return Object.assign({}, state, {
    editor: newEditor
  });
}

function handleFetchEditorDataSuccess(state, action) {
  let { payload } = action;

  let newEditor = Object.assign({}, state.editor, {
    inited: true,
    data: payload
  });

  return Object.assign({}, state, {
    editor: newEditor
  });
}

function handleSaveEditorDataSuccess(state, action) {
  let { payload } = action;

  let newEditor = Object.assign({}, state.editor, {
    step: STEP_SAVED
  });

  return Object.assign({}, state, {
    editor: newEditor
  });
}

function handleSubmitEditorSuccess(state, action) {
  let { payload } = action;

  console.log(payload);
  let newEditor;

  if (payload.isSelectUser) {
    newEditor = Object.assign({}, state.editor, {
      step: STEP_USERS,
      users: payload
    });
  } else {
    newEditor = Object.assign({}, state.editor, {
      step: STEP_SUBMITTED
    });
  }

  return Object.assign({}, state, {
    editor: newEditor
  });
}

function handleSubmitEditorUsersSuccess(state, action) {
  let { payload } = action;

  let newEditor = Object.assign({}, state.editor, {
    step: STEP_SUBMITTED
  });

  return Object.assign({}, state, {
    editor: newEditor
  });
}

function handleFetchEditorFormulaSuccess(state, action) {
  let { payload } = action;

  updateFormulaResultToEditor(state.editor, payload);

  let newEditor = Object.assign({}, state.editor, {
    formula: payload
  });

  return Object.assign({}, state, {
    editor: newEditor
  });
}

function handleDoApprovalAgreeSuccess(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    step: STEP_AGREE_1,
    agree: payload
  });
  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleDoApprovalAgreeDataSuccess(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    step: STEP_AGREE_2,
    agree: payload
  });
  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleDoApprovalDisagreeSuccess(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    step: STEP_DISAGREE_1,
    disagree: payload
  });
  return Object.assign({}, state, {
    detail: newDetail
  });
}

function handleDoApprovalDisagreeDataSuccess(state, action) {
  let { payload } = action;

  let newDetail = Object.assign({}, state.detail, {
    step: STEP_DISAGREE_2,
    disagree: payload
  });
  return Object.assign({}, state, {
    detail: newDetail
  });
}

export default function reimb(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_REIMB_TABS_SUCCESS:
      return handleFetchTabsSuccess(state, action);
    case types.FETCH_REIMB_LIST_SUCCESS:
      return handleFetchListSuccess(state, action);
    case types.FETCH_REIMB_LIST_TEMPLATE_SUCCESS:
      return handleFetchListTemplateSuccess(state, action);
    case types.FETCH_REIMB_LIST_DATA_SUCCESS:
      return handleFetchListDataSuccess(state, action);
    case types.FETCH_REIMB_LIST_LOADING:
      return handleLoading(state, action);
    case types.DELETE_REIMB_LIST_ITEM:
      return handleDeleteListItem(state, action);
    case types.RESET_REIMB_DETAIL:
      return Object.assign({}, state, {
        detail: {
          inited: false,
          step: STEP_INITIAL,
          finished: false,
          template: {},
          data: {},
          agree: {},
          disagree: {},
          users: {}
        }
      });
    case types.FETCH_REIMB_DETAIL_TEMPLATE_SUCCESS:
      return handleFetchDetailTemplateSuccess(state, action);
    case types.FETCH_REIMB_DETAIL_DATA_SUCCESS:
      return handleFetchDetailDataSuccess(state, action);
    case types.MARK_REIMB_DETAIL_FINISHED:
      return handleMarkDetailFinished(state, action);
    case types.RESET_REIMB_EDITOR:
      return Object.assign({}, state, {
        editor: {
          inited: false,
          step: action.payload.step,
          template: {},
          data: {},
          formula: [],
          users: {}
        }
      });
    case types.FETCH_REIMB_EDITOR_TEMPLATE_SUCCESS:
      return handleFetchEditorTemplateSuccess(state, action);
    case types.FETCH_REIMB_EDITOR_DATA_SUCCESS:
      return handleFetchEditorDataSuccess(state, action);
    case types.SUBMIT_EDITOR_SUCCESS:
      return handleSubmitEditorSuccess(state, action);
    case types.SUBMIT_EDITOR_USERS_SUCCESS:
      return handleSubmitEditorUsersSuccess(state, action);
    case types.SAVE_REIMB_EDITOR_DATA_SUCCESS:
      return handleSaveEditorDataSuccess(state, action);
    case types.SUBMIT_REIMB_SUCCESS:
      return handleSubmitReimbSuccess(state, action);
    case types.SUBMIT_REIMB_USERS_SUCCESS:
      return handleSubmitReimbUsersSuccess(state, action);
    case types.DELETE_REIMB_SUCCESS:
      return handleDeleteReimbSuccess(state, action);
    case types.FETCH_REIMB_EDITOR_FORMULA_SUCCESS:
      return handleFetchEditorFormulaSuccess(state, action);

    case types.DO_APPROVAL_AGREE_SUCCESS:
      return handleDoApprovalAgreeSuccess(state, action);
    case types.DO_APPROVAL_AGREE_DATA_SUCCESS:
      return handleDoApprovalAgreeDataSuccess(state, action);
    case types.DO_APPROVAL_DISAGREE_SUCCESS:
      return handleDoApprovalDisagreeSuccess(state, action);
    case types.DO_APPROVAL_DISAGREE_DATA_SUCCESS:
      return handleDoApprovalDisagreeDataSuccess(state, action);
    default:
      return state;
  }
}
