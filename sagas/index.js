import { fork, all } from 'redux-saga/effects';

import { watchRequestServerValidation } from './server';
import { watchLogin } from './login';
import { watchUser } from './user';
import { watchFunctions } from './functions';
import { watchReimb } from './reimb';
import { watchApproval } from './approval';
import { watchWork } from './work';
import { watchMessage } from './message';
import { watchSearch } from './search';
import { watchStatistics } from './statistics';
import { watchVpn } from './vpn';
import { watchBasedata } from './basedata';

export default function* rootSaga() {
  yield all([
    fork(watchRequestServerValidation),
    fork(watchLogin),
    fork(watchFunctions),
    fork(watchUser),
    fork(watchReimb),
    fork(watchApproval),
    fork(watchWork),
    fork(watchMessage),
    fork(watchSearch),
    fork(watchStatistics),
    fork(watchVpn),
    fork(watchBasedata)
  ]);
}
