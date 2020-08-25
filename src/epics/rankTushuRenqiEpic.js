import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookRankApi} from '../apis/Api'
import * as actions from '../actions/rankTushuRenqiAction'
import {showToast} from '../actions/toastAction'


const rankTushuRenqiEpic = action$ => action$.pipe(
  ofType(actions.RANK_TUSHU_RENQI_INIT),
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
    console.log('rankTushuRenqiEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.rankTushuRenqiInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.rankTushuRenqiInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankTushuRenqiInitFailed()
    }
  })
)

const rankTushuRenqiLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.RANK_TUSHU_RENQI_LOAD_MORE),
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
    console.log('rankTushuRenqiLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.rankTushuRenqiLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.rankTushuRenqiLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankTushuRenqiLoadMoreFailed()
    }
  })
)


export default combineEpics(rankTushuRenqiEpic, rankTushuRenqiLoadMoreEpic)
