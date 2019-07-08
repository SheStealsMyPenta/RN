import * as types from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  loading:false,
  baseDataDefine:{
    /*
    [baseDataName]: {
      id,
      title
    }
    */ 
  },
  list:{
    /*
    [baseDataName]: {
      hasMore: false,
      length: 0,
      data: [] //无层级，通过parentID+baseDataName来检索
    }
    */
  },
  search:{
    /*
    [baseDataName]:{
      hasMore: false,
      length: 0,
      data: [] 
    }
    */
  },
}

function handleFetchBasedataDefineSuccess(state, action){
  
  let { id,title,name } = action.payload;
  if (state.baseDataDefine[name]) return state;
  let baseDataDefine = Object.assign({},state.baseDataDefine,{
    [name]:{
      id:id,
      title:title,
    }})
  return Object.assign({}, state, {baseDataDefine});
}

function handleFetchBasedataListSuccess(state, action){
  let { payload:{ more, length, baseDataList }, meta:{ name, parentID } } = action;
  
  let tmp = baseDataList.map(itemObj=>{
    itemObj.parentID = parentID;
    return itemObj;
  });
  /* if(state.list[name]){
    const ids = state.list[name].data.map(itemObj=>itemObj.base_data_id);
    const s = new Set(ids);
    const itemsToAdd = tmp.map(itemObj=>{
      if(!s.has(itemObj.base_data_id)){
        return itemObj;
      }
    });
    if(itemsToAdd.length>0){
      tmp = Array.from(new Set([...state.list[name].data,...itemsToAdd]));
    } 
  } */
  let list = Object.assign({},state.list,{
    [name]: {
      hasMore: more || false,
      length: length,
      data: tmp,
    }
  });
  return Object.assign({}, state, {
    list
  });
}

function handleFetchBasedataListLoading(state,action){
  let {loading} = action.payload;
  return Object.assign({},state,{
    loading: loading
  });
}

function handleFetchBasedataListMoreSuccess(state,action){
  let {
    more,
    baseDataList,
  } = action.payload;
  let { name, parentID } = action.meta;
  const { length }  = state.list[name];
  let tmp = baseDataList.map(itemObj=>{
    itemObj.parentID = parentID;
    return itemObj;
  });
  let data = Array.from(new Set([...state.list[name].data,...tmp]));
  let listByName = Object.assign({}, state.list, {
    [name]: {
      hasMore: more || false,
      data: data,
      length: length,
    }
  })
  return Object.assign({},state,{ list:listByName });
}

function handleSearchBasedataListSuccess(state, action){
  let { more, length, searchResult} = action.payload;
  let { name, parentID } = action.meta;
  let data = searchResult.map(itemObj=>{
    itemObj.parentID = parentID;
    return itemObj;
  });
  let search = Object.assign({}, state.search, {
    [name]: {
      hasMore: more || false,
      length: length,
      data: data,
    }
  })
  return Object.assign({}, state, {
    search
  });
}

function handleSearchBasedataListMoreSuccess(state,action){
  const {
    more,
    searchResult,
  } = action.payload;
  const { name, parentID } = action.meta;
  const { length } = state.search[name];
  let tmp = searchResult.map(itemObj=>{
    itemObj.parentID = parentID;
    return itemObj;
  })
  let data = Array.from(new Set([...state.search[name].data,...tmp]));
  let searchByName = Object.assign({}, state.search, {
    [name]: {
      hasMore: more || false,
      data: data,
      length: length,
    }
  });
  //global.log('fetchListMore',data,searchByName);
  return Object.assign({},state,{ search: searchByName });
}

function handleClearBasedata(state,action){
  return Object.assign({},state,initialState);
}

function handleClearBasedataList(state,action){
  return Object.assign({},state,{
    hasMore: true,
    length:0,
    baseDataList: [],
    loading: false,
    //isFirstLoad: false
  });
}

function handleClearSearchBasedataResult(state,action){
  return Object.assign({},state,{
    search:{
      hasMore: true,
      length: 0,
      searchDataList:[]
    }
  })
}

export default function basedata(state = initialState, action) {
  //console.log('+++basedata reducer',action);
  switch(action.type){
    case types.FETCH_BASEDATA_DEFINE_SUCCESS:
      return handleFetchBasedataDefineSuccess(state,action);
    case types.FETCH_BASEDATA_LIST_SUCCESS:
      return handleFetchBasedataListSuccess(state,action);
    case types.FETCH_BASEDATA_LIST_LOADING:
      return handleFetchBasedataListLoading(state,action);
    case types.FETCH_BASEDATA_LIST_MORE_SUCCESS:
      return handleFetchBasedataListMoreSuccess(state,action);
    case types.SEARCH_BASEDATA_LIST_SUCCESS:
      return handleSearchBasedataListSuccess(state,action);
    case types.SEARCH_BASEDATA_LIST_MORE_SUCCESS:
      return handleSearchBasedataListMoreSuccess(state,action);
    case types.CLEAR_BASEDATA:
      return handleClearBasedata(state,action);
    case types.CLEAR_BASEDATA_LIST:
      return handleClearBasedataList(state,action);
    case types.CLEAR_SEARCH_BASEDATA_RESULT:
      return handleClearSearchBasedataResult(state,action);
    default:
      return state;
  };
}

