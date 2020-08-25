/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {
  AppRegistry, NativeModules,
  Text,
  UIManager
} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as APP_CONFIG from "./src/apis/ApiConfig";
import {API_DEV, API_PREFIX_1, API_PREFIX_PRODUCTION_1, HOST_DEV} from "./src/apis/Api";
import {isIOS} from "./src/utils/PlatformUtils";
import {Config} from "./src/config/Config";

const prefix = APP_CONFIG.ApiConfig.getInstance()
if (Config.isProduction) {
  prefix.ip = API_PREFIX_PRODUCTION_1
  prefix.h5ApiPrefix = API_PREFIX_1
} else {
  prefix.ip = HOST_DEV
  prefix.h5ApiPrefix = API_DEV
}

if (isIOS()) {
  NativeModules.BookReadManager.saveApi(prefix.ip)
}else{
  NativeModules.OpenNativeModule.saveApiAddress(prefix.ip + '/')
}

Text.defaultProps = {...(Text.defaultProps || {}), allowFontScaling: false};

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent(appName, () => App);

