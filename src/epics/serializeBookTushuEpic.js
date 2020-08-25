import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {serializeBookApi} from '../apis/Api'
import * as actions from '../actions/serializeBookTushuAction'
import {showToast} from '../actions/toastAction'


const serializeBookTushuEpic = action$ => action$.pipe(
  ofType(actions.SERIALIZE_BOOK_TUSHU_INIT),
  mergeMap(action => zip(
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.sex),
    of(action.payload.type),
    (start, size, sex,type) => ({
      start,
      size,
      sex,
      type,
    }),
  )),
  flatMap((result) => {
    const {
      start,
      size,
      sex,
      type,
    } = result

    return from(serializeBookApi(sex, type, size, start))
  }),
  map(ret => {
    console.log('serializeBookTushuEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.serializeBookTushuInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.serializeBookTushuInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.serializeBookTushuInitFailed()
    }
  })
)

const serializeBookTushuLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.SERIALIZE_BOOK_TUSHU_LOAD_MORE),
  mergeMap(action => zip(
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.sex),
    of(action.payload.type),
    (start, size, sex, type) => ({
      start,
      size,
      sex,
      type,
    }),
  )),
  flatMap((result) => {
    const {
      start,
      size,
      sex,
      type,
    } = result
    return from(serializeBookApi(sex, type, size, start))
  }),
  map((ret) => {
    console.log('serializeBookTushuLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.serializeBookTushuLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.serializeBookTushuLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.serializeBookTushuLoadMoreFailed()
    }
  })
)


export default combineEpics(serializeBookTushuEpic,serializeBookTushuLoadMoreEpic)
