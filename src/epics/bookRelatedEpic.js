import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookRelatedApi} from '../apis/Api'
import * as actions from '../actions/bookRelatedlAction'
import {showToast} from '../actions/toastAction'


const bookRelatedEpic = action$ => action$.pipe(
  ofType(actions.BOOK_RELATED_INIT),
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
    return from(bookRelatedApi(bookId))
  }),
  map(ret => {
    console.log('bookRelated ret ======== ', ret)
    if (ret.status === 200) {
      return actions.bookRelatedInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.bookRelatedInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.bookRelatedInitFailed()
    }
  })
)


export default combineEpics(bookRelatedEpic)
