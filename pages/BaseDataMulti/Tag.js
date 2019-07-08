import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import ImageButton from '../../components/ImageButton';
import gStyles from '../../constants/Styles';

const del = require('../../img/del.png');



class Tag extends React.Component{
  constructor(props){
    super(props);
  }

  /*onLayout=(event)=>{
      const {width,height} = event.nativeEvent.layout;
      let newWidth = width+5*4+12,
      newHeight = height+5*2;
      this.setState({
        containerWidth: newWidth,
        containerHeight: newHeight,
        textWidth: width,
        textHeight: height
      })
      console.log('789789',width,height,newWidth,newHeight);
  }*/
  _getTextLength=(text)=>{
    let len = 0;  
    for (let i=0; i<text.length; i++) {  
      if (text.charCodeAt(i)>127 || text.charCodeAt(i)==94) {  
         len += 2;  
       } else {  
         len ++;  
       }  
     }
    len = len/2;
    //console.log('字符串长度',len);
    return len;
  }
  
  _onCloseTag=()=>{
    //console.log(this.props);
    if(this.props.item !== null){
      this.props.onCloseTag(this.props.item);
    }
  }

  render(){
    //根据文本长度动态计算tag框宽度和高度
    let containerWidth,containerHeight,textWidth,textHeight,
    leng = Math.ceil(this._getTextLength(this.props.item.base_data_name))+0.5;
    let maxLeng;
    if(leng>15){
      maxLeng=15;
    }else if(leng<4){
      maxLeng = 4;
    }else{
      maxLeng = leng;
    }
    textWidth = maxLeng*14;
    textHeight = 24;
    containerWidth = textWidth+2*7+2*8+12;
    containerHeight = textHeight+11;
    
    //console.log(this.props);
    return(
    <TouchableOpacity 
      activeOpacity={1}
      style={{
        width: containerWidth,
        height: containerHeight,
        flexDirection: 'row',
        borderRadius:3,
        borderWidth: 1,
        backgroundColor: gStyles.color.bgColor,
        borderColor: gStyles.color.mColor,
        alignItems:'center',
        justifyContent:'space-between',
        margin:10
      }}
    >  
      <View 
        style={{
         width: textWidth,
         height: textHeight,
         flexDirection: 'row',
         alignItems: 'center',
         marginVertical: 7,
         
      }}>
        <Text 
          style={styles.text}
          onLayout={this.onLayoutText}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        >
          {this.props.item.base_data_name}
        </Text>
      </View>
      <ImageButton 
        source={del} 
        containerStyle={styles.tagImgContainer} 
        style={styles.tagImg} 
        onPress={this._onCloseTag}
      /> 
    </TouchableOpacity>
    );
  }
}
const styles=StyleSheet.create({
  tagImgContainer:{
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },
  tagImg:{
    width: 12,
    height:12,
    marginRight: 8
  },
  text:{
    fontSize: 14,
    textAlign: 'center',
    color: gStyles.color.mTextColor,
    marginLeft:7
  }
});


export default Tag;