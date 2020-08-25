export const VIEW_MORE_INIT = 'VIEW_MORE_INIT'
export const VIEW_MORE_INIT_SUCCESS = 'VIEW_MORE_INIT_SUCCESS'
export const VIEW_MORE_INIT_FAILED = 'VIEW_MORE_INIT_FAILED'

export const VIEW_MORE_LOAD_MORE = 'VIEW_MORE_LOAD_MORE'
export const VIEW_MORE_LOAD_MORE_SUCCESS = 'VIEW_MORE_LOAD_MORE_SUCCESS'
export const VIEW_MORE_LOAD_MORE_FAILED = 'VIEW_MORE_LOAD_MORE_FAILED'

/**
 * 查看更多列表
 * */
export const viewMoreInit = payload => ({
  type: VIEW_MORE_INIT,
  payload,
})

export const viewMoreInitSuccess = payload => ({
  type: VIEW_MORE_INIT_SUCCESS,
  payload,
})

export const viewMoreInitFailed = payload => ({
  type: VIEW_MORE_INIT_FAILED,
  payload,
})

/**
 * 查看更多列表加载更多
 * */
export function viewMoreLoadMore(payload) {
  return {
    type: VIEW_MORE_LOAD_MORE,
    payload,
  }
}

export function viewMoreLoadMoreSuccess(payload) {
  return {
    type: VIEW_MORE_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function viewMoreLoadMoreFailed(payload) {
  return {
    type: VIEW_MORE_LOAD_MORE_FAILED,
    payload,
  }
}
