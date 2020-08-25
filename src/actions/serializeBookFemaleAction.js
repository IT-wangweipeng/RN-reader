
export const SERIALIZE_BOOK_FEMALE_INIT = 'SERIALIZE_BOOK_FEMALE_INIT'
export const SERIALIZE_BOOK_FEMALE_INIT_SUCCESS = 'SERIALIZE_BOOK_FEMALE_INIT_SUCCESS'
export const SERIALIZE_BOOK_FEMALE_INIT_FAILED = 'SERIALIZE_BOOK_FEMALE_INIT_FAILED'

export const SERIALIZE_BOOK_FEMALE_LOAD_MORE = 'SERIALIZE_BOOK_FEMALE_LOAD_MORE'
export const SERIALIZE_BOOK_FEMALE_LOAD_MORE_SUCCESS = 'SERIALIZE_BOOK_FEMALE_LOAD_MORE_SUCCESS'
export const SERIALIZE_BOOK_FEMALE_LOAD_MORE_FAILED = 'SERIALIZE_BOOK_FEMALE_LOAD_MORE_FAILED'

/**
 * 连载列表
 * */
export const serializeBookFemaleInit = payload => ({
  type: SERIALIZE_BOOK_FEMALE_INIT,
  payload,
})

export const serializeBookFemaleInitSuccess = payload => ({
  type: SERIALIZE_BOOK_FEMALE_INIT_SUCCESS,
  payload,
})

export const serializeBookFemaleInitFailed = payload => ({
  type: SERIALIZE_BOOK_FEMALE_INIT_FAILED,
  payload,
})

/**
 * 连载列表加载更多
 * */
export function serializeBookFemaleLoadMore(payload) {
  return {
    type: SERIALIZE_BOOK_FEMALE_LOAD_MORE,
    payload,
  }
}

export function serializeBookFemaleLoadMoreSuccess(payload) {
  return {
    type: SERIALIZE_BOOK_FEMALE_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function serializeBookFemaleLoadMoreFailed(payload) {
  return {
    type: SERIALIZE_BOOK_FEMALE_LOAD_MORE_FAILED,
    payload,
  }
}
