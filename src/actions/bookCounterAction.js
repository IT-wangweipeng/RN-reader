export const BOOK_COUNTER_INIT = 'BOOK_COUNTER_INIT'
export const BOOK_COUNTER_SUCCESS = 'BOOK_COUNTER_SUCCESS'
export const BOOK_COUNTER_FAILED = 'BOOK_COUNTER_FAILED'

export const bookCounterInit = payload => ({
  type: BOOK_COUNTER_INIT,
  payload,
})

export const bookCounterInitSuccess = payload => ({
  type: BOOK_COUNTER_SUCCESS,
  payload,
})

export const bookCounterInitFailed = payload => ({
  type: BOOK_COUNTER_FAILED,
  payload,
})
