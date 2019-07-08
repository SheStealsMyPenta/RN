import React, { Component } from 'react';
import { View, Platform, StyleSheet } from 'react-native';

import gStyles from '../constants/Styles';
import Text from './Text';

class PageHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.header}>
        {this.props.headerLeft}
        <Text style={styles.headerText}>{this.props.text}</Text>
        {this.props.headerRight}
      </View>
    );
  }
}

PageHeader.defaultProps = {
  text: '',
  headerLeft: <View />,
  headerRight: <View />
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    height: Platform.OS === 'ios' ? gStyles.size.headerHeight + 20 : gStyles.size.headerHeight,
    backgroundColor: gStyles.color.mColor
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: gStyles.color.sColor,
    alignSelf: 'center',
  }
});

export default PageHeader;
