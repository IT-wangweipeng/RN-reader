import React, {Component} from 'react'
import {
  Alert,
  Platform,
  NativeModules,
  AppState,
  Linking,
  DeviceEventEmitter, PermissionsAndroid
} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as WeChat from 'react-native-wechat'
import JPush from 'jpush-react-native'
import SplashScreen from 'react-native-splash-screen'
import TabNavigator from '../utils/Navigation'
import {getItem, removeItem, setItem} from '../utils/AsyncStorageManager'
import {KEY_FIRST_LAUNCH, KEY_TOKEN} from '../utils/AsyncStorageKey'
import {Config} from '../config/Config'
import * as userAction from '../actions/userAction'
import {AutoLoginApi, HOST_DEV, UploadDeviceInfoApi} from '../apis/Api'
import * as APP_CONFIG from '../apis/ApiConfig'
import {showToast} from '../actions/toastAction'
import {query, updateNotificationMessage, insertNotificationMessage} from "../model/BookModelManager";
import {isIOS} from "../utils/PlatformUtils";
import { init, Geolocation,setLocatingWithReGeocode } from "react-native-amap-geolocation"


var nativeModule = NativeModules.OpenNativeModule

class RootComponent extends Component {

  constructor(props) {
    super(props)

  }

  componentWillMount(): void {
    if (isIOS()) {
      JPush.setBadge(0, success => {
        console.log('s ========== ', success)
      })
    }
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      SplashScreen.hide();
    } else {
      const HOST_PRODUCTION = APP_CONFIG.ApiConfig.getInstance().ip
      nativeModule.hideSplash()
    }
    WeChat.registerApp(Config.wechat.appID)
    this._jpushNotification()
    // this._getGeoLocation()

    getItem(KEY_TOKEN).then(token => {
      if (!!token) {
        AutoLoginApi(token).then(ret => {
          if (ret.status === 200) {
            const userId = `${ret.data.user.id}`
            JPush.setAlias(userId, (result) => {
              console.log('set alias result: ', result)
            })
            console.log('autoLogin success user=',ret.data.user)

            //fix 1.0微信登录api没有返回wechat_openid，2.0中需要用到wechat_openid进行提现
            if(ret.data.user.wechat_union && ret.data.user.wechat_openid == ""){
              this.props.actions.deleteUser()
              removeItem(KEY_TOKEN)
              showToast('登录已过期，请重新登录')
            }else{
              this.props.actions.userInit(ret.data)
            }
          } else {
            this.props.actions.deleteUser()
            removeItem(KEY_TOKEN)
            showToast('登录已过期，请重新登录')
            showToast('登录已过期，请重新登录')
          }
        })
          .catch(error => {
            showToast('登录出错，请重新登录')
            this.props.actions.deleteUser()
            removeItem(KEY_TOKEN)
          })
      }
    })
      .catch(error => {
        console.log('get token error with info: ', error)
      })
  }

  async _getGeoLocation(){
    // 对于 Android 需要自行根据需要申请权限
    if (!isIOS()) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    }
    // 使用自己申请的高德 App Key 进行初始化
    await init({
      ios: "6a01df3c36bc760ec90cb57ce02f0d49",
      android: "620f612ddce500ab5fed8be44a0a1023"
    });


    setLocatingWithReGeocode(true)
    Geolocation.getCurrentPosition(({ location }) => {
      console.log('gg location=',location)
      if (location.errorCode === 0) {
        getItem(KEY_TOKEN).then((token) => {
          this._uploadDeviceInfo(token, Config.app.uniqueId, location.province)
        })
          .catch(error => {
            console.log('get token error: ', error)
          })
      }
    })
  }

  _uploadDeviceInfo = (token, uniqueID, address) => {
    UploadDeviceInfoApi(token, uniqueID, address).then(ret => {
      console.log('上传设备号成功：', ret)
    })
      .catch((error) => {
        console.log('上传设备信息失败：', error)
      })

  }

  render() {
    return (
      <TabNavigator
        ref={(n) => {
          this.navigationRef = n
          // global.navigationRef = n
        }}
      />
    )
  }


  _jpushNotification() {
    if (Platform.OS === 'ios') {
      /*
      * 如果不是通过点击推送启动应用，比如点击应用 icon 直接启动应用，notification 会返回 undefine。
      * */
      JPush.getLaunchAppNotification(e => {
        console.log('点击icon启动app =============== ', e)
        if (e === undefined) {
          // application was launch by tap app's icon
        } else if (e['aps'] === undefined) {
          // application was launch by tap local notification
        } else {
          // application was launch by tap remote notification
          this._handleRemoteNotification(e)
        }
      })

      // 点击推送事件
      JPush.addReceiveOpenNotificationListener(e => {
        console.log('iOS 9 later 点击推送 ===== ', e, AppState.currentState)
        if (AppState.currentState === 'active' || 'inactive') {
          this._handleRemoteNotification(e)
        } else {
          console.log(AppState.currentState);
        }
      })
    } else {

      JPush.addGetRegistrationIdListener((map) => {
        console.log(map)
      })

      JPush.getInfo((map) => {
        console.log(map)
      })

      JPush.notifyJSDidLoad((resultCode) => {
        if (resultCode === 0) {
          JPush.getRegistrationID((registrationId) => {
            console.log('registrationId: ' + registrationId)
          })
        }
      })

      JPush.addReceiveOpenNotificationListener(map => {
        console.log('Opening notification!')
        console.log('map.extra: ' + map.extras)

        if (this.navigationRef != null) {
          let extras = JSON.parse(map.extras)
          console.log('yy extras=', extras)
          const navigation = this.navigationRef._navigation
          if (extras && extras.type && extras.type === 1) {
            navigation.navigate('Notification')
            return
          }

          if (extras.url) {
            if (global.refWebNavigation) {
              global.refWebNavigation.replace('Web', {
                url: extras.url
              })
            } else {
              navigation.navigate('Web', {
                url: extras.url
              })
            }
          } else if (extras.book_id) {
            if (global.refDetailNavigation) {
              global.refDetailNavigation.replace('Detail', {
                bookId: extras.book_id
              })
            } else {
              navigation.navigate('Detail', {
                bookId: extras.book_id
              })
            }
          }
        }
      })
    }
  }

  _handleRemoteNotification(e) {
    // appState: "inactive"
    // aps: {sound: "default", badge: 1, alert: {…}}
    // book_id: "1234"
    // extras:
    //   book_id: "1234"
    //   url: "http://www.baidu.com"
    // url: "http://www.baidu.com"
    // _j_business: 1
    // _j_msgid: 47287804081984790
    // _j_uid: 25567227458
    console.log(`alertContent===================: ${JSON.stringify(e)}`)
    const navigation = this.navigationRef._navigation;
    if (e && e.extras && e.extras.type && e.extras.type === 1) {
      navigation.navigate('Notification')
    } else {
      // 其他类型推送消息
      if (e.extras && !!e.extras.url) {
        navigation.navigate('Web', {
          url: `${e.extras.url}`
        })
      } else if (e.extras && !!e.extras.book_id) {
        navigation.navigate('Detail', {
          bookId: e.extras.book_id
        })
      }
    }
  }
}

RootComponent.propTypes = {}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...userAction}, dispatch)
})

export default connect(({user}) => {
  return {
    user,
  }
}, mapDispatchToProps)(RootComponent)
