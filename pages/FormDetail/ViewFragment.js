import React, { Component } from 'react';
import { View, Image, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { Toast, List, InputItem, DatePicker } from 'antd-mobile';

import gStyles from '../../constants/Styles';
import Text from '../../components/Text';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButton';
import Gallery from '../../components/Gallery';
import Attachments from '../../components/Attachments';
import MultiSelectedDetail from '../../components/MultiSelectedDetail';
import {
  isImage,
  selectImages,
  selectFiles,
  dateToDate,
  dateToDate2,
  dateToFullDateTime,
  dateToFullDateTime2
} from '../../utils/Helper';
import * as FormHelper from '../../utils/FormHelper';

import BaseDataMulti from '../../pages/BaseDataMulti';

const DateView = ({ extra = '请选择', onClick = () => {} }) => {
  return (
    <TouchableOpacity onPress={() => onClick()}>
      <Text style={styles.dateViewText}>{extra}</Text>
    </TouchableOpacity>
  );
};

const ValueView = ({ value = '' }) => {
  return <Text style={styles.valueViewText}>{value}</Text>;
};

class ViewFragment extends Component {
  constructor(props) {
    super(props);
  }

  renderImageEditor = (template, data) => {
    let images = [];
    for (var i in data) {
      if (isImage(data[i].enclosurename)) {
        images.push(FormHelper.getRemoteAttachmentPath(data[i].recid));
        //images.push(data[i].enclosurename);
      }
    }

    if (images.length == 0) {
      return <View />;
    }

    return (
      <View style={styles.imageContainer}>
        <View style={styles.imageHeader}>
          <Text style={styles.imageTitle}>图片</Text>
        </View>
        <Gallery images={images} canDelete={false} />
      </View>
    );
  };

  renderAttachmentEditor = (template, data) => {
    let files = [];
    for (var i in data) {
      //if (!isImage(data[i].enclosurename)) {
      files.push({
        id: data[i].recid,
        name: data[i].enclosurename,
        size: Number(data[i].enclosuresize),
        isbillsave: data[i].isbillsave,
        path: data[i]._localpath
      });
      //}
    }

    if (files.length == 0) {
      return <View />;
    }

    return (
      <View style={styles.attachmentContainer}>
        <View style={styles.attachmentHeader}>
          <Text style={styles.attachmentTitle}>附件</Text>
        </View>
        <Attachments files={files} onFileClick={this.props.onAttachmentClick} canDelete={false} />
      </View>
    );
  };

  getBooleanInput = ({ editable = false, value = false, onValueChange }) => {
    value = value ? true : false;
    return (
      <Switch value={value} disabled={!editable} onValueChange={onValueChange} onTintColor={gStyles.color.mColor} />
    );
  };

  getInputValue = (tableName, prop, order) => {
    const { type, data } = this.props;
    let inputValue;

    switch (type) {
      case 'master': {
        _.find(data.rowData, (value, key) => {
          if (key == prop.fieldName) {
            inputValue = FormHelper.getFieldValue(value);
            return true;
          }
        });

        break;
      }
      case 'detail': {
        for (var i in data) {
          if (data[i].tableName == tableName) {
            _.find(data[i].rowDataes.collections[order].fields, (value, key) => {
              if (key == prop.fieldName) {
                inputValue = FormHelper.getFieldValue(value);
                return true;
              }
            });
            break;
          }
        }
        break;
      }
      default:
    }

    return inputValue;
  };

  renderInputView = (tableName, prop, order) => {
    const { type, template, data, onValueChange } = this.props;

    let value = this.getInputValue(tableName, prop, order),
      valueType = prop.valueType,
      input = <Text>{valueType}</Text>;

    switch (valueType && valueType.toLowerCase()) {
      case 'boolean':
        input = this.getBooleanInput({
          editable: false,
          value: value,
          onValueChange: newVal => {
            onValueChange(type, tableName, order, prop, newVal);
          }
        });
        break;
      case 'string':
        input = <ValueView value={value || '无'} />;
        break;
      case 'int':
      case 'numric':
      case 'numeric':
        input = <ValueView value={value} />;
        break;
      case 'date':
        if (value) {
          let date = new Date();
          date.setTime(value);
          input = <ValueView value={dateToDate2(date)} />;
        } else {
          input = <ValueView value={'无'} />;
        }
        break;
      case 'datetime':
        if (value) {
          let date = new Date();
          date.setTime(value);
          input = <ValueView value={dateToFullDateTime2(date)} />;
        } else {
          input = <ValueView value={'无'} />;
        }
        break;
      case 'basedata_single': {
        if (value) {
          input = <ValueView value={value.title[0] || '无'} />;
        } else {
          input = <ValueView value={'无'} />;
        }
        break;
      }
      case 'basedata_multi': {
        if (value) {
          let items = value.title.map(title => {
            return { title };
          });
          input = <MultiSelectedDetail labelContainer={{ paddingHorizontal: 0 }} selectedItems={items} />;
        } else {
          input = <ValueView value={'无'} />;
        }
        break;
      }
      default:
        input = <Text style={styles.errorText}>未知类型</Text>;
    }
    return input;
  };

  // 显示一个子表
  // tableName:子表名称
  // rows: 子表显示模型数据
  // collections: 子表所有的数据集合
  renderSubForm = (tableName, rows, collections) => {
    return (
      <View>
        {collections.map((value, index) => {
          return <View key={index}>{this.renderForm(tableName, index, rows)}</View>;
        })}
      </View>
    );
  };

  // 显示所有子表
  // tmpls: 所有子表界面模型
  // data: 所有子表数据
  renderSubForms = (tmpls, data) => {
    return (
      <View>
        {tmpls.map((value, index) => {
          if (!value.rows || value.rows.length == 0) {
            return <View key={index} />;
          }

          // 查找子表的数据集
          let collections = null;
          for (let i in data) {
            if (data[i].tableName != value.tableName) continue;

            collections = data[i].rowDataes.collections;
            break;
          }

          if (collections == null) return <View key={index} />;

          // 渲染子表的数据集
          return <View key={index}>{this.renderSubForm(value.tableName, value.rows, collections)}</View>;
        })}
      </View>
    );
  };

  // 显示一个表的数据，可以是主表，也可以是一张子表的一个数据
  // tableName: 主表或子表名称
  // order: 显示的数据在主表或子表数据集中的位置，主表这个字段始终为0
  // rows: 主表或子表显示模型数据
  renderForm = (tableName, order, rows) => {
    const { type, template, data } = this.props;

    return (
      <List style={styles.form}>
        {rows.map((row, index) => {
          let cells = row.cells,
            rowStyle = [styles.formRow],
            inputStyle = [styles.formInput];

          if (index != 0) {
            rowStyle.push(styles.formRowDivider);
          }

          let inputFieldName = FormHelper.getInputFieldNameFromTitle(cells[1].title);
          if (!inputFieldName) return <View key={index} />;

          let inputFieldProp = FormHelper.getFieldProp(type, tableName, template, data, inputFieldName);
          if (!inputFieldProp) {
            return (
              <View key={index} style={rowStyle}>
                <Text style={styles.formLabel}>{cells[0].title}</Text>
                <View style={inputStyle}>{}</View>
              </View>
            );
          }

          return (
            <View key={index} style={rowStyle}>
              <Text style={styles.formLabel}>{cells[0].title}</Text>
              <View style={inputStyle}>{this.renderInputView(tableName, inputFieldProp, order)}</View>
            </View>
          );
        })}
      </List>
    );
  };

  render() {
    const { type, template, data } = this.props;
    let fragment = <View />;

    switch (type) {
      case 'master': {
        const { template: { tableName, rows } } = this.props;
        fragment = this.renderForm(tableName, 0, rows);
        break;
      }

      case 'detail':
        fragment = this.renderSubForms(template, data);
        break;

      case 'attachment':
        fragment = (
          <View>
            {/*this.renderImageEditor(template, data)*/}
            {this.renderAttachmentEditor(template, data)}
          </View>
        );
        break;
      default:
        //fragment = <View />;
        fragment = <Text style={styles.errorText}>此行数据格式不正确</Text>;
    }

    return fragment;
  }
}

ViewFragment.defaultProps = {
  onValueChange: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  form: {
    marginBottom: 12
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  formRowDivider: {
    borderTopColor: gStyles.color.mBorderColor,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  formLabel: {
    flex: 3.5,
    fontSize: 15,
    color: '#333333',
    paddingVertical: 13,
    paddingLeft: 8
  },
  formInput: {
    flex: 6.5,
    paddingLeft: 5
    //fontSize: 14,
    //color: '#807e7e',
  },
  inputItem: {
    height: 30,
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingRight: 0
  },
  dateViewText: {
    fontSize: 14,
    color: '#807e7e'
  },
  valueViewText: {
    fontSize: 14,
    color: '#807e7e'
  },
  AddSubFormContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginBottom: 12
  },
  AddSubFormText: {
    fontSize: 16,
    color: gStyles.color.mColor,
    marginRight: 8
  },
  AddSubFormImage: {
    width: 20,
    height: 20,
    tintColor: gStyles.color.mColor
  },
  DelSubFormContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopColor: gStyles.color.mBorderColor,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  DelSubFormText: {
    fontSize: 16,
    color: gStyles.color.tColor,
    marginRight: 8
  },
  DelSubFormImage: {
    width: 20,
    height: 20,
    tintColor: gStyles.color.tColor
  },
  imageContainer: {
    backgroundColor: gStyles.color.sColor,
    paddingBottom: 10,
    marginBottom: 10
  },
  imageHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageTitle: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    marginBottom: 7,
    marginLeft: 12
  },
  imageIcon: {
    width: 21,
    height: 17,
    marginRight: 20
  },
  attachmentContainer: {
    backgroundColor: gStyles.color.sColor,
    paddingBottom: 10,
    marginBottom: 10
  },
  attachmentHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  attachmentIcon: {
    width: 23,
    height: 20.5,
    marginRight: 20
  },
  attachmentTitle: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    marginBottom: 3,
    marginLeft: 12
  },
  errorText: {
    color: 'red',
    marginVertical: 5
  }
});

export default ViewFragment;
