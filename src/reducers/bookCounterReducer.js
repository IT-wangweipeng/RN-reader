import * as TYPES from '../actions/bookCounterAction'

const initState = {
  id: 0,
  isSuccess: false,
}


const bookCounter = (state = initState, action) => {
  switch (action.type) {
    case TYPES.BOOK_COUNTER_INIT: {
      return {
        ...state,
        id: action.payload.id,
        isSuccess: false,
      }
    }
    case TYPES.BOOK_COUNTER_SUCCESS: {
      return {
        ...state,
        isSuccess: true,
      }
    }
    case TYPES.BOOK_COUNTER_FAILED: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    default:
      return state
  }
}

export default bookCounter
