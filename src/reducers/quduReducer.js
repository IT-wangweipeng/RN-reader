import * as TYPES from '../actions/quduAction'

const initState = {
  sex: 3,
  list: [],
  isSuccess: false,
  isLoading: false,
}

const qudu = (state = initState, action) => {
  switch (action.type) {
    case TYPES.QUDU_INIT: {
      return {
        ...state,
        isSuccess: false,
        isLoading: true,
      }
    }
    case TYPES.QUDU_INIT_SUCCESS: {
      return {
        ...state,
        list: action.payload.data.list,
        isSuccess: true,
        isLoading: false,
      }
    }
    case TYPES.QUDU_INIT_FAILED: {
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

export default qudu
