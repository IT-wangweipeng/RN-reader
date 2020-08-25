import * as TYPES from '../actions/loginAction'

const initState = {
  phone: '',
  captcha: '',
  isSuccess: false,
}

const login = (state = initState, action) => {
  switch (action.type) {
    case TYPES.LOGIN:
      return {
        ...state,
        isSuccess: false,
        phone: action.payload.phone,
        captcha: action.payload.captcha,
      }
    case TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        isSuccess: true,
      }
    case TYPES.LOGIN_FAILED:
      return {
        ...state,
        isSuccess: false,
      }
    case TYPES.LOGIN_AUTO: {
      return {
        ...state,
      }
    }
    default:
      return state
  }
}

export default login
