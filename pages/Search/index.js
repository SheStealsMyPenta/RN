import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { List, InputItem, DatePicker } from 'antd-mobile';
import InputItemStyle from 'antd-mobile/lib/input-item/style/index';
import ListItemStyle from 'antd-mobile/lib/list/style/index';
import PickerStyle from 'antd-mobile/lib/picker/style/index';
import _ from 'lodash';

import gStyles from '../../constants/Styles';
import PageWrapper from '../../components/PageWrapper';
import PageContent from '../../components/PageContent';
import PageFooter from '../../components/PageFooter';
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView';
import Button from '../../components/Button';
import { dateToDate, dateToFullDateTime } from '../../utils/Helper';
import * as FormHelper from '../../utils/FormHelper';
import * as FormInput from '../../utils/FormInput';

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

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.getStateShape()
    };
  }

  componentWillMount() {
    const { navigation, actions } = this.props;

    console.log(navigation.state.params, this.getStateShape());
    //actions.fetchSearchMeta(1);
  }
  componentDidMount() {}
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {}

  getStateShape = () => {
    const { navigation } = this.props;
    const rows = navigation.state.params.template.queryTemplate.table.rows;

    let shape = {};

    for (let i in rows) {
      let prop = rows[i].cells[1].prop;

      shape[prop.fieldName] = FormHelper.getTypeDefaultValue(prop.valueType);
    }

    return shape;
  };

  getFieldValue = prop => this.state.value[prop.fieldName];

  setFieldValue = (prop, value) => {
    let type = prop.valueType && prop.valueType.toLowerCase();
    switch (type) {
      case 'boolean':
      case 'string':
      case 'int':
      case 'numric':
      case 'numeric':
      case 'date':
      case 'datetime':
        this.state.value[prop.fieldName] = value;
        break;

      case 'basedata_single':
      case 'basedata_multi':
        this.state.value[prop.fieldName] = value;
        break;
    }

    this.setState({});
  };

  getQueryParams = () => {
    const { navigation } = this.props;
    const rows = navigation.state.params.template.queryTemplate.table.rows;

    let type,
      prop,
      tmpProp,
      stateValue = this.state.value,
      queryParams = { id: '', fields: {} },
      fields = queryParams.fields;
    for (let i in rows) {
      prop = rows[i].cells[1].prop;
      tmpProp = _.cloneDeep(prop);

      type = prop.valueType && prop.valueType.toLowerCase();
      switch (type) {
        case 'boolean':
          tmpProp.value = String(stateValue[prop.fieldName]);
          break;
        case 'string':
        case 'int':
        case 'numric':
        case 'numeric':
          if (stateValue[prop.fieldName] == '') continue;

          tmpProp.value = stateValue[prop.fieldName];

        case 'date':
        case 'datetime': {
          tmpProp.value = stateValue[prop.fieldName];
          break;
        }

        case 'basedata_single':
        case 'basedata_multi':
          if (_.isEmpty(stateValue[prop.fieldName].value)) continue;

          if (!tmpProp.value) tmpProp.value = {};
          tmpProp.value.title = stateValue[prop.fieldName].title;
          tmpProp.value.value = stateValue[prop.fieldName].value;
          break;
      }
      fields[prop.fieldName] = tmpProp;
    }

    return queryParams;
  };

  onSearch = () => {
    const { navigation, login, actions } = this.props;
    const { type, category, defineID, template } = navigation.state.params;

    navigation.navigate('SearchResult', { template, defineID, type, category, queryParams: this.getQueryParams() });
  };

  renderInput = prop => {
    let valueType = prop.valueType,
      editable = prop.readOnly == 'false',
      value = this.getFieldValue(prop),
      input = <Text>{valueType}</Text>;

    switch (valueType && valueType.toLowerCase()) {
      case 'boolean':
        input = FormInput.getBooleanInput({
          editable,
          value,
          onValueChange: newVal => {
            this.setFieldValue(prop, newVal);
          }
        });
        break;
      case 'string':
        input = FormInput.getStringInput({
          editable,
          value,
          onValueChange: newVal => {
            this.setFieldValue(prop, newVal);
          }
        });
        break;
      case 'int':
      case 'numric':
      case 'numeric':
        input = FormInput.getNumberInput({
          editable,
          value,
          onValueChange: newVal => {
            this.setFieldValue(prop, newVal);
          }
        });
        break;
      case 'date':
        input = FormInput.getDateInput({
          editable,
          value,
          onValueChange: newVal => {
            this.setFieldValue(prop, newVal);
          }
        });
        break;
      case 'datetime':
        input = FormInput.getDateTimeInput({
          editable,
          value,
          onValueChange: newVal => {
            this.setFieldValue(prop, newVal);
          }
        });
        break;
      case 'basedata_single': {
        input = FormInput.getBaseDataSingleInput({
          editable,
          tableName: prop.baseDataID,
          filter: '',
          onValueChange: newVal => {
            this.setFieldValue(prop, newVal);
          },
          defaultValue: value,
        });
        break;
      }
      case 'basedata_multi': {
        input = FormInput.getBaseDataMultiInput({
          editable,
          tableName: prop.baseDataID,
          filter: '',
          onValueChange: newVal => {
            this.setFieldValue(prop, newVal);
          },
          defaultValue: value,
        });
      }
      default:
        input = <Text style={styles.errorText}>未知类型</Text>;
    }
    return input;
  };

  renderForm = () => {
    const { navigation } = this.props;

    const rows = navigation.state.params.template.queryTemplate.table.rows;

    console.log(rows);

    return (
      <List style={styles.form}>
        {rows.map((row, index) => {
          let cells = row.cells,
            rowStyle = [styles.formRow],
            inputStyle = [styles.formInput];

          if (index != 0) {
            rowStyle.push(styles.formRowDivider);
          }
          if (index == 0) {
            inputStyle.push(styles.formInputFirst);
          } else if (index == rows.length - 1) {
            inputStyle.push(styles.formInputLast);
          }

          return (
            <View key={index} style={rowStyle}>
              <Text style={styles.formLabel}>{cells[0].title}</Text>
              <View style={inputStyle}>{this.renderInput(cells[1].prop)}</View>
            </View>
          );
        })}
      </List>
    );
  };

  render() {
    return (
      <PageWrapper>
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={65}>
          <PageContent>
            <View style={styles.container}>{this.renderForm()}</View>
          </PageContent>
        </KeyboardAvoidingView>
        <PageFooter>
          <Button containerStyle={styles.buttonContainer} style={styles.button} text="确定" onPress={this.onSearch} />
        </PageFooter>
      </PageWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  form: {
    width: '90%',
    marginHorizontal: 12,
    marginTop: 18,
    marginBottom: 27,
    borderColor: gStyles.color.mBorderColor,
    borderWidth: StyleSheet.hairlineWidth
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
    flex: 2,
    fontSize: 15,
    color: '#333333',
    paddingVertical: 13,
    backgroundColor: gStyles.color.bgColor,
    paddingLeft: 5
  },
  formInput: {
    flex: 3,
    paddingLeft: 5
    //fontSize: 14,
    //color: '#807e7e',
  },
  formInputFirst: {
    borderTopRightRadius: 10
  },
  formInputLast: {
    borderBottomRightRadius: 10
  },
  inputItem: {
    height: 30,
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingRight: 0
  },
  buttonContainer: {
    width: 200,
    height: 35
  },
  button: {
    fontSize: 16
  }
});

export default Search;
