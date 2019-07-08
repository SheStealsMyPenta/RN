import React from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';

import configureStore from './store/configure-store';
import rootSaga from './sagas/index';
import AppWrapper from './containers/AppWrapper';
import gConfig from './constants/Config';

console.disableYellowBox = true;
global.log = function(...args) {
  if (__DEV__) {
    console.log(...args);
  }
};

global.server = gConfig.defaultServer;
/* global.pnServer =
  Platform.OS === 'android'
    ? {
        ip: 'www.dofull.cn',
        port: '12589'
      }
    : {
        ip: 'http://www.dofull.cn',
        port: '9090'
      }; */
//console.log('root start:',global.server);

const store = configureStore();

// run root saga
store.runSaga(rootSaga);

const Root = () => (
  <Provider store={store}>
    <AppWrapper />
  </Provider>
);

export default Root;
