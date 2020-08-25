import * as TYPES from '../actions/marketSearchRecommendAction'
import R from 'ramda'

const initState = {
  data: [],
  isSuccess: false,
  isLoading: false,
}

const marketSearchRecommend = (state = initState, action) => {
  switch (action.type) {
    case TYPES.MARKET_SEARCH_RECOMMEND_INIT: {
      return {
        ...state,
        isSuccess: false,
        isLoading: true,
      }
    }
    case TYPES.MARKET_SEARCH_RECOMMEND_INIT_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isSuccess: true,
        isLoading: false,
      }
    }
    case TYPES.MARKET_SEARCH_RECOMMEND_INIT_FAILED: {
      return {
        ...state,
        isSuccess: false,
        isLoading: false,
      }
    }
    default:
      return state
  }
}

export default marketSearchRecommend
