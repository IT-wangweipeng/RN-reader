import * as TYPES from '../actions/bookFavoritesAction'

const initState = {
  id: 0,
  isSuccess: false,
}


const bookFavorites = (state = initState, action) => {
  switch (action.type) {
    case TYPES.BOOK_FAVORITES_INIT: {
      return {
        ...state,
        id: action.payload.id,
        isSuccess: false,
      }
    }
    case TYPES.BOOK_FAVORITES_SUCCESS: {
      return {
        ...state,
        isSuccess: true,
      }
    }
    case TYPES.BOOK_FAVORITES_FAILED: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    default:
      return state
  }
}

export default bookFavorites
