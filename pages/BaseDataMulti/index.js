import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Platform,
  Dimensions
} from 'react-native';
import { SearchBar } from 'antd-mobile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import ImageButton from '../../components/ImageButton';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import gStyles from '../../constants/Styles';
import CheckBoxItem from './CheckBoxItem';
import HierachyLabel from './HierachyLabel';
import SelectedDetails from './SelectedDetails';
import PageWrapper from '../../components/PageWrapper';
import PageContent from '../../components/PageContent';
import PageFooter from '../../components/PageFooter';
import LoadingView from '../../components/LoadingView';
import * as basedataActions from '../../actions/basedataActions';

//const maxHeight = Dimensions.get('window').height;
const goBackImg = require('../../img/arrow_left.png');
//var count = 1;
class BaseDataMulti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [this.getDefaultValue(this.props.defaultValue)] | [],
      editedItems: [],
      modalVisible: false,
      levelTextDisplay: [],
      curParentID: [],
      keyword: '',
      showSearchResult: false
    };
  }
  _submit = () => {
    //global.log('准备提交修改');
    let items = [...this.state.editedItems];
    let ret = items.map(function(item) {
      return {
        base_data_id: item.base_data_id,
        base_data_name: item.base_data_name
      };
    });
    global.log('多选返回', ret);
    this.props.onChange(ret);
    this.closeModal();
    this.turnOffSearchView();
    this.setState(
      {
        selectedItems: items
      },
      () => global.log('选中提交', this.state.selectedItems)
    );
  };

  onItemSelected = value => {
    const { item, checked } = value;
    let items = [];
    if (checked) {
      parentID = [...this.state.curParentID];
      item.parentID = parentID;
      items = [...this.state.editedItems];
      items.push(item);
      global.log(items);
    } else {
      items = this.state.editedItems;
      for (let i = 0; i < items.length; i++) {
        if (items[i].base_data_id === item.base_data_id) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        items.splice(index, 1);
      }
    }
    this.setState({
      editedItems: items
    });
  };

  requestChildren = value => {
    const { base_data_id } = value;
    this.props.actions.fetchBasedataList(
      this.props.basedataName,
      this.props.login.auth.token,
      this.props.login.auth.user,
      base_data_id,
      this.props.authType,
      this.props.filter
    );
    levelTextDisplay.push({
      base_data_id: value.base_data_id,
      base_data_name: value.base_data_name
    });
    let curParentID = this.state.curParentID;
    curParentID.push(value.base_data_id);
    this.setState({
      levelTextDisplay: levelTextDisplay,
      curParentID: curParentID
    });
  };

  /*
  渲染“返回上一级”列表头部
  */
  renderHeader = () => {
    if (this.state.showSearchResult) {
      return <View />;
    }
    let leng = this.state.levelTextDisplay.length;
    return leng > 0 ? (
      <TouchableOpacity
        onPress={this.onHeaderClick}
        style={styles.listHeaderContainer}
      >
        <Image source={goBackImg} style={styles.listHeaderImg} />
        <View style={styles.listHeaderTextContainer}>
          <Text style={styles.listHeaderText}>{'返回上级'}</Text>
        </View>
      </TouchableOpacity>
    ) : (
      <View />
    );
  };

  /*
  逻辑：
    1.处理列表数据，dataList回到上一个节点
    2.处理层级显示文本，回到上一个节点
  */
  onHeaderClick = () => {
    let levelTextDisplay = this.state.levelTextDisplay,
      curParentID = this.state.curParentID;
    levelTextDisplay.pop();
    curParentID.pop();
    this.setState({
      levelTextDisplay: levelTextDisplay,
      curParentID: curParentID
    });
    const { basedataName, authType, filter } = this.props;
    const { auth: { token, user } } = this.props.login;
    this.props.actions.fetchBasedataList(
      basedataName,
      token,
      user,
      parentID,
      authType,
      filter
    );
  };

  renderItem = ({ item, index }) => {
    let { base_data_haschild, base_data_id } = item;
    let isChecked = false;
    for (let i = 0; i < this.state.editedItems.length; i++) {
      if (
        this.state.editedItems[i] &&
        this.state.editedItems[i].base_data_id === base_data_id
      ) {
        isChecked = true;
        break;
      }
    }
    let isChildrenChecked = false;
    for (let i = 0; i < this.state.editedItems.length; i++) {
      if (
        this.state.editedItems[i].parentID &&
        this.state.editedItems[i].parentID.indexOf(base_data_id) !== -1
      ) {
        isChildrenChecked = true;
        break;
      }
    }
    return (
      <CheckBoxItem
        hasChildren={base_data_haschild}
        onChange={this.onItemSelected}
        requestChildren={this.requestChildren}
        item={{ index, ...item }}
        checked={isChecked || isChildrenChecked || this.state.selectAll}
        containerStyle={this.props.itemContainerStyle}
        imgStyle={this.props.itemImgStyle}
        textContainerStyle={this.props.itemTextContainerStyle}
        textStyle={this.props.itemTextStyle}
      />
    );
  };

  renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: gStyles.color.mBorderColor
      }}
    />
  );

  renderLoadingView = () => {
    return <LoadingView style={{ height: 56, width: '100%' }} />;
  };
  renderEndReachedView = () => {
    return (
      <View style={{ height: 56, width: '100%', marginTop: 8 }}>
        <Text
          style={{ textAlign: 'center', alignSelf: 'center', fontSize: 14 }}
        >
          - - - 到底啦 - - -
        </Text>
      </View>
    );
  };
  renderEmptyFooter = () => {
    return <View style={{ height: 56, width: '100%' }} />;
  };

  renderFooter = () => {
    let ret;
    if (this.state.showSearchResult) {
      ret = this.renderSearchFooter();
    } else {
      ret = this.renderListFooter();
    }
    return ret;
  };
  renderListFooter = () => {
    const { basedataName, basedata } = this.props;
    const { loading, list } = basedata;
    let hasMore = false;
    if (list[basedataName]) {
      hasMore = list[basedataName].hasMore;
    }
    if (loading) {
      ret = this.renderLoadingView();
    } else if (!hasMore) {
      ret = this.renderEndReachedView();
    } else {
      ret = this.renderEmptyFooter();
    }
    return ret;
  };
  renderSearchFooter = () => {
    const { basedataName, basedata } = this.props;
    const { loading, search } = basedata;
    let hasMore = false;
    if (search[basedataName]) {
      hasMore = search[basedataName].hasMore;
    }
    if (loading) {
      ret = this.renderLoadingView();
    } else if (!hasMore) {
      ret = this.renderEndReachedView();
    } else {
      ret = this.renderEmptyFooter();
    }
    return ret;
  };

  goBack = () => {
    this.closeModal();
    this.turnOffSearchView();
  };

  showModal = () => {
    this.setState(
      {
        modalVisible: true
      },
      () => {
        let { authType, filter, basedataName, actions, basedata } = this.props,
          { token, user } = this.props.login.auth;
        let items = JSON.parse(JSON.stringify(this.state.selectedItems));
        this.setState({
          editedItems: items
        });
        let parentID = '';
        if (items[0] && items[0].parentID) {
          let lastIndex = items[0].parentID.length - 1;
          parentID = items[0].parentID[lastIndex];
          global.log('+++++', parentID);
        }
        if (!basedata.baseDataDefine[basedataName]) {
          //请求基础资料表头和ID
          actions.fetchBasedataDefine(basedataName, token);
        }
        //请求数据
        actions.fetchBasedataList(
          basedataName,
          token,
          user,
          parentID,
          authType,
          filter
        );
      }
    );
  };

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  };
  turnOffSearchView = () => {
    this.setState({
      showSearchResult: false
    });
  };

  componentWillMount() {}
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}

  getDefaultValue = defaultValue => {
    let items = [];
    if (defaultValue && defaultValue.value) {
      const { value, title } = defaultValue;
      for (let i = 0; i < value.length; i++) {
        items[i]={};
        items[i].base_data_haschild = false;
        items[i].is_group = false;
        items[i].base_data_name = title[i];
        items[i].base_data_id = value[i];
        if (this.state && this.state.curParentID) {
          items[i].parentID = this.state.curParentID;
        } else {
          items[i].parentID = [];
        }
      }
    }
    global.log('公式触发处理',items);
    return items;
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      let postbackValue = this.getDefaultValue(nextProps.defaultValue);
      global.log('公式触发', nextProps.defaultValue,postbackValue);
      if (postbackValue.length>0) {
        this.setState({
          selectedItems: [...postbackValue]
        });
      }
    }
  }

  handleLoadMore = info => {
    let {
      actions,
      basedataName,
      basedata: { loading, list, search }
    } = this.props;
    let { token } = this.props.login.auth;
    let curParentID = '';
    if (this.state.curParentID.length != 0) {
      let lastIndex = this.state.curParentID.length - 1;
      curParentID = this.state.curParentID[lastIndex];
    }
    //global.log('到底啦',loading,hasMore,search.hasMore);
    if (loading) return;
    if (this.state.showSearchResult) {
      if (search[basedataName].hasMore) {
        //global.log('获取更多搜索列表');
        actions.searchBasedataListMore(
          basedataName,
          curParentID,
          'more',
          token
        );
      }
    } else {
      if (list[basedataName].hasMore) {
        //global.log('获取更多列表');
        actions.fetchBasedataListMore(basedataName, curParentID, 'more', token);
      }
    }
  };

  onItemLayout = (data, index) => ({
    length: 55, //item 行高
    offset: (55 + 1) * index, //item行高+separator高
    index
  });

  onCheckDetails = value => {
    this.setState({
      editedItems: value
    });
  };

  onSearchInput = value => {
    this.setState({
      keyword: value
    });
  };

  onSearchSubmit = value => {
    let { authType, filter, basedataName, actions } = this.props;
    let { token, user } = this.props.login.auth;
    let parentID = '';
    if (this.state.curParentID.length > 0) {
      let lastIndex = this.state.curParentID.length - 1;
      parentID = this.state.curParentID[lastIndex];
    }
    if (value) {
      this.setState(
        {
          showSearchResult: true
        },
        () => {
          //global.log('搜索前清空state.search',this.state.search);
          actions.searchBasedataList(
            basedataName,
            token,
            this.state.keyword,
            parentID,
            authType
          );
        }
      );
    } else {
      //global.log('删除搜索关键字，获取常规列表',this.state.baseDataList);
      actions.fetchBasedataList(
        basedataName,
        token,
        user,
        parentID,
        authType,
        filter
      );
      this.turnOffSearchView();
    }
    //global.log('提交搜索');
  };

  renderEmpty = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Text>暂无数据</Text>
    </View>
  );

  render() {
    let formLabelText = ['请选择'],
      details = [];
    if (this.state.selectedItems.length > 0) {
      formLabelText = this.state.selectedItems
        .map(item => item.base_data_name)
        .join(',');
    }
    if (this.state.editedItems.length > 0) {
      details = this.state.editedItems;
    }
    const { basedataName, basedata } = this.props;
    const { baseDataDefine, list, search } = this.props.basedata;
    //const initIndex = this.state.editedItems.index || 0;
    let title = '',
      listData = [],
      searchData = [];
    let curParentID = '';
    if (this.state.curParentID.length != 0) {
      let lastIndex = this.state.curParentID.length - 1;
      curParentID = this.state.curParentID[lastIndex];
    }
    if (this.state.modalVisible) {
      title =
        baseDataDefine && baseDataDefine[basedataName]
          ? baseDataDefine[basedataName].title
          : '';
      //global.log(basedataName,list[basedataName]);
      if (list[basedataName]) {
        listData = _.filter(list[basedataName].data, itemObj => {
          //global.log('itemObj',itemObj);
          if (_.isEqual(itemObj.parentID, curParentID)) {
            return itemObj;
          }
        });
        global.log('筛选后data', listData);
      }
      if (this.state.showSearchResult && search[basedataName]) {
        searchData = _.filter(search[basedataName].data, itemObj => {
          if (_.isEqual(itemObj.parentID, curParentID)) {
            return itemObj;
          }
        });
      }
    }
    return (
      <View>
        <TouchableOpacity
          style={[styles.labelContainer, this.props.labelContainerStyle]}
          onPress={this.showModal}
          disabled={this.props.disabled}
        >
          <View style={[styles.labelContainer, this.props.labelContainerStyle]}>
            <Text
              style={[styles.labelText, this.props.labelTextStyle]}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {formLabelText}
            </Text>
          </View>
        </TouchableOpacity>
        {this.state.modalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={this.closeModal}
          >
            <PageWrapper>
              <PageHeader
                headerLeft={
                  <ImageButton
                    containerStyle={styles.imageButtonContainer}
                    style={styles.imageButtonImg}
                    source={require('../../img/return.png')}
                    onPress={this.goBack}
                  />
                }
                text={title}
                headerRight={<View style={styles.imageButtonContainer} />}
              />
              <View>
                <SearchBar
                  placeholder={'搜索'}
                  onChange={this.onSearchInput}
                  onSubmit={this.onSearchSubmit}
                  //onBlur={this.onSearchCancel}
                  value={this.state.keyword}
                  autoCapitalize={'none'}
                  returnKeyType={'search'}
                />
              </View>
              {this.state.levelTextDisplay.length != 0 && (
                <HierachyLabel items={this.state.levelTextDisplay} />
              )}
              {/*<PageContent >*/}
              {this.state.showSearchResult && (
                <FlatList
                  style={styles.flatList}
                  data={searchData}
                  renderItem={this.renderItem}
                  ItemSeparatorComponent={this.renderSeparator}
                  keyExtractor={item => item.base_data_id}
                  ListHeaderComponent={this.renderHeader}
                  ListFooterComponent={this.renderFooter}
                  ListEmptyComponent={this.renderEmpty}
                  //initialScrollIndex={this.state.editedItem.index || 0}
                  onEndReached={this.handleLoadMore}
                  onEndReachedThreshold={0.5}
                  extraData={this.state.editedItems}
                  getItemLayout={this.onItemLayout}
                />
              )}
              {!this.state.showSearchResult && (
                <FlatList
                  style={styles.flatList}
                  data={listData}
                  renderItem={this.renderItem}
                  ItemSeparatorComponent={this.renderSeparator}
                  keyExtractor={item => item.base_data_id}
                  ListHeaderComponent={this.renderHeader}
                  ListFooterComponent={this.renderFooter}
                  ListEmptyComponent={this.renderEmpty}
                  //initialScrollIndex={this.state.editedItem.index || 0}
                  onEndReached={this.handleLoadMore}
                  onEndReachedThreshold={0.5}
                  extraData={this.state.editedItems}
                  getItemLayout={this.onItemLayout}
                />
              )}
              <SelectedDetails
                selectedItems={details}
                onChange={this.onCheckDetails}
              />
              {/*</PageContent>*/}
              <PageFooter>
                <Button
                  style={styles.buttonText}
                  containerStyle={styles.button}
                  text="确定"
                  onPress={this._submit}
                />
              </PageFooter>
            </PageWrapper>
          </Modal>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  labelContainer: {
    width: '100%',
    height: 40,
    //borderStyle: 'solid',
    //borderWidth: 1,
    //borderColor: gStyles.color.mBorderColor,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  labelText: {
    fontSize: 15,
    textAlign: 'left',
    color: gStyles.color.tTextColor,
    paddingLeft: 4
  },
  headerStyle: {
    height: Platform.OS === 'ios' ? 70 : 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerTitleStyle: {
    //textAlign: "center",
    alignSelf: 'center',
    color: gStyles.color.mTextColor,
    fontSize: 16,
    fontWeight: 'bold'
  },
  imageButtonContainer: {
    width: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  imageButtonImg: {
    width: 10,
    height: 17.5,
    alignSelf: 'center'
  },
  gap: {
    marginTop: 15
  },
  flatList: {
    height: '50%',
    width: '100%'
  },
  button: {
    alignSelf: 'center',
    height: 44,
    width: '80%'
  },
  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
    padding: 13
  }
});

function mapStateToProps(state, props) {
  const { login, basedata } = state;
  return {
    login,
    basedata
  };
}

function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({ ...basedataActions }, dispatch);
  return {
    actions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseDataMulti);
