import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Image, NativeModules,
  Text, TouchableOpacity, View,
  Platform,
  BackHandler,
  ActivityIndicator,
  Dimensions, DeviceEventEmitter, Alert,
} from 'react-native'

import * as WeChat from 'react-native-wechat'
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
import {BindThirdApi, ForceBindApi, GetUserInfoApi, LogoutApi} from "../apis/Api";
import * as userAction from "../actions/userAction";
import Toast from "react-native-root-toast";
import {deleteAll} from "../model/BookModelManager";
import {isIOS} from "../utils/PlatformUtils";



// fix https://github.com/facebook/react-native/issues/10865
const patchPostJsCode = `(${String(function () {
  var originalPostMessage = window.postMessage
  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }
  window.postMessage = patchedPostMessage
})})();`


const {width, height} = Dimensions.get('window')
const BookReadManager = NativeModules.BookReadManager;
var nativeModule = NativeModules.OpenNativeModule;

const SHANDW_GAME_CENTER_PAGE = "http://www.shandw.com/m/indexTemp/"
const VIP_CENTER_PAGE = Config.vip.url()


let curUrl = ""
let canGoBack = false // web是否能够返回上一级web

class WebfareWebPage extends Component {

  // static navigationOptions = ({navigation}) => {
  //   if (navigation.state.params.hiddenHeader) {
  //     return ({
  //       header: null
  //     })
  //   }
  //   return ({
  //     title: `${navigation.state.params.title != null ? navigation.state.params.title : ''}`,
  //     headerLeft: (
  //       <View style={{flexDirection: 'row'}}>
  //         <TouchableOpacity
  //           style={{marginLeft: 5}}
  //           onPress={navigation.state.params.goBack}
  //         >
  //           <Image
  //             style={{width: 30, height: 30}}
  //             source={IMAGES.left_arrow}
  //           />
  //         </TouchableOpacity>
  //         {
  //           (navigation.state.params.showCloseIcon && navigation.state.params.showCloseIcon === true) ? (
  //             <TouchableOpacity
  //               onPress={() => {
  //                 navigation.goBack(null)
  //               }}
  //             >
  //               <Image
  //                 style={{marginLeft: 5, width: 30, height: 30, padding: 10}}
  //                 source={IMAGES.image_close}
  //               />
  //             </TouchableOpacity>
  //           ) : null
  //         }
  //       </View>
  //     ),
  //     headerRight: (
  //       <View>
  //         {
  //           navigation.state.params.rightIcon != null ? (
  //             <TouchableOpacity
  //               style={{marginRight: 16, justifyContent: 'center', alignItems: 'center'}}
  //               onPress={() => {
  //                 navigation.state.params.handleAction()
  //               }}
  //             >
  //               <Text style={{fontSize: 18, fontWeight: "500", fontStyle: "normal", color: '#f85836'}}>
  //                 {`${navigation.state.params.rightIcon}`}
  //               </Text>
  //
  //             </TouchableOpacity>
  //           ) : null
  //         }
  //       </View>
  //     ),
  //   })
  // }


  componentDidMount() {
    this.props.navigation.setParams({handleAction: this._handleAction})
    this._loadVideoAd()
    this.props.navigation.setParams({goBack: this._onGoBack});
    global.refWebNavigation = this.props.navigation
  }

  componentWillMount(): void {
    // if (Platform.OS === 'android') {
    //   BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    // }

  }

  _onGoBack = () => {
    const {navigation} = this.props
    if (canGoBack) {
      if (curUrl.includes(SHANDW_GAME_CENTER_PAGE) || curUrl.includes(VIP_CENTER_PAGE)) {
        navigation.goBack(null)
        return
      }

      this.webViewRef.goBack()
      setTimeout(() => {
        const data = {
          message: !!this.props.user.token,
          token: this.props.user.token,
          source: 4,
          custom: Config.channel
        }
        this.webViewRef.postMessage(JSON.stringify({...data}))
      }, 200)
    } else {
      navigation.goBack(null)
    }
  }

