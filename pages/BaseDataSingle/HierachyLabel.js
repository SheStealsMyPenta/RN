import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';

import gStyles from '../../constants/Styles';
import ImageLabel from './ImageLabel';



const right_arrow = require('../../img/arrow_right_grey.png');
const separatorWidth = Dimensions.get('window').width-28;
class HierachyLabel extends React.Component{
  constructor(props){
    super(props);
  }
  
  _renderLabel=(item)=>{
    //console.log('render ImageLabel');
    return(
      <ImageLabel 
        key={item.base_data_id}
        title={item.base_data_name}
        source={right_arrow}
        containerStyle={styles.label}
        imageStyle={styles.image}
        textStyle={styles.text}
      />
    );
  }

  render(){
    //console.log('render HierachyLabel',this.props.textItems);
    return(
      <View>
        <View style={styles.separator}/>
        <View style={[styles.container,this.props.containerStyle]}>
          {this.props.items.map((item)=>this._renderLabel(item))}
        </View>
        <View style={styles.separator}/>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    paddingTop: 14,
    paddingBottom: 3,
    paddingHorizontal: 6
  },
  separator:{
    width: separatorWidth,
    height: 1,
    paddingHorizontal: 14,
    backgroundColor: gStyles.color.mBorderColor,
    alignSelf: 'center'
  },
  label:{
    flexDirection:'row',
    marginLeft: 8,
    marginBottom: 11
  },
  image:{
    
  },
  text:{
    fontSize:14,
    textAlign: 'center',
    color: gStyles.color.mTextColor
  }
})

export default HierachyLabel;