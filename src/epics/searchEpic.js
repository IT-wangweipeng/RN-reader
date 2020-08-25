import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {searchApi} from '../apis/Api'
import * as actions from '../actions/searchAction'
import {showToast} from '../actions/toastAction'


const searchEpic = action$ => action$.pipe(
  ofType(actions.SEARCH_INIT),
  mergeMap(action => zip(
    of(action.payload.token),
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.keyword),
    (token, start, size, keyword) => ({
      token,
      start,
      size,
      keyword,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      start,
      size,
      keyword,
    } = result

    return from(searchApi(token, start, size, encodeURIComponent(keyword)))
  }),
  map(ret => {
    console.log('searchEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.searchInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.searchInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.searchInitFailed()
    }
  })
)

const searchLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.SEARCH_LOAD_MORE),
  mergeMap(action => zip(
    of(action.payload.token),
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.keyword),
    (token, start, size, keyword) => ({
      token,
      start,
      size,
      keyword,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      start,
      size,
      keyword,
    } = result
    return from(searchApi(token, start, size, keyword))
  }),
  map((ret) => {
    console.log('searchMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.searchLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.searchLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.searchLoadMoreFailed()
    }
  })
)


export default combineEpics(searchEpic,searchLoadMoreEpic)
