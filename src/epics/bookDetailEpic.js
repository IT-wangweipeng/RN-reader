import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookDetailApi} from '../apis/Api'
import * as actions from '../actions/bookDetailAction'
import {showToast} from '../actions/toastAction'


const bookDetailEpic = action$ => action$.pipe(
  ofType(actions.BOOK_DETAIL_INIT),
  mergeMap(action => zip(
    of(action.payload.bookId),
    bookId => ({
      bookId,
    }),
  )),
  flatMap((result) => {
    const {
      bookId,
    } = result
    return from(bookDetailApi(bookId))
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.bookDetailInitSuccess(ret)
    } else {
      // showToast(ret.message)
      return actions.bookDetailInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      // showToast(error.message)
      return actions.bookDetailInitFailed()
    }
  })
)


export default combineEpics(bookDetailEpic)
