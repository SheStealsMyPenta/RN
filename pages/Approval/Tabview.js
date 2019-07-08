import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import PageWrapper from '../../components/PageWrapper';
import Text from '../../components/Text';
import LoadingView from '../../components/LoadingView';
import LoadingViewFinish from '../../components/LoadingViewFinish';
import ToastUtil from '../../utils/ToastUtil';
import ListItem from './ListItem';

import gStyles from '../../constants/Styles';

class Tabview extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { login, actions } = this.props.screenProps;

    this.tabData = this.getTabData();
    actions.fetchApprovalListTemplate(login.auth.token, this.tabData.id, this.tabData.updateTime);
  }

  getTabData = () => {
    const { tabsData } = this.props.screenProps;
    const { routeName } = this.props.navigation.state;

    let data = null;
    for (let i in tabsData) {
      if (routeName == tabsData[i].id) {
        data = tabsData[i];
        break;
      }
    }

    return data;
  };

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
    const { navigation } = this.props.screenProps;

    //console.log(this.defineLinks, this.getShowDefineId(value.billDefineID), value);
    navigation.navigate('FormDetail', {
      type: 'approval',
      listID: this.getTabData(navigation.state.routeName).id,
      listItemID: value.id,
      dataID: value.billDataID,
      defineID: this.getShowDefineId(value.billDefineID)
    });
  };

  renderItem = ({ item }) => {
    return <ListItem template={this.template} value={item} onPress={this.onPress} />;
  };

  handleRefresh = () => {
    const { login, actions, approval } = this.props.screenProps;

    let listObj = approval.list[this.tabData.id];
    if (!listObj) return;

    actions.fetchApprovalListData(login.auth.token, this.tabData.id, true, 0);
  };

  handleLoadMore = () => {
    const { login, actions, approval } = this.props.screenProps;

    let listObj = approval.list[this.tabData.id];
    if (!listObj || listObj.total <= listObj.data.length) return;

    actions.fetchApprovalListData(login.auth.token, this.tabData.id, false, listObj.data.length);
  };

  renderFooter = () => {
    const { navigation: parentNavigation, approval } = this.props.screenProps;

    let listObj = approval.list[this.tabData.id];
    if (!listObj) return <View />;

    if (listObj.total <= listObj.data.length) return <LoadingViewFinish />;

    return listObj.loading ? <LoadingView wrapperStyle={{ marginBottom: 20 }} /> : <View />;
  };

  render() {
    const { navigation: parentNavigation, approval } = this.props.screenProps;

    let tabInfo = approval.list[this.tabData.id];

    if (!tabInfo) {
      return <View />;
    }
    this.defineLinks = tabInfo.template.billDefineLinks;
    this.template = tabInfo.template.listTemplate;

    let data = tabInfo.data,
      refreshing = tabInfo.refreshing || false;

    return (
      <PageWrapper style={styles.container}>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={this.renderFooter}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
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

export default Tabview;
