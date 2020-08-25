import * as TYPES from '../actions/bookDetailAction'

const initState = {
  bookId: 0,
  data: {},
  isSuccess: false,
  isEmpty: false,
  isFinished: false,
  isLoading: false,
}


const bookDetail = (state = initState, action) => {
  switch (action.type) {
    case TYPES.BOOK_DETAIL_INIT: {
      return {
        ...state,
        bookId: action.payload.bookId,
        isSuccess: false,
        isEmpty: false,
        isFinished: false,
        isLoading: true,
      }
    }
    case TYPES.BOOK_DETAIL_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isSuccess: true,
        isEmpty: false,
        isFinished: true,
        isLoading: false,
      }
    }
    case TYPES.BOOK_DETAIL_FAILED: {
      return {
        ...state,
        isSuccess: false,
        isEmpty: true,
        isFinished: true,
        isLoading: false,
      }
    }
    default:
      return state
  }
}

export default bookDetail
