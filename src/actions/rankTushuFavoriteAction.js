
export const RANK_TUSHU_FAVORITE_INIT = 'RANK_TUSHU_FAVORITE_INIT'
export const RANK_TUSHU_FAVORITE_INIT_SUCCESS = 'RANK_TUSHU_FAVORITE_INIT_SUCCESS'
export const RANK_TUSHU_FAVORITE_INIT_FAILED = 'RANK_TUSHU_FAVORITE_INIT_FAILED'

export const RANK_TUSHU_FAVORITE_LOAD_MORE = 'RANK_TUSHU_FAVORITE_LOAD_MORE'
export const RANK_TUSHU_FAVORITE_LOAD_MORE_SUCCESS = 'RANK_TUSHU_FAVORITE_LOAD_MORE_SUCCESS'
export const RANK_TUSHU_FAVORITE_LOAD_MORE_FAILED = 'RANK_TUSHU_FAVORITE_LOAD_MORE_FAILED'

/**
 * 排行女频人气列表
 * */
export const rankTushuFavoriteInit = payload => ({
  type: RANK_TUSHU_FAVORITE_INIT,
  payload,
})

export const rankTushuFavoriteInitSuccess = payload => ({
  type: RANK_TUSHU_FAVORITE_INIT_SUCCESS,
  payload,
})

export const rankTushuFavoriteInitFailed = payload => ({
  type: RANK_TUSHU_FAVORITE_INIT_FAILED,
  payload,
})

/**
 * 排行女频人气列表加载更多
 * */
export function rankTushuFavoriteLoadMore(payload) {
  return {
    type: RANK_TUSHU_FAVORITE_LOAD_MORE,
    payload,
  }
}

export function rankTushuFavoriteLoadMoreSuccess(payload) {
  return {
    type: RANK_TUSHU_FAVORITE_LOAD_MORE_SUCCESS,
    payload,
  }
}

export function rankTushuFavoriteLoadMoreFailed(payload) {
  return {
    type: RANK_TUSHU_FAVORITE_LOAD_MORE_FAILED,
    payload,
  }
}
