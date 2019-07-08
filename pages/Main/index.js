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

import gStyles from '../../constants/Styles';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popmenuVisible: false
    };
  }

  componentWillMount() {
    const { navigation, actions, login, user, reimb: { tabs } } = this.props;

    actions.fetchReimbListTemplate(
      login.auth.token,
      this.props.navigation.state.routeName,
      tabs[0].id,
      tabs[0].updateTime
    );
    //actions.fetchReimbList(this.props.navigation.state.routeName, false, 1);
    //actions.fetchApprovalListTemplate(login.auth.token, this.tabData.id, this.tabData.updateTime);

    navigation.setParams({
      openPopMenu: this.openPopMenu,
      search: this.search,
    });
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

    navigation.navigate('FormDetail', {
      type: 'reimb',
      listID: this.props.navigation.state.routeName,
      listItemID: value.id,
      dataID: value.billDataID,
      defineID: this.getShowDefineId(value.billDefineID)
    });
    //navigate('Web', { url: 'http://www.qq.com' });
    //navigate('FormDetail', { value });
  };

  //renderItem = value => <ListItem value={value} onPress={this.onPress} />;
  renderItem = ({ item }) => {
    return <ListItem template={this.template} value={item} onPress={this.onPress} />;
  };

  handleRefresh = () => {
    const { navigation, actions, login, reimb: { tabs } } = this.props;

    actions.fetchReimbListData(login.auth.token, navigation.state.routeName, tabs[0].id, true, 0);
  };

  handleLoadMore = () => {
    const { login, navigation, actions, reimb } = this.props;
    let listObj = reimb[`${navigation.state.routeName}List`];

    if (!listObj || listObj.total <= listObj.list.length) return;

    actions.fetchReimbListData(
      login.auth.token,
      navigation.state.routeName,
      reimb.tabs[0].id,
      false,
      listObj.list.length
    );
  };

  search = () => {
    const { login, navigation, actions, reimb } = this.props;
    let listObj = reimb[`${navigation.state.routeName}List`];

    navigation.navigate('Search', {
      type: 'reimb',
      category: navigation.state.routeName,
      defineID: reimb.tabs[0].id,
      template: listObj.template
    });
    //console.log(navigation.state.routeName, reimb.tabs[0].id, listObj.template);
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

  onPopMenuSelect = item => {
    const { navigation } = this.props;

    navigation.navigate('FormEditor', { type: 'new', defineID: item.id });
  };

  renderFooter = () => {
    const { reimb, navigation } = this.props;
    let listObj = reimb[`${navigation.state.routeName}List`];

    if (listObj.total <= listObj.list.length) return <LoadingViewFinish />;

    return listObj.loading ? <LoadingView wrapperStyle={{ marginBottom: 20 }} /> : <View />;
  };

  getFunctions = functions => {
    return Object.values(functions)
      .filter(item => item.typename && item.typename.toLowerCase() == 'bill_function')
      .map(item => {
        return {
          id: item.id,
          title: item.title,
          imageID: item.imageID
        };
      });
  };

  render() {
    const { functions = {}, reimb, navigation } = this.props;
    let listObj = reimb[`${this.props.navigation.state.routeName}List`];

    if (!listObj.template) {
      return <View />;
    }
    this.defineLinks = listObj.template.billDefineLinks;
    this.template = listObj.template.listTemplate;

    return (
      <PageWrapper style={styles.container}>
        <FormType
          onItemClick={this.onPopMenuSelect}
          requestCloseModal={this.closePopMenu}
          visible={this.state.popmenuVisible}
          items={this.getFunctions(functions)}
        />
        <FlatList
          data={listObj.list}
          renderItem={this.renderItem}
          keyExtractor={item => item.billDataID}
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

export default Main;
