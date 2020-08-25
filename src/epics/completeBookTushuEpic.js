import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {completeBookApi} from '../apis/Api'
import * as actions from '../actions/completeBookTushuAction'
import {showToast} from '../actions/toastAction'


const completeBookTushuEpic = action$ => action$.pipe(
  ofType(actions.COMPLETE_BOOK_TUSHU_INIT),
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

    return from(completeBookApi(sex, size, start))
  }),
  map(ret => {
    console.log('completeBookTushuEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.completeBookTushuInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.completeBookTushuInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.completeBookTushuInitFailed()
    }
  })
)

const completeBookTushuLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.COMPLETE_BOOK_TUSHU_LOAD_MORE),
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
    return from(completeBookApi(sex, size, start))
  }),
  map((ret) => {
    console.log('completeBookTushuLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.completeBookTushuLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.completeBookTushuLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.completeBookTushuLoadMoreFailed()
    }
  })
)


export default combineEpics(completeBookTushuEpic,completeBookTushuLoadMoreEpic)
