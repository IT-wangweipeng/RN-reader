import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookFavoritesApi} from '../apis/Api'
import * as actions from '../actions/bookFavoritesAction'
import {showToast} from '../actions/toastAction'


const bookFavoritesEpic = action$ => action$.pipe(
  ofType(actions.BOOK_FAVORITES_INIT),
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
    return from(bookFavoritesApi(id))
  }),
  map(ret => {
    console.log('bookFavoritesEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.bookFavoritesInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.bookFavoritesInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.bookFavoritesInitFailed()
    }
  })
)


export default combineEpics(bookFavoritesEpic)
