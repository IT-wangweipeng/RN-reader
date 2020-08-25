export const LOGIN = 'LOGIN'
export const LOGIN_CHECK = 'LOGIN_CHECK'
export const LOGIN_AUTO = 'LOGIN_AUTO'

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'

export const login = payload => ({
  type: LOGIN,
  payload,
})

export const loginSuccess = payload => ({
  type: LOGIN_SUCCESS,
  payload,
})

export const loginFailed = () => ({
  type: LOGIN_FAILED,
})

export const autoLogin = payload => ({
  type: LOGIN_AUTO,
  payload,
})

export const loginCheck = payload => ({
  type: LOGIN_CHECK,
  payload,
})
