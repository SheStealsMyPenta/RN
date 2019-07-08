import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet } from 'react-native';

import ReturnButton from '../components/ReturnButton';
import ImageButton from '../components/ImageButton';
import FormEditor from '../pages/FormEditor';

import gStyles from '../constants/Styles';

import * as loadingActions from '../actions/loadingActions';
import * as reimbActions from '../actions/reimbActions';

class FormEditorContainer extends Component {
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
            source={require('../img/export.png')}
            onPress={() => {
              navigation.state.params.onPrint && navigation.state.params.onPrint();
              //navigation.navigate('FormPreviewer');
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
    return <FormEditor {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  const { login, reimb, user } = state;
  return {
    token: login.auth.token,
    reimb,
    user,
  };
}

function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({ ...loadingActions, ...reimbActions }, dispatch);
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

export default connect(mapStateToProps, mapDispatchToProps)(FormEditorContainer);