  // onBackAndroid = () => {
  //   if (canGoBack) {
  //     if(curUrl.includes(SHANDW_GAME_CENTER_PAGE) || curUrl.includes(VIP_CENTER_PAGE)) {
  //       return false
  //     }
  //
  //     this.webViewRef.goBack()
  //     return true
  //   }
  //   return false
  // }

  _loadVideoAd() {
    if (!isIOS()) {
      nativeModule.loadRewardeVideo().then(ret => {
        console.log('yy ret=', ret)
        if (ret === "onVideoComplete" && !!this.props.user.token) {// 播放完成
          // 增加激励视频热豆
          if (this.hotbeanType != -1) {
            this.props.actions.hotBeansPaymentInitAction({
              hotbeans_type: this.hotbeanType
            })
            showToast('已成功领取热豆')
          }
        } else if (ret == "onAdClose") { // 用户手动关闭视频
          // 不增加激励视频热豆
          if (this.hotbeanType === -1) {
            this._quickEncachement()
          }
        }
        //成功播放后，都会加载视频，为下一次播放做准备
        this._loadVideoAd()
      }).catch(error => {
        console.log('yy error=', error)
      })
    }
  }

  _playVideoAd(type) {
    if (isIOS()) {
      BookReadManager.loadAndPlayRewardeVideo().then((ret) => {
        console.log('看视频 ======== ', ret);
        if (ret && ret.result) {
          // 增加热豆
          if (!!this.props.user.token) {
            if (type !== -1) {
              // 增加激励视频热豆
              this.props.actions.hotBeansPaymentInitAction({
                hotbeans_type: type
              })
              showToast('已成功领取热豆')
            } else {
              this._quickEncachement()
            }
          }
        }
      })
    } else {
      nativeModule.playRewardeVideo()
    }
  }

  _quickEncachement = () => {
    const data = {
      message: !!this.props.user.token,
      token: this.props.user.token,
      status: true,
      source: 4,
      custom: Config.channel,
    }

    console.log('kanshidata ======== ', data)
    this.webViewRef.postMessage(JSON.stringify({...data}))
  }

  _onNavigationStateChange = (navState) => {
    canGoBack = navState.canGoBack
    curUrl = navState.url
    // const {navigation} = this.props
    // navigation.setParams({title: navState.title})
    const title = navState.title

    console.log('title ======== ', title);

    // if (title === '福利任务') {
    //   navigation.setParams({rightIcon: '规则'})
    // } else if (title === '我的热豆') {
    //   navigation.setParams({rightIcon: '明细'})
    // } else if (title === '邀请好友') {
    //   navigation.setParams({rightIcon: '规则说明', actionType: 'INVITE_RULE'})
    // } else if (title === '提现') {
    //   navigation.setParams({rightIcon: '规则说明', actionType: 'WITHDRAW_RULE'})
    // } else if (title === '福利任务') {
    //   navigation.setParams({rightIcon: null})
    // } else if (title === '会员中心') {
    //   navigation.setParams({rightIcon: '购买记录', actionType: 'PAY_RECORD'})
    // }
  }

  // 刷新当前页面
  _reloadCurrentPage = () => {
    const data = {
      h5reload: true,
      message: true,
      token: this.props.user.token,
      source: 4,
      custom: Config.channel
    }
    console.log('_reloadCurrentPage')
    this.webViewRef.postMessage(JSON.stringify({...data}))
  }

  // 登录
  _h5Login = () => {
    this.props.navigation.navigate('Login', {
      loginSuccess: () => {

        // console.log('login ===== ', data, this.webViewRef)
        setTimeout(() => {
          const data = {
            message: true,
            token: this.props.user.token,
            source: 4,
            custom: Config.channel
          }
          this.webViewRef.postMessage(JSON.stringify({...data}))
        }, 200)

      }
    })
  }

