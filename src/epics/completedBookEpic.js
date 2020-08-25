import {of, zip, from} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {CompletedBookApi} from '../apis/Api'
import * as actions from '../reducers/completedBookReducer'
import {showToast} from '../actions/toastAction'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'
import {getItem} from '../utils/AsyncStorageManager'

const completedBookEpic = action$ => action$.pipe(
  ofType(actions.COMPLETED_BOOK_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    (token) => ({
      token,
    }),
  )),
  flatMap((result) => {
    const {
      token,
    } = result
    return CompletedBookApi(token)
  }),
  map(ret => {
    console.log('CompletedBookApi ======== ', ret)
    if (ret.status === 200) {
      return actions.completedBookInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.completedBookInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.completedBookInitFailedAction()
  })
)

export default combineEpics(completedBookEpic)
