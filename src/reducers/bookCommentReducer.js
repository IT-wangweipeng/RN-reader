import {createAction, handleActions} from 'redux-actions'


export const BOOK_COMMENT_INIT = 'BOOK_COMMENT_INIT'
export const BOOK_COMMENT_INIT_SUCCESS = 'BOOK_COMMENT_INIT_SUCCESS'
export const BOOK_COMMENT_INIT_FAILED = 'BOOK_COMMENT_INIT_FAILED'

export const BOOK_COMMENT_LOADING_MORE_INIT = 'BOOK_COMMENT_LOADING_MORE_INIT'
export const BOOK_COMMENT_LOADING_MORE_SUCCESS = 'BOOK_COMMENT_LOADING_MORE_SUCCESS'
export const BOOK_COMMENT_LOADING_MORE_FAILED = 'BOOK_COMMENT_LOADING_MORE_FAILED'

export const POST_BOOK_COMMENT_INIT = 'POST_BOOK_COMMENT_INIT'
export const POST_BOOK_COMMENT_INIT_SUCCESS = 'POST_BOOK_COMMENT_INIT_SUCCESS'
export const POST_BOOK_COMMENT_INIT_FAILED = 'POST_BOOK_COMMENT_INIT_FAILED'

export const BOOK_COMMENT_DETAIL_INIT = 'BOOK_COMMENT_DETAIL_INIT'
export const BOOK_COMMENT_DETAIL_INIT_SUCCESS = 'BOOK_COMMENT_DETAIL_INIT_SUCCESS'
export const BOOK_COMMENT_DETAIL_INIT_FAILED = 'BOOK_COMMENT_DETAIL_INIT_FAILED'

export const BOOK_COMMENT_DETAIL_LOAD_MORE_INIT = 'BOOK_COMMENT_DETAIL_LOAD_MORE_INIT'
export const BOOK_COMMENT_DETAIL_LOAD_MORE_SUCCESS = 'BOOK_COMMENT_DETAIL_LOAD_MORE_SUCCESS'
export const BOOK_COMMENT_DETAIL_LOAD_MORE_FAILED = 'BOOK_COMMENT_DETAIL_LOAD_MORE_FAILED'

export const DELETE_COMMENT_DETAIL = 'DELETE_COMMENT_DETAIL'
export const DELETE_BOOK_COMMENT = 'DELETE_BOOK_COMMENT'

export const DELETE_BOOK_COMMENT_INIT = 'DELETE_BOOK_COMMENT_INIT'
export const DELETE_BOOK_COMMENT_SUCCESS = 'DELETE_BOOK_COMMENT_SUCCESS'
export const DELETE_BOOK_COMMENT_FAILED = 'DELETE_BOOK_COMMENT_FAILED'

export const REPLY_INIT = 'REPLY_INIT'
export const REPLY_INIT_SUCCESS = 'REPLY_INIT_SUCCESS'
export const REPLY_INIT_FAILED = 'REPLY_INIT_FAILED'

export const LIKE_COMMENT_INIT = 'LIKE_COMMENT_INIT'
export const LIKE_COMMENT_INIT_SUCCESS = 'LIKE_COMMENT_INIT_SUCCESS'
export const LIKE_COMMENT_INIT_FAILED = 'LIKE_COMMENT_INIT_FAILED'

export const DISLIKE_COMMENT_INIT = 'DISLIKE_COMMENT_INIT'
export const DISLIKE_COMMENT_INIT_SUCCESS = 'DISLIKE_COMMENT_INIT_SUCCESS'
export const DISLIKE_COMMENT_INIT_FAILED = 'DISLIKE_COMMENT_INIT_FAILED'




// 书籍想法列表
export const bookCommentInitAction = createAction(BOOK_COMMENT_INIT)
export const bookCommentInitSuccessAction = createAction(BOOK_COMMENT_INIT_SUCCESS)
export const bookCommentInitFailedAction = createAction(BOOK_COMMENT_INIT_FAILED)

// 书籍想法列表加载更多
export const bookCommentLoadingMoreInitAction = createAction(BOOK_COMMENT_LOADING_MORE_INIT)
export const bookCommentLoadingMoreSuccessAction = createAction(BOOK_COMMENT_LOADING_MORE_SUCCESS)
export const bookCommentLoadingMoreFailedAction = createAction(BOOK_COMMENT_LOADING_MORE_FAILED)

