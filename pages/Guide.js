import React from 'React';
import {
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet
} from 'react-native';
import store from 'react-native-simple-store';
import { Button, Carousel } from 'antd-mobile';

import gStyles from '../constants/Styles';
import gConfig from '../constants/Config';
import NavigationUtil from '../utils/NavigationUtil';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;
const guide1Img = require('../img/guide1.png');
const guide2Img = require('../img/guide2.png');
const guide3Img = require('../img/guide3.png');

class Guide extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Carousel
        swiping={true}
        autoplay={false}
        bounces={false}
        dots={true}
        dotStyle={style.dots}
      >
        <Image source={guide1Img} style={style.image} />
        <Image source={guide2Img} style={style.image} />
        <ImageBackground source={guide3Img} style={style.image}>
          <View style={{ position: 'absolute', bottom: 100 }}>
            <Button
              type="primary"
              onClick={() => {
                store.save('isInit', {
                  isFirst: true,
                  server: '',
                });
                // NavigationUtil.reset(this.props.navigation, 'VpnLogin');
                this.props.navigation.navigate('VpnLogin');
              }}
              style={style.startButton}
            >
              <Text style={style.buttonText} activeStyle={false}>
                进入登录页
              </Text>
            </Button>
          </View>
        </ImageBackground>
      </Carousel>
    );
  }
}

const style = StyleSheet.create({
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: maxWidth,
    height: maxHeight
  },
  startButton: {
    height: 35,
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: gStyles.color.mColor
  },
  buttonText: {
    fontSize: 18,
    color: gStyles.color.sColor
  },
  dots: {}
});

export default Guide;
