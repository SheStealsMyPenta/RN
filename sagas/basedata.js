import { all, put, call, cancelled, takeEvery, takeLatest } from 'redux-saga/effects';

import apiClient from '../utils/ApiClient';
import { showError, getResponseError } from '../utils/Helper';
import { fetchBasedataListLoading } from '../actions/basedataActions';
import gConfig from '../constants/Config';
import * as types from '../constants/ActionTypes';

function* handleFetchBasedataDefine(action){
  const {payload: {baseDataName,token}} = action;
  let response;
  try{
    response = yield call(apiClient.post, gConfig.pathBasedataDefine, {
      params: {
        name: baseDataName,
        token: token,
      }
    });
    //console.log('===',response.result);
    if(response.result.type ==='data' && response.result.basedata_define){
      //console.log('+++',response.result.basedata_define);
      yield put({
        type: types.FETCH_BASEDATA_DEFINE_SUCCESS,
        payload: response.result.basedata_define
      })
    }
  }catch(error){
    showError(error);
  }finally{
  }
}

function* handleFetchBasedataList(action){
const {
  payload: {
    baseDataName,
    parentID,
    token,
    userID,
    authType,
    filter,
  }
} = action;
//console.log('+++++',action);
yield put(fetchBasedataListLoading(true));
let response;
  try{
    response = yield call(apiClient.post, gConfig.pathBasedataList, {
      params: {
        id: baseDataName,
        parentId: parentID,
        token: token,
        userId: userID,
        authType: authType,
        filter: filter,
      }
    });
    const {type,baseDataList} = response.result;
    if(type==='data' && baseDataList){
      yield put({
        type: types.FETCH_BASEDATA_LIST_SUCCESS,
        payload:response.result,
        meta:{
          name: baseDataName,
          parentID: parentID,
        }
      })
    }else{
      ////console.log('@@@',response.result);
      throw new Error(response.result.msg);
    }
  }catch(error){
    showError(error);
  }finally{
    yield put(fetchBasedataListLoading(false));
  }
}


function* handleFetchBasedataListMore(action){
  global.log('@@@@@@@@',action.payload);
  const {
    payload: {
      act,
      token,
    },
    meta: {
      baseDataName,
      parentID,
    }
  } = action;
  yield put(fetchBasedataListLoading(true));
  let response;
  try{
    response = yield call(apiClient.post, gConfig.pathBasedataList, {
      params: {
        act: act,
        token: token,
      }
    });
    const {type,baseDataList,more} = response.result;
    if(type==='data' && baseDataList){
        yield put({
          type: types.FETCH_BASEDATA_LIST_MORE_SUCCESS,
          payload:{
            more: more,
            baseDataList: baseDataList,
          },
          meta:{
            name: baseDataName,
            parentID: parentID,
          }
        })
    }else{
      //console.log('@@@',response.result);
      let msg = response.result.msg || '获取数据失败';
      throw new Error(msg);
    }
  }catch(error){
    showError(error);
  }finally{
    yield put(fetchBasedataListLoading(false));
  }
}

function* handleSearchBasedataList(action){
  const {
    payload: {
      baseDataName,
      parentID,
      token,
      authType,
      keyword,
    }
  } = action;
  //console.log('+++',action);
  yield put(fetchBasedataListLoading(true));
  let response;
    try{
      response = yield call(apiClient.post, gConfig.pathBasedataSearch, {
        params: {
          parentid: parentID,
          authType: authType,
          definename: baseDataName,
          token: token,
          keyword: keyword,
        }
      });
      //console.log('++++++',response.result);
      const {type,searchResult} = response.result;

      if(type==='data' && searchResult){
        yield put({
          type: types.SEARCH_BASEDATA_LIST_SUCCESS,
          payload:response.result,
          meta:{
            name: baseDataName,
            parentID: parentID,
          }
        })
      }else{
        //console.log('@@@',response.result);
        throw new Error(response.result.message);
      }
    }catch(error){
      showError(error);
    }finally{
      yield put(fetchBasedataListLoading(false));
    }
}

function* handleSearchBasedataListMore(action){
  //console.log('@@@@@@@@',action.payload);
  const {
    payload: {
      act,
      token,
    },
    meta: {
      baseDataName,
      parentID,
    }
  } = action;
  yield put(fetchBasedataListLoading(true));
  let response;
  try{
    response = yield call(apiClient.post, gConfig.pathBasedataSearch, {
      params: {
        act: act,
        token: token,
      }
    });
    const {type,more,searchResult} = response.result;
    //global.log('基础资料搜索更多',response.result);
    if(type==='data' && searchResult){
        yield put({
          type: types.SEARCH_BASEDATA_LIST_MORE_SUCCESS,
          payload:{
            more: more,
            searchResult: searchResult,
          },
          meta:{
            name: baseDataName,
            parentID:parentID,
          }
        })
    }else{
      //console.log('@@@',response.result);
      let msg = response.result.message || '获取数据失败';
      throw new Error(message);
    }
  }catch(error){
    showError(error);
  }finally{
    yield put(fetchBasedataListLoading(false));
  }
} 

export function* watchBasedata() {
  yield all([
    takeLatest(types.FETCH_BASEDATA_DEFINE, handleFetchBasedataDefine),
    takeLatest(types.FETCH_BASEDATA_LIST, handleFetchBasedataList),
    takeLatest(types.FETCH_BASEDATA_LIST_MORE, handleFetchBasedataListMore),
    takeLatest(types.SEARCH_BASEDATA_LIST,handleSearchBasedataList),
    takeLatest(types.SEARCH_BASEDATA_LIST_MORE,handleSearchBasedataListMore),
  ]);
}