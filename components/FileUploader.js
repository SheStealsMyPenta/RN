import React, { Component } from 'react';
import { View, Image, Modal, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Progress } from 'antd-mobile';

import gStyles from '../constants/Styles';
import Text from '../components/Text';
import Button from '../components/Button';
import PageWrapper from '../components/PageWrapper';
import PageHeader from '../components/PageHeader';
import PageContent from '../components/PageContent';
import PageFooter from '../components/PageFooter';
import ImageButton from '../components/ImageButton';
import { showToast, uploadFile, getFileImage, getSizeDescribe } from '../utils/Helper';
import { UPLOADER_UPLOADING, UPLOADER_SUCCESS, UPLOADER_ERROR } from '../constants/Constants';

class FileUploader extends Component {
  constructor(props) {
    super(props);

    this.currentTask = null;
    this.state = {
      visible: false,
      finished: false,
      token: '',
      billId: '',
      files: [
        // id:{status, percent}
      ]
    };
  }

  onConfirm = () => {
    this.props.onSuccess();
    this.close();
  };

  onCancel = () => {
    if (this.currentTask) {
      this.currentTask.cancel();
      this.currentTask = null;
    }

    this.props.onError();
    this.close();
  };

  onRetry = () => {
    this.setState(
      {
        finished: false,
        files: this.state.files.map(item => {
          if (item.status == UPLOADER_ERROR) {
            return {
              ...item,
              status: UPLOADER_UPLOADING
            };
          } else {
            return item;
          }
        })
      },
      () => {
        this.uploadOne();
      }
    );
  };

  open = () => {
    this.setState({ visible: true });
  };

  close = () => {
    this.setState({ visible: false });
  };

  setFileInfo = (file, status, percent) => {
    let files = this.state.files.map(item => {
      if (file.id == item.id) {
        return {
          ...item,
          status,
          percent: percent || item.percent
        };
      } else {
        return item;
      }
    });

    this.setState({
      files
    });
  };

  startUpload = (token, billId, files) => {
    console.log(files);
    this.setState(
      {
        visible: true,
        finished: false,
        token,
        billId,
        files: files.map(item => {
          return {
            ...item,
            status: UPLOADER_UPLOADING,
            percent: 0
          };
        })
      },
      this.uploadOne
    );
  };

  uploadOne = () => {
    let file = null;
    for (let i in this.state.files) {
      if (this.state.files[i].status == UPLOADER_UPLOADING) {
        file = this.state.files[i];
        break;
      }
    }

    if (file != null) {
      this.currentTask = uploadFile(
        this.state.token,
        this.state.billId,
        file.id,
        file.name,
        file.path,
        (status, value) => {
          //console.log(status, value, file);
          switch (status) {
            case 'progress':
              this.setFileInfo(file, UPLOADER_UPLOADING, Math.round(value.written / value.total * 100));
              break;
            case 'success':
              this.setFileInfo(file, UPLOADER_SUCCESS, 100);
              // 上传成功，继续上传其他
              this.uploadOne();
              break;
            case 'error':
              this.setFileInfo(file, UPLOADER_ERROR);
              // 上传失败，不继续上传其他文件
              this.uploadFinished();
              break;
          }
        }
      );
    } else {
      this.uploadFinished();
    }
  };

  uploadFinished = () => {
    this.setState({
      finished: true
    });
  };

  renderFile = (file, index) => {
    const { onFileClick, canDelete, onAttachmentDelete } = this.props;
    return (
      <View key={index} style={styles.fileContainer}>
        <Text style={styles.fileText}>{file.name}</Text>
        <View style={styles.fileProgressContainer}>
          <Progress percent={file.percent} />
          <Text style={styles.fileProgressText}>{file.percent}%</Text>
        </View>
        {file.status == UPLOADER_ERROR && <Text style={styles.fileError}>上传失败</Text>}
      </View>
    );
  };

  renderButtons = () => {
    let btns = <View />;
    if (this.state.finished) {
      let hasError = false;
      for (let i in this.state.files) {
        if (this.state.files[i].status == UPLOADER_ERROR) {
          hasError = true;
          break;
        }
      }

      if (hasError) {
        btns = (
          <View style={styles.footerButtonsContainer}>
            <Button
              containerStyle={styles.footerButtonContainer}
              style={styles.footerButton}
              text="取消"
              onPress={this.onCancel}
            />
            <Button
              containerStyle={styles.footerButtonContainer}
              style={styles.footerButton}
              text="重试"
              onPress={this.onRetry}
            />
          </View>
        );
      } else {
        btns = (
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            text="确定"
            onPress={this.onConfirm}
          />
        );
      }
    } else {
      btns = (
        <View style={styles.footerButtonsContainer}>
          <Text style={styles.footerText}>文件上传中，请稍候...</Text>
          <Button
            containerStyle={styles.footerButtonContainer}
            style={styles.footerButton}
            text="取消"
            onPress={this.onCancel}
          />
        </View>
      );
    }

    return btns;
  };

  render() {
    return (
      <Modal animationType="fade" transparent={false} visible={this.state.visible} onRequestClose={() => {}}>
        <PageWrapper>
          <PageHeader text="附件上传" />
          <PageContent style={styles.content}>
            {this.state.files.map((file, index) => {
              return this.renderFile(file, index);
            })}
          </PageContent>
          <PageFooter style={styles.footer}>{this.renderButtons()}</PageFooter>
        </PageWrapper>
      </Modal>
    );
  }
}

FileUploader.defaultProps = {
  files: [],
  onSuccess: () => {},
  onError: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    padding: 10
  },
  footer: {
    justifyContent: 'space-around'
  },
  fileContainer: {
    marginVertical: 10
  },
  fileText: {
    marginBottom: 5
  },
  fileError: {
    color: 'red'
  },
  fileProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fileProgressText: {
    marginLeft: 3
  },
  footerButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerButtonContainer: {
    backgroundColor: gStyles.color.mColor,
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  footerButton: {
    fontSize: 16,
    color: 'white'
  },
  footerText: {
    color: gStyles.color.mColor
  }
});

export default FileUploader;
