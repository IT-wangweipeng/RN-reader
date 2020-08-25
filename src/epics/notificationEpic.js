import {of, from, zip} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {NotificationApi, DeleteNotificationApi, NotificationTipsApi} from '../apis/Api'
import * as actions from '../reducers/notificationReducer'
import {showToast} from '../actions/toastAction'
import { getItem, setItem } from '../utils/AsyncStorageManager'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'


const notificationEpic = action$ => action$.pipe(
  ofType(actions.NOTIFICATION_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    (token) => ({token})),
  ),
  flatMap((it) => {
    const {token} = it
    return NotificationApi(token)
  }),
  map(ret => {
    console.log('notificationInitAction ret ======== ', ret)
    if (ret.status === 200) {
      return actions.notificationInitSuccessAction(ret.data)
    } else {
      showToast(ret.message)
      return actions.notificationInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.notificationInitFailedAction()
    }
  })
)


const deleteNotificationEpic = action$ => action$.pipe(
  ofType(actions.DELETE_NOTIFICATION_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.book_ids),
    (token, book_ids) => ({token, book_ids})),
  ),
  flatMap((it) => {
    const {token, book_ids} = it
    return DeleteNotificationApi(token, book_ids)
  }),
  map(ret => {
    console.log('readTimeLoadMoreSuccessAction ret ======== ', ret)
    if (ret.status === 200) {
      return actions.deleteNotificationSuccessAction(ret.data)
    } else {
      showToast(ret.message)
      return actions.deleteNotificationFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.deleteNotificationFailedAction()
    }
  })
)


const showNotificationTips = action$ => action$.pipe(
  ofType(actions.NOTIFICATION_TIPS_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.type),
    (token, type) => ({token, type})),
  ),
  flatMap((it) => {
    const {token, type} = it
    return NotificationTipsApi(token, type)
  }),
  map(ret => {
    console.log('notificationTipsInitSuccess ret ======== ', ret)
    if (ret.status === 200) {
      return actions.notificationTipsInitSuccess(ret.data)
    } else {
      showToast(ret.message)
      return actions.notificationInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.notificationInitFailedAction()
    }
  })
)


export default combineEpics(notificationEpic, deleteNotificationEpic, showNotificationTips)
