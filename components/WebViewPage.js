import React, { Component } from 'react';
import { StyleSheet, WebView, BackHandler, Dimensions, View } from 'react-native';

import ReturnButton from '../components/ReturnButton';
import ToastUtil from '../utils/ToastUtil';
import LoadingView from '../components/LoadingView';

let canGoBack = false;

class WebViewPage extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <ReturnButton navigation={navigation} />,
    title: navigation.state.params.title || ' ',
    headerRight: <View />
  });

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  }

  onNavigationStateChange = navState => {
    canGoBack = navState.canGoBack;
  };

  goBack = () => {
    if (canGoBack) {
      this.webview.goBack();
      return true;
    }

    return false;
  };

  renderLoading = () => <LoadingView />;

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <WebView
          ref={ref => {
            this.webview = ref;
          }}
          style={styles.base}
          source={{ uri: params.url }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          scalesPageToFit
          decelerationRate="normal"
          onShouldStartLoadWithRequest={() => {
            const shouldStartLoad = true;
            return shouldStartLoad;
          }}
          onNavigationStateChange={this.onNavigationStateChange}
          renderLoading={this.renderLoading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  }
});

export default WebViewPage;
