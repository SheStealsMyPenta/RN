import React, { Component } from 'react';
import { View, Image, Switch, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { Toast, List, InputItem, DatePicker } from 'antd-mobile';
import InputItemStyle from 'antd-mobile/lib/input-item/style/index';
import ListItemStyle from 'antd-mobile/lib/list/style/index';
import PickerStyle from 'antd-mobile/lib/picker/style/index';

import gStyles from '../../constants/Styles';
import Text from '../../components/Text';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButton';
import NumberInput from '../../components/input/NumberInput';
import Gallery from '../../components/Gallery';
import Attachments from '../../components/Attachments';
import FilePicker from '../../components/FilePicker';
import {
  isDefine,
  showShort,
  isImage,
  openCamera,
  selectImages,
  dateToDate,
  dateToFullDateTime
} from '../../utils/Helper';
import * as FormHelper from '../../utils/FormHelper';

import BaseDataMulti from '../../pages/BaseDataMulti';
import BaseDataSingle from '../../pages/BaseDataSingle';

// 修改 antd-mobile控件样式
const newInputItemStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    newInputItemStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === 'input') {
      newInputItemStyle[key].height = 43;
      newInputItemStyle[key].fontSize = 15;
      newInputItemStyle[key].color = '#333333';
    }
  }
}

const newInputItemDisabledStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    newInputItemDisabledStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === 'input') {
      newInputItemDisabledStyle[key].height = 43;
      newInputItemDisabledStyle[key].fontSize = 15;
      newInputItemDisabledStyle[key].color = '#999999';
    }
  }
}

const newListItemStyle = {};
for (const key in ListItemStyle) {
  if (Object.prototype.hasOwnProperty.call(ListItemStyle, key)) {
    if (typeof ListItemStyle[key] === 'object') {
      newListItemStyle[key] = { ...StyleSheet.flatten(ListItemStyle[key]) };
    } else {
      newListItemStyle[key] = ListItemStyle[key];
    }
    switch (key) {
      case 'Line':
        newListItemStyle[key].paddingRight = 10;
        newListItemStyle[key].minHeight = 30;
        newListItemStyle[key].borderBottomWidth = 0;
        break;
      case 'Item':
        newListItemStyle[key].paddingLeft = 0;

        break;
      case 'Content':
        newListItemStyle[key].fontSize = 14;
        newListItemStyle[key].color = '#807e7e';
        break;
      case 'Extra':
        newListItemStyle[key].fontSize = 14;
        newListItemStyle[key].lineHeight = 14;
        break;
      default:
    }
  }
}

const newPickerStyle = {};
for (const key in PickerStyle) {
  if (Object.prototype.hasOwnProperty.call(PickerStyle, key)) {
    newPickerStyle[key] = { ...StyleSheet.flatten(PickerStyle[key]) };
    if (key === 'actionText') {
      newPickerStyle[key].color = gStyles.color.mColor;
    }
  }
}

const DateView = ({ extra = '请选择', onClick = () => {} }) => {
  return (
    <TouchableOpacity onPress={() => onClick()}>
      <Text style={styles.dateViewText}>{extra}</Text>
    </TouchableOpacity>
  );
};

class EditorFragment extends Component {
  constructor(props) {
    super(props);
  }

  addSubForm = tableName => {
    this.props.onAddSubForm(tableName);
  };

  delSubForm = (tableName, order) => {
    this.props.onDelSubForm(tableName, order);
  };

  openCamera = () => {
    openCamera((type, data) => {
      if (type == 'success') {
        this.props.onAddAttachments(data);
      }
    });
  };

  selectImages = () => {
    selectImages((type, data) => {
      if (type == 'success') {
        this.props.onAddAttachments(data);
      }
    });
  };

  selectFiles = () => {
    this.filePicker.open(data => {
      this.props.onAddAttachments(data);
    });
  };

  onAttachmentDelete = index => {
    this.props.onAttachmentDelete('file', index);
  };

  onImageDelete = index => {
    this.props.onAttachmentDelete('image', index);
  };

