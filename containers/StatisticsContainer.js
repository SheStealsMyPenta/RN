import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet } from 'react-native';

import ReturnButton from '../components/ReturnButton';
import ImageButton from '../components/ImageButton';
import Statistics from '../pages/Statistics';

import gStyles from '../constants/Styles';

import * as loadingActions from '../actions/loadingActions';
import * as statisticsActions from '../actions/statisticsActions';

class StatisticsContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    let title = '';

    if (navigation.state.params) {
      title = navigation.state.params.title || '';
    }

    return {
      headerLeft: <ReturnButton navigation={navigation} />,
      title: `${title}`,
      headerRight: (
        <View style={styles.headerRightContainer}>
          <ImageButton
            source={require('../img/search.png')}
            containerStyle={styles.headerRightImageContainer}
            onPress={() => {
              navigation.state.params.search && navigation.state.params.search();
            }}
          />
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Statistics {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  const { login, statistics } = state;
  return {
    login,
    statistics
  };
}

function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({ ...loadingActions, ...statisticsActions }, dispatch);
  return {
    actions
  };
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: gStyles.size.headerRightMargin
  },
  headerRightImageContainer: {
    padding: gStyles.size.headerIconPadding
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsContainer);
