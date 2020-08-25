import {createAction, handleActions} from 'redux-actions'


export const BOOKSHELF_BANNER_INIT = 'BOOKSHELF_BANNER_INIT'
export const BOOKSHELF_BANNER_INIT_SUCCESS = 'BOOKSHELF_BANNER_INIT_SUCCESS'
export const BOOKSHELF_BANNER_INIT_FAILED = 'BOOKSHELF_BANNER_INIT_FAILED'
export const BOOKSHELF_RECOMMEND_REFRESH_INIT = 'BOOKSHELF_RECOMMEND_REFRESH_INIT'
export const BOOKSHELF_RECOMMEND_REFRESH_INIT_SUCCESS = 'BOOKSHELF_RECOMMEND_REFRESH_INIT_SUCCESS'
export const BOOKSHELF_RECOMMEND_REFRESH_INIT_FAILED = 'BOOKSHELF_RECOMMEND_REFRESH_INIT_FAILED'


export const bookshelfBannerInitAction = createAction(BOOKSHELF_BANNER_INIT)
export const bookshelfBannerSuccessAction = createAction(BOOKSHELF_BANNER_INIT_SUCCESS)
export const bookshelfBannerFailedAction = createAction(BOOKSHELF_BANNER_INIT_FAILED)

export const bookshelfRecommendRefreshInitAction = createAction(BOOKSHELF_RECOMMEND_REFRESH_INIT)
export const bookshelfRecommendRefreshInitSuccessAction = createAction(BOOKSHELF_RECOMMEND_REFRESH_INIT_SUCCESS)
export const bookshelfRecommendRefreshInitFailedAction = createAction(BOOKSHELF_RECOMMEND_REFRESH_INIT_FAILED)

import React from 'react'
import {
  Text,
} from 'react-native'


const bookRecommend = handleActions({
  BOOKSHELF_BANNER_INIT: (state, action) => ({
    ...state,
  }),
  BOOKSHELF_BANNER_INIT_SUCCESS: (state, action) => ({
    ...state,
    banners: action.payload.banners,
    horns: action.payload.horns,
    hornsMessage: action.payload.horns,
  }),
  BOOKSHELF_BANNER_INIT_FAILED: (state, action) => ({
    ...state,
  }),
  BOOKSHELF_RECOMMEND_REFRESH_INIT: (state, action) => ({
    ...state,
  }),
  BOOKSHELF_RECOMMEND_REFRESH_INIT_SUCCESS: (state, action) => ({
    ...state,
    recommend: action.payload.data,
  }),
  BOOKSHELF_RECOMMEND_REFRESH_INIT_FAILED: (state, action) => ({
    ...state,
  })
}, initialState = {
  banners: [],
  horns: [],
  hornsMessage: [],
  recommend: [],
});

export default bookRecommend
