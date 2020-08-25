import {of, from, zip} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {ReadTimeApi} from '../apis/Api'
import * as actions from '../reducers/readTimeReducer'
import {showToast} from '../actions/toastAction'
import { getItem, setItem } from '../utils/AsyncStorageManager'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'


const readTimeEpic = action$ => action$.pipe(
  ofType(actions.READ_TIME_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    (token) => ({token})),
  ),
  flatMap((it) => {
    const {token} = it
    return ReadTimeApi(token, 10, 0)
  }),
  map(ret => {
    console.log('readTimeInitSuccessAction ret ======== ', ret)
    if (ret.status === 200) {
      return actions.readTimeInitSuccessAction(ret.data)
    } else {
      showToast(ret.message)
      return actions.readTimeInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.readTimeInitFailedAction()
    }
  })
)


const readTimeLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.READ_TIME_LOAD_MORE_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.size),
    of(action.payload.start),
    (token, size, start) => ({token, size, start})),
  ),
  flatMap((it) => {
    const {token, size, start} = it
    return ReadTimeApi(token, size, start)
  }),
  map(ret => {
    console.log('readTimeLoadMoreSuccessAction ret ======== ', ret)
    if (ret.status === 200) {
      return actions.readTimeLoadMoreSuccessAction(ret.data)
    } else {
      showToast(ret.message)
      return actions.readTimeInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.readTimeInitFailedAction()
    }
  })
)



export default combineEpics(readTimeEpic, readTimeLoadMoreEpic)
