import * as TYPES from '../actions/searchRecommendAction'

const initState = {
  sex: 1,
  data: [],
  isSuccess: false,
}


const searchRecommend = (state = initState, action) => {
  switch (action.type) {
    case TYPES.SEARCH_RECOMMEND_INIT: {
      return {
        ...state,
        sex: action.payload.sex,
        isSuccess: false,
      }
    }
    case TYPES.SEARCH_RECOMMEND_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isSuccess: true,
      }
    }
    case TYPES.SEARCH_RECOMMEND_FAILED: {
      return {
        ...state,
        isSuccess: false,
      }
    }
    default:
      return state
  }
}

export default searchRecommend
