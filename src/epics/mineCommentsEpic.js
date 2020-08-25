import {of, zip, from} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {
  UserCenterCommentListApi,
  UserCenterCommentDetailListApi
} from "../apis/Api";
import * as actions from '../reducers/mineCommentListReducer'
import {showToast} from '../actions/toastAction'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'
import {getItem} from '../utils/AsyncStorageManager'



// 我的想法
const mineCommentEpic = action$ => action$.pipe(
  ofType(actions.MINE_BOOK_COMMENT_LIST_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.start),
    of(action.payload.size),
    (token, start, size) => ({
      token,
      start,
      size,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      start,
      size,
    } = result
    return UserCenterCommentListApi(token, start, size)
  }),
  map(ret => {
    console.log('UserCenterCommentListApi ======== ', ret)
    if (ret.status === 200) {
      return actions.mineBookCommentListSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.mineBookCommentListFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.mineBookCommentListFailedAction()
  })
)

// 我的想法加载更多
const mineCommentLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.MINE_BOOK_COMMENT_LIST_LOAD_MORE_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.start),
    of(action.payload.size),
    (token, start, size) => ({
      token,
      start,
      size,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      start,
      size,
    } = result
    return UserCenterCommentListApi(token, start, size)
  }),
  map(ret => {
    console.log('UserCenterCommentListApi Load More ======== ', ret)
    if (ret.status === 200) {
      return actions.mineBookCommentListLoadMoreSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.mineBookCommentListLoadMoreFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.mineBookCommentListLoadMoreFailedAction()
  })
)


// 我的想法详情
const mineCommentDetailEpic = action$ => action$.pipe(
  ofType(actions.MINE_BOOK_COMMENT_DETAIL_LIST_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.book_id),
    (token, start, size, book_id) => ({
      token,
      start,
      size,
      book_id,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      start,
      size,
      book_id,
    } = result
    return UserCenterCommentDetailListApi(token, book_id, start, size)
  }),
  map(ret => {
    console.log('UserCenterCommentDetailListApi ======== ', ret)
    if (ret.status === 200) {
      return actions.mineBookCommentDetailListSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.mineBookCommentDetailListFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.mineBookCommentDetailListFailedAction()
  })
)

// 我的想法详情加载更多
const mineCommentDetailLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.start),
    of(action.payload.size),
    of(action.payload.book_id),
    (token, start, size, book_id) => ({
      token,
      start,
      size,
      book_id,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      start,
      size,
      book_id,
    } = result
    return UserCenterCommentDetailListApi(token, book_id, start, size)
  }),
  map(ret => {
    console.log('UserCenterCommentDetailListApi Load More ======== ', ret)
    if (ret.status === 200) {
      return actions.mineBookCommentDetailLoadMoreSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.mineBookCommentDetailLoadMoreFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.mineBookCommentDetailLoadMoreFailedAction()
  })
)


export default combineEpics(
  mineCommentEpic,
  mineCommentLoadMoreEpic,
  mineCommentDetailEpic,
  mineCommentDetailLoadMoreEpic,
)
