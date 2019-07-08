import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import PageContent from '../../components/PageContent';
import Button from '../../components/Button';
import Text from '../../components/Text';
import ReturnButton from '../../components/ReturnButton';

import gStyles from '../../constants/Styles';

class ApprovalProcess extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { navigation, token, actions } = this.props;
    const { defineID, dataID } = navigation.state.params;

    actions.fetchApprovalProcess(token, defineID, dataID);
  }

  renderProcess = (item, index) => {
    return (
      <View key={index} style={styles.process}>
        <View style={styles.headerLeft}>
          <Image style={styles.image} source={require('../../img/process.png')} />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.title}>{item.approvalResultTitle}</Text>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.userName}>{item.approvalUserTitle}</Text>
              <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Text style={styles.time}>{item.approvalDate}</Text>
              </View>
            </View>
            <Text style={styles.userPost}>{item.approvalUserPost}</Text>
          </View>
          <Text style={styles.describe}>{item.approvalMessage}</Text>
        </View>
      </View>
    );
  };

  render() {
    const { approval: { process } } = this.props;
    return (
      <PageContent style={styles.container}>
        {process &&
          process.map((item, index) => {
            return this.renderProcess(item, index);
          })}
      </PageContent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5
  },
  process: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 1,
    backgroundColor: gStyles.color.sColor
  },
  headerLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
    marginRight: 12
  },
  headerRight: {
    flex: 1,
    justifyContent: 'center'
  },
  image: {
    width: 45,
    height: 45
  },
  title: {
    fontSize: 15,
    color: gStyles.color.mTextColor,
    marginBottom: 9
  },
  userName: {
    fontSize: 12,
    color: gStyles.color.sTextColor,
  },
  userPost: {
    fontSize: 12,
    color: gStyles.color.sTextColor,
    marginTop: 5
  },
  time: {
    fontSize: 12,
    color: gStyles.color.sTextColor,
    paddingRight: 5
  },
  describe: {
    fontSize: 14,
    color: gStyles.color.mTextColor,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 6,
    paddingVertical: 9,
    marginTop: 9,
    borderRadius: 5,
    overflow: 'hidden'
  }
});

export default ApprovalProcess;
