export const BOOK_FAVORITES_INIT = 'BOOK_FAVORITES_INIT'
export const BOOK_FAVORITES_SUCCESS = 'BOOK_FAVORITES_SUCCESS'
export const BOOK_FAVORITES_FAILED = 'BOOK_FAVORITES_FAILED'

export const bookFavoritesInit = payload => ({
  type: BOOK_FAVORITES_INIT,
  payload,
})

export const bookFavoritesInitSuccess = payload => ({
  type: BOOK_FAVORITES_SUCCESS,
  payload,
})

export const bookFavoritesInitFailed = payload => ({
  type: BOOK_FAVORITES_FAILED,
  payload,
})
