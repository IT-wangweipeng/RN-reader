
export const RANK_FEMALE_FAVORITE_INIT = 'RANK_FEMALE_FAVORITE_INIT'
export const RANK_FEMALE_FAVORITE_INIT_SUCCESS = 'RANK_FEMALE_FAVORITE_INIT_SUCCESS'
export const RANK_FEMALE_FAVORITE_INIT_FAILED = 'RANK_FEMALE_FAVORITE_INIT_FAILED'

export const RANK_FEMALE_FAVORITE_LOAD_MORE = 'RANK_FEMALE_FAVORITE_LOAD_MORE'
export const RANK_FEMALE_FAVORITE_LOAD_MORE_SUCCESS = 'RANK_FEMALE_FAVORITE_LOAD_MORE_SUCCESS'
export const RANK_FEMALE_FAVORITE_LOAD_MORE_FAILED = 'RANK_FEMALE_FAVORITE_LOAD_MORE_FAILED'

/**
 * 排行女频人气列表
 * */
export const rankFemaleFavoriteInit = payload => ({
  type: RANK_FEMALE_FAVORITE_INIT,
  payload,
})

export const rankFemaleFavoriteInitSuccess = payload => ({
  type: RANK_FEMALE_FAVORITE_INIT_SUCCESS,
  payload,
})

export const rankFemaleFavoriteInitFailed = payload => ({
  type: RANK_FEMALE_FAVORITE_INIT_FAILED,
  payload,
})

/**
 * 排行女频人气列表加载更多
 * */
export function rankFemaleFavoriteLoadMore(payload) {
  return {
    type: RANK_FEMALE_FAVORITE_LOAD_MORE,
    payload,
  }
}

export function rankFemaleFavoriteLoadMoreSuccess(payload) {
  return {
    type: RANK_FEMALE_FAVORITE_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function rankFemaleFavoriteLoadMoreFailed(payload) {
  return {
    type: RANK_FEMALE_FAVORITE_LOAD_MORE_FAILED,
    payload,
  }
}
