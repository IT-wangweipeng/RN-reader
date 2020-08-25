import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {serializeBookApi} from '../apis/Api'
import * as actions from '../actions/serializeBookFemaleAction'
import {showToast} from '../actions/toastAction'


const serializeBookFemaleEpic = action$ => action$.pipe(
  ofType(actions.SERIALIZE_BOOK_FEMALE_INIT),
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
    console.log('serializeBookFemaleEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.serializeBookFemaleInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.serializeBookFemaleInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.serializeBookFemaleInitFailed()
    }
  })
)

const serializeBookFemaleLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.SERIALIZE_BOOK_FEMALE_LOAD_MORE),
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
    console.log('serializeBookFemaleLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.serializeBookFemaleLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.serializeBookFemaleLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.serializeBookFemaleLoadMoreFailed()
    }
  })
)


export default combineEpics(serializeBookFemaleEpic,serializeBookFemaleLoadMoreEpic)
