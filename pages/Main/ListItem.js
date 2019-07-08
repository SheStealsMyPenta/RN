import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Toast, List } from 'antd-mobile';
import ListStyle from 'antd-mobile/lib/list/style/index';

import Text from '../../components/Text';
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
    const { template: { table: { rows } }, value, onPress } = this.props;

    //console.log('listItem', this.props.template, value);

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
          {/*
          <View style={styles.topView}>
            <Text style={styles.title}>周明</Text>
            <Text style={styles.department}>设计部</Text>
            <Text style={styles.number}>N02-20170619-102011</Text>
          </View>
          <Image style={styles.dividerImage} source={require('../../img/item_divider.png')} />
          <View style={styles.bottomView}>
            <Text style={styles.describe}>这是这个表单的描述</Text>
            <Text style={styles.money}>￥3,000.00</Text>
            <View style={styles.bottomSubView}>
              <Text style={styles.date}>2017/08/18 18:11:22</Text>
              <View style={styles.bottomProgressView}>
                <Image style={styles.bottomProgressImage} source={require('../../img/item_progress_user.png')} />
                <Text style={styles.progress}>财务部审批中</Text>
              </View>
            </View>
          </View>
          */}
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
    borderRadius: 5,
    marginBottom: 10
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
  /*
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  bottomView: {
    flexDirection: 'column',
    width: '100%'
  },
  dividerImage: {
    height: 14,
    width: '100%'
  },
  title: {
    color: gStyles.color.mTextColor,
    minWidth: 48,
    marginRight: 5,
    fontSize: 16
  },
  department: {
    color: gStyles.color.sTextColor,
    fontSize: 13
  },
  number: {
    flex: 1,
    textAlign: 'right',
    color: gStyles.color.mTextColor,
    fontSize: 14
  },
  describe: {
    width: '100%',
    marginTop: 6,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: gStyles.color.sTextColor
  },
  money: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: gStyles.color.mTextColor,
    marginBottom: 12
  },
  bottomSubView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  date: {
    fontSize: 13,
    color: gStyles.color.sTextColor
  },
  bottomProgressView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end'
  },
  bottomProgressImage: {
    height: 13,
    width: 12,
    marginRight: 5
  },
  progress: {
    textAlign: 'left',
    fontSize: 13,
    color: gStyles.color.sTextColor
  }
  */
});

export default ListItem;
