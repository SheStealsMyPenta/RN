import React from 'react';
import { Text, Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Toast, List } from 'antd-mobile';
import ListStyle from 'antd-mobile/lib/list/style/index';

import gStyles from '../../constants/Styles';
import * as FormHelper from '../../utils/FormHelper';

const newListStyle = {};
for (const key in ListStyle) {
  if (Object.prototype.hasOwnProperty.call(ListStyle, key)) {
    if (typeof ListStyle[key] === 'object') {
      newListStyle[key] = { ...StyleSheet.flatten(ListStyle[key]) };
    } else {
      //newListStyle[key] = ListStyle[key];
    }
    switch (key) {
      case 'Body':
        newListStyle[key].borderTopWidth = 0;
      case 'BodyBottomLine':
        newListStyle[key].borderBottomWidth = 0;
      default:
    }
  }
}

class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  isRealTitle = title => {
    if (title && title.length > 2 && title[0] == '{' && title[1] == '#') {
      return false;
    }

    return true;
  };

  getValue = title => {
    const { value: { fields } } = this.props;
    let fieldName = FormHelper.getInputFieldNameFromTitle(title),
      fieldProp = fields[fieldName];

    if (fieldProp) {
      return fieldProp.value;
    }

    return '';
  };

  render() {
    const { template, value, onPress } = this.props;

    if (!template || !template.listTemplate) {
      return <View />;
    }

    let rows = template.listTemplate.table.rows;
    return (
      <TouchableOpacity onPress={() => onPress(value)}>
        <View style={styles.container}>
          <List style={styles.form} styles={StyleSheet.create(newListStyle)}>
            {rows.map((row, index) => {
              let cells = row.cells,
                title = cells[0].title,
                rowStyle = [styles.formRow];

              if (index != 0) {
                rowStyle.push(styles.formRowDivider);
              }

              if (!this.isRealTitle(title)) {
                return (
                  <View key={index} style={rowStyle}>
                    <Text numberOfLines={2} style={styles.formLabel}>
                      {this.getValue(title)}
                    </Text>
                  </View>
                );
              }

              return (
                <View key={index} style={rowStyle}>
                  <Text style={styles.formLabel}>{title}</Text>
                  <Text numberOfLines={2} style={styles.formValue}>
                    {this.getValue(cells[1].title)}
                  </Text>
                </View>
              );
            })}
          </List>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 8,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  form: {
    width: '100%'
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  formRowDivider: {
    borderTopColor: gStyles.color.mBorderColor,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  formLabel: {
    flex: 1,
    fontSize: 15,
    color: gStyles.color.mTextColor,
    paddingLeft: 8
  },
  formValue: {
    flex: 2,
    paddingLeft: 5,
    color: gStyles.color.sTextColor
    //fontSize: 14,
    //color: '#807e7e',
  }
});

export default ListItem;
