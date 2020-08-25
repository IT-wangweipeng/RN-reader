import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookRankApi} from '../apis/Api'
import * as actions from '../actions/rankMaleFavoriteAction'
import {showToast} from '../actions/toastAction'


const rankMaleFavoriteEpic = action$ => action$.pipe(
  ofType(actions.RANK_MALE_FAVORITE_INIT),
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
    console.log('rankMaleFavoriteEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.rankMaleFavoriteInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.rankMaleFavoriteInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankMaleFavoriteInitFailed()
    }
  })
)

const rankMaleFavoriteLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.RANK_MALE_FAVORITE_LOAD_MORE),
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
    console.log('rankMaleFavoriteLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.rankMaleFavoriteLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.rankMaleFavoriteLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankMaleFavoriteLoadMoreFailed()
    }
  })
)


export default combineEpics(rankMaleFavoriteEpic, rankMaleFavoriteLoadMoreEpic)
