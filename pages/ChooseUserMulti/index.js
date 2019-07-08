import React from 'react';
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
  TextInput
} from 'react-native';
import { SearchBar } from 'antd-mobile';

import ImageButton from '../../components/ImageButton';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import gStyles from '../../constants/Styles';
import CheckBoxItem from './CheckBoxItem';
import PageWrapper from '../../components/PageWrapper';
import PageFooter from '../../components/PageFooter';
import LoadingView from '../../components/LoadingView';

class ChooseUserMulti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      msg: this.props.title === '同意' ? '同意' : '',
      //hasMore: this.props.basedata.hasMore || false,
      //length: this.props.basedata.length,
      modalVisible: props.visible,
      //defaultTexts: ['请选择,'],
      keyword: ''
    };
  }
  _submit = () => {
    this.state.selectedItems.map(item => {
      delete item.index;
    });
    //console.log(items);
    let value = { msg: this.state.msg, items: this.state.selectedItems };
    this.props.onChange(value);
    this.closeModal();
    this.setState({
      selectedItems: [],
      msg: '',
      modalVisible: false,
      keyword: ''
    });
  };
  onItemSelected = value => {
    const { item, checked } = value;
    //console.log('selectedItem',value,item);
    //console.log('+++++',value);
    let items, texts;
    let placeholder = '请选择,';
    if (checked) {
      //parentID = JSON.parse(JSON.stringify(this.state.curParentID));
      //item.parentID = parentID;
      items = this.state.selectedItems;
      //texts = this.state.defaultTexts;
      //删除默认text
      /*if(texts.indexOf(placeholder)!==-1){
        let pos = texts.indexOf(placeholder);
        texts.splice(pos,1);
      }*/
      //console.log('++++',items);
      //加入新选中item
      items.push(item);
      //texts.push(item.base_data_name+',');
      //console.log('++++++++',items);
    } else {
      items = this.state.selectedItems;
      //texts = this.state.defaultTexts;
      let index = -1;
      for (let i = 0; i < items.length; i++) {
        if (items[i].index === item.index) {
          index = i;
          break;
        }
      }
      //console.log('元素index',index,item,items);
      if (index !== -1) {
        items.splice(index, 1);
        //texts.splice(index,1);
      }
      //如果texts长度为0，增加默认'请选择'文本
      /*if(texts.length === 0){
        texts.push(placeholder);
      }*/
    }
    this.setState({
      selectedItems: items
      //defaultTexts: texts
    });
  };
  renderItem = ({ item, index }) => {
    let { fieldName } = item;
    let isChecked = false;
    for (let i = 0; i < this.state.selectedItems.length; i++) {
      if (this.state.selectedItems[i].fieldName === fieldName) {
        isChecked = true;
        break;
      }
    }
    //console.log('选中的item信息',this.state.selectedItem,isChecked);
    /* let isChildrenChecked=false;
    //console.log('是否选中',isChecked,isChildrenChecked);
    for(let i=0;i<this.state.selectedItems.length;i++){
      if(this.state.selectedItems[i].parentID.indexOf(base_data_id)!==-1){
        isChildrenChecked = true;
        break;
      }
    }*/
    return (
      <CheckBoxItem
        //hasChildren={false}
        onChange={this.onItemSelected}
        //requestChildren = {this.requestChildren}
        item={{ index, ...item }}
        checked={isChecked}
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

  renderHeader = () => (
    <View>
      <SearchBar placeholder="搜索" maxLength={8} onChange={this.onSearch} />
    </View>
  );

  renderFooter = () => (
    <View style={{ height: 56, width: '100%', marginTop: 8 }}>
      <Text style={{ textAlign: 'center', alignSelf: 'center', fontSize: 14 }}>
        - - - 到底啦 - - -
      </Text>
    </View>
  );

  renderEmpty = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Text>暂无数据</Text>
    </View>
  );

  showModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  };

  onChangeMsg = text => {
    this.setState({
      msg: text.trim()
    });
  };

  onCheckDetails = value => {
    this.setState({
      selectedItems: value
    });
  };

  onSearch = value => {
    this.setState({
      keyword: value.trim()
    });
  };

  onFilter = (src, keyword) => {
    let results = [];
    for (let i = 0; i < src.length; i++) {
      let title = src[i].title;
      if (title.indexOf(keyword) !== -1) {
        results.push(src[i]);
      }
    }
    return results;
  };

  componentWillMount() {}
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillReceiveProps(nextProps) {
    let visible = nextProps.visible,
      title = nextProps.title === '同意' ? '同意' : '';
    this.setState({
      modalVisible: visible,
      msg: title
    });
  }

  renderMsgbox = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={this.closeModal}
      >
        {/* <View style={{height:'20%'}}/> */}
        <View style={styles.msgBox}>
          <PageHeader text={'审批意见'} />
          <View style={styles.textItemContainer}>
            <TextInput
              //styles={StyleSheet.create(newStyle)}
              autoFocus={true}
              placeholder={'请填写审批意见'}
              multiline={true}
              value={this.state.msg}
              onChangeText={this.onChangeMsg}
              numberOfLines={8}
              maxLength={200}
              autoCapitalize={'none'}
              selectionColor={gStyles.color.mColor}
              style={styles.textInput}
              underlineColorAndroid={'transparent'}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.buttonText}
              containerStyle={styles.cancelButton}
              text="取消"
              onPress={this.closeModal}
            />
            <Button
              style={styles.buttonText}
              containerStyle={
                this.state.msg ? styles.button : styles.cancelButton
              }
              text="确定"
              onPress={this._submit}
              disabled={!this.state.msg}
            />
          </View>
        </View>
      </Modal>
    );
  };

  renderUserList = () => {
    let data = this.state.keyword
      ? this.onFilter(this.props.data, this.state.keyword)
      : this.props.data;
    //console.log('test:...',!this.state.selectedItems,!(this.state.msg && this.state.selectedItems));
    return (
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
                  onPress={this.closeModal}
                />
              }
              headerRight={<View style={styles.imageButtonContainer}/>}
              text={'选择审批人'}
            />
          }
          {/*this.state.showLevelTextDisplay && 
          <HierachyLabel 
            items={this.state.levelTextDisplay}
          />*/}
          {/*<PageContent >*/}
          <FlatList
            style={styles.flatList}
            data={data}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={item => item.fieldName}
            ListHeaderComponent={this.renderHeader}
            ListEmptyComponent={this.renderEmpty}
            //ListFooterComponent={this.renderFooter}
            //removeClippedSubviews={false}
            //initialNumToRender={20}
            //initialScrollIndex={this.state.selectedItem.index || 0}
            //onEndReached={this.handleLoadMore}
            //onEndReachedThreshold={0.1}
            extraData={data}
            getItemLayout={this.onItemLayout}
          />
          {/*
          <SelectedDetails 
            selectedItems={this.state.selectedItems}
            onChange={this.onCheckDetails}
          />
          */}
          {/*</PageContent>*/}
          <PageFooter>
            <Button
              style={styles.listButtonText}
              containerStyle={
                this.state.selectedItems.length > 0
                  ? styles.listButton
                  : styles.listButtonDisabled
              }
              text="确定"
              onPress={this._submit}
              disabled={!(this.state.selectedItems.length > 0)}
            />
          </PageFooter>
        </PageWrapper>
      </Modal>
    );
  };

  renderMsgUserList = () => {
    let data = this.state.keyword
      ? this.onFilter(this.props.data, this.state.keyword)
      : this.props.data;
    let isAutoFocus = this.props.title === '同意' ? false : true;
    //console.log('test:...',!this.state.selectedItems,!(this.state.msg && this.state.selectedItems));
    return (
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
                  onPress={this.closeModal}
                />
              }
              headerRight={<View style={styles.imageButtonContainer}/>}
              text={'选择审批人'}
            />
          }
          <View
            style={{
              width: '100%',
              height: 150,
              borderWidth: 1,
              borderColor: gStyles.color.mBorderColor,
              borderRadius: 4,
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: '#fcfcfc'
            }}
          >
            <TextInput
              //styles={StyleSheet.create(newStyle)}
              autoFocus={isAutoFocus}
              placeholder={'请填写审批意见'}
              multiline={true}
              value={this.state.msg}
              onChangeText={this.onChangeMsg}
              numberOfLines={8}
              maxLength={200}
              autoCapitalize={'none'}
              selectionColor={gStyles.color.mColor}
              style={styles.textInput}
              underlineColorAndroid={'transparent'}
            />
          </View>
          {/*this.state.showLevelTextDisplay && 
          <HierachyLabel 
            items={this.state.levelTextDisplay}
          />*/}
          {/*<PageContent >*/}
          <FlatList
            style={styles.flatList}
            data={data}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={item => item.fieldName}
            ListHeaderComponent={this.renderHeader}
            ListEmptyComponent={this.renderEmpty}
            //ListFooterComponent={this.renderFooter}
            //removeClippedSubviews={false}
            //initialNumToRender={20}
            //initialScrollIndex={this.state.selectedItem.index || 0}
            //onEndReached={this.handleLoadMore}
            //onEndReachedThreshold={0.1}
            extraData={data}
            getItemLayout={this.onItemLayout}
          />
          {/*
          <SelectedDetails 
            selectedItems={this.state.selectedItems}
            onChange={this.onCheckDetails}
          />
          */}
          {/*</PageContent>*/}
          <View style={{ marginBottom: 30 }}>
            <Button
              style={styles.listButtonText}
              containerStyle={
                this.state.msg && this.state.selectedItems.length > 0
                  ? styles.listButton
                  : styles.listButtonDisabled
              }
              text="确定"
              onPress={this._submit}
              disabled={
                !(this.state.msg && this.state.selectedItems.length > 0)
              }
            />
          </View>
        </PageWrapper>
      </Modal>
    );
  };

  render() {
    //let initIndex = this.state.selectedItem.index || 0;
    let { isSelectUser, isShowSuggest } = this.props;
    let ret;
    if (isSelectUser && isShowSuggest) {
      ret = this.renderMsgUserList();
    } else if (isSelectUser) {
      ret = this.renderUserList();
    } else if (isShowSuggest) {
      ret = this.renderMsgbox();
    } else {
      ret = <View />;
    }
    return ret;
  }
}

