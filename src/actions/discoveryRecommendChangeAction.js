export const DISCOVERY_RECOMMEND_CHANGE_INIT = 'DISCOVERY_RECOMMEND_CHANGE_INIT'
export const DISCOVERY_RECOMMEND_CHANGE_INIT_SUCCESS = 'DISCOVERY_RECOMMEND_CHANGE_INIT_SUCCESS'
export const DISCOVERY_RECOMMEND_CHANGE_INIT_FAILED = 'DISCOVERY_RECOMMEND_CHANGE_INIT_FAILED'

export const discoveryRecommendChangeInit = payload => ({
  type: DISCOVERY_RECOMMEND_CHANGE_INIT,
  payload,
})

export const discoveryRecommendChangeInitSuccess = payload => ({
  type: DISCOVERY_RECOMMEND_CHANGE_INIT_SUCCESS,
  payload,
})

export const discoveryRecommendChangeInitFailed = payload => ({
  type: DISCOVERY_RECOMMEND_CHANGE_INIT_FAILED,
  payload,
})
