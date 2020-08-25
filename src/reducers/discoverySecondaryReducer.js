import * as TYPES from '../actions/discoverySecondaryAction'

const initState = {
  data: {},
  isLoading: true,
}

const discoverySecondary = (state = initState, action) => {
  switch (action.type) {
    case TYPES.DISCOVERY_SECONDARY_INIT: {
      return {
        ...state,
      }
    }
    case TYPES.DISCOVERY_SECONDARY_INIT_SUCCESS: {
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
      }
    }
    case TYPES.DISCOVERY_SECONDARY_INIT_FAILED: {
      return {
        ...state,
        isLoading: false,
      }
    }
    default:
      return state
  }
}

export default discoverySecondary
