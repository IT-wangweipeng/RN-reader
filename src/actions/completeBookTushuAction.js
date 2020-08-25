
export const COMPLETE_BOOK_TUSHU_INIT = 'COMPLETE_BOOK_TUSHU_INIT'
export const COMPLETE_BOOK_TUSHU_INIT_SUCCESS = 'COMPLETE_BOOK_TUSHU_INIT_SUCCESS'
export const COMPLETE_BOOK_TUSHU_INIT_FAILED = 'COMPLETE_BOOK_TUSHU_INIT_FAILED'

export const COMPLETE_BOOK_TUSHU_LOAD_MORE = 'COMPLETE_BOOK_TUSHU_LOAD_MORE'
export const COMPLETE_BOOK_TUSHU_LOAD_MORE_SUCCESS = 'COMPLETE_BOOK_TUSHU_LOAD_MORE_SUCCESS'
export const COMPLETE_BOOK_TUSHU_LOAD_MORE_FAILED = 'COMPLETE_BOOK_TUSHU_LOAD_MORE_FAILED'

/**
 * 完本列表
 * */
export const completeBookTushuInit = payload => ({
  type: COMPLETE_BOOK_TUSHU_INIT,
  payload,
})

export const completeBookTushuInitSuccess = payload => ({
  type: COMPLETE_BOOK_TUSHU_INIT_SUCCESS,
  payload,
})

export const completeBookTushuInitFailed = payload => ({
  type: COMPLETE_BOOK_TUSHU_INIT_FAILED,
  payload,
})

/**
 * 完本列表加载更多
 * */
export function completeBookTushuLoadMore(payload) {
  return {
    type: COMPLETE_BOOK_TUSHU_LOAD_MORE,
    payload,
  }
}

export function completeBookTushuLoadMoreSuccess(payload) {
  return {
    type: COMPLETE_BOOK_TUSHU_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function completeBookTushuLoadMoreFailed(payload) {
  return {
    type: COMPLETE_BOOK_TUSHU_LOAD_MORE_FAILED,
    payload,
  }
}
