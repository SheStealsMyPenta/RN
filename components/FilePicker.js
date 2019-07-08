import React, { Component } from 'react';
import { View, Image, Modal, FlatList, ScrollView, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Progress } from 'antd-mobile';
import RNFS from 'react-native-fs';
import _ from 'lodash';

import gStyles from '../constants/Styles';
import Text from '../components/Text';
import Button from '../components/Button';
import PageWrapper from '../components/PageWrapper';
import PageContent from '../components/PageContent';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import ImageButton from '../components/ImageButton';
import { showToast, hideToast, uploadFile, getFileImage, getFileNameFromPath, getSizeDescribe } from '../utils/Helper';

class FileItem extends Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress(this.props.value);
  };

  renderFileIcon = () => {
    let icon;
    if (this.props.value.isFile()) {
      if (this.props.checked) {
        icon = <Image style={styles.fileIcon} source={require('../img/checked.png')} />;
      } else {
        icon = <Image style={styles.fileIcon} source={require('../img/checkbox.png')} />;
      }
    } else {
      icon = <Image style={styles.folderIcon} source={require('../img/folder.png')} />;
    }

    return icon;
  };

  render() {
    let isFile = this.props.value.isFile();

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.fileContainer}>
          {this.renderFileIcon()}
          <Text style={styles.fileTitle} numberOfLines={1} ellipsizeMode="middle">
            {this.props.value.name}
          </Text>
          {!isFile && <Image style={styles.arrowRight} source={require('../img/arrow_right.png')} />}
        </View>
      </TouchableOpacity>
    );
  }
}

FileItem.defaultProps = {
  checked: false,
  onPress: () => {}
};

class FilePicker extends Component {
  constructor(props) {
    super(props);

    this.initData();
    this.state = {
      visible: false,
      currentLevel: 0,
      levels: [],
      checked: {}
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.pickerIndexBar) {
      setTimeout(() => {
        this.pickerIndexBar.scrollToEnd();
      }, 50);
    }
  }

  onConfirm = () => {
    let data = _.map(this.state.checked, value => ({ name: value.name, size: value.size, path: value.path }));
    this.onConfirmCallBack(data);
    this.close();
  };

  onCancel = () => {
    this.close();
  };

  open = callback => {
    this.onConfirmCallBack = callback || (() => {});
    this.initData();
    this.setState({ visible: true, currentLevel: 0, levels: [], checked: {} });
    this.readDir(
      Platform.OS == 'android'
        ? /*RNFS.ExternalDirectoryPath */ RNFS.ExternalStorageDirectoryPath
        : /*RNFS.MainBundlePath*/ RNFS.DocumentDirectoryPath
    );
  };

  close = () => {
    this.setState({ visible: false });
  };

  initData = () => {
    this.pickerDirArray = [
      /*{index,name,path, offset}*/
    ];
    this.pickerUIArray = [
      /*flatlist*/
    ];
  };

  readDir = dir => {
    if (!dir) return;

    showToast('读取中...', 0, () => {}, true);
    RNFS.readDir(dir)
      .then(result => {
        let levels;

        this.pickerDirArray[this.state.currentLevel] = {
          index: this.state.currentLevel,
          name: getFileNameFromPath(dir),
          path: dir,
        };
        if (this.state.levels.length == this.state.currentLevel) {
          levels = [...this.state.levels, result];
        } else {
          levels = this.state.levels.map((item, index) => {
            if (index == this.state.currentLevel) {
              return result;
            } else {
              return item;
            }
          });
        }

        this.setState({ levels });

        hideToast();
      })
      .catch(err => {
        showShort('读取文件夹失败！');
        console.log(err);
      });
  };

  onFileClick = item => {
    let isFile = item.isFile();
    if (isFile) {
      if (this.state.checked[item.path]) {
        let newChecked = { ...this.state.checked };
        _.unset(newChecked, item.path);
        this.setState({ checked: newChecked });
      } else {
        this.setState({ checked: { ...this.state.checked, [item.path]: item } });
      }
    } else {
      this.state.currentLevel += 1;
      this.readDir(item.path);
    }
  };

