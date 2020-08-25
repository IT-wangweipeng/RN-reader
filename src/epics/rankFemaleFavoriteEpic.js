import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookRankApi} from '../apis/Api'
import * as actions from '../actions/rankFemaleFavoriteAction'
import {showToast} from '../actions/toastAction'


const rankFemaleFavoriteEpic = action$ => action$.pipe(
  ofType(actions.RANK_FEMALE_FAVORITE_INIT),
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
      return actions.rankFemaleFavoriteInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.rankFemaleFavoriteInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankFemaleFavoriteInitFailed()
    }
  })
)

const rankFemaleFavoriteLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.RANK_FEMALE_FAVORITE_LOAD_MORE),
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
    console.log('rankFemaleFavoriteLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.rankFemaleFavoriteLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.rankFemaleFavoriteLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankFemaleFavoriteLoadMoreFailed()
    }
  })
)


export default combineEpics(rankFemaleFavoriteEpic, rankFemaleFavoriteLoadMoreEpic)
