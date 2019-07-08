import axios from 'axios';
import { Buffer } from 'buffer';
import iconv from 'iconv-lite';
import _ from 'lodash';
import gConfig from '../constants/Config';
import ErrorInfo, { errorCode } from './ErrorInfo';

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    global.log('*****httpRequestData*****', config);
    return config;
  },
  function(error) {
    // Do something with request error
    global.log('*****httpRequestError*****', error);
    return Promise.reject(error);
  }
);

/*function getQueryString(params = {}, encoder = JSON.stringify) {
  return Object.keys(params)
    .map(key =>
      //[key, params[key] && !_.isString(params[key]) ? encoder(params[key]) : params[key]]
      [
        key,
        params[key] && !_.isString(params[key]) ? iconv.encode(encoder(params[key]), 'gbk').toString() : params[key]
      ]
        .map(encodeURIComponent)
        .join('=')
    )
    .join('&');
}*/

function getQueryString(params, encoder = JSON.stringify) {
  if (!params) return;
  return Object.keys(params)
    .map(key =>
      [
        key,
        params[key] && !_.isString(params[key])
          ? encoder(params[key])
          : params[key]
        //params[key] && _.isString(params[key]) ? params[key] : iconv.encode(encoder(params[key]), 'gbk')
      ]
        .map((value, key) => {
          //console.log('before encodeURIComponent ', value);
          return encodeURIComponent(value);
        })
        .join('=')
    )
    .join('&');
}

export class ApiClient {
  constructor(passedConfig) {
    const baseConfig = {
      bodyEncoder: JSON.stringify,
      credentials: 'same-origin',
      //responseType: 'json',
      responseType: 'arraybuffer',
      maxContentLength: 2000000,
      timeout: 20000,
      headers: {
        Accept: 'application/json',
        //'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      methods: ['get', 'post', 'put', 'patch', 'delete']
    };

    /* if (!passedConfig.basePath) {
      // e.g. 'https://example.com/api/v3'
      throw new ErrorInfo(errorCode.ERROR_ARGUMENT, 'ApiClient必须指定basePath字段');
    } */

    const methods = passedConfig ? passedConfig.methods : baseConfig.methods;
    methods.forEach(method => {
      this[method] = (
        path,
        { params, data, fetchConfig } = {
          params: {},
          data: null,
          fetchConfig: {}
        }
      ) => {
        const config = {
          ...baseConfig,
          ...passedConfig,
          ...fetchConfig,
          headers: {
            ...baseConfig.headers,
            ...(passedConfig ? passedConfig.headers : {}),
            ...(fetchConfig ? fetchConfig.headers : {})
          }
        };
        const {
          methods: _methods,
          basePath,
          headers,
          responseType,
          bodyEncoder,
          ...otherConfig
        } = config;
        //const url = basePath + path;
        console.log('ApiClient:', global.server);
        const extUrl = fetchConfig ? fetchConfig.url : null;
        const url = extUrl || global.server + path;
        const body = getQueryString(data);
        //global.log('apiclient',url);
        return axios
          .request({
            ...otherConfig,
            url,
            method,
            headers,
            responseType,
            params: params || {},
            data: body
          })
          .then(
            response => {
              let data = iconv.decode(new Buffer(response.data), 'gbk');
              global.log('*****httpResponseData*****', data);
              try {
                return JSON.parse(data);
              } catch (e) {
                global.log('netErrorInfo:', url, params, data);
                throw new ErrorInfo(
                  errorCode.ERROR_PARSE_JSON,
                  '返回的数据不是JSON格式',
                  response.data
                );
              }
            },
            function(e) {
              global.log('*****httpResponseError*****', e);
              if (e.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw new ErrorInfo(
                  errorCode.ERROR_NETWORK_RSP,
                  '网络请求返回出错:' + e.response.status,
                  e.response
                );
              } else if (e.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                throw new ErrorInfo(
                  errorCode.ERROR_NETWORK_REQ,
                  '网络请求出错:' + e.request.status,
                  e.request
                );
              } else {
                // Something happened in setting up the request that triggered an Error
                throw new ErrorInfo(
                  errorCode.ERROR_NETWORK_SETUP,
                  '网络请求配置不正确',
                  e
                );
              }
            }
          );
      };
    });
  }
}

//export default new ApiClient({ basePath: gConfig.defaultServer });
//export default getApiClient();
export default new ApiClient();
