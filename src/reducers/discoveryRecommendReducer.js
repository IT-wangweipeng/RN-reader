import * as TYPES from '../actions/discoveryRecommendAction'

const initState = {
  data: {},
  isLoading: true,
  isSuccess: false,
}

const discoveryRecommend = (state = initState, action) => {
  switch (action.type) {
    case TYPES.DISCOVERY_RECOMMEND_INIT: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    case TYPES.DISCOVERY_RECOMMEND_INIT_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
        isSuccess: true,
      }
    }
    case TYPES.DISCOVERY_RECOMMEND_INIT_FAILED: {
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
      }
    }
    default:
      return state
  }
}

export default discoveryRecommend
