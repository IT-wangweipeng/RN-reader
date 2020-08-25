import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {shortessayBookApi} from '../apis/Api'
import * as actions from '../actions/shortessayBookAction'
import {showToast} from '../actions/toastAction'


const shortessayBookEpic = action$ => action$.pipe(
  ofType(actions.SHORTESSAY_BOOK_INIT),
  mergeMap(action => zip(
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.sex),
    (start, size, sex) => ({
      start,
      size,
      sex,
    }),
  )),
  flatMap((result) => {
    const {
      start,
      size,
      sex,
    } = result

    return from(shortessayBookApi(sex, size, start))
  }),
  map(ret => {
    console.log('shortessayBookEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.shortessayBookInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.shortessayBookInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.shortessayBookInitFailed()
    }
  })
)

const shortessayBookLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.SHORTESSAY_BOOK_LOAD_MORE),
  mergeMap(action => zip(
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.sex),
    (start, size, sex) => ({
      start,
      size,
      sex,
    }),
  )),
  flatMap((result) => {
    const {
      start,
      size,
      sex,
    } = result
    return from(shortessayBookApi(sex, size, start))
  }),
  map((ret) => {
    console.log('shortessayBookLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.shortessayBookLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.shortessayBookLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.shortessayBookLoadMoreFailed()
    }
  })
)


export default combineEpics(shortessayBookEpic,shortessayBookLoadMoreEpic)
