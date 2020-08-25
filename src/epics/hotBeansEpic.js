import {of, zip, from} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {HotBeansApi, HotBeansPaymentApi} from '../apis/Api'
import * as actions from '../reducers/hotBeansReducer'
import {showToast} from '../actions/toastAction'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'
import {getItem} from '../utils/AsyncStorageManager'

const hotBeansEpic = action$ => action$.pipe(
  ofType(actions.GET_HOT_BEANS_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    (token, sex) => ({
      token,
    }),
  )),
  flatMap((result) => {
    const {
      token,
    } = result
    return HotBeansApi(token)
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.getHotBeansSuccessAction({data: ret.data})
    } else {
      showToast(ret.message)
      return actions.getHotBeansFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.getHotBeansFailedAction()
  })
)

const hotBeansPaymentEpic = action$ => action$.pipe(
  ofType(actions.HOT_BEANS_PAYMENT_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.hotbeans_type),
    (token, hotbeans_type) => ({
      token,
      hotbeans_type,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      hotbeans_type
    } = result
    return HotBeansPaymentApi(token, hotbeans_type)
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.hotBeansPaymentInitSuccessAction()
    } else {
      showToast(ret.message)
      return actions.hotBeansPaymentInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.hotBeansPaymentInitFailedAction()
  })
)


export default combineEpics(hotBeansEpic, hotBeansPaymentEpic)
