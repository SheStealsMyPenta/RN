import _ from 'lodash';
import { Platform } from 'react-native';
import gConfig from '../constants/Config';
import {
  generateRandomAlphaNum,
  openRemoteFile,
  openLocalFile,
  dateToDate2,
  dateToFullDateTime2,
  dateToFullDateTime3,
  readFileBase64,
  readRemoteImageBase64,
  showToast
} from './Helper';

export function getRemoteAttachmentPath(attachment) {
  return `${global.server}${gConfig.pathAttachmentService}${attachment}`;
}

export function getTemplateID(form) {
  return form._id; // 单据模型ID
}

export function getTemplateFunctionID(form) {
  return form._info._id; // 功能ID
}

export function getTemplateMasterRowsInfo(form) {
  return {
    rows: form._info.master_page.detail_template.table.rows,
    tableName: form._info.master_page.name,
    fields: form._info.master_page.mobile_talbe.mobile_fields.fields
  };
}

export function getTemplateDetailRowsInfo(form) {
  let detailPages = form._info.detail_pages;

  let rowsInfo = [];
  for (var i in detailPages) {
    let page = detailPages[i];
    rowsInfo.push({
      rows: page.detail_template.table.rows,
      tableName: page.name,
      fields: page.mobile_talbe.mobile_fields.fields
      //title: page.mobile_talbe.title,
    });
  }

  return rowsInfo;
}

export function getDataFunctionID(form) {
  return form._id; // 功能ID
}

export function getDataBillID(form) {
  return form._info.bill_id; // 功能ID
}

export function getDataAttachments(form) {
  return form._info.bill_enclosures;
}

export function getDataMasterDataInfo(form) {
  return {
    id: form._info.master_data.id,
    tableName: form._info.table_name,
    editable: form._info.editable,
    rowData: form._info.master_data.fields,
    editableFieldNames: form._info.editableFieldNames
  };
}

export function getDataDetailDataInfo(form) {
  let detailDataes = form._info.detail_dataes;
  let dataInfo = [];

  for (var i in detailDataes) {
    let data = detailDataes[i];
    dataInfo.push({
      tableName: data.table_name,
      editable: true,
      rowDataes: data.row_dataes,
      editableFieldNames: data.editableFieldNames,
      defaultValue: data.default_value
    });
  }

  return dataInfo;
}

export function getDefaultDetailData(id, defaultValue, index) {
  let defaultData = {
      id,
      fields: {}
    },
    defaultFields = defaultValue.fields,
    valueType;

  for (var key in defaultFields) {
    defaultData.fields[key] = Object.assign({}, defaultFields[key]);

    if (key == 'RECVER') {
      defaultData.fields[key].value = index;
      continue;
    }

    if (key == 'SORTORDER') {
      defaultData.fields[key].value = index + 1;
      continue;
    }

    valueType = defaultFields[key].valueType.toLowerCase();
    if (valueType == 'basedata_single' || valueType == 'basedata_multi') {
      defaultData.fields[key].value = _.cloneDeep(defaultFields[key].value);
    }
  }

  return defaultData;
}

// title格式为{#fieldName}
export function getInputFieldNameFromTitle(title) {
  if (!title || title.length < 4 || title[0] != '{') {
    return null;
  }

  //console.log('getFieldNameFromTitle', title.substring(2, title.length - 1));
  return title.substring(2, title.length - 1);
}

export function getFieldProp(type, tableName, template, data, fieldName) {
  let prop = {};
  switch (type) {
    case 'master':
      prop = data.rowData[fieldName];
      break;

    case 'detail': {
      for (let i in data) {
        if (data[i].tableName == tableName) {
          prop = data[i].defaultValue.fields[fieldName];
          break;
        }
      }
      break;
    }
  }

  return prop;
}

export function getFieldValue(field) {
  if (_.isNil(field))
    return 'error: field not found';
  if (_.isNil(field.value))
    return getTypeDefaultValue(field.valueType);

  return field.value;
}

export function updateFieldValue(field, newVal) {
  //console.log(field, newVal);
  let type = field.valueType && field.valueType.toLowerCase();
  switch (type) {
    case 'boolean':
    case 'string':
    case 'int':
    case 'numric':
    case 'numeric':
    case 'date':
    case 'datetime':
      field.value = _.clone(newVal);
      break;
    case 'basedata_single':
      if (newVal) {
        field.value.title = _.cloneDeep(newVal.title);
        field.value.value = _.cloneDeep(newVal.value);
      } else {
        field.value.title = [];
        field.value.value = [];
      }
      break;
    case 'basedata_multi':
      if (newVal) {
        field.value.title = _.cloneDeep(newVal.title);
        field.value.value = _.cloneDeep(newVal.value);
      } else {
        field.value.title = [];
        field.value.value = [];
      }
      break;
  }
}

