import React from 'react';
import PropTypes from 'prop-types';
import {
  DeviceEventEmitter,
  InteractionManager,
  FlatList,
  ListView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import store from 'react-native-simple-store';

import FormType from '../../pages/FormType';
import PageWrapper from '../../components/PageWrapper';
import LoadingView from '../../components/LoadingView';
import LoadingViewFinish from '../../components/LoadingViewFinish';
import ToastUtil from '../../utils/ToastUtil';
import ListItem from './ListItem';
import ReturnButton from '../../components/ReturnButton';

import gStyles from '../../constants/Styles';

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { actions } = this.props;

    actions.resetSearchResult();
    this.handleRefresh();
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  getShowDefineId = billDefineID => {
    let showDefineID,
      defineLinks = this.defineLinks;
    for (let i in defineLinks) {
      if (defineLinks[i].billID == billDefineID) {
        showDefineID = defineLinks[i].showDefineID;
        break;
      }
    }

    return showDefineID;
  };

  onPress = value => {
    const { navigation } = this.props;
    const { type, category } = navigation.state.params;

    navigation.navigate('FormDetail', {
      type,
      listID: category,
      listItemID: value.id,
      dataID: value.billDataID,
      defineID: this.getShowDefineId(value.billDefineID)
    });
  };

  renderItem = ({ item }) => {
    return <ListItem template={this.template} value={item} onPress={this.onPress} />;
  };

  handleRefresh = () => {
    const { navigation, actions, login } = this.props;
    const { template, defineID, type, category, queryParams } = navigation.state.params;

    actions.fetchSearchResult(login.auth.token, defineID, type, category, queryParams, true, 0);
  };

  handleLoadMore = () => {
    const { navigation, actions, login, search } = this.props;
    const { template, defineID, type, category, queryParams } = navigation.state.params;

    if (search.total <= search.list.length) return;

    actions.fetchSearchResult(login.auth.token, defineID, type, category, queryParams, false, search.list.length);
  };

  renderFooter = () => {
    const { navigation, search } = this.props;

    if (search.total <= search.list.length) return <LoadingViewFinish />;

    return search.loading ? <LoadingView wrapperStyle={{ marginBottom: 20 }} /> : <View />;
  };

  render() {
    const { search, navigation } = this.props;
    const { template, defineID, type, category, queryParams } = navigation.state.params;

    this.defineLinks = template.billDefineLinks;
    this.template = template.listTemplate;

    return (
      <PageWrapper style={styles.container}>
        <FlatList
          data={search.list}
          renderItem={this.renderItem}
          keyExtractor={item => item.billDataID}
          ListFooterComponent={this.renderFooter}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={search.refreshing}
              onRefresh={this.handleRefresh}
              tintColor={gStyles.color.mColor}
              titleColor={gStyles.color.mColor}
              colors={[gStyles.color.mColor]}
            />
          }
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </PageWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE'
  }
});

export default SearchResult;
