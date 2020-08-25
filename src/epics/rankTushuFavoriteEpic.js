import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookRankApi} from '../apis/Api'
import * as actions from '../actions/rankTushuFavoriteAction'
import {showToast} from '../actions/toastAction'


const rankTushuFavoriteEpic = action$ => action$.pipe(
  ofType(actions.RANK_TUSHU_FAVORITE_INIT),
  mergeMap(action => zip(
    of(action.payload.sex),
    of(action.payload.type),
    of(action.payload.size),
    of(action.payload.start),
    (sex, type, size, start) => ({
      sex,
      type,
      size,
      start,
    }),
  )),
  flatMap((result) => {
    const {
      sex,
      type,
      size,
      start,
    } = result

    return from(bookRankApi(sex, type, size, start))
  }),
  map(ret => {
    console.log('rankTushuFavoriteEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.rankTushuFavoriteInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.rankTushuFavoriteInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankTushuFavoriteInitFailed()
    }
  })
)

const rankTushuFavoriteLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.RANK_TUSHU_FAVORITE_LOAD_MORE),
  mergeMap(action => zip(
    of(action.payload.sex),
    of(action.payload.type),
    of(action.payload.size),
    of(action.payload.start),
    (sex, type, size, start) => ({
      sex,
      type,
      size,
      start,
    }),
  )),
  flatMap((result) => {
    const {
      sex,
      type,
      size,
      start,
    } = result
    return from(bookRankApi(sex, type, size, start))
  }),
  map((ret) => {
    console.log('rankTushuFavoriteLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.rankTushuFavoriteLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.rankTushuFavoriteLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankTushuFavoriteLoadMoreFailed()
    }
  })
)


export default combineEpics(rankTushuFavoriteEpic, rankTushuFavoriteLoadMoreEpic)