// 删除子表的数据集中指定的数据，主要是公式触发返回时会用到
function deleteSubFormData(collections, deleteRECIDS) {
  for (let i in deleteRECIDS) {
    for (let j in collections) {
      if (collections[j].id == deleteRECIDS[i]) {
        _.unset(collections, j);
        break;
      }
    }
  }
}

// 添加数据到指定子表的数据集中，主要是公式触发会用到
function addFormulaSubForm(editor, tableName, collection) {
  let subForm = null;
  let dataDetail = getDataDetailDataInfo(editor.data);

  for (var i in dataDetail) {
    if (dataDetail[i].tableName == tableName) {
      subForm = dataDetail[i];
      break;
    }
  }

  if (!subForm) return;

  let subFormData = getDefaultDetailData(
      collection.id,
      subForm.defaultValue,
      1
    ),
    fields = collection.fields;

  //console.log('1844444444', editor, tableName, collection, subForm, subFormData);
  for (let key in fields) {
    updateFieldValue(subFormData.fields[key], fields[key].value);
  }

  subForm.rowDataes.collections.push(subFormData);
}

export function updateFormulaResultToEditor(editor, formula) {
  let m1 = getDataMasterDataInfo(editor.data), // 主表
    m2 = getDataMasterDataInfo(formula), // 公式触发返回的主表数据
    d1 = getDataDetailDataInfo(editor.data), // 子表
    d2 = getDataDetailDataInfo(formula); // 公式触发返回的子表数据

  // 更新主表字段
  let rowData = m2.rowData;
  for (let key in rowData) {
    //console.log('updateFormulaResultToEditor', m1.rowData[key], rowData[key].value);
    updateFieldValue(m1.rowData[key], rowData[key].value);
  }

  // 更新子表字段
  let collections1, collections2, deletedRECIDS;
  for (let i in d2) {
    collections1 = d1[i].rowDataes.collections; // 本地子表数据
    collections2 = d2[i].rowDataes.collections; // 公式触发返回的子表数据
    deleteRECIDS = d2[i].rowDataes.detail_delete_recids; // 公式触发返回的子表需要删除行

    // 先删除不需要的子表数据
    if (deleteRECIDS && deleteRECIDS.length > 0) {
      deleteSubFormData(collections1, deleteRECIDS);
    }

    for (let j in collections2) {
      let handled = false;
      let fields = collections2[j].fields;

      for (let m in collections1) {
        // 更新到表单
        if (collections1[m].id == collections2[j].id) {
          for (let key in fields) {
            updateFieldValue(collections1[m].fields[key], fields[key].value);
          }
          handled = true;
          break;
        }
      }

      if (!handled) {
        addFormulaSubForm(editor, d2[i].tableName, collections2[j]);
      }
    }
  }
}

export function filterUnsavedAttachments(attachments = []) {
  if (!attachments) return [];
  let files = attachments
    .filter(item => item._localpath != null && item.isbillsave == 0)
    .map(item => {
      return {
        id: item.recid,
        name: item.enclosurename,
        path: item._localpath
      };
    });

  return files;
}

export function markAttachmentsSaved(attachments = []) {
  for (let i in attachments) {
    attachments[i].isbillsave = 1;
  }
}

export function getTypeDefaultValue(type) {
  type = type && type.toLowerCase();
  switch (type) {
    case 'boolean':
      return false;
    case 'string':
      return '';
    case 'int':
    case 'numric':
    case 'numeric':
      return '';
    case 'date':
    case 'datetime':
      return '';
    //return new Date().getTime();

    case 'basedata_single':
    case 'basedata_multi':
      return { title: [], value: [] };
  }

  return '';
}

export function getReimbStateFromCategory(category) {
  let state = 0;
  switch (category) {
    case 'todo':
      state = '0';
      break;
    case 'doing':
      state = '1';
      break;
    case 'passed':
      state = '2';
      break;
    case 'rejected':
      state = '5';
      break;
    default:
  }

  return state;
}

