import * as TYPES from '../actions/discoveryRecommendChangeAction'

const initState = {
  data: {},
  isLoading: true,
  isSuccess: false,
}

const discoveryRecommendChange = (state = initState, action) => {
  switch (action.type) {
    case TYPES.DISCOVERY_RECOMMEND_CHANGE_INIT: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    case TYPES.DISCOVERY_RECOMMEND_CHANGE_INIT_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
        isSuccess: true,
      }
    }
    case TYPES.DISCOVERY_RECOMMEND_CHANGE_INIT_FAILED: {
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

export default discoveryRecommendChange
