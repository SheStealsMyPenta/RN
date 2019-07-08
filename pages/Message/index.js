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
import ListItem from './ListItem';

import gStyles from '../../constants/Styles';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popmenuVisible: false
    };
  }

  componentWillMount() {
    //this.props.actions.fetchMessageList(false, 1);

    this.props.navigation.setParams({
      openPopMenu: this.openPopMenu,
      showLoading: () => {
        this.props.actions.showLoading();
      }
    });
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  onPress = value => {
    const { navigate } = this.props.navigation;
    //navigate('Web', { url: 'http://www.qq.com' });
    navigate('MessageDetail', { value });
  };

  renderItem = value => <ListItem value={value} onPress={this.onPress} />;

  handleRefresh = () => {
    //this.props.actions.fetchMessageList(true, 1);
  };

  handleLoadMore = () => {
    const { message, navigation, actions } = this.props;
    //this.props.actions.fetchMessageList(false, message.page + 1);
  };

  openPopMenu = () => {
    this.setState({
      popmenuVisible: true
    });
  };

  closePopMenu = () => {
    this.setState({
      popmenuVisible: false
    });
  };

  openPopMenuSelect = item => {
    console.log(item);
  };

  renderFooter = () => {
    const { message, navigation } = this.props;

    return message.loading ? <LoadingView wrapperStyle={{ marginBottom: 20 }} /> : <View />;
  };

  render() {
    const { message, navigation } = this.props;
    let data = message.list,
      page = message.page,
      refreshing = message.refreshing || false;

    return (
      <PageWrapper>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => item.registered}
          ListFooterComponent={this.renderFooter}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
              //title="正在加载数据，请稍候..."
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
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  }
});

export default Message;