function getSignaturesBase64(formData, callback = (status, result) => {}) {
  let result = [];
  let atts = formData._info.bill_enclosures;
  let signature = null;
  for (let i in atts) {
    //签名图片的名称满足一定的格式
    if (atts[i].enclosurename.search(/^签名图片\_\d{10}\.png$/) != -1) {
      signature = atts[i];
    }
  }
  if (signature) {
    readFileBase64(
      signature.enclosurename,
      signature.isbillsave ? signature.recid : signature._localpath,
      signature.isbillsave,
      (status, result) => {
        if (status == 'success') {
          callback(status, [result]);
        } else {
          callback(status, result);
        }
      }
    );
  } else {
    setTimeout(() => {
      callback('success', result);
    }, 0);
  }
}

// 返回打印数据，目前只支持现场收费表单
export function getDataForPrinter(
  formTemplate,
  formData,
  signatureImgID,
  callback = (status, result) => {}
) {
  let result = {
    //单据类型（准备用 单据类型+校飞地点+日期 作为打印pdf时的文件名）
    docTitle: '',
    customerName: '', // 所属单位
    airportName: '', // 校飞地点
    flightModel: '', //机型
    flightNo: '', // 机号
    dateStart: '', //校飞开始时间
    dateEnd: '', // 校飞结束时间
    captain: '', // 机长
    inspectors: [], //校验员
    durationHour: '', //飞行小时
    durationMinute: '', // 飞行分钟
    feeRate: '', //收费标准
    extraDurationHour1: '', //另有小时数（一）
    extraDurationMinute1: '', //另有分钟数（一）
    extraDurationFeeRate1: '', //另有加收费率（一）
    extraDurationHour2: '', //另有小时数（二）
    extraDurationMinute2: '', //另有分钟数（二）
    extraDurationFeeRate2: '', //另有加收费率（二）
    paymentAmountCN: '', //金额大写
    paymentAmount: '', //金额小写
    devices: [
      /*{
	type,设备类型
	sum,设备数量
	radioAddr,台址
	callCode,呼号
	inpectionType,校验类型
	isExtraFeeAdded，是否加收
}*/
    ],
    customerPaymentInfo: {
      /*付款方开票信息
	companyName,单位全称
	taxID,纳税识别号
	registerAddress,注册地址
	registerPhoneNum,注册电话
	bankBranch,开户银行
	bankAccount,银行账号
	address,通讯地址
	email,邮箱地址
  cellPhone，手机号码
  invoiceAddress, 邮寄地址
  */
    },
    signatureCus: '', //客户签名图片
    signatureEmp: '',
    invoiceNum: '',
  };
  let masterFields = getDataMasterDataInfo(formData).rowData;
  result.docTitle = `${formTemplate._info.title}-${getFieldValue(
    masterFields['AIRPORT_NAME']
  ).title[0] || ''}-${dateToFullDateTime3(new Date())}`;
  result.customerName = getFieldValue(masterFields['VSSDW']).title[0] || ''; // 所属单位
  result.airportName =
    getFieldValue(masterFields['AIRPORT_NAME']).title[0] || ''; // 校飞地点
  result.flightModel = getFieldValue(masterFields['VJX']); //机型
  result.flightNo = getFieldValue(masterFields['VJH']); // 机号

  result.dateStart = getFieldValue(masterFields['VKSJFRQ']); //校飞开始时间
  if (result.dateStart) {
    let tmpDate = new Date();
    tmpDate.setTime(result.dateStart);
    result.dateStart = dateToDate2(tmpDate);
  }

  result.dateEnd = getFieldValue(masterFields['VJSJFRQ']); // 校飞结束时间
  if (result.dateEnd) {
    let tmpDate = new Date();
    tmpDate.setTime(result.dateEnd);
    result.dateEnd = dateToDate2(tmpDate);
  }

  result.captain = getFieldValue(masterFields['VJZ']); // 机长
  result.inspectors = getFieldValue(masterFields['VJYY']); //校验员
  result.durationHour = getFieldValue(masterFields['VFXSJXS']); //飞行小时
  result.durationMinute = getFieldValue(masterFields['VFXSJFZ']); // 飞行分钟
  result.feeRate = getFieldValue(masterFields['VSFBZ']).title[0]; //收费标准
  result.extraDurationHour1 = getFieldValue(masterFields['VJBXS']); //另有小时数（一）
  result.extraDurationMinute1 = getFieldValue(masterFields['VJBFZ']); //另有分钟数（一）
  result.extraDurationFeeRate1 = getFieldValue(masterFields['VJBSFBL']); //另有加收费率（一）
  result.extraDurationHour2 = getFieldValue(masterFields['VJBXS1']); //另有小时数（二）
  result.extraDurationMinute2 = getFieldValue(masterFields['VJBFZ1']); //另有分钟数（二）
  result.extraDurationFeeRate2 = getFieldValue(masterFields['VJBSFBL1']); //另有加收费率（二）
  result.paymentAmountCN = getFieldValue(masterFields['VFKJEDX']); //金额大写
  result.paymentAmount = getFieldValue(masterFields['VFKJEXX']); //金额小写
  global.log('准备取客户付款信息');
  result.customerPaymentInfo = {
    companyName: getFieldValue(masterFields['VFKDWQC']), //单位全称
    taxID: getFieldValue(masterFields['VTAXNO']), //纳税识别号
    registerAddress: getFieldValue(masterFields['VFFDZ']), //注册地址
    registerPhoneNum: getFieldValue(masterFields['VDH']), //注册电话
    bankBranch: getFieldValue(masterFields['VFFKHYH']), //开户银行
    bankAccount: getFieldValue(masterFields['VFFZH']), //银行账号
    address: getFieldValue(masterFields['VXXTXDZ']), //通讯地址
    email: getFieldValue(masterFields['VEMAIL']), //邮箱地址
    cellPhone: getFieldValue(masterFields['VPHONE']), //手机号码
    invoiceAddress: getFieldValue(masterFields['VXXTXDZ']) //发票邮寄地址
  };
  global.log('主表字段',masterFields);
  result.invoiceNum = getFieldValue(masterFields['VINVOICE_NO']);

  let detailDatas = getDataDetailDataInfo(formData),
    devices = [];

  for (let i in detailDatas) {
    if (detailDatas[i].tableName != 'BG_KILLS_TASKDEVICE') continue;
    let collections = detailDatas[i].rowDataes.collections;

    for (let j in collections) {
      let detailFields = collections[j].fields;
      devices.push({
        type: getFieldValue(detailFields['DEVICEID']).title[0], //设备类型
        sum: getFieldValue(detailFields['DNUM']), //设备数量
        radioAddr: getFieldValue(detailFields['ADDR_NAME']), //台址
        callCode: getFieldValue(detailFields['CALLSIGN']), //呼号
        inpectionType:
          getFieldValue(detailFields['INSPECT_TYPE']).title[0] || '', //校验类型
        isExtraFeeAdded: getFieldValue(detailFields['INCREASE_CHARGE']) //是否加收
      });
      //console.log('第'+j+'次循环读取后device内容：',devices);
    }
    //console.log('传递预览数据',formData, masterFields, collections);
  }

  result.devices = devices;


  // 获得签名图片的base64内容，由于读取文件内容采用异步方式，本函数也需要采用异步方式
  const getSignatureCusAsPromise = (formData) =>
    new Promise((resolve, reject)=>{
      getSignaturesBase64(formData, (status,content) =>{
        status == 'success' ? resolve(content[0]) : reject('');
      });
  });

  const getSignatureEmpAsPromise = (signatureImgID) =>
    new Promise((resolve, reject)=>{
      readRemoteImageBase64(signatureImgID,(status,content)=>{
        status == 'success' ? resolve(content) : reject('');
      });
  });

  getSignatureCusAsPromise(formData).then((data)=>{
    global.log('cus resolved',data);
  })
  getSignatureEmpAsPromise(signatureImgID).then((data)=>{
    global.log('emp progress',data);
  }).then((data)=>{
    global.log('emp resolved',data);
  })

  Promise.all([getSignatureCusAsPromise(formData),getSignatureEmpAsPromise(signatureImgID)]).then((base64Images)=>{
    global.log('全部resolved',base64Images);
    result.signatureCus = `data:image/png;base64,${base64Images[0]}`;
    result.signatureEmp = `data:image/png;base64,${base64Images[1]}`;
    callback('success',result);
  });
}

export function openAttachment(att) {
  if (!att) return;

  switch (att.isbillsave) {
    case 0:
      openLocalFile(att.path, att.name);
      break;
    case 1:
      openRemoteFile(getRemoteAttachmentPath(att.id), att.name);
      break;
    default:
  }
}

export function getFormButtonSetting(form) {
  return form._info.bill_button_state;
}
