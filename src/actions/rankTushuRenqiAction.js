
export const RANK_TUSHU_RENQI_INIT = 'RANK_TUSHU_RENQI_INIT'
export const RANK_TUSHU_RENQI_INIT_SUCCESS = 'RANK_TUSHU_RENQI_INIT_SUCCESS'
export const RANK_TUSHU_RENQI_INIT_FAILED = 'RANK_TUSHU_RENQI_INIT_FAILED'

export const RANK_TUSHU_RENQI_LOAD_MORE = 'RANK_TUSHU_RENQI_LOAD_MORE'
export const RANK_TUSHU_RENQI_LOAD_MORE_SUCCESS = 'RANK_TUSHU_RENQI_LOAD_MORE_SUCCESS'
export const RANK_TUSHU_RENQI_LOAD_MORE_FAILED = 'RANK_TUSHU_RENQI_LOAD_MORE_FAILED'

/**
 * 排行男频人气列表
 * */
export const rankTushuRenqiInit = payload => ({
  type: RANK_TUSHU_RENQI_INIT,
  payload,
})

export const rankTushuRenqiInitSuccess = payload => ({
  type: RANK_TUSHU_RENQI_INIT_SUCCESS,
  payload,
})

export const rankTushuRenqiInitFailed = payload => ({
  type: RANK_TUSHU_RENQI_INIT_FAILED,
  payload,
})

/**
 * 排行男频人气列表加载更多
 * */
export function rankTushuRenqiLoadMore(payload) {
  return {
    type: RANK_TUSHU_RENQI_LOAD_MORE,
    payload,
  }
}

export function rankTushuRenqiLoadMoreSuccess(payload) {
  return {
    type: RANK_TUSHU_RENQI_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function rankTushuRenqiLoadMoreFailed(payload) {
  return {
    type: RANK_TUSHU_RENQI_LOAD_MORE_FAILED,
    payload,
  }
}
