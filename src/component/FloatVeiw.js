import React, {Component} from 'react'
import {
  PanResponder,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  NativeModules,
} from 'react-native'

import {Header} from 'react-navigation'
import images from "./images"

const {StatusBarManager} = NativeModules

const {width, height} = Dimensions.get('window')
const FLOAT_VIEW_WIDTH = 68
const FLOAT_VIEW_HEIGHT = 69
const PADDING_END = 4
const PADDING_BOTTOM = 16
const NAVIGATION_BAR_HEIGHT = Header.HEIGHT
const BOTTOM_TAB_HEIGHT = 50
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT
const INIT_TOP = height - FLOAT_VIEW_HEIGHT - PADDING_BOTTOM - BOTTOM_TAB_HEIGHT - STATUSBAR_HEIGHT

//position(1书城,2书架,3分类,4我的)
class FloatView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showFlag: false,
      left: width - FLOAT_VIEW_WIDTH - PADDING_END,
      top: props.position === 2 ? INIT_TOP - NAVIGATION_BAR_HEIGHT : INIT_TOP,
      parentOpacity: 1,
      childOpacity: 1,
    }
    this.isParentClick = false
    this.isChildClick = false
    this.x_min = 0
    this.x_max = width - FLOAT_VIEW_WIDTH
    this.y_min = 0
    this.y_max = props.position === 2 ? INIT_TOP + PADDING_BOTTOM - NAVIGATION_BAR_HEIGHT :  INIT_TOP + PADDING_BOTTOM
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('yy parent onPanResponderGrant')
        this._top = this.state.top
        this._left = this.state.left
        this.isParentClick = true
        this.setState({
          parentOpacity: 0.6,
        })
      },
      onPanResponderMove: (evt, gs) => {
        console.log('yy parent onPanResponderMove:' + gs.dx + ' ' + gs.dy)
        if (gs.dx < 5 && gs.dx > -5 && gs.dy < 5 && gs.dy > -5) {
          this.isParentClick = true
        } else {
          this.isParentClick = false
        }

        this.moveLeft = this._left + gs.dx
        this.moveTop = this._top + gs.dy
        // console.log('yy before moveLeft=' + this.moveLeft + ',moveTop=' + this.moveTop)
        if (this.moveLeft >= this.x_max) {
          this.moveLeft = this.x_max
        } else if(this.moveLeft <= this.x_min) {
          this.moveLeft = this.x_min
        }

        if (this.moveTop >= this.y_max) {
          this.moveTop = this.y_max
        } else if(this.moveTop <= this.y_min) {
          this.moveTop = this.y_min
        }
        // console.log('yy after moveLeft=' + this.moveLeft + ',moveTop=' + this.moveTop)
        this.setState({
          top: this.moveTop,
          left: this.moveLeft,
        })
      },
      onPanResponderRelease: (evt, gs) => {
        console.log('yy parent onPanResponderRelease')
        this.setState({
          parentOpacity: 1,
        })
        if (this.isParentClick) {
          this.props.onPress && this.props.onPress()
        }
      }
    })


    this._panResponder1 = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: () => {
        console.log('yy child onPanResponderGrant')
        this.isChildClick = true
        this.setState({
          childOpacity: 0.6,
        })
      },
      onPanResponderMove: (evt, gs) => {
        console.log('yy child onPanResponderMove:' + gs.dx + ' ' + gs.dy)
        if (gs.dx < 5 && gs.dx > -5 && gs.dy < 5 && gs.dy > -5) {
          this.isChildClick = true
        } else {
          this.isChildClick = false
        }
      },
      onPanResponderRelease: (evt, gs) => {
        console.log('yy child onPanResponderRelease')
        this.setState({
          childOpacity: 1,
        })
        if (this.isChildClick) {
          this.hideFloatView()
        }
      }
    })
  }

  showFloatView = () => {
    console.log('yy showFloatView')
    this.setState({
      showFlag: true,
    })
  }

  hideFloatView = () => {
    console.log('yy hideFloatView')
    this.setState({
      showFlag: false,
    })
  }


  render() {
    if (this.state.showFlag) {
      return (
        <ImageBackground
          style={{
            position: 'absolute',
            left: this.state.left,
            top: this.state.top,
            width: FLOAT_VIEW_WIDTH,
            height: FLOAT_VIEW_HEIGHT,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            opacity: this.state.parentOpacity,
          }}
          source={{uri: this.props.data.image, cache: 'force-cache'}}
          {...this._panResponder.panHandlers}
        >
          <Image
            style={{
              marginTop: 6,
              marginEnd: 6,
              width: 17,
              height: 17,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              opacity: this.state.childOpacity,
            }}
            source={images.image_float_window_cancel}
            {...this._panResponder1.panHandlers}
          />
        </ImageBackground>

      )
    }

    return null
  }
}


export default FloatView
