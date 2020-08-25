import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookRankApi} from '../apis/Api'
import * as actions from '../actions/rankMaleRenqiAction'
import {showToast} from '../actions/toastAction'


const rankMaleRenqiEpic = action$ => action$.pipe(
  ofType(actions.RANK_MALE_RENQI_INIT),
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
    console.log('rankMaleRenqiEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.rankMaleRenqiInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.rankMaleRenqiInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankMaleRenqiInitFailed()
    }
  })
)

const rankMaleRenqiLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.RANK_MALE_RENQI_LOAD_MORE),
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
    console.log('rankMaleRenqiLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.rankMaleRenqiLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.rankMaleRenqiLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankMaleRenqiLoadMoreFailed()
    }
  })
)


export default combineEpics(rankMaleRenqiEpic, rankMaleRenqiLoadMoreEpic)