const styles = StyleSheet.create({
  flatList: {
    height: '50%',
    width: '100%'
  },
  msgBox: {
    width: '100%',
    height: 333,
    backgroundColor: 'white',
    alignSelf: 'center'
    //justifyContent: 'center'
  },
  textItemContainer: {
    width: '98%',
    height: 184,
    marginTop: 13,
    borderWidth: 1,
    borderColor: gStyles.color.mBorderColor,
    borderRadius: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#fcfcfc'
  },
  textInput: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    fontSize: 15,
    textAlignVertical: 'top',
    padding: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 17,
    justifyContent: 'space-around',
    paddingHorizontal: 26
  },
  button: {
    width: 105,
    height: 35,
    borderRadius: 5
  },
  cancelButton: {
    width: 105,
    height: 35,
    borderRadius: 5,
    backgroundColor: '#999999'
  },
  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
    padding: 13
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
    flexDirection: 'row',
    justifyContent: 'center'
  },
  imageButtonImg: {
    width: 10,
    height: 17.5,
    alignSelf: 'center'
  },
  listButton: {
    alignSelf: 'center',
    height: 44,
    width: '80%'
  },
  listButtonDisabled: {
    alignSelf: 'center',
    height: 44,
    width: '80%',
    backgroundColor: '#999999'
  },
  listButtonText: {
    fontSize: 17,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
    padding: 13
  }
});

export default ChooseUserMulti;
