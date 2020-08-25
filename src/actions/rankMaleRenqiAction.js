
export const RANK_MALE_RENQI_INIT = 'RANK_MALE_RENQI_INIT'
export const RANK_MALE_RENQI_INIT_SUCCESS = 'RANK_MALE_RENQI_INIT_SUCCESS'
export const RANK_MALE_RENQI_INIT_FAILED = 'RANK_MALE_RENQI_INIT_FAILED'

export const RANK_MALE_RENQI_LOAD_MORE = 'RANK_MALE_RENQI_LOAD_MORE'
export const RANK_MALE_RENQI_LOAD_MORE_SUCCESS = 'RANK_MALE_RENQI_LOAD_MORE_SUCCESS'
export const RANK_MALE_RENQI_LOAD_MORE_FAILED = 'RANK_MALE_RENQI_LOAD_MORE_FAILED'

/**
 * 排行男频人气列表
 * */
export const rankMaleRenqiInit = payload => ({
  type: RANK_MALE_RENQI_INIT,
  payload,
})

export const rankMaleRenqiInitSuccess = payload => ({
  type: RANK_MALE_RENQI_INIT_SUCCESS,
  payload,
})

export const rankMaleRenqiInitFailed = payload => ({
  type: RANK_MALE_RENQI_INIT_FAILED,
  payload,
})

/**
 * 排行男频人气列表加载更多
 * */
export function rankMaleRenqiLoadMore(payload) {
  return {
    type: RANK_MALE_RENQI_LOAD_MORE,
    payload,
  }
}

export function rankMaleRenqiLoadMoreSuccess(payload) {
  return {
    type: RANK_MALE_RENQI_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function rankMaleRenqiLoadMoreFailed(payload) {
  return {
    type: RANK_MALE_RENQI_LOAD_MORE_FAILED,
    payload,
  }
}
