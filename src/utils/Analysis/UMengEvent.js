
import {
  NativeModules,
  Platform,
} from 'react-native'


const native = Platform.OS === 'ios' ? NativeModules.UMNative : NativeModules.UmengNativeModule

export const sendAction = (eventID: string) => {
  if (native) {
    native.onEvent(eventID)
  }
}

export const UMCalculateEvent = (eventId: string, parameters: Object, count: string) => {
  if (native && !__DEV__) {
    native.onEventWithCounter(eventId, parameters, count)
  }
}

export const UMCPS_WITH_LABEL = (eventID: string, eventName: string) => {
  if (native && !__DEV__) {
    native.onEventWithLabel(eventID, eventName)
  }
}

export const UMCPS = (eventID: string, paramsObj: Object) => {
  if (native) {
    native.onEventWithParameters(eventID, paramsObj)
  }
}

export const beginLogPageView = (pageName: string) => {
  if (native && !__DEV__) {
    native.onPageBegin(pageName)
  }
}

export const endLogPageView = (pageName: string) => {
  if (native && !__DEV__) {
    native.onPageEnd(pageName)
  }
}
