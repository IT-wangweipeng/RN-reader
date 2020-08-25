import * as TYPES from '../actions/userAction'

const initState = {
  token: '',
  info: {},
  isLoading: false,
  updateSuccess: false
}

const user = (state = initState, action) => {
  switch (action.type) {
    case TYPES.USER_INIT:
      return {
        ...state,
        token: action.payload.token,
        info: action.payload.user
      }
    case TYPES.DELETE_USER:
      return {
        ...state,
        token: '',
        info: {},
      }
    case TYPES.UPDATE_USER_INFO_INIT:
      return {
        ...state,
        isLoading: true,
        updateSuccess: false,
      }
    case TYPES.UPDATE_USER_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateSuccess: true,
      }
    case TYPES.UPDATE_USER_INFO_FAILED:
      return {
        ...state,
        isLoading: false,
        updateSuccess: false,
      }
    case TYPES.USER_MERGE:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}

export default user
