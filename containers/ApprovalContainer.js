import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as approvalActions from '../actions/approvalActions';
import gStyles from '../constants/Styles';
import TabIcon from '../components/TabIcon';
import ImageButton from '../components/ImageButton';
import Approval from '../pages/Approval';

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: gStyles.size.headerRightMargin
  },
  headerRightImageContainer: {
    padding: gStyles.size.headerIconPadding
  }
});

class ApprovalContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <View style={styles.headerRightContainer}>
          <ImageButton
            source={require('../img/search.png')}
            containerStyle={styles.headerRightImageContainer}
            onPress={() => {
              navigation.state.params.search && navigation.state.params.search();
            }}
          />
          {/*<ImageButton source={require('../img/batch_approval.png')} containerStyle={styles.headerRightImageContainer} />*/}
        </View>
      )
    };
  };


  render() {
    return <Approval {...this.props} />;
  }
}

const mapStateToProps = state => {
  const { login, approval } = state;
  return {
    login,
    approval
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators({ ...approvalActions,
  }, dispatch);
  return {
    actions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalContainer);
