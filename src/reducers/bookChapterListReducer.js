import * as TYPES from '../actions/bookChapterListAction'

const initState = {
  bookId: 0,
  order: 1,
  data: [],
  isSuccess: false,
}


const bookChapterList = (state = initState, action) => {
  switch (action.type) {
    case TYPES.BOOK_CHAPTER_LIST_INIT: {
      return {
        ...state,
        bookId: action.payload.bookId,
        order: action.payload.order,
        isSuccess: false,
      }
    }
    case TYPES.BOOK_CHAPTER_LIST_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isSuccess: true,
      }
    }
    case TYPES.BOOK_CHAPTER_LIST_FAILED: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    default:
      return state
  }
}

export default bookChapterList
