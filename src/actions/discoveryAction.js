export const DISCOVERY_INIT = 'DISCOVERY_INIT'
export const DISCOVERY_INIT_SUCCESS = 'DISCOVERY_INIT_SUCCESS'
export const DISCOVERY_INIT_FAILED = 'DISCOVERY_INIT_FAILED'

export const discoveryInit = payload => ({
  type: DISCOVERY_INIT,
  payload,
})

export const discoveryInitSuccess = payload => ({
  type: DISCOVERY_INIT_SUCCESS,
  payload,
})

export const discoveryInitFailed = payload => ({
  type: DISCOVERY_INIT_FAILED,
  payload,
})
