import * as TYPES from '../actions/bookRelatedlAction'

const initState = {
  bookId: 0,
  data: [],
  isSuccess: false,
}


const bookRelated = (state = initState, action) => {
  switch (action.type) {
    case TYPES.BOOK_RELATED_INIT: {
      return {
        ...state,
        bookId: action.payload.bookId,
        isSuccess: false,
      }
    }
    case TYPES.BOOK_RELATED_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isSuccess: true,
      }
    }
    case TYPES.BOOK_RELATED_FAILED: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    default:
      return state
  }
}

export default bookRelated