  _h5GoTask = () => {
    this.props.navigation.goBack()
    const {quduCallback} = this.props.navigation.state.params
    quduCallback && quduCallback()
  }

  _gameSignOut = () => {
    this.props.navigation.goBack()
  }

  _h5Ready = () => {
    const data = {
      message: !!this.props.user.token,
      token: this.props.user.token,
      source: 4,
      custom: Config.channel
    }
    console.log('data ======= ', data)
    this.webViewRef.postMessage(JSON.stringify({...data}))
  }

  _goBookMarket = () => {
    this.props.navigation.goBack()
    this.props.navigation.navigate('Market')
  }

  _goBookShelf = () => {
    this.props.navigation.goBack()
    this.props.navigation.navigate('Bookshelf')
  }

  _sign = () => {
    const {signStatusCallback} = this.props.navigation.state.params
    signStatusCallback && signStatusCallback()
  }

  _bindWeChat = () => {
    WeChat.sendAuthRequest('snsapi_userinfo')
      .then((result) => {
        this._getWeChatOpenId(result.code)
      }).catch((e) => {
      showToast('操作已取消')
    })
  }

  _getWeChatOpenId(code) {
    const oauthUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${Config.wechat.appID}&secret=${Config.wechat.appSecret}&code=${code}&grant_type=authorization_code`
    fetch(oauthUrl).then(response => response.json())
      .then((ret) => {
        console.log('wechat info ===== ', ret)
        this._getWeChatUserInfo(ret)
      })
      .catch((error) => {
        showToast(error.message)
      })
  }

  _getWeChatUserInfo(ret) {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${ret.access_token}&openid=${ret.openid}`
    fetch(url).then(response =>
      response.json()
    ).then((ret) => {
      console.log('wechat login info: ', ret)
      this._bindUserInfo(ret)
    }).catch((error) => {
      showToast(error.message)
    })
  }

  _bindUserInfo(info) {
    const {user} = this.props;
    console.log('info ======= ', info, user)
    if (!!user.token) {
      BindThirdApi(user.token, info.openid, info.unionid, encodeURIComponent(info.nickname), user.info.phone, 1).then(ret => {
        if (ret && ret.status === 200) {
          showToast('绑定成功', Toast.positions.CENTER)
          // this._reloadCurrentPage()
        } else if (ret.status === 701){
          // 已经绑定，提示解绑
          this._showUnbindAlert(user, info)
        } else {
          showToast(`${ret.message}`, Toast.positions.CENTER)
        }
      })
        .catch(err => {
          showToast(err.message)
        })
    }
  }

  _showUnbindAlert = (user, info) => {
    Alert.alert(
      '温馨提示',
      '此微信已注册过该应用账号，若确定绑定此微信，应用内微信账号将会被注销',
      [
        {
          text: '取消',
          onPress: () => {
            showToast('绑定失败', Toast.positions.CENTER)
          },
          style: 'cancel',
        },
        {
          text: '确定', onPress: () => {
            // 强制绑定微信号
            ForceBindApi(user.token, info.openid, info.unionid, encodeURIComponent(info.nickname), user.info.phone, 1, 1).then(ret => {
              if (ret && ret.status === 200) {
                showToast('绑定成功', Toast.positions.CENTER)
                // this._reloadCurrentPage()
              } else if (ret.status === 701){
                // 已经绑定，提示解绑
                this._showUnbindAlert(user)
              } else {
                showToast(`${ret.message}`, Toast.positions.CENTER)
              }
            })
              .catch(err => {
                showToast(err.message)
              })
          }
        },
      ],
      {cancelable: false},
    );
  }

  _h5Share = (inviteCode) => {
    this.props.navigation.navigate('Share', {
      title: '免费读小说，还能领现金，读得越多领得越多',
      description: '我在用热料看小说，邀请你也来，不仅免费看还能赚现金，赶紧来安装吧。',
      thumbImage: 'http://read.1bookreader.com/html/img/logo_free.png',
      webpageUrl: `${Config.url.downloadPage()}?invite_code=${inviteCode}`,
    })
  }

