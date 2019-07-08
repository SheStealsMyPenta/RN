import { combineReducers } from 'redux';

import loading from './loading';
import network from './network';
import login from './login';
import user from './user';
import functions from './functions';
import reimb from './reimb';
import approval from './approval';
import work from './work';
import server from './server';
import message from './message';
import search from './search';
import statistics from './statistics';
import vpn from './vpn';
import basedata from './basedata';
import { RESET_LOGIN_STATUS } from '../constants/ActionTypes';

const appReducer = combineReducers({
  loading,
  network,
  server,
  login,
  user,
  functions,
  reimb,
  approval,
  work,
  message,
  search,
  statistics,
  vpn,
  basedata
});

const rootReducer = (state, action) => {
  if (action.type === RESET_LOGIN_STATUS) {
    state = { server: state.server, vpn:state.vpn, network: state.network };
  }
  return appReducer(state, action);
};

export default rootReducer;
