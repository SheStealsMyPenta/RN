import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import PageContent from '../../components/PageContent';
import Button from '../../components/Button';

import gStyles from '../../constants/Styles';

class MessageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { actions } = this.props;

    actions.resetMessageDetail();
    actions.fetchMessageDetail(1);
  }
  componentDidMount() {}
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {}

  render() {
    let { message: { detail } } = this.props;

    return <PageContent style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default MessageDetail;
