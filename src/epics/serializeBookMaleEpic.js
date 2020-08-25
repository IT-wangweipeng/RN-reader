import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {serializeBookApi} from '../apis/Api'
import * as actions from '../actions/serializeBookMaleAction'
import {showToast} from '../actions/toastAction'


const serializeBookMaleEpic = action$ => action$.pipe(
  ofType(actions.SERIALIZE_BOOK_MALE_INIT),
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
    console.log('serializeBookMaleEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.serializeBookMaleInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.serializeBookMaleInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.serializeBookMaleInitFailed()
    }
  })
)

const serializeBookMaleLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.SERIALIZE_BOOK_MALE_LOAD_MORE),
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
    console.log('serializeBookMaleLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.serializeBookMaleLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.serializeBookMaleLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.serializeBookMaleLoadMoreFailed()
    }
  })
)


export default combineEpics(serializeBookMaleEpic,serializeBookMaleLoadMoreEpic)
