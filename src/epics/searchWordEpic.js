import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {searchWordApi} from '../apis/Api'
import * as actions from '../actions/searchWordAction'
import {showToast} from '../actions/toastAction'


const searchWordEpic = action$ => action$.pipe(
  ofType(actions.SEARCH_WORD_INIT),
  mergeMap(action => zip(
    of(action.payload.word),
    word => ({
      word,
    }),
  )),
  flatMap((result) => {
    const {
      word,
    } = result
    return from(searchWordApi(word))
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.searchWordInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.searchWordInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.searchWordInitFailed()
    }
  })
)


export default combineEpics(searchWordEpic)