// 发表书籍想法
export const postBookCommentInitAction = createAction(POST_BOOK_COMMENT_INIT)
export const postBookCommentInitSuccessAction = createAction(POST_BOOK_COMMENT_INIT_SUCCESS)
export const postBookCommentInitFailedAction = createAction(POST_BOOK_COMMENT_INIT_FAILED)

// 书籍想法详情列表
export const bookCommentDetailInitAction = createAction(BOOK_COMMENT_DETAIL_INIT)
export const bookCommentDetailInitSuccessAction = createAction(BOOK_COMMENT_DETAIL_INIT_SUCCESS)
export const bookCommentDetailInitFailedAction = createAction(BOOK_COMMENT_DETAIL_INIT_FAILED)

// 书籍想法详情加载更多
export const bookCommentDetailLoadMoreAction = createAction(BOOK_COMMENT_DETAIL_LOAD_MORE_INIT)
export const bookCommentDetailLoadMoreSuccessAction = createAction(BOOK_COMMENT_DETAIL_LOAD_MORE_SUCCESS)
export const bookCommentDetailLoadMoreFailedAction = createAction(BOOK_COMMENT_DETAIL_LOAD_MORE_FAILED)

// 删除书籍想法
export const deleteBookCommentInitAction = createAction(DELETE_BOOK_COMMENT_INIT)
export const deleteBookCommentInitSuccessAction = createAction(DELETE_BOOK_COMMENT_SUCCESS)
export const deleteBookCommentInitFailedAction = createAction(DELETE_BOOK_COMMENT_FAILED)

// 回复评论
export const replyInitAction = createAction(REPLY_INIT)
export const replyInitSuccessAction = createAction(REPLY_INIT_SUCCESS)
export const replyInitFailedAction = createAction(REPLY_INIT_FAILED)

// 点赞
export const likeInitAction = createAction(LIKE_COMMENT_INIT)
export const likeInitSuccessAction = createAction(LIKE_COMMENT_INIT_SUCCESS)
export const likeInitFailedAction = createAction(LIKE_COMMENT_INIT_FAILED)

// 取消赞
export const dislikeInitAction = createAction(DISLIKE_COMMENT_INIT)
export const dislikeInitSuccessAction = createAction(DISLIKE_COMMENT_INIT_SUCCESS)
export const dislikeInitFailedAction = createAction(DISLIKE_COMMENT_INIT_FAILED)

// 删除想法详情
export const deleteCommentDetail = createAction(DELETE_COMMENT_DETAIL)

// 删除书籍想法列表
export const deleteBookComment = createAction(DELETE_BOOK_COMMENT)



