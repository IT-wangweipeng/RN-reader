
export const RANK_FEMALE_RENQI_INIT = 'RANK_FEMALE_RENQI_INIT'
export const RANK_FEMALE_RENQI_INIT_SUCCESS = 'RANK_FEMALE_RENQI_INIT_SUCCESS'
export const RANK_FEMALE_RENQI_INIT_FAILED = 'RANK_FEMALE_RENQI_INIT_FAILED'

export const RANK_FEMALE_RENQI_LOAD_MORE = 'RANK_FEMALE_RENQI_LOAD_MORE'
export const RANK_FEMALE_RENQI_LOAD_MORE_SUCCESS = 'RANK_FEMALE_RENQI_LOAD_MORE_SUCCESS'
export const RANK_FEMALE_RENQI_LOAD_MORE_FAILED = 'RANK_FEMALE_RENQI_LOAD_MORE_FAILED'

/**
 * 排行女频人气列表
 * */
export const rankFemaleRenqiInit = payload => ({
  type: RANK_FEMALE_RENQI_INIT,
  payload,
})

export const rankFemaleRenqiInitSuccess = payload => ({
  type: RANK_FEMALE_RENQI_INIT_SUCCESS,
  payload,
})

export const rankFemaleRenqiInitFailed = payload => ({
  type: RANK_FEMALE_RENQI_INIT_FAILED,
  payload,
})

/**
 * 排行女频人气列表加载更多
 * */
export function rankFemaleRenqiLoadMore(payload) {
  return {
    type: RANK_FEMALE_RENQI_LOAD_MORE,
    payload,
  }
}

export function rankFemaleRenqiLoadMoreSuccess(payload) {
  return {
    type: RANK_FEMALE_RENQI_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function rankFemaleRenqiLoadMoreFailed(payload) {
  return {
    type: RANK_FEMALE_RENQI_LOAD_MORE_FAILED,
    payload,
  }
}
