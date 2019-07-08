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
import RadioItem from './RadioItem';
import HierachyLabel from './HierachyLabel';
import PageWrapper from '../../components/PageWrapper';
import PageFooter from '../../components/PageFooter';
import LoadingView from '../../components/LoadingView';
import * as basedataActions from '../../actions/basedataActions';

//const maxHeight = Dimensions.get('window').height;
const goBackImg = require('../../img/arrow_left.png');
var count = 1;
class BaseDataSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      levelTextDisplay: [],
      curParentID: [],
      selectedItem: this.getDefaultValue(this.props.defaultValue) || {},
      editedItem: {}, //编辑中的条目，确认后提交给selectedItem
      keyword: '',
      showSearchResult: false
    };
  }
  _submit = () => {
    if (this.state.editedItem) {
      let item = JSON.parse(JSON.stringify(this.state.editedItem));
      global.log('++++++', item);
      this.setState({
        selectedItem: item
      });
      this.props.onChange({
        base_data_id: item.base_data_id,
        base_data_name: item.base_data_name,
      });
    }else{
      this.setState({
        selectedItem: ''
      });
    }
    this.closeModal();
    this.turnOffSearchView();
  };

  onItemSelected = value => {
    //global.log('selectedItem',value);
    let { item, checked } = value;
    if (!checked) {
      let parentID = JSON.parse(JSON.stringify(this.state.curParentID));
      item.parentID = parentID;
      this.setState({
        editedItem: item
      });
    } else {
      this.setState({
        editedItem: ''
      });
    }
  };

  requestChildren = value => {
    const { base_data_id } = value;
    const { basedataName, authType, filter } = this.props;
    const { auth: { token, user } } = this.props.login;
    this.props.actions.fetchBasedataList(
      basedataName,
      token,
      user,
      base_data_id,
      authType,
      filter
    );
    levelTextDisplay = this.state.levelTextDisplay;
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
    let parentID = '';
    if (curParentID.length > 0) {
      let lastIndex = curParentID.length - 1;
      parentID = curParentID[lastIndex];
    }
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
    let isChecked = base_data_id === this.state.editedItem.base_data_id;
    let isChildrenChecked = false;
    if (this.state.editedItem.parentID) {
      isChildrenChecked =
        this.state.editedItem.parentID.indexOf(base_data_id) !== -1;
    }
    return (
      <RadioItem
        hasChildren={base_data_haschild}
        onChange={this.onItemSelected}
        requestChildren={this.requestChildren}
        item={{ index, ...item }}
        checked={isChecked || isChildrenChecked}
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
    //global.log('接收到loding',this.props.loading);
    let ret;
    if (this.state.showSearchResult) {
      ret = this.renderSearchFooter();
    } else {
      ret = this.renderListFooter();
    }
    //global.log('footer render result',ret);
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
      //ret = this.renderLoadingView();
      return <LoadingView style={{ height: 56, width: '100%' }} />;
    } else if (!hasMore) {
      return (
        <View style={{ height: 56, width: '100%', marginTop: 8 }}>
          <Text
            style={{ textAlign: 'center', alignSelf: 'center', fontSize: 14 }}
          >
            - - - 到底啦 - - -
          </Text>
        </View>
      );
    } else {
      return <View style={{ height: 56, width: '100%' }} />;
    }
  };
  renderSearchFooter = () => {
    const { basedataName, basedata } = this.props;
    const { loading, search } = basedata;
    let hasMore = false;
    if (search[basedataName]) {
      hasMore = search[basedataName].hasMore;
    }
    if (loading) {
      return <LoadingView style={{ height: 56, width: '100%' }} />;
    } else if (!hasMore) {
      return (
        <View style={{ height: 56, width: '100%', marginTop: 8 }}>
          <Text
            style={{ textAlign: 'center', alignSelf: 'center', fontSize: 14 }}
          >
            - - - 到底啦 - - -
          </Text>
        </View>
      );
    } else {
      return <View style={{ height: 56, width: '100%' }} />;
    }
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
        let item = JSON.parse(JSON.stringify(this.state.selectedItem));
        global.log('------', item);
        this.setState({
          editedItem: item
        });
        //global.log('显示列表',!basedata.baseDataDefine,!basedata.baseDataDefine[basedataName]);
        let parentID = '';
        if (this.state.curParentID.length > 0) {
          let lastIndex = this.state.curParentID.length - 1;
          parentID = this.state.curParentID[lastIndex];
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
    let item = {};
    if (defaultValue) {
      const { value, title } = defaultValue;
      item.base_data_haschild = false;
      item.is_group = false;
      item.base_data_name = title[0];
      item.base_data_id = value[0];
      if (this.state && this.state.curParentID) {
        item.parentID = this.state.curParentID;
      } else {
        item.parentID = [];
      }
    }
    //global.log(item);
    return item;
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      let postbackValue = this.getDefaultValue(nextProps.defaultValue);
      if (postbackValue.base_data_name) {
        this.setState({
          selectedItem: postbackValue
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

  /*onSearchCancel=(value)=>{
    global.log('取消搜索');
    //if(!value) return;
     if(!value) return;
    let { authType, filter, basedataName, actions } = this.props;
    let {token,user} = this.props.login.auth;
    let parentID = '';
    if (this.state.curParentID.length>0) {
      let lastIndex = this.state.curParentID.length - 1;
      parentID = this.state.curParentID[lastIndex];
    }
    this.setState({
      keyword: '',
      showSearchResult: false,
    },()=>
      actions.fetchBasedataList(basedataName, token, user, parentID, authType, filter)); 
  }*/

  renderEmpty = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Text>暂无数据</Text>
    </View>
  );

  render() {
    //表单显示文本
    let formLabelText = '请选择';
    const { basedataName, basedata } = this.props;
    const { baseDataDefine, list, search } = this.props.basedata;
    const initIndex = this.state.editedItem.index || 0;
    let title = '',
      listData = [],
      searchData = [];
    if (this.state.selectedItem && this.state.selectedItem.base_data_name) {
      //global.log('基础资料+公式触发',this.state.selectedItem);
      formLabelText = this.state.selectedItem.base_data_name;
    }
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
      if (list[basedataName] && list[basedataName].data.length > 0) {
        listData = _.filter(list[basedataName].data, itemObj => {
          //global.log('itemObj',itemObj);
          if (_.isEqual(itemObj.parentID, curParentID)) {
            return itemObj;
          }
        });
        global.log('筛选后data', listData, initIndex);
      }
      if (
        this.state.showSearchResult &&
        search[basedataName] &&
        search[basedataName].data.length > 0
      ) {
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
          style={[this.props.labelContainerStyle, styles.labelContainer]}
          onPress={this.showModal}
          disabled={this.props.disabled}
        >
          <View style={[this.props.labelContainerStyle, styles.labelContainer]}>
            <Text
              style={[
                this.props.labelTextStyle,
                this.props.disabled
                  ? styles.disabledLabelText
                  : styles.labelText
              ]}
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
              {
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
              }
              <SearchBar
                placeholder={'搜索'}
                onChange={this.onSearchInput}
                onSubmit={this.onSearchSubmit}
                //onCancel={this.onSearchCancel}
                value={this.state.keyword}
                autoCapitalize={'none'}
                returnKeyType={'search'}
              />

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
                  //initialScrollIndex={listData.length > 0 ? initIndex : null}
                  onEndReached={this.handleLoadMore}
                  onEndReachedThreshold={0.5}
                  extraData={this.state.editedItem}
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
                  //initialScrollIndex={listData.length > 0 ? initIndex : null}
                  onEndReached={this.handleLoadMore}
                  onEndReachedThreshold={0.5}
                  extraData={this.state.editedItem}
                  getItemLayout={this.onItemLayout}
                />
              )}
              {/*</PageContent>*/}
              <PageFooter style={{ marginBottom: 30 }}>
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
  disabledLabelText: {
    fontSize: 15,
    textAlign: 'left',
    color: '#999999',
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
    justifyContent: 'center',
  },
  imageButtonImg: {
    width: 10,
    height: 17.5,
    alignSelf: 'center'
  },
  searchBar: {
    marginTop: 6,
    width: '100%'
  },
  separator: {
    width: '100%',
    height: 1,
    paddingHorizontal: 14,
    backgroundColor: gStyles.color.mBorderColor,
    alignSelf: 'center'
  },
  flatList: {
    flex: 1,
    height: '80%',
    width: '100%'
  },
  listHeaderContainer: {
    flexDirection: 'row',
    height: 33,
    backgroundColor: 'white'
  },
  listHeaderImg: {
    marginLeft: 14,
    marginRight: 19,
    alignSelf: 'center'
    //height: 10,
    //width: 15,
  },
  listHeaderTextContainer: {
    width: '70%',
    justifyContent: 'center'
  },
  listHeaderText: {
    fontSize: 14,
    color: gStyles.color.mTextColor,
    textAlign: 'left'
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

export default connect(mapStateToProps, mapDispatchToProps)(BaseDataSingle);
