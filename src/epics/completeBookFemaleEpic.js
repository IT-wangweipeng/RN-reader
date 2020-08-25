import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {completeBookApi} from '../apis/Api'
import * as actions from '../actions/completeBookFemaleAction'
import {showToast} from '../actions/toastAction'


const completeBookFemaleEpic = action$ => action$.pipe(
  ofType(actions.COMPLETE_BOOK_FEMALE_INIT),
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
    console.log('completeBookFemaleEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.completeBookFemaleInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.completeBookFemaleInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.completeBookFemaleInitFailed()
    }
  })
)

const completeBookFemaleLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.COMPLETE_BOOK_FEMALE_LOAD_MORE),
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
    console.log('completeBookFemaleLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.completeBookFemaleLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.completeBookFemaleLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.completeBookFemaleLoadMoreFailed()
    }
  })
)


export default combineEpics(completeBookFemaleEpic,completeBookFemaleLoadMoreEpic)
