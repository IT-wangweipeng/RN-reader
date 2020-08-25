export const SEARCH_BANNER_INIT = 'SEARCH_BANNER_INIT'
export const SEARCH_BANNER_INIT_SUCCESS = 'SEARCH_BANNER_INIT_SUCCESS'
export const SEARCH_BANNER_INIT_FAILED = 'SEARCH_BANNER_INIT_FAILED'

export const searchBannerInit = payload => ({
  type: SEARCH_BANNER_INIT,
  payload,
})

export const searchBannerInitSuccess = payload => ({
  type: SEARCH_BANNER_INIT_SUCCESS,
  payload,
})

export const searchBannerInitFailed = payload => ({
  type: SEARCH_BANNER_INIT_FAILED,
  payload,
})
