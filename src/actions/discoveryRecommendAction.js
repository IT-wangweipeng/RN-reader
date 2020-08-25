export const DISCOVERY_RECOMMEND_INIT = 'DISCOVERY_RECOMMEND_INIT'
export const DISCOVERY_RECOMMEND_INIT_SUCCESS = 'DISCOVERY_RECOMMEND_INIT_SUCCESS'
export const DISCOVERY_RECOMMEND_INIT_FAILED = 'DISCOVERY_RECOMMEND_INIT_FAILED'

export const discoveryRecommendInit = payload => ({
  type: DISCOVERY_RECOMMEND_INIT,
  payload,
})

export const discoveryRecommendInitSuccess = payload => ({
  type: DISCOVERY_RECOMMEND_INIT_SUCCESS,
  payload,
})

export const discoveryRecommendInitFailed = payload => ({
  type: DISCOVERY_RECOMMEND_INIT_FAILED,
  payload,
})
