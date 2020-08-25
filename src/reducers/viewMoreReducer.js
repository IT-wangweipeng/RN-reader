import * as types from '../actions/viewMoreAction'

const initState = {
  start: 0,
  size: 10,
  id: 0,
  loadMore: false,
  isLoadingMore: false,
  isRefreshing: false,
  list: [],
}

export default function viewMore(state = initState, action = {}) {
  switch (action.type) {
    case types.VIEW_MORE_INIT: {
      return {
        ...state,
        isRefreshing: true,
      }
    }
    case types.VIEW_MORE_INIT_SUCCESS: {
      return {
        ...state,
        isRefreshing: false,
        list: action.payload.data.list,
        loadMore: action.payload.data.hasMore || false,
      }
    }
    case types.VIEW_MORE_INIT_FAILED: {
      return {
        ...state,
        isRefreshing: false,
      }
    }
    case types.VIEW_MORE_LOAD_MORE: {
      return {
        ...state,
        isLoadingMore: true,
      }
    }
    case types.VIEW_MORE_LOAD_MORE_SUCCESS: {
      return {
        ...state,
        isLoadingMore: false,
        loadMore: action.payload.data.hasMore,
        list: state.list.concat(action.payload.data.list || []),
        start: state.start + state.size,
      }
    }
    case types.VIEW_MORE_LOAD_MORE_FAILED: {
      return {
        ...state,
        isLoadingMore: false,
      }
    }
    default:
      return state
  }
}
