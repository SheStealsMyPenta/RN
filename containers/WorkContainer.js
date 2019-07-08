import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TabIcon from '../components/TabIcon';
import Work from '../pages/Work';
import * as workActions from '../actions/workActions';

const normal = require('../img/tab_job.png');
const selected = require('../img/tab_job_selected.png');
class WorkContainer extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '工作',
    tabBarIcon: ({ focused }) => <TabIcon source={focused?selected:normal} size={23}/>,
    headerLeft: <View />,
    headerRight: <View />
  });

  render() {
    return <Work {...this.props} />;
  }
}

const mapStateToProps = state => {
  const { login, functions, work } = state;
  return {
    login,
    functions,
    work
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators({ ...workActions }, dispatch);
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkContainer);
