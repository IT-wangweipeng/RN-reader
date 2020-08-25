import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
} from 'react-native'
import images from "../../component/images";

const {width, height} = Dimensions.get('window')

export default class BookMarketTopTabBar extends Component {

  _renderTab(name, page, isTabActive, onPressHandler) {
    const textColor = isTabActive ? this.props.activeColor : this.props.inactiveColor

    const fontSize = isTabActive ? this.props.activeFontSize : this.props.inactiveFontSize

    const fontWeight = isTabActive ? 'bold' : 'normal'

    const Button = Platform.OS === 'ios' ? ButtonIos : ButtonAndroid

    if (name === 'VIP') {
      return (
        <Button
          style={{flex: 1}}
          key={name}
          accessible
          accessibilityLabel={name}
          accessibilityTraits="button"
          onPress={() => onPressHandler(page)}>
          <View style={styles.tab}>
            {isTabActive ?
              <Image style={{width: 48, height: 19}} source={images.image_tab_vip_active}></Image>
              : <Image style={{width: 45, height: 18}} source={images.image_tab_vip_inactive}></Image>
            }
          </View>
        </Button>
      )
    }

    return (
      <Button
        style={{flex: 1}}
        key={name}
        accessible
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}>
        <View style={styles.tab}>
          <Text style={[{fontSize, color: textColor, fontWeight}]}>
            {name}
          </Text>
        </View>
      </Button>
    )
  }

  _renderUnderline() {
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
      }, {inputRange: [], outputRange: []})
    }

    const scaleX = this.props.scrollValue.interpolate(scaleValue(scale))

    return (
      <Animated.View
        style={[
          tabUnderlineStyle,
          {
            transform: [
              {translateX},
              {scaleX},
            ],
          },
          this.props.underlineStyle,
        ]}
      />
    )
  }

  render() {
    return (
      <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, width, flexDirection: 'row'}]}>
        <View style={[styles.tabContent, this.props.style]}>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page
            return this._renderTab(name, page, isTabActive, this.props.goToPage)
          })}
          {/*{*/}
          {/*this._renderUnderline()*/}
          {/*}*/}

        </View>

        <View style={{flex: 1, backgroundColor:'#fff'}}/>
        {
          this.props.showSearch ? (
            <TouchableOpacity
              style={{width: 40, height: 30, marginRight: 5, alignItems: 'center', justifyContent: 'center'}}
              onPress={() => {
                this.props.onSearchClick && this.props.onSearchClick()
              }}
            >
              <Image
                source={require('../../images/image_search.png')}
                style={{width: 25, height: 25}}
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
    height: 30,
    borderColor: '#f4f4f4',
  },
  tabContent: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
})
