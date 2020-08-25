export const CATEGORY_INIT = 'CATEGORY_INIT'
export const CATEGORY_INIT_SUCCESS = 'CATEGORY_INIT_SUCCESS'
export const CATEGORY_INIT_FAILED = 'CATEGORY_INIT_FAILED'

export const READ_PREFERENCE_INIT = 'READ_PREFERENCE_INIT'
export const READ_PREFERENCE_INIT_SUCCESS = 'READ_PREFERENCE_INIT_SUCCESS'
export const READ_PREFERENCE_INIT_FAILED = 'READ_PREFERENCE_INIT_FAILED'


export const categoryInit = payload => ({
  type: CATEGORY_INIT,
  payload,
})

export const categoryInitSuccess = payload => ({
  type: CATEGORY_INIT_SUCCESS,
  payload,
})

export const categoryInitFailed = payload => ({
  type: CATEGORY_INIT_FAILED,
  payload,
})

export const readPreferenceInit = payload => ({
  type: READ_PREFERENCE_INIT,
  payload,
})

export const readPreferenceSuccessInit = payload => ({
  type: READ_PREFERENCE_INIT_SUCCESS,
  payload,
})

export const readPreferenceFailedInit = payload => ({
  type: READ_PREFERENCE_INIT_FAILED,
  payload,
})