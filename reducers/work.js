import * as types from '../constants/ActionTypes';

const initialState = {
  link: {
    id: '',
    title: '',
    url: ''
  }
};

function handleFetchNetlinkSuccess(state, action) {
  let { payload, meta } = action;
  return Object.assign({}, state, { link: { id: meta.id, title: meta.title, url: payload.url } });
}

export default function work(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_NETLINK_SUCCESS:
      return handleFetchNetlinkSuccess(state, action);
    default:
      return state;
  }
}
