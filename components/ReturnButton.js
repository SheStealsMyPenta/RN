import React from 'react';

import ImageButton from '../components/ImageButton';

const ReturnButton = ({ navigation }) => (
  <ImageButton
    containerStyle={{
      flexDirection: 'row',
      width: 40,
      justifyContent: 'center',
      paddingVertical: 10
    }}
    style={{ width: 10, height: 17.5 }}
    onPress={() => {
      navigation.goBack();
    }}
    source={require('../img/return.png')}
  />
);

export default ReturnButton;
