import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Image, View} from 'react-native'
import {timer} from 'rxjs'
import {NavigationActions, StackActions} from 'react-navigation'
import {getItem} from '../../utils/AsyncStorageManager'
import {KEY_FIRST_LAUNCH} from '../../utils/AsyncStorageKey'
import {Config} from '../../config/Config'

const resetMainPageAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'MainTab'}),
  ],
})


class SplashPage extends Component {

  componentDidMount() {
    this.timerSubscribe = timer(1000).subscribe((it) => {
      this.resetRouter(it)

    })
  }

  async resetRouter(it) {
    const oldVersion = await getItem(KEY_FIRST_LAUNCH)
    const targetVersion = `${Config.app.version}_${Config.app.jsVersion}`
    if (oldVersion !== targetVersion) {
      this.props.navigation.replace('Greeting')
    } else {
      if (it === 0) {
        this.props.navigation.dispatch(resetMainPageAction)
      }
    }
  }

  componentWillUnmount() {
    this.timerSubscribe.unsubscribe()
  }

  render() {
    return (
      <Image
        style={{flex: 1}}
        source={require('../../images/image_splash.png')}
      />
    )
  }
}

SplashPage.propTypes = {}

export default SplashPage
