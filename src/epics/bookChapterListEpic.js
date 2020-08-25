import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookChapterListApi} from '../apis/Api'
import * as actions from '../actions/bookChapterListAction'
import {showToast} from '../actions/toastAction'


const bookChapterListEpic = action$ => action$.pipe(
  ofType(actions.BOOK_CHAPTER_LIST_INIT),
  mergeMap(action => zip(
    of(action.payload.bookId),
    of(action.payload.order),
    (bookId, order) => ({
      bookId,
      order,
    }),
  )),
  flatMap((result) => {
    const {
      bookId,
      order,
    } = result
    return from(bookChapterListApi(bookId, order))
  }),
  map(ret => {
    console.log('bookChapterListEpic ret ======== ', ret)
    if (ret.status === 200) {
      return actions.bookChapterListInitSuccess(ret)
    } else {
      // showToast(ret.message)
      return actions.bookChapterListInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      // showToast(error.message)
      return actions.bookChapterListInitFailed()
    }
  })
)


export default combineEpics(bookChapterListEpic)
