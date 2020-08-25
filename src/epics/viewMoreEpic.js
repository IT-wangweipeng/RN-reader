import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {viewMoreApi} from '../apis/Api'
import * as actions from '../actions/viewMoreAction'
import {showToast} from '../actions/toastAction'


const viewMoreEpic = action$ => action$.pipe(
  ofType(actions.VIEW_MORE_INIT),
  mergeMap(action => zip(
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.id),
    (start, size, id) => ({
      start,
      size,
      id,
    }),
  )),
  flatMap((result) => {
    const {
      start,
      size,
      id,
    } = result

    return from(viewMoreApi(id, size, start))
  }),
  map(ret => {
    console.log('viewMoreEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.viewMoreInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.viewMoreInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.viewMoreInitFailed()
    }
  })
)

const viewMoreLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.VIEW_MORE_LOAD_MORE),
  mergeMap(action => zip(
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.id),
    (start, size, id) => ({
      start,
      size,
      id,
    }),
  )),
  flatMap((result) => {
    const {
      start,
      size,
      id,
    } = result
    return from(viewMoreApi(id, size, start))
  }),
  map((ret) => {
    console.log('viewMoreLoadMoreEpic === ', ret, typeof (ret))
    if (ret && ret.status === 200) {
      return actions.viewMoreLoadMoreSuccess(ret)
    }
    showToast(ret.message)
    return actions.viewMoreLoadMoreFailed()
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.viewMoreLoadMoreFailed()
    }
  })
)


export default combineEpics(viewMoreEpic,viewMoreLoadMoreEpic)
