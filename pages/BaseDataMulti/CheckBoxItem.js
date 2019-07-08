import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStylePropTypes,
  TextStylePropsTypes,
  ImageStylePropTypes
} from 'react-native';
import PropTypes from 'prop-types';

import gStyles from '../../constants/Styles';
import ImageButton from '../../components/ImageButton';

const checkedImg = require('../../img/checked.png');
const normalImg = require('../../img/checkbox.png');
const arrow_right = require('../../img/arrow_right.png');



class CheckBoxItem extends React.Component{
  constructor(props){
    super(props);
    //console.log('重刷？',this.props.checked);
    this.state={
      checked: this.props.checked
    }
  }

  /*static propTypes={
    item: PropTypes.object,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    containerStyle: ViewStylePropTypes,
    imgStyle: ImageStylePropTypes,
    textStyle: TextStylePropTypes
  }*/

  static defaultProps={
    item: {},
    onChange: {},
    checked: false,
    containerStyle: {
      flexDirection: 'row',
      height: 55,
      backgroundColor: 'white',
    },
    imgStyle: {
      marginLeft: 14,
      marginRight: 19,
      alignSelf: 'center',
      height: 22,
      width: 22,
    },
    textContainer: {
      width: '70%',
      justifyContent: 'center'
    },
    textStyle: {
      fontSize: 14,
      color: gStyles.color.mTextColor,
      textAlign: 'left', 
    },
    imageButtonContainer:{ 
      width: 40,
      flexDirection: 'row', 
      justifyContent: 'center'
    },
    imageButtonImg:{
      width: 10, 
      height: 17.5,
      alignSelf: 'center'
    }
  }
  
  _onSelect=()=>{
    //console.log('item props',this.props);
    //console.log('===',{key:value,title:title});
    let checked = !this.state.checked;
    let { item } = this.props;
    //console.log('----',item);
    let value = {item,checked};
    this.setState({
      checked: checked
    })
    this.props.onChange(value);
    
  }

  _requestChildren=()=>{
    const {item,checked} = this.props;
    //console.log('@@@@====',this.props);
    this.props.requestChildren(item);
  }

  renderChildrenNode(){
    //console.log('render child',this.props.item,this.state.checked);
    let checked = this.state.checked;
    return(
      <TouchableOpacity style={this.props.containerStyle} onPress={this._onSelect}>
        <Image style={this.props.imgStyle} source={checked?checkedImg:normalImg}/>
        <View style={this.props.textContainer}>
          <Text style={this.props.textStyle}>{this.props.item.base_data_name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderFatherNode(){
    //console.log('render father',this.props.item);
    let checked = this.state.checked;
    return(
      <View style={this.props.containerStyle}>
      <Image style={this.props.imgStyle} source={checked?checkedImg:normalImg}/>
      <View style={this.props.textContainer}>
        <Text style={this.props.textStyle}>{this.props.item.base_data_name}</Text>
      </View>
      <ImageButton 
              containerStyle={this.props.imageButtonContainer}
              style={this.props.imageButtonImg} 
              source={arrow_right} 
              onPress={this._requestChildren} 
            />
      </View>
    );
  }

  componentWillReceiveProps(nextProps){
    if(this.props.checked !==nextProps.checked){
      this.setState({
        checked:nextProps.checked
      })
    }
  }

  render(){
    //console.log('checkbox check状态',this.props.item.checked);
    return(
      <View>  
      {this.props.hasChildren?this.renderFatherNode():this.renderChildrenNode()}
      </View>
    );
  }
  
}


export default CheckBoxItem;