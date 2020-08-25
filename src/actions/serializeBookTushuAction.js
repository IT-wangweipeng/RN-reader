
export const SERIALIZE_BOOK_TUSHU_INIT = 'SERIALIZE_BOOK_TUSHU_INIT'
export const SERIALIZE_BOOK_TUSHU_INIT_SUCCESS = 'SERIALIZE_BOOK_TUSHU_INIT_SUCCESS'
export const SERIALIZE_BOOK_TUSHU_INIT_FAILED = 'SERIALIZE_BOOK_TUSHU_INIT_FAILED'

export const SERIALIZE_BOOK_TUSHU_LOAD_MORE = 'SERIALIZE_BOOK_TUSHU_LOAD_MORE'
export const SERIALIZE_BOOK_TUSHU_LOAD_MORE_SUCCESS = 'SERIALIZE_BOOK_TUSHU_LOAD_MORE_SUCCESS'
export const SERIALIZE_BOOK_TUSHU_LOAD_MORE_FAILED = 'SERIALIZE_BOOK_TUSHU_LOAD_MORE_FAILED'

/**
 * 连载列表
 * */
export const serializeBookTushuInit = payload => ({
  type: SERIALIZE_BOOK_TUSHU_INIT,
  payload,
})

export const serializeBookTushuInitSuccess = payload => ({
  type: SERIALIZE_BOOK_TUSHU_INIT_SUCCESS,
  payload,
})

export const serializeBookTushuInitFailed = payload => ({
  type: SERIALIZE_BOOK_TUSHU_INIT_FAILED,
  payload,
})

/**
 * 连载列表加载更多
 * */
export function serializeBookTushuLoadMore(payload) {
  return {
    type: SERIALIZE_BOOK_TUSHU_LOAD_MORE,
    payload,
  }
}

export function serializeBookTushuLoadMoreSuccess(payload) {
  return {
    type: SERIALIZE_BOOK_TUSHU_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function serializeBookTushuLoadMoreFailed(payload) {
  return {
    type: SERIALIZE_BOOK_TUSHU_LOAD_MORE_FAILED,
    payload,
  }
}
