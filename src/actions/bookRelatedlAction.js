export const BOOK_RELATED_INIT = 'BOOK_RELATED_INIT'
export const BOOK_RELATED_SUCCESS = 'BOOK_RELATED_SUCCESS'
export const BOOK_RELATED_FAILED = 'BOOK_RELATED_FAILED'

export const bookRelatedInit = payload => ({
  type: BOOK_RELATED_INIT,
  payload,
})

export const bookRelatedInitSuccess = payload => ({
  type: BOOK_RELATED_SUCCESS,
  payload,
})

export const bookRelatedInitFailed = payload => ({
  type: BOOK_RELATED_FAILED,
  payload,
})
