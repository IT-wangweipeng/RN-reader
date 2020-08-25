/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
  Alert,
  Platform,
  BackHandler,
  View,
  PanResponder, NativeModules,
} from 'react-native'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {createEpicMiddleware} from 'redux-observable'
import logger from 'redux-logger'
import codePush from 'react-native-code-push'
import rootReducer from './src/reducers/index'
import rootEpic from './src/epics/index'
import Root from './src/component/RootComponent'
import {showToast} from './src/actions/toastAction'
import * as APP_CONFIG from "./src/apis/ApiConfig";
import {
  API_PREFIX_1,
  API_PREFIX_PRODUCTION_1,
  API_PREFIX_PRODUCTION_2,
  API_PREFIX_2,
  TestApi,
  API_DEV,
  HOST_DEV,
  AdsSourceApi
} from "./src/apis/Api";
import {isIOS} from "./src/utils/PlatformUtils";
import {Config} from "./src/config/Config";
import {forEach} from "ramda";

console.disableYellowBox = true
const epicMiddleware = createEpicMiddleware()
const store = createStore(
  rootReducer,
  applyMiddleware(
    logger,
    epicMiddleware,
  )
)

let lastBackPressed = null

epicMiddleware.run(rootEpic)

console.disableYellowBox = true
type Props = {};
if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
  };
}

class App extends Component<Props> {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    codePush.checkForUpdate()
      .then((update) => {
        if (!update) {
          console.log('The app is up to date!')
        } else {
          codePush.sync({
            installMode: codePush.InstallMode.IMMEDIATE,
          })
        }
      })
  }

  testApi(){
    const prefix = APP_CONFIG.ApiConfig.getInstance()
    if (Config.isProduction) {
      prefix.h5ApiPrefix = API_PREFIX_1
      prefix.ip = API_PREFIX_PRODUCTION_1
      console.log('ip ================= ', prefix.ip)
      this.saveApi(prefix)
      TestApi(`${prefix.h5ApiPrefix}`).then(ret => {
        console.log('testApi status=',ret.status)
        if (ret && ret.status === 200) {
          prefix.ip = API_PREFIX_PRODUCTION_1
          prefix.h5ApiPrefix = API_PREFIX_1
        } else {
          prefix.ip = API_PREFIX_PRODUCTION_2
          prefix.h5ApiPrefix = API_PREFIX_2
        }
        this.saveApi(prefix)
      })
        .catch(err => {
          prefix.ip = API_PREFIX_PRODUCTION_2
          prefix.h5ApiPrefix = API_PREFIX_2
          this.saveApi(prefix)
        })
    } else {
      prefix.ip = HOST_DEV
      prefix.h5ApiPrefix = API_DEV
      this.saveApi(prefix)
    }
  }

  // fetchAdsSource = () => {
  //   if (isIOS()) {
  //     NativeModules.BookReadManager.getAdsType().then(ret => {
  //       console.log('getAdsType ========== ', ret)
  //       if (ret && ret.adType == null) {
  //         this._saveAdsType(this.adsType)
  //       }
  //       this.requestAdSource()
  //     })
  //   }
  // }

  requestAdSource = () => {
      AdsSourceApi().then(ret => {
        console.log('获取广告来源成功 ==== ', ret)
        if (ret && ret.status === 200) {
          const {data} = ret
          const {list} = data
          console.log('获取广告来源成功 2==== ', list)
          if (list && list.length > 0) {
            this._saveAdsType(list)
          } else {
            this._saveAdsType([])
          }
        } else {
          this._saveAdsType([])
        }
      })
        .catch(err => {
          console.log('获取广告来源失败 ==== ', err)
          this._saveAdsType([])
        })
  }

  _saveAdsType = (adType) => {
    if (isIOS()) {
      NativeModules.BookReadManager.saveAdsSource(adType)
    }else{
      NativeModules.OpenNativeModule.saveAdsSource(JSON.stringify(adType))
    }

  }

  saveApi = (prefix) => {
    if (isIOS()) {
      NativeModules.BookReadManager.saveApi(prefix.ip)
      NativeModules.BookReadManager.saveApiPrefix(prefix.h5ApiPrefix)
    } else {
      NativeModules.OpenNativeModule.saveApiAddress(prefix.ip + '/')
      NativeModules.OpenNativeModule.saveWechatShareWebpageUrl(Config.wechatShare.webpageUrl())
    }
  }


  componentWillMount() {
    this.requestAdSource()
    this.testApi();
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  onBackAndroid = () => {
    if (lastBackPressed && lastBackPressed + 3000 >= Date.now()) {
      // 3秒内按过back键退出应用
      return false
    }
    lastBackPressed = Date.now()
    showToast('再按一次退出应用')
    return true
  }


  render() {

    return (
      <Provider store={store}>
        <Root/>
      </Provider>
    )
  }
}

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};
export default App = codePush(codePushOptions)(App)
