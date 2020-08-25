export const BOOK_DETAIL_INIT = 'BOOK_DETAIL_INIT'
export const BOOK_DETAIL_SUCCESS = 'BOOK_DETAIL_SUCCESS'
export const BOOK_DETAIL_FAILED = 'BOOK_DETAIL_FAILED'

export const bookDetailInit = payload => ({
  type: BOOK_DETAIL_INIT,
  payload,
})

export const bookDetailInitSuccess = payload => ({
  type: BOOK_DETAIL_SUCCESS,
  payload,
})

export const bookDetailInitFailed = payload => ({
  type: BOOK_DETAIL_FAILED,
  payload,
})