  _goBalancePage = () => {
    this.props.navigation.navigate('Web', {
      url: `${Config.url.balance()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
      showCloseIcon: true,
      pageWillUnmountCallback: () => {
        // this._reloadCurrentPage()
      }
    })
  }

  _goInvitePage = () => {
    this.props.navigation.navigate('Web', {
      url: `${Config.url.invite()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
      showCloseIcon: true,
      pageWillUnmountCallback: () => {
        // this._reloadCurrentPage()
      }
    })
  }

  _onMessage = (e) => {
    if(e.nativeEvent.data === '') {
      return
    }
    const data = JSON.parse(e.nativeEvent.data)
    const msg = data.message
    console.log('msg ============= ', msg)
    switch (msg) {
      case 'h5BindWechat':
        this._bindWeChat()
        break;
      case 'h5Login':
        this._h5Login()
        break;
      case 'h5GoTask':
        this._h5GoTask()
        break;
      case 'gameSignOut':
        this._gameSignOut()
        break;
      case 'h5Ready':
        this._h5Ready()
        break;
      case 'h5PlayVideo':
        this.hotbeanType = 8;
        this._playVideoAd(this.hotbeanType)
        break;
      case 'kanshipintixian':
        this.hotbeanType = -1;
        this._playVideoAd(this.hotbeanType)
        break;
      case 'h5PlayVideoForCheckin':
        this.hotbeanType = 27;
        this._playVideoAd(this.hotbeanType)
        break;
      case 'h5BookMarket':
        this._goBookMarket()
        break;
      case 'h5BookShelf':
        this._goBookShelf()
        break;
      case 'h5Share':
        const inviteCode = data && data.invite_code || undefined
        this._h5Share(inviteCode)
        break;
      case 'alreadySignIn':
        this._sign()
        break;
      case 'consumeHotBean':
        // 更新用户信息，更新免广告时间
        this._updateUserInfo()
        break;
      case 'shouyi.html':
        this._goBalancePage()
        break;
      case  'invite.html':
        this._goInvitePage()
        break;
      default:
        break;
    }
  }

  _updateUserInfo = () => {
    getItem(KEY_TOKEN).then(token => {
      if (!!token) {
        GetUserInfoApi(token).then(ret => {
          if (ret.status === 200) {
            this.props.actions.userInit({
              token: token,
              user: ret.data
            })
          } else {
            showToast(`${ret.message}`)
          }
        })
          .catch(error => {
            showToast(`${error.message}`)
          })
      }
    })
      .catch(error => {
        console.log('get token error with info: ', error)
      })
  }


  _onShouldStartLoadWithRequest = (req) => {
    if (req.url === 'h5read.mjpet.net://') {
      this.webViewRef.goBack()
      setTimeout(() => {
        this.webViewRef.reload()
      }, 200)
      return false
    }
    return true
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <WebView
          ref={webview => this.webViewRef = webview}
          useWebKit={true}
          source={{uri: `${Config.url.missionURL()}?token=${this.props.user.token}&canOpen=1&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`}}
          onNavigationStateChange={this._onNavigationStateChange}
          onMessage={this._onMessage}
          startInLoadingState={true}
          renderError={(e) => {
            console.log('onError === ', e)
            if (e === 'NSURLErrorDomain' || 'WebKitLoadingErrorDomain') {
              return
            }
          }}
          renderLoading={() => {
            return (
              <ActivityIndicator
                style={{position: "absolute", top: height / 2, left: width / 2}}
                size="small"
              />

            )
          }}
          onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
          injectJavaScript={patchPostJsCode}
        />
      </View>
    )
  }
}

WebfareWebPage.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  rightIcon: PropTypes.string,
  // 1: 我的热豆 2：任务中心
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
}, mapDispatchToProps)(WebfareWebPage)
