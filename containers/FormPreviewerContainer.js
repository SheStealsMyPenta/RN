import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet, Platform,NativeModules } from 'react-native';

import ReturnButton from '../components/ReturnButton';
import ImageButton from '../components/ImageButton';
import FormPreviewer from '../pages/FormPreviewer';

import gStyles from '../constants/Styles';
import {showToast} from '../utils/Helper';
import * as loadingActions from '../actions/loadingActions';
import * as reimbActions from '../actions/reimbActions';
const { PNManager } = NativeModules;
class FormPreviewerContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <ReturnButton navigation={navigation} />,
    title: '预览',
    headerRight: (
      <View style={styles.headerRightContainer}>
        <ImageButton
          source={require('../img/print.png')}
          onPress={() => {
            if(Platform.OS==='android'){
              showToast('目前还不支持打印');
              if (navigation.state.params.createPDF) {
                let fileName = navigation.state.params.fileName ? navigation.state.params.fileName : 'file';
                navigation.state.params.createPDF(navigation.state.params.html, fileName, 'docs').then(filePath => {
                  if(!filePath){
                    showToash('生成pdf文件出错，请重试');
                    return;
                  }
                  PNManager.exportToExternalStorage(filePath,fileName);
                  // navigation.setParams({
                  //   pdfPath: filePath
                  // });
                  //console.log('aaaaa', filePath);
                });
              }
              return;
            }
            if (navigation.state.params.createPDF) {
              let fileName = navigation.state.params.fileName ? navigation.state.params.fileName : 'file';
              navigation.state.params.createPDF(navigation.state.params.html, fileName, 'docs').then(filePath => {
                if(!filePath){
                  showToash('生成pdf文件出错，请重试');
                  return;
                }
                navigation.setParams({
                  pdfPath: filePath
                });
                //console.log('aaaaa', filePath);
              });
            }
          }}
          containerStyle={styles.headerRightImageContainer}
        />
      </View>
    )
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <FormPreviewer {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  const { reimb } = state;
  return {
    reimb
  };
}

function mapDispatchToProps(dispatch, props) {
  const actions = bindActionCreators({ ...loadingActions, ...reimbActions }, dispatch);
  return {
    actions
  };
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: gStyles.size.headerRightMargin
  },
  headerRightImageContainer: {
    padding: gStyles.size.headerIconPadding
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FormPreviewerContainer);