  renderImageEditor = (template, data) => {
    let images = [];
    for (var i in data) {
      if (isImage(data[i].enclosurename)) {
        images.push(data[i].enclosurename);
      }
    }

    return (
      <View style={styles.imageContainer}>
        <View style={styles.imageHeader}>
          <Text style={styles.imageTitle}>图片</Text>
          <ImageButton style={styles.imageIcon} source={require('../../img/camera.png')} onPress={this.selectImages} />
        </View>
        <Gallery images={images} canDelete={true} onImageDelete={this.onImageDelete} />
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

    return (
      <View style={styles.attachmentContainer}>
        <FilePicker ref={fpicker => (this.filePicker = fpicker)} />
        <View style={styles.attachmentHeader}>
          <Text style={styles.attachmentTitle}>附件</Text>
          <ImageButton
            style={styles.attachmentIcon}
            source={require('../../img/attachment.png')}
            onPress={this.selectFiles}
          />
          <ImageButton
            style={styles.pictureIcon}
            source={require('../../img/picture.png')}
            onPress={this.selectImages}
          />
          <ImageButton style={styles.cameraIcon} source={require('../../img/camera.png')} onPress={this.openCamera} />
        </View>
        <Attachments
          files={files}
          onFileClick={this.props.onAttachmentClick}
          canDelete={true}
          onAttachmentDelete={this.onAttachmentDelete}
        />
      </View>
    );
  };

  getBooleanInput = ({ editable = false, value = false, onValueChange }) => {
    value = value ? true : false;
    return (
      <Switch value={value} disabled={!editable} onValueChange={onValueChange} onTintColor={gStyles.color.mColor} />
    );
  };

  getStringInput = ({ editable = false, value = '', onValueChange }) => {
    return (
      <InputItem
        editable={editable}
        defaultValue={value}
        onEndEditing={e => {
          onValueChange(e.nativeEvent.text || '');
        }}
        autoCapitalize="none"
        type="text"
        clear={true}
        style={styles.inputItem}
        styles={StyleSheet.create(editable ? newInputItemStyle : newInputItemDisabledStyle)}
        selectionColor={gStyles.color.mColor}
        placeholder={editable ? '请输入内容' : ''}
      />
    );
  };

  getMultilineTextInput = () => {
    return (
      <InputItem
        multiline={true}
        numberOfLines={5}
        autoCapitalize="none"
        style={styles.inputItem}
        styles={StyleSheet.create(editable ? newInputItemStyle : newInputItemDisabledStyle)}
        selectionColor={gStyles.color.mColor}
        placeholder={editable ? '请输入内容' : ''}
      />
    );
  };

  getNumberInput = ({ editable = false, value = '', onValueChange }) => {
    return (
      <NumberInput
        editable={editable}
        defaultValue={String(value)}
        onEndEditing={e => {
          let number = isDefine(e.nativeEvent.text) ? Number(e.nativeEvent.text) : '';
          onValueChange(_.isNumber(number) ? number : '');
        }}
        type="number"
        style={styles.inputItem}
        styles={StyleSheet.create(editable ? newInputItemStyle : newInputItemDisabledStyle)}
        selectionColor={gStyles.color.mColor}
        placeholder={editable ? '请输入数字' : ''}
      />
    );
  };

  getDateInput = ({ editable = false, value, onValueChange }) => {
    //value = value ? moment(value).utcOffset(8) : moment().utcOffset(8);
    value = value ? moment(value).utcOffset(8) : '';
    return (
      <DatePicker
        mode="date"
        disabled={!editable}
        value={value}
        onChange={date => {
          onValueChange(date.valueOf());
        }}
        format={date => date.format('YYYY-MM-DD')}
        styles={StyleSheet.create(newPickerStyle)}
      >
        <DateView />
      </DatePicker>
    );
  };

  getDateTimeInput = ({ editable = false, value, onValueChange }) => {
    value = value ? moment(value).utcOffset(8) : moment().utcOffset(8);
    return (
      <DatePicker
        mode="datetime"
        disabled={!editable}
        value={value}
        onChange={datetime => {
          onValueChange(datetime.valueOf());
        }}
        format={date => date.format('YYYY-MM-DD hh:mm')}
        styles={StyleSheet.create(newPickerStyle)}
      >
        <DateView />
      </DatePicker>
    );
  };

  getInputEditable = (tableName, prop) => {
    const { type, data } = this.props;
    let editable = false;

    switch (type) {
      case 'master': {
        _.find(data.editableFieldNames, value => {
          if (value == prop.fieldName) {
            editable = true;
            return true;
          }
        });

        break;
      }
      case 'detail': {
        for (var i in data) {
          if (data[i].tableName == tableName) {
            _.find(data[i].editableFieldNames, value => {
              if (value == prop.fieldName) {
                editable = true;
                return true;
              }
            });
          }
        }
        break;
      }
      case 'attachment': {
        editable = true;
        break;
      }
      default:
    }

    return editable;
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

  /*
   * type : string/int/numberic/boolean/date/datetime/basedata_single/basedata_multi/undefine
  */
  renderInput = (tableName, prop, order) => {
    const { type, template, data, onValueChange } = this.props;

    let editable = this.getInputEditable(tableName, prop),
      value = this.getInputValue(tableName, prop, order),
      valueType = prop.valueType,
      input = <Text>{valueType}</Text>;

    switch (valueType && valueType.toLowerCase()) {
      case 'boolean':
        input = this.getBooleanInput({
          editable,
          value,
          onValueChange: newVal => {
            onValueChange(type, tableName, order, prop, newVal);
          }
        });
        break;
      case 'string':
        input = this.getStringInput({
          editable,
          value,
          onValueChange: newVal => {
            onValueChange(type, tableName, order, prop, newVal);
          }
        });
        break;
      case 'int':
      case 'numric':
      case 'numeric':
        input = this.getNumberInput({
          editable,
          value,
          onValueChange: newVal => {
            onValueChange(type, tableName, order, prop, newVal);
          }
        });
        break;
      case 'date':
        input = this.getDateInput({
          editable,
          value,
          onValueChange: newVal => {
            onValueChange(type, tableName, order, prop, newVal);
          }
        });
        break;
      case 'datetime':
        input = this.getDateTimeInput({
          editable,
          value,
          onValueChange: newVal => {
            onValueChange(type, tableName, order, prop, newVal);
          }
        });
        break;
      case 'basedata_single': {
        input = (
          <BaseDataSingle
            basedataName={value.tableName}
            authType=""
            filter={prop.basedatafilter}
            disabled={!editable}
            defaultValue={{ title: value.title, value: value.value }}
            onChange={newVal => {
              onValueChange(type, tableName, order, prop, {
                title: [newVal.base_data_name],
                value: [newVal.base_data_id]
              });
            }}
            labelTextStyle={{ textAlign: 'left' }}
          />
        );
        break;
      }
      case 'basedata_multi': {
        input = (
          <BaseDataMulti
            basedataName={value.tableName}
            authType=""
            disabled={!editable}
            filter={prop.basedatafilter}
            defaultValue={{ title: value.title, value: value.value }}
            onChange={newVal => {
              let title = [],
                value = [];
              for (let i in newVal) {
                title.push(newVal[i].base_data_name);
                value.push(newVal[i].base_data_id);
              }
              onValueChange(type, tableName, order, prop, { title, value });
            }}
            labelTextStyle={{ textAlign: 'left' }}
          />
        );
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

          return (
            <View key={index}>
              {this.renderSubForm(value.tableName, value.rows, collections)}
              <TouchableOpacity style={styles.AddSubFormContainer} onPress={() => this.addSubForm(value.tableName)}>
                <Text style={styles.AddSubFormText}>增加一行</Text>
                <Image style={styles.AddSubFormImage} source={require('../../img/add.png')} />
              </TouchableOpacity>
            </View>
          );
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
          if (!inputFieldProp) return <View key={index} />;

          return (
            <View key={index} style={rowStyle}>
              <Text style={styles.formLabel}>{cells[0].title}</Text>
              <View style={inputStyle}>{this.renderInput(tableName, inputFieldProp, order)}</View>
            </View>
          );
        })}
        {order > 0 && (
          <TouchableOpacity style={styles.DelSubFormContainer} onPress={() => this.delSubForm(tableName, order)}>
            <Text style={styles.DelSubFormText}>删除此行</Text>
            <Image style={styles.DelSubFormImage} source={require('../../img/delete.png')} />
          </TouchableOpacity>
        )}
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

EditorFragment.defaultProps = {
  onValueChange: () => {},
  onAddSubForm: () => {},
  onDelSubForm: () => {},
  onAttachmentDelete: () => {}
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
    color: '#333333'
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
  cameraIcon: {
    width: 23,
    height: 18.5,
    marginRight: 20
  },
  pictureIcon: {
    width: 21.5,
    height: 18.5,
    marginRight: 20
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

export default EditorFragment;
