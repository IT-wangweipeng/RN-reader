import * as TYPES from '../actions/discoveryAction'

const initState = {
  data: [],
  isLoading: true,
}

const discovery = (state = initState, action) => {
  switch (action.type) {
    case TYPES.DISCOVERY_INIT: {
      return {
        ...state,
      }
    }
    case TYPES.DISCOVERY_INIT_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
      }
    }
    case TYPES.DISCOVERY_INIT_FAILED: {
      return {
        ...state,
        isLoading: false,
      }
    }
    default:
      return state
  }
}

export default discovery
