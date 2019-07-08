import React, { Component } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import _ from 'lodash';

import gStyles from '../../constants/Styles';
import PageWrapper from '../../components/PageWrapper';
import PageContent from '../../components/PageContent';
import PageFooter from '../../components/PageFooter';
import Button from '../../components/Button';
import FileOpener from '../../components/FileOpener';
import FileUploader from '../../components/FileUploader';
import {
  STEP_INITIAL,
  STEP_SAVED,
  STEP_AGREE_1,
  STEP_AGREE_2,
  STEP_DISAGREE_1,
  STEP_DISAGREE_2,
  STEP_USERS,
  STEP_SUBMITTED,
  STEP_DELETED
} from '../../constants/Constants';
import ViewFragment from './ViewFragment';
import { showShort, showToast, hideToast } from '../../utils/Helper';
import * as FormHelper from '../../utils/FormHelper';

import ChooseUserMulti from '../ChooseUserMulti';

class FormDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agree: {
        isShowSuggest: false,
        isSelectUser: false,
        users: []
      },
      disagree: {
        isShowSuggest: false,
        isSelectUser: false,
        users: []
      },
      submit: {
        users: []
      }
    };
  }

  componentWillMount() {
    const { token, actions, navigation, reimb: { detail } } = this.props;
    const { listItemID, defineID, dataID, type } = navigation.state.params;
    let billType = 'bill'; //表单类型为“报销”
    if (type !== 'reimb') {
      billType = 'tode'; //表单类型为“审批”，tode为适配服务器端拼写错误
    }
    //global.log('单据按钮类型',billType);
    actions.resetReimbDetail();
    actions.fetchReimbDetailTemplate(token, defineID, dataID, billType);
    navigation.setParams({
      onPrint: this.onPrint,
      onDelete: this.onDelete
    });
  }
  componentDidMount() {}
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {
    const { navigation, actions, reimb: { detail } } = nextProps;

    if (!detail.inited) return; // 数据未获取完毕，直接返回
    if (!this.props.reimb.detail.inited) {
      // 尚未初始化数据
      this.setState({
        billId: FormHelper.getDataBillID(detail.data),
        functionId: FormHelper.getDataFunctionID(detail.data),
        dataMaster: FormHelper.getDataMasterDataInfo(detail.data),
        dataDetail: FormHelper.getDataDetailDataInfo(detail.data),
        dataAttach: FormHelper.getDataAttachments(detail.data)
      });

      // 获取数据成功，需要设置表单标题
      navigation.setParams({
        title: detail.template._info.title
      });
    }

    if (detail.finished) return;

    switch (detail.step) {
      case STEP_USERS: {
        let users = detail.users.nodes[0].users;
        this.setState({
          submit: {
            users: users
          }
        });
        break;
      }
      case STEP_AGREE_1: {
        let users = [];
        if (detail.agree.isSelectUser) {
          users = detail.agree.nodes[0].users;
        }
        this.setState({
          agree: {
            isSelectUser: detail.agree.isSelectUser,
            isShowSuggest: detail.agree.isShowsuggest,
            users
          }
        });

        break;
      }

      case STEP_DISAGREE_1: {
        let users = [];
        if (detail.disagree.isSelectUser) {
          users = detail.disagree.nodes[0].users;
        }
        this.setState({
          disagree: {
            isSelectUser: detail.disagree.isSelectUser,
            isShowSuggest: detail.disagree.isShowsuggest,
            users
          }
        });
        break;
      }

      case STEP_AGREE_2:
      case STEP_DISAGREE_2:
      case STEP_DELETED:
      case STEP_SUBMITTED: {
        this.deleteListItem();
        navigation.goBack();
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
    }
  }

  deleteListItem = () => {
    const { navigation, actions } = this.props;
    const { type, listID, listItemID } = navigation.state.params;
    if (type == 'reimb') {
      actions.deleteReimbListItem(listID, listItemID);
    } else if (type == 'approval') {
      actions.deleteApprovalListItem(listID, listItemID);
    }

    actions.markDetailFinished();
  };

  onAdd = () => {
    global.log('onAdd');
  };

  onModify = () => {
    const { navigation } = this.props;
    const { defineID, dataID } = navigation.state.params;

    navigation.navigate('FormEditor', { type: 'saved', defineID, dataID });
  };

  onSubmit = () => {
    const { token, actions, reimb: { detail } } = this.props;
    actions.submitReimb(token, this.state.billId, this.state.dataMaster.id);
  };

  onFilesUploadedSuccessfully = () => {
    FormHelper.markAttachmentsSaved(this.state.dataAttach);
    /*
    const { navigation } = this.props;
    showToast('文件上传完毕，提交成功');
    this.deleteListItem();
    navigation.goBack();
    */
  };

  // 选择用户结束
  onSubmitUsersEnd = value => {
    const { navigation, token, actions, reimb: { detail } } = this.props;

    let data = _.cloneDeep(detail.users);
    data.nodes[0].users = value.items;

    actions.submitReimbUsers(
      token,
      this.state.billId,
      this.state.dataMaster.id,
      data
    );
  };

  onAgree = () => {
    const { navigation, token, actions } = this.props;
    const { listItemID } = navigation.state.params;

    actions.doApprovalAgree(token, listItemID);
  };

  onDisagree = () => {
    const { navigation, token, actions } = this.props;
    const { listItemID } = navigation.state.params;

    Alert.alert('', '确认驳回表单？', [
      {
        text: '取消',
        style: 'cancel'
      },
      {
        text: '确定',
        onPress: () => {
          actions.doApprovalDisagree(token, listItemID);
        }
      }
    ]);
  };

  onGetProcess = () => {
    const { actions, navigation } = this.props;
    const { defineID, dataID } = navigation.state.params;

    actions.resetApprovalProcess();
    navigation.navigate('ApprovalProcess', { defineID, dataID });
  };

  // 同意意见输入结束
  onAgreeEnd = value => {
    const { navigation, token, actions, reimb: { detail } } = this.props;
    const { listItemID } = navigation.state.params;

    let data = _.cloneDeep(detail.agree);

    data.alertMsg = value.msg;
    if (detail.agree.isSelectUser) {
      data.nodes[0].users = value.items;
    }

    actions.doApprovalAgreeData(token, listItemID, data);
  };

  onDisagreeEnd = value => {
    const { navigation, token, actions, reimb: { detail } } = this.props;
    const { listItemID } = navigation.state.params;

    let data = _.cloneDeep(detail.disagree);

    data.alertMsg = value.msg;
    if (detail.disagree.isSelectUser) {
      data.nodes[0].users = value.items;
    }

    actions.doApprovalDisagreeData(token, listItemID, data);
  };

  onDelete = () => {
    const { token, actions, reimb: { detail } } = this.props;
    let btnSetting = FormHelper.getFormButtonSetting(detail.data);
    if (!btnSetting.btn_delete_Visible) {
      showToast('已提交单据不可删除');
      return;
    }
    Alert.alert('', '确认删除表单？', [
      {
        text: '取消',
        style: 'cancel'
      },
      {
        text: '确定',
        onPress: () => {
          actions.deleteReimb(
            token,
            this.state.billId,
            this.state.dataMaster.id
          );
        }
      }
    ]);
  };

  onPrint = () => {
    const { navigation, token, actions, reimb: { detail }, user } = this.props;

    let btnSetting = FormHelper.getFormButtonSetting(detail.data);
    if (!btnSetting.btn_export_Visible) {
      showToast('该单据不支持打印哦');
      return;
    }

    showToast('正在获取打印内容...', 0);
    FormHelper.getDataForPrinter(
      detail.template,
      detail.data,
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

  onAttachmentClick = att => {
    this.fileOpenerRef.open(
      att.name,
      att.isbillsave ? att.id : att.path,
      att.isbillsave
    );
  };

  renderContent = content => {
    let formTemplate = content.template,
      formData = content.data;

    return (
      <View>
        {this.state.dataMaster && (
          <ViewFragment
            key="master"
            type="master"
            template={FormHelper.getTemplateMasterRowsInfo(formTemplate)}
            data={this.state.dataMaster}
          />
        )}
        {this.state.dataDetail && (
          <ViewFragment
            key="detail"
            type="detail"
            template={FormHelper.getTemplateDetailRowsInfo(formTemplate)}
            data={this.state.dataDetail}
          />
        )}
        {this.state.dataAttach && (
          <ViewFragment
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

  renderReimbFooter = () => {
    const btnSettings = FormHelper.getFormButtonSetting(
      this.props.reimb.detail.data
    );
    return (
      <PageFooter style={styles.footer}>
        {/*
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            icon={require('../../img/add_square.png')}
            text="新增"
            onPress={this.onAdd}
          />
          */}
        {btnSettings.btn_monitor_Visible && (
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            text="轨迹"
            onPress={this.onGetProcess}
            disabled={!btnSettings.btn_monitor_Enabled}
          />
        )}
        {btnSettings.btn_edit_Visible && (
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            icon={require('../../img/modify.png')}
            text="修改"
            onPress={this.onModify}
            disabled={!btnSettings.btn_edit_Enabled}
          />
        )}
        {btnSettings.btn_commit_Visible && (
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            icon={require('../../img/submit.png')}
            text="提交"
            onPress={this.onSubmit}
            disabled={!btnSettings.btn_commit_Enabled}
          />
        )}
      </PageFooter>
    );
  };

  renderApprovalFooter = () => {
    const btnSettings = FormHelper.getFormButtonSetting(
      this.props.reimb.detail.data
    );
    return (
      <PageFooter style={styles.footer}>
        {btnSettings.btn_monitor_Visible && (
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            text="轨迹"
            onPress={this.onGetProcess}
            disabled={!btnSettings.btn_monitor_Enabled}
          />
        )}
        {btnSettings.btn_agree_Visible && (
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            text="同意"
            onPress={this.onAgree}
            disabled={!btnSettings.btn_agree_Enabled}
          />
        )}
        {btnSettings.btn_reject_Visible && (
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            text="驳回"
            onPress={this.onDisagree}
            disabled={!btnSettings.btn_reject_Enabled}
          />
        )}
        {/*
        <Button
          containerStyle={styles.footerButtonContainer}
          style={styles.footerButton}
          text="取回"
          onPress={this.onGetBack}
        />
        */}
      </PageFooter>
    );
  };

  render() {
    let { navigation, reimb: { detail } } = this.props;

    if (!detail.inited) {
      return <View />;
    }

    let footer;
    switch (navigation.state.params.type) {
      case 'reimb':
        footer = this.renderReimbFooter();
        break;
      case 'approval':
        footer = this.renderApprovalFooter();
        break;
      default:
        footer = <View />;
    }

    return (
      <PageWrapper>
        <FileOpener
          ref={ref => {
            this.fileOpenerRef = ref;
          }}
        />
        <FileUploader
          ref={ref => {
            this.fileUploaderRef = ref;
          }}
          onError={() => {
            console.log('FileUploader error');
          }}
          onSuccess={this.onFilesUploadedSuccessfully}
        />
        {detail.step == STEP_AGREE_1 && (
          <ChooseUserMulti
            isShowSuggest={this.state.agree.isShowSuggest}
            isSelectUser={this.state.agree.isSelectUser}
            title={'同意'}
            visible={true}
            data={this.state.agree.users}
            onChange={this.onAgreeEnd}
          />
        )}
        {detail.step == STEP_DISAGREE_1 && (
          <ChooseUserMulti
            isShowSuggest={this.state.disagree.isShowSuggest}
            isSelectUser={this.state.disagree.isSelectUser}
            title={'驳回'}
            visible={true}
            data={this.state.disagree.users}
            onChange={this.onDisagreeEnd}
          />
        )}
        {detail.step == STEP_USERS && (
          <ChooseUserMulti
            isShowSuggest={false}
            isSelectUser={true}
            title={'选择用户'}
            visible={true}
            data={this.state.submit.users}
            onChange={this.onSubmitUsersEnd}
            ref={ref => {
              this.chooseSubmitUserMultiRef = ref;
            }}
          />
        )}
        <PageContent style={styles.container}>
          {detail && this.renderContent(detail)}
        </PageContent>
        {footer}
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

export default FormDetail;
