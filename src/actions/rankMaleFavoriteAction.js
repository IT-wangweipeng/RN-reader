
export const RANK_MALE_FAVORITE_INIT = 'RANK_MALE_FAVORITE_INIT'
export const RANK_MALE_FAVORITE_INIT_SUCCESS = 'RANK_MALE_FAVORITE_INIT_SUCCESS'
export const RANK_MALE_FAVORITE_INIT_FAILED = 'RANK_MALE_FAVORITE_INIT_FAILED'

export const RANK_MALE_FAVORITE_LOAD_MORE = 'RANK_MALE_FAVORITE_LOAD_MORE'
export const RANK_MALE_FAVORITE_LOAD_MORE_SUCCESS = 'RANK_MALE_FAVORITE_LOAD_MORE_SUCCESS'
export const RANK_MALE_FAVORITE_LOAD_MORE_FAILED = 'RANK_MALE_FAVORITE_LOAD_MORE_FAILED'

/**
 * 排行男频人气列表
 * */
export const rankMaleFavoriteInit = payload => ({
  type: RANK_MALE_FAVORITE_INIT,
  payload,
})

export const rankMaleFavoriteInitSuccess = payload => ({
  type: RANK_MALE_FAVORITE_INIT_SUCCESS,
  payload,
})

export const rankMaleFavoriteInitFailed = payload => ({
  type: RANK_MALE_FAVORITE_INIT_FAILED,
  payload,
})

/**
 * 排行男频人气列表加载更多
 * */
export function rankMaleFavoriteLoadMore(payload) {
  return {
    type: RANK_MALE_FAVORITE_LOAD_MORE,
    payload,
  }
}

export function rankMaleFavoriteLoadMoreSuccess(payload) {
  return {
    type: RANK_MALE_FAVORITE_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function rankMaleFavoriteLoadMoreFailed(payload) {
  return {
    type: RANK_MALE_FAVORITE_LOAD_MORE_FAILED,
    payload,
  }
}