const bookComment = handleActions({
  // 书籍想法
  BOOK_COMMENT_INIT: (state, action) => ({
    ...state,
    bookCommentListLoadSuccess: false,
  }),
  BOOK_COMMENT_INIT_SUCCESS: (state, action) => ({
    ...state,
    bookCommentListLoadSuccess: true,
    newComments: action.payload.types === 1 ? action.payload.data.list : state.newComments,
    hotComments: action.payload.types === 2 ? action.payload.data.list : state.hotComments,
    totalComments: action.payload.data.total_comments,
    bookInfo: action.payload.data.book_info,
    newCommentsHasMore: action.payload.types === 1 ? action.payload.data.hasMore : state.newCommentsHasMore,
    hotCommentsHasMore: action.payload.types === 2 ? action.payload.data.hasMore : state.hotCommentsHasMore,
  }),
  BOOK_COMMENT_INIT_FAILED: (state, action) => ({
    ...state,
    bookCommentListLoadSuccess: false,
  }),
  // 书籍想法加载更多
  BOOK_COMMENT_LOADING_MORE_INIT: (state, action) => ({
    ...state,
    isCommentListLoadingMore: true
  }),
  BOOK_COMMENT_LOADING_MORE_SUCCESS: (state, action) => ({
    ...state,
    isCommentListLoadingMore: false,
    newComments: action.payload.types === 1 ? state.newComments.concat(action.payload.data.list || []) : state.newComments,
    hotComments: action.payload.types === 2 ? state.hotComments.concat(action.payload.data.list || []) : state.hotComments,
    totalComments: action.payload.data.total_comments,
    bookInfo: action.payload.data.book_info,
    newCommentsHasMore: action.payload.types === 1 ? action.payload.data.hasMore : state.newCommentsHasMore,
    hotCommentsHasMore: action.payload.types === 2 ? action.payload.data.hasMore : state.hotCommentsHasMore,
  }),
  BOOK_COMMENT_LOADING_MORE_FAILED: (state, action) => ({
    ...state,
    isCommentListLoadingMore: false,
  }),
  // 发表书籍想法
  POST_BOOK_COMMENT_INIT: (state, action) => ({
    ...state,
    isLoading: true,
  }),
  POST_BOOK_COMMENT_INIT_SUCCESS: (state, action) => ({
    ...state,
    isLoading: false,
    postBookCommentSuccess: true
  }),
  POST_BOOK_COMMENT_INIT_FAILED: (state, action) => ({
    ...state,
    isLoading: false,
    postBookCommentSuccess: false
  }),
  // 想法详情
  BOOK_COMMENT_DETAIL_INIT: (state, action) => ({
    ...state,
    loadSuccess: false,
  }),
  BOOK_COMMENT_DETAIL_INIT_SUCCESS: (state, action) => ({
    ...state,
    loadSuccess: true,
    commentDetail: action.payload.data.comment,
    replyHasMore: action.payload.data.reply_list.hasMore,
    replyList: action.payload.data.reply_list.list,
  }),
  BOOK_COMMENT_DETAIL_INIT_FAILED: (state, action) => ({
    ...state,
    loadSuccess: false,
  }),
  // 想法详情加载更多
  BOOK_COMMENT_DETAIL_LOAD_MORE_INIT: (state, action) => ({
    ...state,
    isLoading: true,
    isReplyLoadMore: true,
  }),
  BOOK_COMMENT_DETAIL_LOAD_MORE_SUCCESS: (state, action) => ({
    ...state,
    isLoading: false,
    isReplyLoadMore: false,
    commentDetail: action.payload.data.comment,
    replyHasMore: action.payload.data.reply_list.hasMore,
    replyList: state.replyList.concat(action.payload.data.reply_list.list || [])
  }),
  BOOK_COMMENT_DETAIL_LOAD_MORE_FAILED: (state, action) => ({
    ...state,
    isLoading: false,
    isReplyLoadMore: false,
  }),

  // 删除想法
  DELETE_BOOK_COMMENT_INIT: (state, action) => ({
    ...state,
  }),
  DELETE_BOOK_COMMENT_SUCCESS: (state, action) => ({
    ...state,
    deleteCommentSuccess: true
  }),
  DELETE_BOOK_COMMENT_FAILED: (state, action) => ({
    ...state,
    deleteCommentSuccess: false
  }),
  // 回复想法、回复评论
  REPLY_INIT: (state, action) => ({
    ...state,
    isLoading: true,
  }),
  REPLY_INIT_SUCCESS: (state, action) => ({
    ...state,
    replySuccess: true,
    isLoading: false,
  }),
  REPLY_INIT_FAILED: (state, action) => ({
    ...state,
    replySuccess: false,
    isLoading: false,
  }),
  // 赞
  LIKE_COMMENT_INIT: (state, action) => ({
    ...state,
    likeSuccess: false
  }),
  LIKE_COMMENT_INIT_SUCCESS: (state, action) => ({
    ...state,
    likeSuccess: true
  }),
  LIKE_COMMENT_INIT_FAILED: (state, action) => ({
    ...state,
    likeSuccess: false
  }),
  // 取消赞
  DISLIKE_COMMENT_INIT: (state, action) => ({
    ...state,
    dislikeSuccess: false
  }),
  DISLIKE_COMMENT_INIT_SUCCESS: (state, action) => ({
    ...state,
    dislikeSuccess: true
  }),
  DISLIKE_COMMENT_INIT_FAILED: (state, action) => ({
    ...state,
    dislikeSuccess: false
  }),
  DELETE_COMMENT_DETAIL: (state, action) => ({
    ...state,
    commentDetail: {},
    replyList: [],
  }),
  DELETE_BOOK_COMMENT: (state, action) => ({
    ...state,
    hotComments: [],
    newComments: [],
  })
}, initialState = {
  isLoading: false,
  loadSuccess: false,
  commentDetail: {},
  bookInfo: {},
  totalComments: 0,

  bookCommentListLoadSuccess: false,
  newComments: [],
  hotComments: [],
  isCommentListLoadingMore: false,
  newCommentsHasMore: false,
  hotCommentsHasMore: false,

  replyList: [],
  replySuccess: false,
  replyHasMore: false,
  isReplyLoadMore: false,

  postBookCommentSuccess: false,
  deleteCommentSuccess: false,

  likeSuccess: false,
  dislikeSuccess: false,
});



export default bookComment