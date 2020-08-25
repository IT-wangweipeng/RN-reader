import {of, zip, from} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {
  UserCenterMessageApi
} from "../apis/Api";
import * as actions from '../reducers/mineMessageReducer'
import {showToast} from '../actions/toastAction'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'
import {getItem} from '../utils/AsyncStorageManager'



const mineMessageEpic = action$ => action$.pipe(
  ofType(actions.MINE_MESSAGE_LIST_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.start),
    of(action.payload.size),
    (token, start, size) => ({
      token,
      start,
      size,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      start,
      size,
    } = result
    return UserCenterMessageApi(token, start, size)
  }),
  map(ret => {
    console.log('UserCenterMessageApi ======== ', ret)
    if (ret.status === 200) {
      return actions.mineMessageListInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.mineMessageListInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.mineMessageListInitFailedAction()
  })
)


const mineMessageLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.MINE_MESSAGE_LIST_LOAD_MORE_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.start),
    of(action.payload.size),
    (token, start, size) => ({
      token,
      start,
      size,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      start,
      size,
    } = result
    return UserCenterMessageApi(token, start, size)
  }),
  map(ret => {
    console.log('UserCenterMessageApi Load More ======== ', ret)
    if (ret.status === 200) {
      return actions.mineMessageListLoadMoreSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.mineMessageListLoadMoreFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.mineMessageListLoadMoreFailedAction()
  })
)



export default combineEpics(
  mineMessageEpic,
  mineMessageLoadMoreEpic
)
