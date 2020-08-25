import * as TYPES from '../actions/bookshelfAction'
import R from 'ramda'

const initState = {
  isLoading: false,
  books: [],
  syncSuccess: false,
  readTime: {},
  weekly_ts: {},
  favorite: [],
  addBookSuccess: false,
  deleteBookSuccess: false,
  addBookLoading: false,
  addCompleteSuccess: false,
  totalRead: 0,
}

const mergeData = (data) => {
  if (data.length === 0) {
    return data
  }
  data.map((item, index) => {
    item.select = false
  })
  console.log('data ====== ', data)
  return data
}

const bookshelf = (state = initState, action) => {
  switch (action.type) {
    case TYPES.RECOMMEND_BOOK_INIT:
      return {
        ...state,
        isLoading: true,
      }
    case TYPES.RECOMMEND_BOOK_INIT_SUCCESS:
      return {
        ...state,
        books: R.concat(R.concat([{end: true}], mergeData(action.payload.data)), [{isGame: true}]),
        isLoading: false
      }
    case TYPES.RECOMMEND_BOOK_INIT_FAILED:
      return {
        ...state,
        isLoading: false,
      }
    case TYPES.FAVORITES_BOOK_INIT:
      return {
        ...state,
        isLoading: true,
      }
    case TYPES.FAVORITES_BOOK_INIT_SUCCESS:
      return {
        ...state,
        books: R.concat(R.concat([{end: true}], mergeData(action.payload.data.list)), [{isGame: true}]),
        favorite: action.payload.data.list,
        readTime: action.payload.data.ts,
        weekly_ts: action.payload.data.weekly_ts,
        isLoading: false,
      }
    case TYPES.FAVORITES_BOOK_INIT_FAILED:
      return {
        ...state,
        isLoading: false,
      }
    case TYPES.BOOK_SYNC_INIT:
      return {
        ...state,
        syncSuccess: false
      }
    case TYPES.BOOK_SYNC_INIT_SUCCESS:
      return {
        ...state,
        syncSuccess: true
      }
    case TYPES.BOOK_SYNC_INIT_FAILED:
      return {
        ...state,
        syncSuccess: false
      }
    case TYPES.UPDATE_BOOK:
      return {
        ...state,
        books: action.payload.data
      }
      // 将book加入书架
    case TYPES.ADD_BOOK_INIT:
      return {
        ...state,
        addBookSuccess: false,
        addBookLoading: true,
      }
    case TYPES.ADD_BOOK_INIT_SUCCESS:
      return {
        ...state,
        addBookSuccess: true,
        addBookLoading: false,
      }
    case TYPES.ADD_BOOK_INIT_FAILED:
      return {
        ...state,
        addBookSuccess: false,
        addBookLoading: false,
      }
      //将book移出书架
    case TYPES.DELETE_BOOK_INIT:
      return {
        ...state,
        deleteBookSuccess: false,
      }
    case TYPES.DELETE_BOOK_INIT_SUCCESS:
      return {
        ...state,
        deleteBookSuccess: true,
      }
    case TYPES.DELETE_BOOK_INIT_FAILED:
      return {
        ...state,
        deleteBookSuccess: false,
      }
    case TYPES.ADD_COMPLETED_BOOK_INIT:
      return {
        ...state,
        addCompleteSuccess: false
      }
    case TYPES.ADD_COMPLETED_BOOK_SUCCESS:
      return {
        ...state,
        addCompleteSuccess: true,
      }
    case TYPES.ADD_COMPLETED_BOOK_FAILED:
      return {
        ...state,
        addCompleteSuccess: false,
      }
    case TYPES.TOTAL_COMPLETED_BOOK_INIT:
      return {
        ...state,
      }
    case TYPES.TOTAL_COMPLETED_BOOK_SUCCESS:
      return {
        ...state,
        totalRead: action.payload.data
      }
    case TYPES.TOTAL_COMPLETED_BOOK_FAILED:
      return {
        ...state,
      }
    default:
      return state
      break
  }
}

export default bookshelf
