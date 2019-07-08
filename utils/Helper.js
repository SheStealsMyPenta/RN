import {
  NetInfo,
  Alert,
  ToastAndroid,
  Platform,
  NativeModules
} from 'react-native';
import { Toast } from 'antd-mobile';
import base64 from 'base64-js';
import { Buffer } from 'buffer';
import iconv from 'iconv-lite';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';

import gConfig from '../constants/Config';
import { getRemoteAttachmentPath } from './FormHelper';

const { FileOpener } = NativeModules;
const SavePath =
  Platform.OS === 'ios'
    ? `${RNFS.DocumentDirectoryPath}/Reimb`
    : `${
        RNFS.ExternalStorageDirectoryPath /*RNFS.ExternalDirectoryPath*/
      }/Reimb`;

export function registerGlobal({ onNetworkChange }) {
  if (onNetworkChange) {
    NetInfo.addEventListener('connectionChange', onNetworkChange);
    NetInfo.fetch().then(connectionInfo => {
      onNetworkChange(connectionInfo);
    });
  }
}

export function unregisterGlobal({ onNetworkChange }) {
  if (onNetworkChange) {
    NetInfo.removeEventListener('connectionChange', onNetworkChange);
  }
}

export function getFileRealPath(url) {
  console.log(decodeURIComponent(url));
  const split = decodeURIComponent(url).split('/');
  const name = split.pop();
  const inbox = split.pop();

  return `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
}

export function showToast(
  content,
  duration = '2',
  onClose = () => {},
  mask = false
) {
  Toast.info(content, duration, onClose, mask);
}

export function hideToast() {
  Toast.hide();
}

export function showShort(content, isAlert = false, title = '提示') {
  if (!content) {
    return;
  }
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert(title, content.toString());
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.SHORT);
  }
}

export function showLong(content, isAlert = false, title = '提示') {
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert(title, content.toString());
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.LONG);
  }
}

export function getResponseError(response) {
  return new Error(
    (response && response.result && response.result.msg) || '服务器返回数据出错'
  );
}

export function showError(error) {
  if (error && error.message) {
    showShort(error.message, true, '出错啦');
    return true;
  }

  return false;
}

export function getQueryString(params = {}) {
  return Object.keys(params)
    .map(key => [key, params[key]].map(encodeURIComponent).join('='))
    .join('&');
}

export function generateRandomAlphaNum(len) {
  len = len || 6;
  len = parseInt(len, 10);
  len = isNaN(len) ? 6 : len;
  var seed = '0123456789ABCDEF';
  var seedLen = seed.length - 1;
  var uuid = '';
  while (len--) {
    uuid += seed.charAt(Math.round(Math.random() * seedLen));
  }
  return uuid;
}

/*
export function generateRandomAlphaNum(len) {
  var rdmString = '';
  for (
    len = len;
    rdmString.length < len;
    rdmString += Math.random()
      .toString(36)
      .substr(2)
  );
  return rdmString.substr(0, len);
}
*/

export function isDefine(value) {
  if (
    value === null ||
    value === '' ||
    value === 'undefined' ||
    value === undefined ||
    value === 'null' ||
    value === '(null)' ||
    value === 'NULL' ||
    typeof value === 'undefined'
  ) {
    return false;
  } else {
    value += '';
    value = value.replace(/\s/g, '');
    if (value === '') {
      return false;
    }
    return true;
  }
}

function fdt(n) {
  return n > 9 ? n : '0' + n;
}

export function dateToTime(date) {
  return `${fdt(date.getHours())}:${fdt(date.getMinutes())}:00`;
}

export function dateToDate(date) {
  return `${date.getFullYear()}/${fdt(date.getMonth() + 1)}/${fdt(
    date.getDate()
  )}`;
}

export function dateToDate2(date) {
  return `${date.getFullYear()}年${fdt(date.getMonth() + 1)}月${fdt(
    date.getDate()
  )}日`;
}

export function dateToFullDateTime(date) {
  return `${date.getFullYear()}/${fdt(date.getMonth() + 1)}/${fdt(
    date.getDate()
  )} ${fdt(date.getHours())}:${fdt(date.getMinutes())}:00`;
}

export function dateToFullDateTime2(date) {
  return `${date.getFullYear()}年${fdt(date.getMonth() + 1)}月${fdt(
    date.getDate()
  )}日 ${fdt(date.getHours())}:${fdt(date.getMinutes())}`;
}

export function dateToFullDateTime3(date) {
  return `${date.getFullYear()}${fdt(date.getMonth() + 1)}${fdt(
    date.getDate()
  )}${fdt(date.getHours())}${fdt(date.getMinutes())}${date.getSeconds()}`;
}

export function getFileNameFromPath(filePath) {
  if (!filePath || filePath.length == 0) return;

  let pos = filePath.lastIndexOf('/');
  return filePath.substring(pos + 1);
}

// 取得文件的扩展名
export function getFileExt(name) {
  let ext = name,
    dot = name.lastIndexOf('.');
  if (dot >= 0) {
    ext = name.substring(dot);
  }

  return ext;
}

// 获取文件对应的类型图片
export function getFileImage(name, large = false) {
  var ext = getFileExt(name).toLowerCase();
  switch (ext) {
    case '.pdf':
      return large ? require('../img/public.png') : require('../img/pdf.png');
    case '.doc':
    case '.docx':
    case '.wps':
      return large ? require('../img/public.png') : require('../img/word.png');
    case '.xls':
    case '.xlsx':
      return large ? require('../img/public.png') : require('../img/excel.png');
    case '.ppt':
    case '.pptx':
    case '.pptm':
      return large ? require('../img/public.png') : require('../img/ppt.png');
    case '.png':
    case '.jpg':
    case '.gif':
      return large
        ? require('../img/public.png')
        : require('../img/graphic.png');
    default:
      return large
        ? require('../img/public.png')
        : require('../img/public.png');
  }
}

// 获取文件大小描述，B/KB/MB/GB
export function getSizeDescribe(size) {
  size = Number(size);
  if (size < 1024) {
    return size + 'B';
  } else if (size < 1024 * 1024) {
    return Math.round(size * 10 / 1024) / 10 + 'KB';
  } else if (size < 1024 * 1024 * 1024) {
    return Math.round(size * 10 / (1024 * 1024)) / 10 + 'MB';
  } else {
    return Math.round(size * 10 / (1024 * 1024 * 1024)) / 10 + 'GB';
  }
}

export function isImage(name) {
  var ext = getFileExt(name).toLowerCase();
  return ext.search(/^\.png$|^\.jpg$|^\.gif$/) != -1;
}

export function getRemoteImagePath(imageID) {
  return `${global.server}${gConfig.pathImageService}${imageID}`;
}

export function getUploadServerPath(token, billId, billEnclosureId) {
  return `${global.server}${
    gConfig.pathSaveBillEnclosure
  }?token=${token}&bill_id=${billId}&bill_enclosure_id=${billEnclosureId}`;
}

export function openCamera(cb = (type, data) => {}) {
  ImagePicker.openCamera({
    cropping: false
  })
    .then(image => {
      console.log('imagesimagesimages', image);
      cb('success', [
        {
          name: image.filename || getFileNameFromPath(image.path),
          path: image.path,
          size: image.size
        }
      ]);
    })
    .catch(e => {
      cb('error');
    });
}

export function selectImages(cb = (type, data) => {}) {
  ImagePicker.openPicker({
    cropping: false,
    multiple: true
  })
    .then(images => {
      console.log('imagesimagesimages', images);
      cb(
        'success',
        images.map(item => ({
          name: item.filename || getFileNameFromPath(item.path),
          path: item.path,
          size: item.size
        }))
      );
    })
    .catch(e => {
      cb('error');
    });
}

// 按base64编码读取远程服务器图片
// 用于读取员工的签名图片
export function readRemoteImageBase64(imageID, callback = () => {}) {
  if(imageID){
    downloadFile(imageID, getRemoteImagePath(imageID), (status, result) => {
      switch (status) {
        case 'success':
          readLocalFileBase64(result, callback);
          break;
        case 'error':
          callback('success', result);
          break;
      }
    });
  } else {
    callback('success','');
  }
}

// 按base64编码读取文件内容，一般用于读取小文件
// 文件可以为远程文件或者本地文件
export function readFileBase64(
  fileName,
  filePath,
  remote,
  callback = () => {}
) {
  if (remote) {
    downloadFile(
      fileName,
      getRemoteAttachmentPath(filePath),
      (status, result) => {
        switch (status) {
          case 'success':
            readLocalFileBase64(result, callback);
            break;
          case 'error':
            callback(status, result);
            break;
        }
      }
    );
  } else {
    readLocalFileBase64(filePath, callback);
  }
}

// 按base64编码读取本地文件内容，一般用于读取小文件
export function readLocalFileBase64(filePath, callback = () => {}) {
  RNFS.readFile(filePath, 'base64')
    .then(content => callback('success', content))
    .catch(err => {
      console.log(err);
      callback('error', filePath);
    });
}

export function downloadFile(fileName, filePath, callback = () => {}) {
  let task = RNFetchBlob.config({
    path: SavePath + '/' + fileName,
    fileCache: true
  }).fetch('GET', filePath, {
    //some headers ..
  });

  task
    .progress((received, total) => {
      //showToast(`正在打开...${Math.round(received / total * 100)}%`, 0);
      callback('progress', { received, total });
    })
    .then(res => {
      callback('success', res.path());
    })
    .catch(e => {
      console.log(e);
      callback('error', 0);
    });

  return task;
}

export function openRemoteFile(filePath, fileName, callback = () => {}) {
  return downloadFile(filePath, fileName, (status, result) => {
    switch (status) {
      case 'success':
        openLocalFile(result, fileName, callback);
        break;
      default:
        callback(status, result);
    }
  });
}

export function openLocalFile(filePath, fileName, callback = () => {}) {
  filePath =
    filePath.search(/^file:\/\//) != -1 ? filePath.substr(7) : filePath;
  FileOpener.open(filePath, getMIMEType(filePath), fileName).then(
    () => {
      callback('success', filePath);
    },
    e => {
      showToast('打开失败，请确认是否安装了对应的解析程序');
      console.log('error!!', filePath, e);
      callback('error', filePath);
    }
  );
}

export function uploadFile(
  token,
  billId,
  billEnclosureId,
  fileName,
  filePath,
  callback = () => {}
) {
  let task = RNFetchBlob.fetch(
    'POST',
    getUploadServerPath(token, billId, billEnclosureId),
    {
      'Content-Type': 'multipart/form-data',
      'RNFB-Response': 'base64'
    },
    [{ name: 'file', filename: fileName, data: RNFetchBlob.wrap(filePath) }]
  );

  task
    .uploadProgress((written, total) => {
      console.log('uploaded', written / total);
      callback('progress', { total, written });
    })
    .then(rsp => {
      let data = iconv.decode(
        new Buffer(base64.toByteArray(rsp.base64())),
        'gbk'
      );
      try {
        data = JSON.parse(data);

        if (data.result && data.result.result) {
          callback('success');
        } else {
          callback('error', new Error('文件上传失败'));
        }
      } catch (e) {
        callback('error', new Error('服务器返回数据类型不是JSON'));
      }
    })
    .catch(err => {
      console.log(err);
      callback('error', err);
    });

  return task;
}

const MIMES = {
  '.3gp': 'video/3gpp',
  '.apk': 'application/vnd.android.package-archive',
  '.asf': 'video/x-ms-asf',
  '.avi': 'video/x-msvideo',
  '.bin': 'application/octet-stream',
  '.bmp': 'image/bmp',
  '.c': 'text/plain',
  '.class': 'application/octet-stream',
  '.conf': 'text/plain',
  '.cpp': 'text/plain',
  '.doc': 'application/msword',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.exe': 'application/octet-stream',
  '.gif': 'image/gif',
  '.gtar': 'application/x-gtar',
  '.gz': 'application/x-gzip',
  '.h': 'text/plain',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.jar': 'application/java-archive',
  '.java': 'text/plain',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/x-javascript',
  '.log': 'text/plain',
  '.m3u': 'audio/x-mpegurl',
  '.m4a': 'audio/mp4a-latm',
  '.m4b': 'audio/mp4a-latm',
  '.m4p': 'audio/mp4a-latm',
  '.m4u': 'video/vnd.mpegurl',
  '.m4v': 'video/x-m4v',
  '.mov': 'video/quicktime',
  '.mp2': 'audio/x-mpeg',
  '.mp3': 'audio/x-mpeg',
  '.mp4': 'video/mp4',
  '.mpc': 'application/vnd.mpohun.certificate',
  '.mpe': 'video/mpeg',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.mpg4': 'video/mp4',
  '.mpga': 'audio/mpeg',
  '.msg': 'application/vnd.ms-outlook',
  '.ogg': 'audio/ogg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.pps': 'application/vnd.ms-powerpoint',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx':
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.prop': 'text/plain',
  '.rc': 'text/plain',
  '.rmvb': 'audio/x-pn-realaudio',
  '.rtf': 'application/rtf',
  '.sh': 'text/plain',
  '.tar': 'application/x-tar',
  '.tgz': 'application/x-compressed',
  '.txt': 'text/plain',
  '.wav': 'audio/x-wav',
  '.wma': 'audio/x-ms-wma',
  '.wmv': 'audio/x-ms-wmv',
  '.wps': 'application/vnd.ms-works',
  '.xml': 'text/plain',
  '.z': 'application/x-compress',
  '.zip': 'application/x-zip-compressed'
};

export function getMIMEType(file) {
  return MIMES[getFileExt(file).toLowerCase()] || '*/*';
}