  onIndexBarClick = item => {
    this.pickerDirArray = this.pickerDirArray.slice(0, item.index + 1);
    //this.pickerUIArray = this.pickerUIArray.slice(0, item.index + 1);
    this.setState({ currentLevel: item.index }, () => {
    });
  };

  renderIndexBar = () => {
    let bar = (
      <ScrollView
        ref={ref => (this.pickerIndexBar = ref)}
        contentContainerStyle={styles.indexBar}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        {this.pickerDirArray.map((item, index) => {
          let textStyle =
            index != this.pickerDirArray.length - 1 ? [styles.barItem, styles.barItemLimit] : [styles.barItem];
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this.onIndexBarClick(item);
              }}
            >
              <View style={styles.barItemContainer}>
                <Image style={styles.barDevider} source={require('../img/arrow_right.png')} />
                <Text style={textStyle} numberOfLines={1} ellipsizeMode="middle">
                  {index == 0 ? '根目录' : item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
    return bar;
  };

  renderItem = ({ item }) => {
    return <FileItem checked={this.state.checked[item.path]} value={item} onPress={this.onFileClick} />;
  };

  renderContent = () => {
    if (this.state.levels.length < this.state.currentLevel + 1) {
      return <View />;
    }

    // 检查缓存
    /*if (this.pickerUIArray[this.state.currentLevel]) {
      return this.pickerUIArray[this.state.currentLevel];
    }*/

    let data = this.state.levels[this.state.currentLevel];
    let content;
    if (!data || data.length == 0) {
      content = <Text style={styles.emptyContent}>该文件夹未包含任何文件哦</Text>;
    } else {
      content = <FlatList style={{ flex: 1 }} data={data} renderItem={this.renderItem} />;
    }

    // 缓存界面
    //this.pickerUIArray[this.state.currentLevel] = content;

    return content;
  };

  renderButtons = () => {
    let btns = (
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
          text="确定"
          onPress={this.onConfirm}
        />
      </View>
    );

    return btns;
  };

  render() {
    return (
      <Modal transparent={false} animationType="slide" visible={this.state.visible} onRequestClose={() => {}}>
        <PageWrapper>
          <PageHeader text="文件选择" />
          <View>{this.renderIndexBar()}</View>
          <ScrollView
            bounces={false}
            ref={ref => (this.dirContent = ref)}
            style={styles.content}
          >
            {this.renderContent()}
          </ScrollView>
          <PageFooter style={styles.footer}>{this.renderButtons()}</PageFooter>
        </PageWrapper>
      </Modal>
    );
  }
}

FilePicker.defaultProps = {
  onSuccess: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: gStyles.color.bgColor
  },
  emptyContent: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20
  },
  footer: {
    justifyContent: 'space-around'
  },
  footerButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerButtonContainer: {
    backgroundColor: gStyles.color.mColor,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  footerButton: {
    fontSize: 16,
    color: 'white'
  },
  footerText: {
    color: gStyles.color.mColor
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 1,
    paddingVertical: 9,
    paddingHorizontal: 8
  },
  folderIcon: {
    width: 30,
    height: 26,
    tintColor: '#f6ba2d'
  },
  fileIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
    marginVertical: 3.5
  },
  fileTitle: {
    flex: 1,
    fontSize: 16,
    color: gStyles.color.sTextColor,
    marginHorizontal: 6
  },
  arrowRight: {
    width: 8,
    height: 15,
    tintColor: '#cccccc',
    marginRight: 3
  },
  indexBar: {
    paddingRight: 5
  },
  barItemContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  barDevider: {
    width: 5,
    height: 9.4,
    tintColor: gStyles.color.mColor,
    marginHorizontal: 5
  },
  barItem: {
    color: gStyles.color.mColor,
    paddingVertical: 10
  },
  barItemLimit: {
    maxWidth: 100
  }
});

export default FilePicker;
