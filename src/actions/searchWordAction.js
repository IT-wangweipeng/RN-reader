export const SEARCH_WORD_INIT = 'SEARCH_WORD_INIT'
export const SEARCH_WORD_SUCCESS = 'SEARCH_WORD_SUCCESS'
export const SEARCH_WORD_FAILED = 'SEARCH_WORD_FAILED'

export const searchWordInit = payload => ({
  type: SEARCH_WORD_INIT,
  payload,
})

export const searchWordInitSuccess = payload => ({
  type: SEARCH_WORD_SUCCESS,
  payload,
})

export const searchWordInitFailed = payload => ({
  type: SEARCH_WORD_FAILED,
  payload,
})
