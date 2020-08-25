import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {completeBookApi} from '../apis/Api'
import * as actions from '../actions/completeBookMaleAction'
import {showToast} from '../actions/toastAction'


const completeBookMaleEpic = action$ => action$.pipe(
  ofType(actions.COMPLETE_BOOK_MALE_INIT),
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
    console.log('completeBookMaleEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.completeBookMaleInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.completeBookMaleInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.completeBookMaleInitFailed()
    }
  })
)

const completeBookMaleLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.COMPLETE_BOOK_MALE_LOAD_MORE),
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
    console.log('completeBookMaleLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.completeBookMaleLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.completeBookMaleLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.completeBookMaleLoadMoreFailed()
    }
  })
)


export default combineEpics(completeBookMaleEpic,completeBookMaleLoadMoreEpic)
