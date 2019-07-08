import React from 'react';
import { TouchableOpacity, Animated, StyleSheet, View, Dimensions, TouchableHighlight } from 'react-native';

const DEFAULT_ANIMATE_TIME = 300;
const styles = StyleSheet.create({
  fullOverlay: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#999999',
    position: 'absolute'
  },
  emptyOverlay: {
    width: 0,
    height: 0,
    backgroundColor: '#999999',
    position: 'absolute'
  }
});
export default class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      overlayStyle: styles.emptyOverlay
    };
  }
  onAnimatedEnd() {
    if (!this.props.visible) {
      this.setState({ overlayStyle: styles.emptyOverlay });
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.visible) {
      this.setState({ overlayStyle: styles.fullOverlay });
    }
    return Animated.timing(this.state.fadeAnim, {
      toValue: newProps.visible ? 0.5 : 0,
      duration: DEFAULT_ANIMATE_TIME
    }).start(this.onAnimatedEnd.bind(this));
  }

  hideSelf = () => {
    this.setState({ overlayStyle: styles.emptyOverlay });
  };

  render() {
    return (
      <TouchableOpacity
        style={[this.state.overlayStyle, { backgroundColor: 'transparent', opacity: 1 }]}
        onPress={() => this.hideSelf()}
      >
        <Animated.View style={[this.state.overlayStyle, { opacity: this.state.fadeAnim }]}>
          {this.props.children}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
