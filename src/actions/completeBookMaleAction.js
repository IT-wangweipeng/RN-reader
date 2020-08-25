
export const COMPLETE_BOOK_MALE_INIT = 'COMPLETE_BOOK_MALE_INIT'
export const COMPLETE_BOOK_MALE_INIT_SUCCESS = 'COMPLETE_BOOK_MALE_INIT_SUCCESS'
export const COMPLETE_BOOK_MALE_INIT_FAILED = 'COMPLETE_BOOK_MALE_INIT_FAILED'

export const COMPLETE_BOOK_MALE_LOAD_MORE = 'COMPLETE_BOOK_MALE_LOAD_MORE'
export const COMPLETE_BOOK_MALE_LOAD_MORE_SUCCESS = 'COMPLETE_BOOK_MALE_LOAD_MORE_SUCCESS'
export const COMPLETE_BOOK_MALE_LOAD_MORE_FAILED = 'COMPLETE_BOOK_MALE_LOAD_MORE_FAILED'

/**
 * 完本列表
 * */
export const completeBookMaleInit = payload => ({
  type: COMPLETE_BOOK_MALE_INIT,
  payload,
})

export const completeBookMaleInitSuccess = payload => ({
  type: COMPLETE_BOOK_MALE_INIT_SUCCESS,
  payload,
})

export const completeBookMaleInitFailed = payload => ({
  type: COMPLETE_BOOK_MALE_INIT_FAILED,
  payload,
})

/**
 * 完本列表加载更多
 * */
export function completeBookMaleLoadMore(payload) {
  return {
    type: COMPLETE_BOOK_MALE_LOAD_MORE,
    payload,
  }
}

export function completeBookMaleLoadMoreSuccess(payload) {
  return {
    type: COMPLETE_BOOK_MALE_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function completeBookMaleLoadMoreFailed(payload) {
  return {
    type: COMPLETE_BOOK_MALE_LOAD_MORE_FAILED,
    payload,
  }
}
