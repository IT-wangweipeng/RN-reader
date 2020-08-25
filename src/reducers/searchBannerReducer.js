import * as TYPES from '../actions/searchBannerAction'

const initState = {
  data: [],
  isSuccess: false,
}

const searchBanner = (state = initState, action) => {
  switch (action.type) {
    case TYPES.SEARCH_BANNER_INIT: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    case TYPES.SEARCH_BANNER_INIT_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isSuccess: true,
      }
    }
    case TYPES.SEARCH_BANNER_INIT_FAILED: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    default:
      return state
  }
}

export default searchBanner
