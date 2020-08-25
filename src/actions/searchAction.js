export const SEARCH_INIT = 'SEARCH_INIT'
export const SEARCH_INIT_SUCCESS = 'SEARCH_INIT_SUCCESS'
export const SEARCH_INIT_FAILED = 'SEARCH_INIT_FAILED'

export const SEARCH_LOAD_MORE = 'SEARCH_LOAD_MORE'
export const SEARCH_LOAD_MORE_SUCCESS = 'SEARCH_LOAD_MORE_SUCCESS'
export const SEARCH_LOAD_MORE_FAILED = 'SEARCH_LOAD_MORE_FAILED'


/**
 * 搜索列表
 * */
export function searchInit(payload) {
  return {
    type: SEARCH_INIT,
    payload,
  }
}

export function searchInitSuccess(payload) {
  return {
    type: SEARCH_INIT_SUCCESS,
    payload,
  }
}

export function searchInitFailed(payload) {
  return {
    type: SEARCH_INIT_FAILED,
    payload,
  }
}

/**
 * 搜索列表加载更多
 * */
export function searchLoadMore(payload) {
  return {
    type: SEARCH_LOAD_MORE,
    payload,
  }
}

export function searchLoadMoreSuccess(payload) {
  return {
    type: SEARCH_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function searchLoadMoreFailed(payload) {
  return {
    type: SEARCH_LOAD_MORE_FAILED,
    payload,
  }
}
