/**
 * Created by jy on 2019/4/26 10:05
 *
 * Author: Jingyu
 * Mail: dev.jingyu@gmail.com
 */


import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  Image,
  View,
  Animated,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native'

import IMAGES from '../../component/images'

export default class TopTabBar extends Component {
  constructor (props: TopTabBar) {
    super(props)

    this.state = {
      activeDefaultColor: '#08086b',
      inactiveDefaultColor: '#666666',
    }
  }

  _renderTab (name, page, num, isTabActive, onPressHandler) {
    const { textStyle } = this.props
    const textColor = isTabActive ? this.props.activeColor : this.props.inactiveColor

    const fontSize = this.props.fontSize

    const fontWeight = isTabActive ? 'bold' : 'normal'

    const Button = Platform.OS === 'ios' ? ButtonIos : ButtonAndroid

    return (
      <Button
        style={{ flex: 1 }}
        key={name}
        accessible
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
      >
        <View style={styles.tab}>
          <Text style={[{ fontSize, color: textColor, fontWeight }]}>
            {name}
          </Text>
          {num > 0
            ? (
              <View style={{
                width: 6, height: 6, borderRadius: 3, backgroundColor: '#f00', top: -8, left: -4,
              }}
              />
            )
            : null
          }
        </View>
      </Button>
    )
  }

  _renderUnderline () {
    const containerWidth = this.props.containerWidth
    const numberOfTabs = this.props.tabs.length
    const underlineWidth = this.props.tabUnderlineDefaultWidth ? this.props.tabUnderlineDefaultWidth : containerWidth / (numberOfTabs * 2)
    const scale = this.props.tabUnderlineScaleX ? this.props.tabUnderlineScaleX : 3
    const itemWidth = (containerWidth - 2 * this.props.style.marginHorizontal) / numberOfTabs
    const left = (itemWidth - 24) / 2
    const tabUnderlineStyle = {
      position: 'absolute',
      width: 24,
      height: 2,
      borderRadius: 2,
      backgroundColor: this.props.activeColor,
      bottom: 0,
      left,
    }

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, itemWidth],
    })

    const scaleValue = (defaultScale) => {
      const number = 4
      const arr = new Array(number * 2)
      return arr.fill(0).reduce((pre, cur, idx) => {
        idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx - 1] + 0.5)
        idx % 2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1)
        return pre
      }, { inputRange: [], outputRange: [] })
    }

    const scaleX = this.props.scrollValue.interpolate(scaleValue(scale))

    return (
      <Animated.View
        style={[
          tabUnderlineStyle,
          {
            transform: [
              { translateX },
              { scaleX },
            ],
          },
          this.props.underlineStyle,
        ]}
      />
    )
  }

  render () {
    return (
      <View style={[styles.tabs, { backgroundColor: this.props.backgroundColor, ...this.props.tabStyle }]}>
        <View style={[styles.tabContent, this.props.style]}>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page

            let num = 0
            switch (page) {
              case 0:
                num = this.props.praiseNum
                break
              case 1:
                num = this.props.replyNum
                break
              case 2:
                num = this.props.followNum
                break
              case 3:
                num = this.props.otherNum
                break
              default:
                break
            }
            return this._renderTab(name, page, num, isTabActive, this.props.goToPage)
          })}
          {/*{*/}
            {/*this._renderUnderline()*/}
          {/*}*/}
        </View>

        {
          this.props.showSearchButton ? (
            <TouchableOpacity
              style={{position: 'absolute', height: 40, width: 40, right: 10, justifyContent: 'center', alignItems: 'center', top: 4}}
              onPress={() => {
                this.props.onPressSearch && this.props.onPressSearch()
              }}
            >
              <Image
                source={IMAGES.bookshelf_search}
              />
            </TouchableOpacity>
          ) : null
        }



        {
          this.props.showBackButton ? (
            <TouchableOpacity
              style={{position: 'absolute', height: 40, width: 40, left: 0, justifyContent: 'center', alignItems: 'center', top: 4}}
              onPress={() => {
                this.props.onPressBack && this.props.onPressBack()
              }}
            >
              <Image
                source={IMAGES.left_arrow}
              />
            </TouchableOpacity>
          ) : null
        }
      </View>

    )
  }
}


const ButtonAndroid = props => (
  <TouchableNativeFeedback
    delayPressIn={0}
    background={TouchableNativeFeedback.SelectableBackground()}
    {...props}
  >
    {props.children}
  </TouchableNativeFeedback>)

const ButtonIos = props => (
  <TouchableOpacity {...props}>
    {props.children}
  </TouchableOpacity>
)


const styles = StyleSheet.create({
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height: 50,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#f4f4f4',
  },
  tabContent: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
