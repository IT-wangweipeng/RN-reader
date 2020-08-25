import {createAction, handleActions} from 'redux-actions'


export const MINE_BOOK_COMMENT_LIST_INIT = 'MINE_BOOK_COMMENT_LIST_INIT'
export const MINE_BOOK_COMMENT_LIST_INIT_SUCCESS = 'MINE_BOOK_COMMENT_LIST_INIT_SUCCESS'
export const MINE_BOOK_COMMENT_LIST_INIT_FAILED = 'MINE_BOOK_COMMENT_LIST_INIT_FAILED'

export const MINE_BOOK_COMMENT_LIST_LOAD_MORE_INIT = 'MINE_BOOK_COMMENT_LIST_LOAD_MORE_INIT'
export const MINE_BOOK_COMMENT_LIST_LOAD_MORE_SUCCESS = 'MINE_BOOK_COMMENT_LIST_LOAD_MORE_SUCCESS'
export const MINE_BOOK_COMMENT_LIST_LOAD_MORE_FAILED = 'MINE_BOOK_COMMENT_LIST_LOAD_MORE_FAILED'

export const MINE_BOOK_COMMENT_DETAIL_LIST_INIT = 'MINE_BOOK_COMMENT_DETAIL_LIST_INIT'
export const MINE_BOOK_COMMENT_DETAIL_LIST_INIT_SUCCESS = 'MINE_BOOK_COMMENT_DETAIL_LIST_INIT_SUCCESS'
export const MINE_BOOK_COMMENT_DETAIL_LIST_INIT_FAILED = 'MINE_BOOK_COMMENT_DETAIL_LIST_INIT_FAILED'

export const MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_INIT = 'MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_INIT'
export const MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_SUCCESS = 'MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_SUCCESS'
export const MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_FAILED = 'MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_FAILED'


// 发表过想法的书的列表
export const mineBookCommentListInitAction = createAction(MINE_BOOK_COMMENT_LIST_INIT)
export const mineBookCommentListSuccessAction = createAction(MINE_BOOK_COMMENT_LIST_INIT_SUCCESS)
export const mineBookCommentListFailedAction = createAction(MINE_BOOK_COMMENT_LIST_INIT_FAILED)

// 发表过想法的书的列表加载更多
export const mineBookCommentListLoadMoreInitAction = createAction(MINE_BOOK_COMMENT_LIST_LOAD_MORE_INIT)
export const mineBookCommentListLoadMoreSuccessAction = createAction(MINE_BOOK_COMMENT_LIST_LOAD_MORE_SUCCESS)
export const mineBookCommentListLoadMoreFailedAction = createAction(MINE_BOOK_COMMENT_LIST_LOAD_MORE_FAILED)

// 发表过想法的书的详情的列表
export const mineBookCommentDetailListInitAction = createAction(MINE_BOOK_COMMENT_DETAIL_LIST_INIT)
export const mineBookCommentDetailListSuccessAction = createAction(MINE_BOOK_COMMENT_DETAIL_LIST_INIT_SUCCESS)
export const mineBookCommentDetailListFailedAction = createAction(MINE_BOOK_COMMENT_DETAIL_LIST_INIT_FAILED)

// 发表过想法的书的详情的列表加载更多
export const mineBookCommentDetailLoadMoreInitAction = createAction(MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_INIT)
export const mineBookCommentDetailLoadMoreSuccessAction = createAction(MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_SUCCESS)
export const mineBookCommentDetailLoadMoreFailedAction = createAction(MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_FAILED)




const mineComment = handleActions({
  // 发表过想法的书的列表
  MINE_BOOK_COMMENT_LIST_INIT: (state, action) => ({
    ...state,
    loadSuccess: false,
  }),
  MINE_BOOK_COMMENT_LIST_INIT_SUCCESS: (state, action) => ({
    ...state,
    bookList: action.payload.data.list,
    bookListHasMore: action.payload.data.hasMore,
    loadSuccess: true,
  }),
  MINE_BOOK_COMMENT_LIST_INIT_FAILED: (state, action) => ({
    ...state,
    loadSuccess: false,
  }),
  // 发表过想法的书的列表加载更多
  MINE_BOOK_COMMENT_LIST_LOAD_MORE_INIT: (state, action) => ({
    ...state,
    isBookListLoadingMore: true
  }),
  MINE_BOOK_COMMENT_LIST_LOAD_MORE_SUCCESS: (state, action) => ({
    ...state,
    isBookListLoadingMore: false,
    bookList: state.bookList.concat(action.payload.data.list || []),
    bookListHasMore: action.payload.data.hasMore,
  }),
  MINE_BOOK_COMMENT_LIST_LOAD_MORE_FAILED: (state, action) => ({
    ...state,
    isBookListLoadingMore: false
  }),

  // 想法的详情列表
  MINE_BOOK_COMMENT_DETAIL_LIST_INIT: (state, action) => ({
    ...state,
    loadSuccess: false,
  }),
  MINE_BOOK_COMMENT_DETAIL_LIST_INIT_SUCCESS: (state, action) => ({
    ...state,
    loadSuccess: true,
    commentDetailList: action.payload.data.list,
    commentDetailListHasMore: action.payload.data.hasMore,
  }),
  MINE_BOOK_COMMENT_DETAIL_LIST_INIT_FAILED: (state, action) => ({
    ...state,
    loadSuccess: false,
  }),

  // 想法的详情列表加载更多
  MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_INIT: (state, action) => ({
    ...state,
    isCommentDetailLoadingMore: true,
  }),
  MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_SUCCESS: (state, action) => ({
    ...state,
    isCommentDetailLoadingMore: false,
    commentDetailList: state.commentDetailList.concat(action.payload.data.list || []),
    commentDetailListHasMore: action.payload.data.hasMore,
  }),
  MINE_BOOK_COMMENT_DETAIL_LOAD_MORE_FAILED: (state, action) => ({
    ...state,
    isCommentDetailLoadingMore: false,
  }),

}, initialState = {
  isLoading: false,
  loadSuccess: false,
  bookList: [],
  bookListHasMore: [],
  isBookListLoadingMore: false,

  commentDetailList: [],
  commentDetailListHasMore: false,
  isCommentDetailLoadingMore: false,
});



export default mineComment