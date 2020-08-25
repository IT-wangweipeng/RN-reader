import * as types from '../actions/serializeBookFemaleAction'

const initState = {
  start: 0,
  size: 10,
  sex: 1,
  type: 2,
  loadMore: false,
  isLoadingMore: false,
  isRefreshing: false,
  list: [],
}

export default function serializeBookFemale(state = initState, action = {}) {
  switch (action.type) {
    case types.SERIALIZE_BOOK_FEMALE_INIT: {
      return {
        ...state,
        isRefreshing: true,
      }
    }
    case types.SERIALIZE_BOOK_FEMALE_INIT_SUCCESS: {
      return {
        ...state,
        isRefreshing: false,
        list: action.payload.data.list,
        loadMore: action.payload.data.hasMore || false,
      }
    }
    case types.SERIALIZE_BOOK_FEMALE_INIT_FAILED: {
      return {
        ...state,
        isRefreshing: false,
      }
    }
    case types.SERIALIZE_BOOK_FEMALE_LOAD_MORE: {
      return {
        ...state,
        isLoadingMore: true,
      }
    }
    case types.SERIALIZE_BOOK_FEMALE_LOAD_MORE_SUCCESS: {
      return {
        ...state,
        isLoadingMore: false,
        loadMore: action.payload.data.hasMore,
        list: state.list.concat(action.payload.data.list || []),
        start: state.start + state.size,
      }
    }
    case types.SERIALIZE_BOOK_FEMALE_LOAD_MORE_FAILED: {
      return {
        ...state,
        isLoadingMore: false,
      }
    }
    default:
      return state
  }
}
