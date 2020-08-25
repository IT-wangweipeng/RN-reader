export const CATEGORY_DETAIL_INIT = 'CATEGORY_DETAIL_INIT'
export const CATEGORY_DETAIL_INIT_SUCCESS = 'CATEGORY_DETAIL_INIT_SUCCESS'
export const CATEGORY_DETAIL_INIT_FAILED = 'CATEGORY_DETAIL_INIT_FAILED'
export const CATEGORY_DETAIL_LOAD_MORE_INIT = 'CATEGORY_DETAIL_LOAD_MORE_INIT'
export const CATEGORY_DETAIL_LOAD_MORE_SUCCESS = 'CATEGORY_DETAIL_LOAD_MORE_SUCCESS'
export const CATEGORY_DETAIL_LOAD_MORE_FAILED = 'CATEGORY_DETAIL_LOAD_MORE_FAILED'



export const categoryDetailInit = (payload) => ({
  type: CATEGORY_DETAIL_INIT,
  payload,
})

export const categoryDetailInitSuccess = (payload) => ({
  type: CATEGORY_DETAIL_INIT_SUCCESS,
  payload,
})

export const categoryDetailInitFailed = (payload) => ({
  type: CATEGORY_DETAIL_INIT_FAILED,
  payload
})

export const categoryLoadMoreInit = payload => ({
  type: CATEGORY_DETAIL_LOAD_MORE_INIT,
  payload,
})

export const categoryLoadMoreSuccess = payload => ({
  type: CATEGORY_DETAIL_LOAD_MORE_SUCCESS,
  payload,
})

export const categoryLoadMoreFailed = payload => ({
  type: CATEGORY_DETAIL_LOAD_MORE_FAILED,
  payload,
})