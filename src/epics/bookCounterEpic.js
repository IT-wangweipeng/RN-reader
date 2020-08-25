import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookCounterApi} from '../apis/Api'
import * as actions from '../actions/bookCounterAction'
import {showToast} from '../actions/toastAction'


const bookCounterEpic = action$ => action$.pipe(
  ofType(actions.BOOK_COUNTER_INIT),
  mergeMap(action => zip(
    of(action.payload.id),
    id => ({
      id,
    }),
  )),
  flatMap((result) => {
    const {
      id,
    } = result
    return from(bookCounterApi(id))
  }),
  map(ret => {
    console.log('bookCounterEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.bookCounterInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.bookCounterInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.bookCounterInitFailed()
    }
  })
)


export default combineEpics(bookCounterEpic)
