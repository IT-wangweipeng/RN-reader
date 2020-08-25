export const DISCOVERY_SECONDARY_INIT = 'DISCOVERY_SECONDARY_INIT'
export const DISCOVERY_SECONDARY_INIT_SUCCESS = 'DISCOVERY_SECONDARY_INIT_SUCCESS'
export const DISCOVERY_SECONDARY_INIT_FAILED = 'DISCOVERY_SECONDARY_INIT_FAILED'

export const discoverySecondaryInit = payload => ({
  type: DISCOVERY_SECONDARY_INIT,
  payload,
})

export const discoverySecondaryInitSuccess = payload => ({
  type: DISCOVERY_SECONDARY_INIT_SUCCESS,
  payload,
})

export const discoverySecondaryInitFailed = payload => ({
  type: DISCOVERY_SECONDARY_INIT_FAILED,
  payload,
})
