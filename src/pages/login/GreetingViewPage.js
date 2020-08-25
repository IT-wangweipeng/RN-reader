/**
 * Created by jy on 2018/9/11 15:09
 *
 * Author: Jingyu
 * Mail: dev.jingyu@gmail.com
 */
import React, {Component} from 'react'
import {
  ScrollView,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  View,
  PixelRatio,
  ImageBackground,
  Platform,
  BackHandler,
} from 'react-native'

import {StackActions, NavigationActions} from 'react-navigation'
import R from 'ramda'
import Swiper from 'react-native-swiper'
import {KEY_FIRST_LAUNCH, KEY_TOKEN} from '../../utils/AsyncStorageKey'
import {setItem, getItem} from '../../utils/AsyncStorageManager'
import {Config} from '../../config/Config'

const {width, height} = Dimensions.get('window')


const resetMainPageAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'MainTab'}),
  ],
})


export default class GreetingViewPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPage: 0,
    }
    this.IMAGES = [
      require('../../images/image_greeting_01.png'),
      require('../../images/image_greeting_02.png')
    ]
  }

  render() {
    return (
      <Swiper
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.paginationStyle}
        loop={false}
      >
        {
          R.addIndex(R.map)((val, idx) => {
            if (idx === this.IMAGES.length - 1) {
              return (
                <View style={{flex: 1, backgroundColor: 'cyan'}}>
                  <ImageBackground style={styles.image} source={val}>
                    <TouchableHighlight
                      style={styles.button}
                      underlayColor={'red'}
                      onPress={() => {
                        setItem(KEY_FIRST_LAUNCH, `${Config.app.version}_${Config.app.jsVersion}`)
                        this.props.navigation.dispatch(resetMainPageAction)
                      }}
                    >
                      <Text style={styles.buttonText}>
                        {'立即体验'}
                      </Text>
                    </TouchableHighlight>
                  </ImageBackground>
                </View>
              )
            }
            return (
              <View style={{flex: 1}}>
                <Image
                  style={styles.image}
                  source={val}
                />
              </View>
            )
          }, this.IMAGES)
        }
      </Swiper>

    )
  }
}


const styles = StyleSheet.create({
  image: {
    width,
    height,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
  },
  button: {
    width: 120,
    height: 44,
    backgroundColor: '#f85836',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height - 100,
    borderRadius: 22,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'red'
  },
  pageControlView: {
    width: 50,
    height: 30,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },
  pageControl: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'red',
  },
  dotStyle: {
    backgroundColor: '#eeeeee',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  activeDotStyle: {
    backgroundColor: 'red',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})


// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { Text, View } from 'react-native'
//
// import { NavigationActions, StackActions } from 'react-navigation'
//
//
// const resetMainPageAction = StackActions.reset({
//   index: 0,
//   actions: [
//     NavigationActions.navigate({ routeName: 'MainTab' }),
//   ],
// })
//
// class GreetingViewPage extends Component {
//   render () {
//     return (
//       <View style={{flex: 1, justifyContent: 'center'}}>
//         <Text
//           onPress={() => {
//
//           }}
//         >{
//         'ssjsjjsjsjs'
//         }</Text>
//       </View>
//     )
//   }
// }
//
// GreetingViewPage.propTypes = {}
//
// export default GreetingViewPage
