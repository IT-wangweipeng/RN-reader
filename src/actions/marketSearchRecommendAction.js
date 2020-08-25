export const MARKET_SEARCH_RECOMMEND_INIT = 'MARKET_SEARCH_RECOMMEND_INIT'
export const MARKET_SEARCH_RECOMMEND_INIT_SUCCESS = 'MARKET_SEARCH_RECOMMEND_INIT_SUCCESS'
export const MARKET_SEARCH_RECOMMEND_INIT_FAILED = 'MARKET_SEARCH_RECOMMEND_INIT_FAILED'

export const marketSearchRecommendInit = payload => ({
  type: MARKET_SEARCH_RECOMMEND_INIT,
  payload,
})

export const marketSearchRecommendInitSuccess = payload => ({
  type: MARKET_SEARCH_RECOMMEND_INIT_SUCCESS,
  payload,
})

export const marketSearchRecommendInitFailed = payload => ({
  type: MARKET_SEARCH_RECOMMEND_INIT_FAILED,
  payload,
})
