import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native';

const ImageLabel = ({containerStyle,textStyle,imageStyle,title,source})=>(
  <View style={[styles.containerStyle,containerStyle]}>
    <Text style={[styles.textStyle,textStyle]}>{title}</Text>
    <Image source={source} style={[styles.imageStyle,imageStyle]}/>
  </View>
);

const styles = StyleSheet.create({
  containerStyle:{
    flexDirection:'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 14,
    color: '#333333'
  },
  imageStyle: {
    marginLeft:8
  }
})

export default ImageLabel;