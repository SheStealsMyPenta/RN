import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import base64 from 'base64-js';
import _ from 'lodash';
import RNFS from 'react-native-fs';

import gStyles from '../../constants/Styles';
import PageWrapper from '../../components/PageWrapper';
import PageContent from '../../components/PageContent';
import PageFooter from '../../components/PageFooter';
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView';
import Signature from '../../components/Signature';
import Button from '../../components/Button';
import FileOpener from '../../components/FileOpener';
import FileUploader from '../../components/FileUploader';
import {
  showToast,
  hideToast,
  isImage,
  generateRandomAlphaNum,
  getFileNameFromPath,
  uploadFile,
  readFileBase64
} from '../../utils/Helper';
import {
  STEP_INITIAL,
  STEP_SAVED,
  STEP_SUBMITTED,
  STEP_USERS
} from '../../constants/Constants';
import ChooseUserMulti from '../ChooseUserMulti';

import * as FormHelper from '../../utils/FormHelper';
import EditorFragment from './EditorFragment';

class FormEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signatureVisible: false,
      users: [],
      dataMaster: null,
      dataDetail: null,
      dataAttach: null
    };
  }

  componentWillMount() {
    const { navigation, token, actions } = this.props;

    if (navigation.state.params) {
      const { type, defineID, dataID } = navigation.state.params;
      let billType = 'bill'; //新建或编辑单据都仅限于报销单据
      if (type == 'saved') {
        actions.resetReimbEditor(STEP_SAVED);
      } else {
        actions.resetReimbEditor(STEP_INITIAL);
      }
      actions.fetchReimbEditorTemplate(token, defineID, dataID, billType);
    }

    navigation.setParams({
      onPrint: this.onPrint
    });
  }
  componentDidMount() {}
  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    const { navigation, token, reimb: { editor } } = nextProps;
    if (!editor.inited) return;

    if (!this.props.reimb.editor.inited) {
      let dataDetail = FormHelper.getDataDetailDataInfo(editor.data);
      for (var i in dataDetail) {
        // 初始化数据
        dataDetail[i].rowDataes.collections.push(
          FormHelper.getDefaultDetailData(
            generateRandomAlphaNum(32),
            dataDetail[i].defaultValue,
            0
          )
        );
      }

      this.setState({
        billId: FormHelper.getDataBillID(editor.data),
        functionId: FormHelper.getDataFunctionID(editor.data),
        dataMaster: FormHelper.getDataMasterDataInfo(editor.data),
        dataDetail: FormHelper.getDataDetailDataInfo(editor.data),
        dataAttach: FormHelper.getDataAttachments(editor.data)
      });

      // 获取数据成功，需要设置表单标题
      navigation.setParams({
        title: editor.template._info.title
      });
    }

    switch (editor.step) {
      case STEP_USERS: {
        let users = editor.users.nodes[0].users;
        this.setState({
          users: users
        });
        break;
      }
      case STEP_SAVED: {
        let files = FormHelper.filterUnsavedAttachments(this.state.dataAttach);
        if (files.length > 0) {
          this.fileUploaderRef.startUpload(
            token,
            this.state.dataMaster.id,
            files
          );
        }
        break;
      }
      case STEP_SUBMITTED: {
        navigation.goBack();

        break;
      }
    }
  }

  onPrint = () => {
    const { navigation, token, actions, reimb: { editor }, user } = this.props;

    let btnSetting = FormHelper.getFormButtonSetting(editor.data);
    if (!btnSetting.btn_export_Visible) {
      showToast('该单据不支持打印哦');
      return;
    }

    showToast('正在获取打印内容...', 0);
    FormHelper.getDataForPrinter(
      editor.template,
      editor.data,
      user.autographimgID,
      (status, result) => {
        hideToast();
        if (status == 'success') {
          navigation.navigate('FormPreviewer', { previewData: result });
        } else {
          showToast('获取打印内容失败');
        }
      }
    );
  };

  openSignature = () => {
    this.setState({
      signatureVisible: true
    });
  };

  closeSignature = () => {
    this.setState({
      signatureVisible: false
    });
  };

  onSave = () => {
    const { token, actions, reimb: { editor } } = this.props;
    actions.saveReimbEditorData(token, editor.data._info);
  };

  onSignatureSave = signature => {
    console.log('保存签名为附件', signature);
    this.closeSignature();
    this.onAddAttachments([
      {
        name: getFileNameFromPath(signature.pathName),
        path: signature.pathName,
        size: signature.encoded.length
      }
    ]);
  };

  onModify = () => {
    global.log('onModify');
  };

  onSubmit = () => {
    const { token, actions, reimb: { editor } } = this.props;

    if (editor.step == STEP_INITIAL) {
      showToast('请先保存表单！');
      return;
    }

    actions.submitEditor(token, this.state.billId, this.state.dataMaster.id);
  };

  onFilesUploadedSuccessfully = () => {
    FormHelper.markAttachmentsSaved(this.state.dataAttach);
    /*
    const { navigation } = this.props;
    showToast('文件上传完毕，提交成功');
    navigation.goBack();
    */
  };

  // 选择用户结束
  onSubmitUsersEnd = value => {
    const { navigation, token, actions, reimb: { editor } } = this.props;

    let data = _.cloneDeep(editor.users);
    data.nodes[0].users = value.items;

    actions.submitEditorUsers(
      token,
      this.state.billId,
      this.state.dataMaster.id,
      data
    );
  };

  onSignature = () => {
    this.openSignature();
  };

  getDriveFields = () => {
    let dataMaster = this.state.dataMaster,
      dataDetail = this.state.dataDetail,
      driveFields = {
        bill_id: this.state.billId,
        master_data: {
          id: dataMaster.id,
          fields: {}
        },
        table_name: dataMaster.tableName,
        editableFieldNames: [],
        editable: dataMaster.editable,
        detail_dataes: []
      };

    let rowData = dataMaster.rowData;
    for (let i in rowData) {
      // 处理主表字段
      let { fieldConstraint } = rowData[i];
      if (
        fieldConstraint &&
        fieldConstraint.events &&
        fieldConstraint.events[0].type == 'InputValueChanged'
      ) {
        driveFields.master_data.fields[i] = rowData[i];
      }
    }

    //console.log('getDriveFields', dataDetail);
    for (let i in dataDetail) {
      // 处理每一个子表
      let rowDataes = dataDetail[i].rowDataes,
        data = {
          table_name: dataDetail[i].tableName,
          editableFieldNames: [],
          row_dataes: {
            total: rowDataes.total,
            collections: []
          }
        },
        srcCollections = rowDataes.collections,
        dstCollections = data.row_dataes.collections;

      for (let j in srcCollections) {
        //处理子表的每一个单独的数据
        let srcCollection = srcCollections[j],
          srcFields = srcCollection.fields,
          dstCollection = {
            id: srcCollection.id,
            fields: {}
          };

        for (var k in srcFields) {
          // 过滤子表数据中的字段，只选择具有公式触发的字段
          let { fieldConstraint } = srcFields[k];
          if (
            fieldConstraint &&
            fieldConstraint.events &&
            fieldConstraint.events[0].type == 'InputValueChanged'
          ) {
            dstCollection.fields[k] = srcFields[k];
          }
        }

        dstCollections.push(dstCollection); // 添加子表的每一行数据
      }
      driveFields.detail_dataes.push(data); // 添加子表的所有数据
    }

    return driveFields;
  };

  triggerFormula = (type, tableName, order, prop, newVal) => {
    const { token, actions } = this.props;
    const { fieldConstraint, fieldName } = prop;

    //console.log('triggerFormula', type, tableName, order, prop, newVal);
    //console.log(fieldConstraint);
    if (
      !fieldConstraint ||
      !fieldConstraint.events ||
      fieldConstraint.events[0].type != 'InputValueChanged'
    ) {
      return false; // 不需要触发公式
    }

    //console.log('triggerFormula ***need triggerFormula***');
    let formulaData = {
      billId: this.state.billId,
      changedFields: null,
      driveFields: null
    };

    let rowId, newValue, oldValue;
    switch (type) {
      case 'master': {
        rowId = this.state.dataMaster.id;
        oldValue = this.state.dataMaster.rowData[fieldName];

        break;
      }
      case 'detail': {
        let dataDetail = this.state.dataDetail,
          tableInfo = null;

        for (var i in dataDetail) {
          if (dataDetail[i].tableName == tableName) {
            tableInfo = dataDetail[i];
            break;
          }
        }
        if (!tableInfo) break;

        rowId = tableInfo.rowDataes.collections[order].id;
        oldValue = tableInfo.rowDataes.collections[order].fields[fieldName];

        break;
      }
    }
    if (!rowId || !oldValue) return false;

    newValue = _.cloneDeep(oldValue);
    FormHelper.updateFieldValue(newValue, newVal);

    formulaData.changedFields = [
      {
        rowId,
        tableName: tableName,
        fieldName: prop.fieldName,
        oldValue,
        newValue
      }
    ];
    formulaData.driveFields = this.getDriveFields();

    //console.log('triggerFormula formulaData', JSON.stringify(formulaData));

    actions.fetchReimbEditorFormula(
      token,
      null,
      this.props.navigation.state.params.id,
      formulaData
    );

    return true;
  };

  onAddSubForm = tableName => {
    let dataDetail = this.state.dataDetail,
      subForm = null;

    //console.log(tableName, dataDetail);

    for (var i in dataDetail) {
      if (dataDetail[i].tableName == tableName) {
        subForm = dataDetail[i];
        break;
      }
    }

    if (!subForm) return;

    subForm.rowDataes.collections.push(
      FormHelper.getDefaultDetailData(
        generateRandomAlphaNum(32),
        subForm.defaultValue,
        subForm.rowDataes.collections.length
      )
    );

    this.setState({
      dataDetail: dataDetail
    });
  };

  onDelSubForm = (tableName, order) => {
    let dataDetail = this.state.dataDetail,
      subForm = null;

    //console.log(tableName, dataDetail);

    for (var i in dataDetail) {
      if (dataDetail[i].tableName == tableName) {
        subForm = dataDetail[i];
        break;
      }
    }

    if (!subForm) return;

    _.remove(subForm.rowDataes.collections, (value, index) => {
      if (index == order) {
        return true;
      }
    });

    this.setState({
      //dataDetail: dataDetail
    });
  };

  onAddAttachments = files => {
    console.log(files);
    //let newAtts = [...this.state.dataAttach];
    let recid,
      newAtts = this.state.dataAttach;
    for (let i in files) {
      recid = generateRandomAlphaNum(32);
      newAtts.push({
        enclosuretype: 0,
        recid: recid,
        enclosuresize: files[i].size, //附件大小
        isbillsave: 0, //附件保存标识，新添加条目时为0，单据保存成功能为1（服务器端自动更新为1）；
        enclosurename: files[i].name,
        billid: this.state.dataMaster.id,
        _localpath: files[i].path // 本地路径，上传或者打开文件的时候用
      });
    }

    this.setState({
      //dataAttach: newAtts
    });
  };

  onDeleteAttachment = (type, order) => {
    let atts = this.state.dataAttach,
      attIndex = -1,
      typeIndex = -1;

    for (var i in atts) {
      //if (type == 'image' ? isImage(atts[i].enclosurename) : !isImage(atts[i].enclosurename)) {
      typeIndex += 1;
      if (typeIndex == order) {
        attIndex = i;
        break;
      }
      //}
    }

    if (attIndex != -1) {
      _.remove(atts, (value, index) => {
        if (index == attIndex) return true;
      });
    }
    this.setState({ dataAttach: atts });
  };

  onValueChange = (type, tableName, order, prop, newVal) => {
    //console.log('********2', type, tableName, prop, newVal);
    const { fieldName } = prop;

    switch (type) {
      case 'master': {
        if (!this.triggerFormula(type, tableName, order, prop, newVal)) {
          FormHelper.updateFieldValue(
            this.state.dataMaster.rowData[fieldName],
            newVal
          );
          this.setState({});
        }
        break;
      }
      case 'detail': {
        let dataDetail = this.state.dataDetail,
          tableInfo = null;

        for (var i in dataDetail) {
          if (dataDetail[i].tableName == tableName) {
            tableInfo = dataDetail[i];
            break;
          }
        }
        if (!tableInfo) return;

        //console.log('onValueChange', tableInfo.rowDataes.collections[order]);
        if (!this.triggerFormula(type, tableName, order, prop, newVal)) {
          FormHelper.updateFieldValue(
            tableInfo.rowDataes.collections[order].fields[fieldName],
            newVal
          );
          this.setState({});
        }

        break;
      }
      default:
    }
  };

  onAttachmentClick = att => {
    this.fileOpenerRef.open(
      att.name,
      att.isbillsave ? att.id : att.path,
      att.isbillsave
    );
  };

  renderContent = editor => {
    let formTemplate = editor.template,
      formData = editor.data;

    /*console.log('#####', FormHelper.getTemplateMasterRowsInfo(formTemplate));
    console.log('#####', FormHelper.getTemplateDetailRowsInfo(formTemplate));
    console.log('#####', FormHelper.getDataMasterDataInfo(formData));
    console.log('#####', FormHelper.getDataDetailDataInfo(formData));*/

    return (
      <View>
        {this.state.dataMaster && (
          <EditorFragment
            onValueChange={this.onValueChange}
            key="master"
            type="master"
            template={FormHelper.getTemplateMasterRowsInfo(formTemplate)}
            data={this.state.dataMaster}
          />
        )}
        {this.state.dataDetail && (
          <EditorFragment
            onValueChange={this.onValueChange}
            onAddSubForm={this.onAddSubForm}
            onDelSubForm={this.onDelSubForm}
            key="detail"
            type="detail"
            template={FormHelper.getTemplateDetailRowsInfo(formTemplate)}
            data={this.state.dataDetail}
          />
        )}
        {this.state.dataAttach && (
          <EditorFragment
            onValueChange={this.onValueChange}
            onAttachmentDelete={this.onDeleteAttachment}
            onAddAttachments={this.onAddAttachments}
            key="attachment"
            type="attachment"
            template={null}
            data={this.state.dataAttach}
            onAttachmentClick={this.onAttachmentClick}
          />
        )}
      </View>
    );
  };

  render() {
    let { reimb: { editor } } = this.props;

    if (!editor.inited) {
      return <View />;
    }
    let btnSetting = FormHelper.getFormButtonSetting(editor.data);
    return (
      <PageWrapper>
        <FileOpener
          ref={ref => {
            this.fileOpenerRef = ref;
          }}
        />
        <FileUploader
          ref={ref => (this.fileUploaderRef = ref)}
          onError={() => {
            console.log('FileUploader error');
          }}
          onSuccess={this.onFilesUploadedSuccessfully}
        />
        <Signature
          visible={this.state.signatureVisible}
          onSaveEvent={this.onSignatureSave}
          requestCloseModal={this.closeSignature}
        />
        {editor.step == STEP_USERS && (
          <ChooseUserMulti
            isShowSuggest={false}
            isSelectUser={true}
            title={'选择用户'}
            visible={true}
            data={this.state.users}
            onChange={this.onSubmitUsersEnd}
            ref={ref => {
              this.chooseSubmitUserMultiRef = ref;
            }}
          />
        )}
        <KeyboardAvoidingView style={styles.container}>
          <PageContent>{editor && this.renderContent(editor)}</PageContent>
        </KeyboardAvoidingView>
        <PageFooter style={styles.footer}>
          {btnSetting.btn_save_Visible && (
            <Button
              containerStyle={styles.footerButtonContainer}
              style={styles.footerButton}
              icon={require('../../img/save.png')}
              text="保存"
              onPress={this.onSave}
              diabled={!btnSetting.btn_save_Enabled}
            />
          )}
          {btnSetting.btn_commit_Visible && (
            <Button
              containerStyle={styles.footerButtonContainer}
              style={styles.footerButton}
              icon={require('../../img/submit.png')}
              text="提交"
              onPress={this.onSubmit}
              diabled={!btnSetting.btn_commit_Enabled}
            />
          )}
          {btnSetting.btn_signature_Visible && (
            <Button
              containerStyle={styles.footerButtonContainer}
              style={styles.footerButton}
              icon={require('../../img/sign.png')}
              text="签字"
              onPress={this.onSignature}
              diabled={!btnSetting.btn_signature_Enabled}
            />
          )}
        </PageFooter>
      </PageWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50
  },
  footer: {
    justifyContent: 'space-around'
  },
  footerButtonContainer: {
    backgroundColor: gStyles.color.mColor,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 5
  },
  footerButton: {
    fontSize: 16,
    color: 'white'
  }
});

export default FormEditor;
