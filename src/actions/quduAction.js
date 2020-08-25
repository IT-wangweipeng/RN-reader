export const QUDU_INIT = 'QUDU_INIT'
export const QUDU_INIT_SUCCESS = 'QUDU_INIT_SUCCESS'
export const QUDU_INIT_FAILED = 'QUDU_INIT_FAILED'

export const quduInit = payload => ({
  type: QUDU_INIT,
  payload,
})

export const quduInitSuccess = payload => ({
  type: QUDU_INIT_SUCCESS,
  payload,
})

export const quduInitFailed = payload => ({
  type: QUDU_INIT_FAILED,
  payload,
})
