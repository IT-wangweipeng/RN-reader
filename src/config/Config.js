import DeviceInfo from 'react-native-device-info'
import {Platform, Text} from "react-native";
import React from "react";
import * as APP_CONFIG from '../apis/ApiConfig'

// platform：安卓：8，iOS：6
const ANDROID_CHANNEL = 8
const CHANNEL = Platform.OS === 'ios' ? 6 : ANDROID_CHANNEL
// const h5Prefix = APP_CONFIG.ApiConfig.getInstance().h5ApiPrefix

// 生产环境改为 true
export const isProduction = true
// 提交app store审核的时候，改为true
export const isReview = false


function h5Prefix() {
  return APP_CONFIG.ApiConfig.getInstance().h5ApiPrefix
}

export const Config = {
  isProduction: isProduction,
  iosReviewVersion: isReview,
  channel: CHANNEL,
  custom: 4,
  app: {
    version: `${DeviceInfo.getVersion()}`,
    build: `${DeviceInfo.getBuildNumber()}`,
    uniqueId: `${DeviceInfo.getUniqueId()}`,
    jsVersion: '1028',
  },
  wechat: {
    appID: 'wxdc3b9846a91d1826',
    appSecret: '3754233b2e28136d7387e31b9d42317d',
  },
  db: {
    // realm 数据更新必须增加 db version
    version: 11,
  },
  wechatShare: {
    webpageUrl: () => `${h5Prefix()}/share/detail.html?custom=${CHANNEL}&sex=%d&id=%d`,
  },
  hotBeans: {
    detailURL: () => isProduction ? `${h5Prefix()}/hotbeannew/account.html` : 'http://10.20.70.219/webread/hotbeannew/account.html',
    rulesURL: () => isProduction ? `${h5Prefix()}/hotbeannew/rule.html` : 'http://10.20.70.219/webread/hotbeannew/rule.html',
    mineURL: () => isProduction ? `${h5Prefix()}/hotbeannew/my.html` : 'http://10.20.70.219/webread/hotbeannew/my.html',
  },
  vip: {
    payRecordURL: () => isProduction ? `${h5Prefix()}/appvip/account.html` : 'http://10.20.70.219/webread/appvip/account.html',
    url: () => isProduction ? `${h5Prefix()}/appvip/vip.html` : 'http://10.20.70.219/webread/appvip/vip.html',
  },
  url: {
    withdraw: () => isProduction ? `${h5Prefix()}/fuli2/tixian.html` : 'http://10.20.70.219/webread/fuli2/tixian.html',
    missionURL: () => isProduction ? `${h5Prefix()}/fuli2/fuli.html` : 'http://10.20.70.219/webread/fuli2/fuli.html',
    invite: () => isProduction ? `${h5Prefix()}/fuli2/invite.html` : 'http://10.20.70.219/webread/fuli2/invite.html',
    balance: () => isProduction ? `${h5Prefix()}/fuli2/shouyi.html` : 'http://10.20.70.219/webread/fuli2/shouyi.html',
    downloadPage: () => isProduction ? `${h5Prefix()}/fuli2/faf.html` : 'http://10.20.70.219/webread/fuli2/faf.html',
    withdrawRule: () => isProduction ? `${h5Prefix()}/fuli2/rule_tixian.html` : 'http://10.20.70.219/webread/fuli2/rule_tixian.html',
    inviteRule: () => isProduction ? `${h5Prefix()}/fuli2/rule_yaoqing.html` : 'http://10.20.70.219/webread/fuli2/rule_yaoqing.html',
    aboutUs: () => `${h5Prefix()}/html/about.html`,
    service: () => `${h5Prefix()}/html/service.html`,
    privacy: () => `${h5Prefix()}/html/privacy.html`,
  }
}
