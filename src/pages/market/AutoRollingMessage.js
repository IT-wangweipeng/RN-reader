import React from 'react';
import { Text, View, Animated, Easing, TouchableOpacity } from 'react-native';

// props [duration, height, containerStyle]
export default class AutoRollingMessage extends React.Component {
  constructor (props) {
    super(props)
    this.animate = this.animate.bind(this)
    this.animatedValue = new Animated.Value(0)
    this.animatedValue.setValue(0)
    this.height = props.height || 40
    this.childrenHeight = props.childrenHeight || 20
    this.centerPosition = (this.height - this.childrenHeight) / 2
    this.anim = Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: this.props.duration || 2000,
        easing: Easing.linear,
        delay: this.props.delay || 0,
      }
    )
    this.state = {
      currentIndex: 0
    }
  }

  componentDidMount () {
    // see: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._isMounted = true;
  }

  componentWillMount() {
    this.animate()
  }

  componentWillUnmount() {
    this._isMounted = false
    this.anim.stop()
  }
  animate () {
    this.anim.start(() => {
      if (this._isMounted) {
        this.setState({currentIndex: (this.state.currentIndex + 1) % this.props.children.length})
        this.animatedValue.setValue(0)
        this.animate()
      }
    })
  }

  render() {
    const { currentIndex } = this.state
    const { containerStyle, childrenStyle } = this.props
    const top = this.animatedValue.interpolate({
      inputRange: [0, 0.2, 0.5, 0.8, 1],
      outputRange: [this.centerPosition, this.centerPosition, this.centerPosition, this.centerPosition, this.height - this.childrenHeight]
    })
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.2, 0.5, 0.8, 1],
      outputRange: [1, 0.9, 1, 0.9, 0]
    })
    return (
      <View style={[{
        height: this.height,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center'
      }, containerStyle]}>
        <Animated.View style={[{
          // position: 'absolute',
          height: this.childrenHeight,
          top,
          opacity
        }, childrenStyle]}>
          <TouchableOpacity
            onPress={() => {
              this.props.onPressItem && this.props.onPressItem(this.state.currentIndex)
            }}
          >
            {this.props.children[currentIndex] || this.props.children}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}
