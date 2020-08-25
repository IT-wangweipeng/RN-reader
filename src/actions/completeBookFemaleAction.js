
export const COMPLETE_BOOK_FEMALE_INIT = 'COMPLETE_BOOK_FEMALE_INIT'
export const COMPLETE_BOOK_FEMALE_INIT_SUCCESS = 'COMPLETE_BOOK_FEMALE_INIT_SUCCESS'
export const COMPLETE_BOOK_FEMALE_INIT_FAILED = 'COMPLETE_BOOK_FEMALE_INIT_FAILED'

export const COMPLETE_BOOK_FEMALE_LOAD_MORE = 'COMPLETE_BOOK_FEMALE_LOAD_MORE'
export const COMPLETE_BOOK_FEMALE_LOAD_MORE_SUCCESS = 'COMPLETE_BOOK_FEMALE_LOAD_MORE_SUCCESS'
export const COMPLETE_BOOK_FEMALE_LOAD_MORE_FAILED = 'COMPLETE_BOOK_FEMALE_LOAD_MORE_FAILED'

/**
 * 完本列表
 * */
export const completeBookFemaleInit = payload => ({
  type: COMPLETE_BOOK_FEMALE_INIT,
  payload,
})

export const completeBookFemaleInitSuccess = payload => ({
  type: COMPLETE_BOOK_FEMALE_INIT_SUCCESS,
  payload,
})

export const completeBookFemaleInitFailed = payload => ({
  type: COMPLETE_BOOK_FEMALE_INIT_FAILED,
  payload,
})

/**
 * 完本列表加载更多
 * */
export function completeBookFemaleLoadMore(payload) {
  return {
    type: COMPLETE_BOOK_FEMALE_LOAD_MORE,
    payload,
  }
}

export function completeBookFemaleLoadMoreSuccess(payload) {
  return {
    type: COMPLETE_BOOK_FEMALE_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function completeBookFemaleLoadMoreFailed(payload) {
  return {
    type: COMPLETE_BOOK_FEMALE_LOAD_MORE_FAILED,
    payload,
  }
}
