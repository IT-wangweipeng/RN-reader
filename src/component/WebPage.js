import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Image, NativeModules,
  Text, TouchableOpacity, View,
  Platform,
  BackHandler,
  ActivityIndicator,
  Dimensions, DeviceEventEmitter,
} from 'react-native'

import {WebView} from 'react-native-webview'
import images from '../component/images'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import IMAGES from "./images";
import {showToast} from "../actions/toastAction";
import * as hotBeanActions from '../reducers/hotBeansReducer'
import {Config} from "../config/Config";
import {getItem, removeItem} from "../utils/AsyncStorageManager";
import {KEY_TOKEN} from "../utils/AsyncStorageKey";
import {GetUserInfoApi} from "../apis/Api";
import * as userAction from "../actions/userAction";
import WebViewPage from "./WebViewPage";


const {width, height} = Dimensions.get('window')


const VIP_CENTER_PAGE = Config.vip.url()


class WebPage extends Component {

  static navigationOptions = ({navigation}) => {
    if (navigation.state.params.hiddenHeader) {
      return ({
        header: null
      })
    }
    return ({
      title: `${navigation.state.params.title != null ? navigation.state.params.title : ''}`,
      headerLeft: (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginLeft: 5}}
            onPress={navigation.state.params.goBack}
          >
            <Image
              style={{width: 30, height: 30}}
              source={IMAGES.left_arrow}
            />
          </TouchableOpacity>
          {
            (navigation.state.params.showCloseIcon && navigation.state.params.showCloseIcon === true) ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack(null)
                }}
              >
                <Image
                  style={{marginLeft: 5, width: 30, height: 30, padding: 10}}
                  source={IMAGES.image_close}
                />
              </TouchableOpacity>
            ) : null
          }
        </View>
      ),
      headerRight: (
        <View>
          {
            navigation.state.params.rightIcon != null ? (
              <TouchableOpacity
                style={{marginRight: 16, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  navigation.state.params.handleAction()
                }}
              >
                <Text style={{fontSize: 18, fontWeight: "500", fontStyle: "normal", color: '#f85836'}}>
                  {`${navigation.state.params.rightIcon}`}
                </Text>

              </TouchableOpacity>
            ) : null
          }
        </View>
      ),
    })
  }


  componentDidMount() {
    this.props.navigation.setParams({handleAction: this._handleAction})
  }

  componentWillMount(): void {

  }

  componentWillUnmount(): void {
    this.props.navigation.state.params.updateHotBeansCallback && this.props.navigation.state.params.updateHotBeansCallback()

    if(this.props.navigation.state.params && this.props.navigation.state.params.fromReadBookPage && this.props.navigation.state.params.url.includes(VIP_CENTER_PAGE)) {
      this.resumeNativeReadPage()
    }

    const {pageWillUnmountCallback} = this.props.navigation.state.params
    pageWillUnmountCallback && pageWillUnmountCallback()
  }

  resumeNativeReadPage() {
    const { navigation } = this.props
    if(navigation.state.params && navigation.state.params.fromReadBookPage) {

      const {user} = this.props
      if (!!user.token) {
        GetUserInfoApi(user.token).then(ret => {
          if (ret.status === 200) {
            console.log('gg GetUserInfoApi')
            this.props.actions.userInit({
              token: user.token,
              user: ret.data
            })
            DeviceEventEmitter.emit('resumeToReadPage')
          } else {
            showToast(`${ret.message}`)
            DeviceEventEmitter.emit('resumeToReadPage')
          }
        })
          .catch(error => {
            showToast(`${error.message}`)
            DeviceEventEmitter.emit('resumeToReadPage')
          })
      } else {
        DeviceEventEmitter.emit('resumeToReadPage')
      }
    }
  }

  _showPageRecord = () => {
    const {user, navigation} = this.props
    console.log('user111 ============= ', user)
    if (!!user.token) {
      navigation.navigate('NewWeb', {
        url: `${Config.vip.payRecordURL()}?token=${user.token}&timestamp=${Date.now()}`,
      })
    } else {
      this._showLoginPage()
    }
  }

  _handleAction = () => {
    const {navigation, user} = this.props
    const type = navigation.state.params && navigation.state.params.rightIcon//navigation.state.params.rightIconType
    console.log('rightIcon ======= ', navigation)

    if (type === '明细') {
      if (!!user.token) {
        // 热豆明细
        navigation.navigate('HotBeanDetail', {
          url: `${Config.hotBeans.detailURL()}?token=${user.token}&timestamp=${Date.now()}`,
          title: '热豆明细'
        })
      } else {
        this._showLoginPage()
      }
    } else if (type === '规则') {
      // 任务规则
      navigation.navigate('HotBeanDetail', {
        url: `${Config.hotBeans.rulesURL()}`,
        title: '规则'
      })
    }

    const actionType = navigation.state.params && navigation.state.params.actionType
    switch (actionType) {
      case "INVITE_RULE":
        navigation.navigate('NewWeb', {
          url: `${Config.url.inviteRule()}`,
        })
        break;
      case "WITHDRAW_RULE":
        navigation.navigate('NewWeb', {
          url: `${Config.url.withdrawRule()}`,
        })
        break;
      case "PAY_RECORD":
        this._showPageRecord()
        break;
      default:
        break;
    }
  }

  _showLoginPage = () => {
    const {url} = this.props.navigation.state.params
    const {navigation} = this.props
    navigation.navigate('Login', {
      loginSuccess: () => {
        if (url && url != undefined) {
          navigation.replace('Web', {
            showCloseIcon: true,
            url: `${url}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
          })
        }
      }
    })
  }

  render() {
    const {url} = this.props.navigation.state.params
    console.log('url ============== ', url)
    return (
      <WebViewPage
        navigation={this.props.navigation}
        url={url}
      />
    )
  }
}

WebPage.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  rightIcon: PropTypes.string,
  // 1: 我的热豆 2：任务中心
  rightIconType: PropTypes.oneOfType([1, 2]),
}


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...hotBeanActions,
    ...userAction,
  }, dispatch)
})

export default connect(({user}) => {
  return {
    user,
  }
}, mapDispatchToProps)(WebPage)
