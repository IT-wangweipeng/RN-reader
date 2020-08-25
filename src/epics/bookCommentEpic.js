import {of, zip, from} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {
  BookCommentApi,
  PostBookCommentApi,
  BookCommentDetailApi,
  DeleteBookCommentApi,
  ReplyApi,
  LikeApi,
  DislikeApi
} from "../apis/Api";
import Toast from "react-native-root-toast";
import * as actions from '../reducers/bookCommentReducer'
import {showToast} from '../actions/toastAction'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'
import {getItem} from '../utils/AsyncStorageManager'

this.types = 1

// 书籍想法
const bookCommentEpic = action$ => action$.pipe(
  ofType(actions.BOOK_COMMENT_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.book_id),
    of(action.payload.types),
    of(action.payload.start),
    of(action.payload.size),
    (token, book_id, types, start, size) => ({
      token,
      book_id,
      types,
      start,
      size,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      types,
      book_id,
      start,
      size,
    } = result
    this.types = types
    return BookCommentApi(book_id, types, start, size, token)
  }),
  map(ret => {
    console.log('BookCommentApi ======== ', ret)
    if (ret.status === 200) {
      return actions.bookCommentInitSuccessAction({
        data: ret.data,
        types: this.types,
      })
    } else {
      showToast(ret.message)
      return actions.bookCommentInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.bookCommentInitFailedAction()
  })
)

// 书籍想法加载更多
const bookCommenLoadMoretEpic = action$ => action$.pipe(
  ofType(actions.BOOK_COMMENT_LOADING_MORE_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.book_id),
    of(action.payload.types),
    of(action.payload.start),
    of(action.payload.size),
    (token, book_id, types, start, size) => ({
      token,
      book_id,
      types,
      start,
      size,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      types,
      book_id,
      start,
      size,
    } = result
    this.types = types
    return BookCommentApi(book_id, types, start, size, token)
  }),
  map(ret => {
    console.log('BookCommentApiLoadingMore ======== ', ret)
    if (ret.status === 200) {
      return actions.bookCommentLoadingMoreSuccessAction({
        data: ret.data,
        types: this.types,
      })
    } else {
      showToast(ret.message)
      return actions.bookCommentLoadingMoreFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.bookCommentLoadingMoreFailedAction()
  })
)


// 发布想法
const publishBookCommentEpic = action$ => action$.pipe(
  ofType(actions.POST_BOOK_COMMENT_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.book_id),
    of(action.payload.comment),
    (token, book_id, comment) => ({
      token,
      book_id,
      comment,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      book_id,
      comment,
    } = result
    return PostBookCommentApi(token, book_id, comment)
  }),
  map(ret => {
    console.log('PostBookCommentApi ======== ', ret)
    if (ret.status === 200) {
      return actions.postBookCommentInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.postBookCommentInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message, Toast.positions.CENTER)
    }
    return actions.postBookCommentInitFailedAction()
  })
)

// 想法详情
const bookCommentDetailEpic = action$ => action$.pipe(
  ofType(actions.BOOK_COMMENT_DETAIL_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.comment_id),
    of(action.payload.start),
    (token, comment_id, start) => ({
      token,
      comment_id,
      start,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      comment_id,
      start,
    } = result
    return BookCommentDetailApi(token, comment_id, start)
  }),
  map(ret => {
    console.log('BookCommentDetailApi ======== ', ret)
    if (ret.status === 200) {
      return actions.bookCommentDetailInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.bookCommentDetailInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.bookCommentDetailInitFailedAction()
  })
)

// 想法详情加载更多
const bookCommentDetailLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.BOOK_COMMENT_DETAIL_LOAD_MORE_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.comment_id),
    of(action.payload.start),
    (token, comment_id, start) => ({
      token,
      comment_id,
      start,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      comment_id,
      start,
    } = result
    return BookCommentDetailApi(token, comment_id, start)
  }),
  map(ret => {
    console.log('BookCommentDetailApi ======== ', ret)
    if (ret.status === 200) {
      return actions.bookCommentDetailLoadMoreSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.bookCommentDetailLoadMoreFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.bookCommentDetailLoadMoreFailedAction()
  })
)

// 删除想法
const deleteBookCommentEpic = action$ => action$.pipe(
  ofType(actions.DELETE_BOOK_COMMENT_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.comment_ids),
    (token, comment_ids) => ({
      token,
      comment_ids,
    }),
  )),
  flatMap((result) => {
    const {
      token,
      comment_ids,
    } = result
    return DeleteBookCommentApi(token, comment_ids)
  }),
  map(ret => {
    console.log('DeleteBookCommentApi ======== ', ret)
    if (ret.status === 200) {
      return actions.deleteBookCommentInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.deleteBookCommentInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.deleteBookCommentInitFailedAction()
  })
)

// 回复
const replyEpic = action$ => action$.pipe(
  ofType(actions.REPLY_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.comment),
    of(action.payload.comment_id),
    of(action.payload.reply_id),
    of(action.payload.book_id),
    of(action.payload.types),
    (token, comment, comment_id, reply_id, book_id, types) => ({
      token,
      comment,
      comment_id,
      reply_id,
      book_id,
      types
    }),
  )),
  flatMap((result) => {
    const {
      token,
      comment,
      comment_id,
      reply_id,
      book_id,
      types
    } = result
    return ReplyApi(token, comment, comment_id, reply_id, book_id, types)
  }),
  map(ret => {
    console.log('ReplyApi ======== ', ret)
    if (ret.status === 200) {
      return actions.replyInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.replyInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.replyInitFailedAction()
  })
)

// 赞
const likeEpic = action$ => action$.pipe(
  ofType(actions.LIKE_COMMENT_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.comment_id),
    of(action.payload.reply_id),
    of(action.payload.types),
    (token, comment_id, reply_id, types) => ({
      token,
      comment_id,
      reply_id,
      types
    }),
  )),
  flatMap((result) => {
    const {
      token,
      comment_id,
      reply_id,
      types
    } = result
    return LikeApi(token, reply_id, comment_id, types)
  }),
  map(ret => {
    console.log('LikeApi ======== ', ret)
    if (ret.status === 200) {
      return actions.likeInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.likeInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.likeInitFailedAction()
  })
)

// 取消赞
const dislikeEpic = action$ => action$.pipe(
  ofType(actions.DISLIKE_COMMENT_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.reply_id),
    of(action.payload.types),
    (token, reply_id, types) => ({
      token,
      reply_id,
      types
    }),
  )),
  flatMap((result) => {
    const {
      token,
      reply_id,
      types
    } = result
    return DislikeApi(token, reply_id, types)
  }),
  map(ret => {
    console.log('DislikeApi ======== ', ret)
    if (ret.status === 200) {
      return actions.dislikeInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.dislikeInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
    }
    return actions.dislikeInitFailedAction()
  })
)


export default combineEpics(
  bookCommentEpic,
  bookCommenLoadMoretEpic,
  publishBookCommentEpic,
  bookCommentDetailEpic,
  bookCommentDetailLoadMoreEpic,
  deleteBookCommentEpic,
  replyEpic,
  likeEpic,
  dislikeEpic
)
