import * as TYPES from '../actions/searchWordAction'

const initState = {
  data: [],
  isSuccess: false,
}


const searchWord = (state = initState, action) => {
  switch (action.type) {
    case TYPES.SEARCH_WORD_INIT: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    case TYPES.SEARCH_WORD_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isSuccess: true,
      }
    }
    case TYPES.SEARCH_WORD_FAILED: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    default:
      return state
  }
}

export default searchWord
