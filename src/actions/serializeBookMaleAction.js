
export const SERIALIZE_BOOK_MALE_INIT = 'SERIALIZE_BOOK_MALE_INIT'
export const SERIALIZE_BOOK_MALE_INIT_SUCCESS = 'SERIALIZE_BOOK_MALE_INIT_SUCCESS'
export const SERIALIZE_BOOK_MALE_INIT_FAILED = 'SERIALIZE_BOOK_MALE_INIT_FAILED'

export const SERIALIZE_BOOK_MALE_LOAD_MORE = 'SERIALIZE_BOOK_MALE_LOAD_MORE'
export const SERIALIZE_BOOK_MALE_LOAD_MORE_SUCCESS = 'SERIALIZE_BOOK_MALE_LOAD_MORE_SUCCESS'
export const SERIALIZE_BOOK_MALE_LOAD_MORE_FAILED = 'SERIALIZE_BOOK_MALE_LOAD_MORE_FAILED'

/**
 * 连载列表
 * */
export const serializeBookMaleInit = payload => ({
  type: SERIALIZE_BOOK_MALE_INIT,
  payload,
})

export const serializeBookMaleInitSuccess = payload => ({
  type: SERIALIZE_BOOK_MALE_INIT_SUCCESS,
  payload,
})

export const serializeBookMaleInitFailed = payload => ({
  type: SERIALIZE_BOOK_MALE_INIT_FAILED,
  payload,
})

/**
 * 连载列表加载更多
 * */
export function serializeBookMaleLoadMore(payload) {
  return {
    type: SERIALIZE_BOOK_MALE_LOAD_MORE,
    payload,
  }
}

export function serializeBookMaleLoadMoreSuccess(payload) {
  return {
    type: SERIALIZE_BOOK_MALE_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function serializeBookMaleLoadMoreFailed(payload) {
  return {
    type: SERIALIZE_BOOK_MALE_LOAD_MORE_FAILED,
    payload,
  }
}
