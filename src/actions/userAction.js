export const USER_INIT = 'USER_INIT'
export const DELETE_USER = 'DELETE_USER'
export const USER_MERGE = 'USER_MERGE'

export const UPDATE_USER_INFO_INIT = 'UPDATE_USER_INFO_INIT'
export const UPDATE_USER_INFO_SUCCESS = 'UPDATE_USER_INFO_SUCCESS'
export const UPDATE_USER_INFO_FAILED = 'UPDATE_USER_INFO_FAILED'


export const userInit = payload => ({
  type: USER_INIT,
  payload,
})

export const deleteUser = payload => ({
  type: DELETE_USER,
  payload,
})

export const updateUserInit = payload => ({
  type: UPDATE_USER_INFO_INIT,
  payload,
})

export const updateUserSuccess = payload => ({
  type: UPDATE_USER_INFO_SUCCESS,
  payload,
})

export const updateUserFailed = payload => ({
  type: UPDATE_USER_INFO_FAILED,
  payload,
})

export const userMerge = payload => ({
  type: USER_MERGE,
  payload,
})