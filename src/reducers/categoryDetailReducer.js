import * as TYPES from '../actions/categoryDetailAction'
import R from 'ramda'

const initState = {
  data: [],
  categoryList: [],
  loadSuccess: false,
  isEmpty: true,
  hasMore: false,
  config: {},
  isLoadingMore: false,
}

_data = (data: Array) => {
  if (data.length === 0) {
    return []
  }
  let newData = []
  data.map((item, idx) => {
    if (idx === 0) {
      newData.push({hasAd: true})
    }
    newData.push(item)
  })
  return newData
}

const bookshelf = (state = initState, action) => {
  switch (action.type) {
    case TYPES.CATEGORY_DETAIL_INIT:
      return {
        ...state,
        loadSuccess: false,
        isEmpty: true,
      }
    case TYPES.CATEGORY_DETAIL_INIT_SUCCESS:
      return {
        ...state,
        data: _data(action.payload[0].data && action.payload[0].data.list),
        categoryList: action.payload[0].data && action.payload[0].data.list,
        config: action.payload[1].data,
        hasMore: action.payload[0].data.hasMore,
        loadSuccess: true,
        isEmpty: false,
      }
    case TYPES.CATEGORY_DETAIL_INIT_FAILED:
      return {
        ...state,
        loadSuccess: false,
      }
    case TYPES.CATEGORY_DETAIL_LOAD_MORE_INIT:
      return {
        ...state,
        isLoadingMore: true,
      }
    case TYPES.CATEGORY_DETAIL_LOAD_MORE_SUCCESS:
      const newData = action.payload.data && action.payload.data.list || []
      const data = state.categoryList.concat(newData)
      return {
        ...state,
        data: _data(data),
        categoryList: data,
        hasMore: action.payload.data.hasMore,
        isLoadingMore: false,
      }
    case TYPES.CATEGORY_DETAIL_LOAD_MORE_FAILED:
      return {
        ...state,
        hasMore: true,
        isLoadingMore: false,
      }
    default:
      return state
      break
  }
}

export default bookshelf
