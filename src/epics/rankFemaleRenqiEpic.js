import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookRankApi} from '../apis/Api'
import * as actions from '../actions/rankFemaleRenqiAction'
import {showToast} from '../actions/toastAction'


const rankFemaleRenqiEpic = action$ => action$.pipe(
  ofType(actions.RANK_FEMALE_RENQI_INIT),
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
    console.log('rankFemaleRenqiEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.rankFemaleRenqiInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.rankFemaleRenqiInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankFemaleRenqiInitFailed()
    }
  })
)

const rankFemaleRenqiLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.RANK_FEMALE_RENQI_LOAD_MORE),
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
    console.log('rankFemaleRenqiLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.rankFemaleRenqiLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.rankFemaleRenqiLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.rankFemaleRenqiLoadMoreFailed()
    }
  })
)


export default combineEpics(rankFemaleRenqiEpic, rankFemaleRenqiLoadMoreEpic)
