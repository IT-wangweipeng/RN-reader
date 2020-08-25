import * as types from '../actions/searchAction'

const initState = {
  start: 0,
  size: 10,
  keyword: null,
  loadMore: false,
  isLoadingMore: false,
  isRefreshing: false,
  list: [],
  type: 0,// 1有结果， 2无结果
}

export default function search(state = initState, action = {}) {
  switch (action.type) {
    case types.SEARCH_INIT: {
      return {
        ...state,
        isRefreshing: true,
      }
    }
    case types.SEARCH_INIT_SUCCESS: {
      return {
        ...state,
        isRefreshing: false,
        list: action.payload.data.list,
        loadMore: action.payload.data.hasMore || false,
        type: action.payload.data.type,
      }
    }
    case types.SEARCH_INIT_FAILED: {
      return {
        ...state,
        isRefreshing: false,
      }
    }
    case types.SEARCH_LOAD_MORE: {
      return {
        ...state,
        isLoadingMore: true,
      }
    }
    case types.SEARCH_LOAD_MORE_SUCCESS: {
      return {
        ...state,
        isLoadingMore: false,
        loadMore: action.payload.data.hasMore,
        list: state.list.concat(action.payload.data.list || []),
        start: state.start + state.size,
        type: action.payload.data.type,
      }
    }
    case types.SEARCH_LOAD_MORE_FAILED: {
      return {
        ...state,
        isLoadingMore: false,
      }
    }
    default:
      return state
  }
}
