export const SEARCH_RECOMMEND_INIT = 'SEARCH_RECOMMEND_INIT'
export const SEARCH_RECOMMEND_SUCCESS = 'SEARCH_RECOMMEND_SUCCESS'
export const SEARCH_RECOMMEND_FAILED = 'SEARCH_RECOMMEND_FAILED'

export const searchRecommendInit = payload => ({
  type: SEARCH_RECOMMEND_INIT,
  payload,
})

export const searchRecommendInitSuccess = payload => ({
  type: SEARCH_RECOMMEND_SUCCESS,
  payload,
})

export const searchRecommendInitFailed = payload => ({
  type: SEARCH_RECOMMEND_FAILED,
  payload,
})
