import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import gStyles from '../constants/Styles';
import Text from '../components/Text';
import { showToast, openLocalFile, downloadFile } from '../utils/Helper';
import { getRemoteAttachmentPath } from '../utils/FormHelper';

class FileOpner extends Component {
  constructor(props) {
    super(props);
    this.task = null;
    this.state = {
      visible: false,
      name: null,
      percent: 0
    };
  }

  taskEnd = () => {
    this.task = null;
    this.close();
  };

  openCallback = (status, result) => {
    switch (status) {
      case 'success':
        this.taskEnd();
        // 模拟器好像有bug，我必须加个延时才能打开文件
        // 手机和pad也有这个问题，延时为0会打开失败，增大到了50，测试ok
        setTimeout(() => {
          openLocalFile(result, this.state.name);
        }, 50);
        break;
      case 'progress':
        this.setState({ percent: Math.round(result.received / result.total * 100) });
        break;
      case 'error':
        showToast('文件下载失败！');
        this.taskEnd();
        break;
    }
  };

  open = (name, path, remote = false) => {
    if (remote) {
      this.setState({ visible: true, name });
      this.task = downloadFile(name, getRemoteAttachmentPath(path), this.openCallback);
    } else {
      openLocalFile(path, name);
    }
  };

  close = () => {
    this.setState({ visible: false, percent: 0 });
    if (this.task) {
      this.task.cancel(() => {});
      this.task = null;
    }
  };

  render() {
    return (
      <Modal transparent={true} animationType="none" visible={this.state.visible} onRequestClose={this.close}>
        <TouchableOpacity style={styles.container} onPress={this.close}>
          <Text style={styles.hint}>文件下载中,轻触屏幕可取消</Text>
          {/*
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="middle">
            {this.state.name}
          </Text>
          */}
          <Text style={styles.percent}>{this.state.percent}%</Text>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(190, 190, 190, .25)'
  },
  hint: {
    fontSize: 18,
    color: gStyles.color.mColor
  },
  name: {
    fontSize: 16,
    color: gStyles.color.mColor,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: Dimensions.get('window').width * 0.85
  },
  percent: {
    margin: 10,
    color: gStyles.color.mColor,
    fontSize: 20
  }
});

export default FileOpner;
