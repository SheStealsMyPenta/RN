import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet } from 'react-native';

import ReturnButton from '../components/ReturnButton';
import ImageButton from '../components/ImageButton';
import FormDetail from '../pages/FormDetail';

import gStyles from '../constants/Styles';

import * as loadingActions from '../actions/loadingActions';
import * as reimbActions from '../actions/reimbActions';
import * as approvalActions from '../actions/approvalActions';

class FormDetailContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    let title = '';
    if (navigation.state.params) {
      title = navigation.state.params.title || '';
    }

    if (title == '') {
      return {
        headerLeft: <ReturnButton navigation={navigation} />,
        title: '',
        headerRight: <View />
      };
    }

    return {
      headerLeft: <ReturnButton navigation={navigation} />,
      title: `${title}`,
      headerRight: (
        <View style={styles.headerRightContainer}>
          <ImageButton
            source={require('../img/delete.png')}
            onPress={() => {
              navigation.state.params.onDelete && navigation.state.params.onDelete();
              //navigation.navigate('Message');
            }}
            containerStyle={styles.headerRightImageContainer}
            style={{ tintColor: gStyles.color.sColor }}
          />
          <ImageButton
            source={require('../img/modify2.png')}
            onPress={() => {
              navigation.state.params.onPrint && navigation.state.params.onPrint();
              //navigation.navigate('Search');
            }}
            containerStyle={styles.headerRightImageContainer}
            style={{ tintColor: gStyles.color.sColor }}
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
    return <FormDetail {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  const { login, reimb, user } = state;
  return {
    token: login.auth.token,
    reimb,
    user
  };
}

function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({ ...loadingActions, ...reimbActions, ...approvalActions }, dispatch);
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

export default connect(mapStateToProps, mapDispatchToProps)(FormDetailContainer);
