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
  Dimensions
} from 'react-native';

import gStyles from '../../constants/Styles';
import PageWrapper from '../../components/PageWrapper';
import PageContent from '../../components/PageContent';
import PageFooter from '../../components/PageFooter';
import ImageButton from '../../components/ImageButton';
import Button from '../../components/Button';
import Tag from './Tag';

const next = require('../../img/next.png');

class SelectedDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedItems: [] //this.props.selectedItems
    };
  }

  _removeItem = (from, to) => {
    //会直接修改到原引用变量
    let index = from.indexOf(to);
    if (index !== -1) {
      from.splice(index, 1);
    }
    return from;
  };

  showModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  closeModal = () => {
    this.setState(
      {
        modalVisible: false
      },
      () => {
        let items = JSON.parse(JSON.stringify(this.props.selectedItems));
        this.setState({
          selectedItems: items
        });
      }
    );
  };

  onDeleteTag = item => {
    //移除selectedItems中对应的item
    let items = this.state.selectedItems;
    //console.log('删除前',items,item);
    let reducedItems = this._removeItem(items, item);
    //console.log('删除后',reducedItems);
    this.setState({
      selectedItems: reducedItems
    });
  };

  renderTag = item => {
    return (
      <Tag key={item.base_data_id} item={item} onCloseTag={this.onDeleteTag} />
    );
  };

  /*  renderTags=(items)=>{
    return(
      <View>
      {items.map((item)=>{
        return(
          <Tag item={item} onCloseTag={this.onDeleteTag}/>
        )})}
      </View>
    )}
*/

  _submit = () => {
    this.props.onChange(this.state.selectedItems);
    this.closeModal();
  };

  componentWillReceiveProps(nextProps) {
    let items = JSON.parse(JSON.stringify(nextProps.selectedItems));
    this.setState({
      selectedItems: items
    });
  }

  render() {
    //console.log('选中的项目是',this.state.selectedItems);
    let items = this.state.selectedItems;
    return (
      <View>
        <TouchableOpacity
          style={styles.labelContainer}
          onPress={this.showModal}
        >
          <View>
            <Text style={styles.labelText}>{`已选择${items.length}项`}</Text>
          </View>
          <View style={styles.labelImageContainer}>
            <Text style={styles.labelText}>更多</Text>
            <Image source={next} style={styles.labelImage} />
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.closeModal}
        >
          <PageWrapper>
            <View style={styles.headerStyle}>
              <ImageButton
                containerStyle={styles.imageButtonContainer}
                style={styles.imageButtonImg}
                source={require('../../img/arrow_left.png')}
                onPress={this.closeModal}
              />
              <Text style={styles.headerTitleStyle}>详情</Text>
              <View style={styles.imageButtonContainer} />
            </View>
            <PageContent>
              <View style={styles.tagsView}>
                <View style={styles.tagsContainer}>
                  {//this.renderTags(this.state.selectedItems)
                  items.map(item => this.renderTag(item, item.base_data_id))}
                </View>
                <View style={styles.tagsLabel}>
                  <Text>{`已选择${items.length}项`}</Text>
                </View>
              </View>
            </PageContent>
            <PageFooter style={{ marginBottom: 35 }}>
              <Button
                style={styles.buttonText}
                containerStyle={styles.button}
                text="确定"
                onPress={this._submit}
              />
            </PageFooter>
          </PageWrapper>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    height: 56,
    width: '100%',
    //borderStyle: 'solid',
    //borderWidth: 1,
    //borderColor: gStyles.color.mBorderColor,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12
  },
  labelText: {
    fontSize: 13,
    textAlign: 'center'
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
  labelImageContainer: {
    marginLeft: 48,
    flexDirection: 'row'
    //justifyContent: 'center',
  },
  labelImage: {
    alignSelf: 'center',
    marginLeft: 4
  },
  tagsView: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 12,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%'
  },
  tag: {
    margin: 10
  },
  tagsLabel: {
    //alignSelf: 'flex-end',
    marginBottom: 13,
    marginLeft: 9
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

export default SelectedDetails;
