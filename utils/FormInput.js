import React from 'React';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { Toast, List, InputItem, DatePicker } from 'antd-mobile';
import InputItemStyle from 'antd-mobile/lib/input-item/style/index';
import ListItemStyle from 'antd-mobile/lib/list/style/index';
import PickerStyle from 'antd-mobile/lib/picker/style/index';

import gStyles from '../constants/Styles';
import Text from '../components/Text';
import NumberInput from '../components/input/NumberInput';
import BaseDataMulti from '../pages/BaseDataMulti';
import BaseDataSingle from '../pages/BaseDataSingle';
import { dateToDate, dateToFullDateTime } from '../utils/Helper';

// 修改 antd-mobile控件样式
const newInputItemStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    newInputItemStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === 'input') {
      newInputItemStyle[key].height = 43;
      newInputItemStyle[key].fontSize = 15;
      newInputItemStyle[key].color = '#897f7f';
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

export function getBooleanInput({ editable = false, value = false, onValueChange }) {
  value = value ? true : false;
  return <Switch value={value} disabled={!editable} onValueChange={onValueChange} onTintColor={gStyles.color.mColor} />;
}

export function getStringInput({ editable = false, value = '', onValueChange }) {
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
      styles={StyleSheet.create(newInputItemStyle)}
      selectionColor={gStyles.color.mColor}
      placeholder={editable ? '请输入内容' : '此项不可编辑'}
    />
  );
}

export function getMultilineTextInput() {
  return (
    <InputItem
      multiline={true}
      numberOfLines={5}
      autoCapitalize="none"
      style={styles.inputItem}
      styles={StyleSheet.create(newInputItemStyle)}
      selectionColor={gStyles.color.mColor}
      placeholder="请输入内容"
    />
  );
}

export function getNumberInput({ editable = false, value = '', onValueChange }) {
  return (
    <NumberInput
      editable={editable}
      defaultValue={String(value)}
      onEndEditing={e => {
        let number = e.nativeEvent.text ? Number(e.nativeEvent.text) : '';
        onValueChange(isNaN(number) ? '' : number);
      }}
      type="number"
      style={styles.inputItem}
      styles={StyleSheet.create(newInputItemStyle)}
      selectionColor={gStyles.color.mColor}
      placeholder="请输入数字"
    />
  );
}

export function getDateInput({ editable = false, value, onValueChange }) {
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
}

export function getDateTimeInput({ editable = false, value, onValueChange }) {
  value = value ? moment(value).utcOffset(8) : '';
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
}

export function getBaseDataSingleInput({ editable = false, tableName, filter, onValueChange,  defaultValue = '' }) {
  return (
    <BaseDataSingle
      basedataName={tableName}
      authType=""
      filter={filter}
      onChange={newVal => {
        onValueChange({
          title: [newVal.base_data_name],
          value: [newVal.base_data_id]
        });
      }}
      labelTextStyle={{ textAlign: 'left' }}
      defaultValue={{ title: defaultValue.title, value: defaultValue.value }}
    />
  );
}

export function getBaseDataMultiInput({ editable = false, tableName, filter, onValueChange, defaultValue = '' }) {
  return (
    <BaseDataMulti
      basedataName={tableName}
      authType=""
      filter={filter}
      onChange={newVal => {
        let title = [],
          value = [];
        for (let i in newVal) {
          title.push(newVal[i].base_data_name);
          value.push(newVal[i].base_data_id);
        }
        onValueChange({ title, value });
      }}
      labelTextStyle={{ textAlign: 'left' }}
      defaultValue={{ title: defaultValue.title, value: defaultValue.value }}
    />
  );
}
