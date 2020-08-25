
export const SHORTESSAY_BOOK_INIT = 'SHORTESSAY_BOOK_INIT'
export const SHORTESSAY_BOOK_INIT_SUCCESS = 'SHORTESSAY_BOOK_INIT_SUCCESS'
export const SHORTESSAY_BOOK_INIT_FAILED = 'SHORTESSAY_BOOK_INIT_FAILED'

export const SHORTESSAY_BOOK_LOAD_MORE = 'SHORTESSAY_BOOK_LOAD_MORE'
export const SHORTESSAY_BOOK_LOAD_MORE_SUCCESS = 'SHORTESSAY_BOOK_LOAD_MORE_SUCCESS'
export const SHORTESSAY_BOOK_LOAD_MORE_FAILED = 'SHORTESSAY_BOOK_LOAD_MORE_FAILED'

/**
 * 短篇列表
 * */
export const shortessayBookInit = payload => ({
  type: SHORTESSAY_BOOK_INIT,
  payload,
})

export const shortessayBookInitSuccess = payload => ({
  type: SHORTESSAY_BOOK_INIT_SUCCESS,
  payload,
})

export const shortessayBookInitFailed = payload => ({
  type: SHORTESSAY_BOOK_INIT_FAILED,
  payload,
})

/**
 * 完本列表加载更多
 * */
export function shortessayBookLoadMore(payload) {
  return {
    type: SHORTESSAY_BOOK_LOAD_MORE,
    payload,
  }
}

export function shortessayBookLoadMoreSuccess(payload) {
  return {
    type: SHORTESSAY_BOOK_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function shortessayBookLoadMoreFailed(payload) {
  return {
    type: SHORTESSAY_BOOK_LOAD_MORE_FAILED,
    payload,
  }
}
