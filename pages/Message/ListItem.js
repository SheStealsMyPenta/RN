import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';

import Text from '../../components/Text';
import gStyles from '../../constants/Styles';

const ListItem = ({ value, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(value)}>
      <View style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.title} numberOfLines={1}>通知</Text>
          <Text style={styles.date}>2017/07/13 17:52</Text>
        </View>
          <Text style={styles.describe} numberOfLines={1} >这是这个很长很长很长很长很长很长的消息的描述内容</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    marginHorizontal: 10,
    marginVertical : 4,
    borderRadius: 5
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    flex: 1,
    color: gStyles.color.mTextColor,
    minWidth: 48,
    marginRight: 5,
    fontSize: 16
  },
  date: {
    textAlign: 'right',
    color: gStyles.color.mTextColor,
    fontSize: 14
  },
  describe: {
    width: '100%',
    marginTop: 10,
    fontSize: 12,
    color: gStyles.color.sTextColor
  },
});

export default ListItem;
