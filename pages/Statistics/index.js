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

import PageWrapper from '../../components/PageWrapper';
import LoadingView from '../../components/LoadingView';
import LoadingViewFinish from '../../components/LoadingViewFinish';
import ToastUtil from '../../utils/ToastUtil';
import ListItem from './ListItem';

import gStyles from '../../constants/Styles';

class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { navigation, actions, login } = this.props;
    const { id, title, queryParams } = navigation.state.params;

    this._queryParams = queryParams;
    actions.fetchStatisticsListTemplate(login.auth.token, id, queryParams, new Date('2017-11-01').getTime());

    navigation.setParams({
      title,
      search: this.onSearch
    });
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  onSearch = () => {
    const { navigation, statistics } = this.props;
    const { id } = navigation.state.params;

    navigation.navigate('StatisticsSearch', { template: statistics[id].template, startSearch: this.startSearch });
  };

  startSearch = queryParams => {
    const { navigation, login, actions, statistics } = this.props;
    const { id } = navigation.state.params;

    this._queryParams = queryParams;
    actions.fetchStatisticsListData(login.auth.token, id, this._queryParams, true, 0);
  };

  onPress = value => {
    const { navigation, statistics } = this.props;
    const { id } = navigation.state.params;

    navigation.navigate('StatisticsDetail', { template: statistics[id].template, value });
  };

  //renderItem = value => <ListItem value={value} onPress={this.onPress} />;
  renderItem = ({ item }) => {
    const { navigation, statistics } = this.props;
    const { id } = navigation.state.params;

    return <ListItem template={statistics[id].template} value={item} onPress={this.onPress} />;
  };

  handleRefresh = () => {
    const { navigation, actions, login } = this.props;
    const { id } = navigation.state.params;

    actions.fetchStatisticsListData(login.auth.token, id, this._queryParams, true, 0);
  };

  handleLoadMore = () => {
    const { login, navigation, actions, statistics } = this.props;
    const { id } = navigation.state.params;

    let listObj = statistics[id];

    if (!listObj || listObj.total <= listObj.data.length) return;

    actions.fetchStatisticsListData(login.auth.token, id, this._queryParams, false, listObj.data.length);
  };

  renderFooter = () => {
    const { navigation, statistics } = this.props;
    const { id } = navigation.state.params;

    let listObj = statistics[id];
    if (!listObj || listObj.total <= listObj.data.length) return <LoadingViewFinish />;

    return listObj.loading ? <LoadingView wrapperStyle={{ marginBottom: 20 }} /> : <View />;
  };

  render() {
    const { statistics, navigation } = this.props;
    const { id } = navigation.state.params;

    let listObj = statistics[id];

    if (!listObj || !listObj.template) {
      return <View />;
    }
    /*
    this.defineLinks = listObj.template.billDefineLinks;
    this.template = listObj.template.listTemplate;
    */

    return (
      <PageWrapper style={styles.container}>
        <FlatList
          data={listObj.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index}
          ListFooterComponent={this.renderFooter}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={listObj.refreshing}
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

export default Statistics;
