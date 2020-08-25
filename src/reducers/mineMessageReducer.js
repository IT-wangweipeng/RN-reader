import {createAction, handleActions} from 'redux-actions'


export const MINE_MESSAGE_LIST_INIT = 'MINE_MESSAGE_LIST_INIT'
export const MINE_MESSAGE_LIST_INIT_SUCCESS = 'MINE_MESSAGE_LIST_INIT_SUCCESS'
export const MINE_MESSAGE_LIST_INIT_FAILED = 'MINE_MESSAGE_LIST_INIT_FAILED'

export const MINE_MESSAGE_LIST_LOAD_MORE_INIT = 'MINE_MESSAGE_LIST_LOAD_MORE_INIT'
export const MINE_MESSAGE_LIST_LOAD_MORE_SUCCESS = 'MINE_MESSAGE_LIST_LOAD_MORE_SUCCESS'
export const MINE_MESSAGE_LIST_LOAD_MORE_FAILED = 'MINE_MESSAGE_LIST_LOAD_MORE_FAILED'


// 消息列表
export const mineMessageListInitAction = createAction(MINE_MESSAGE_LIST_INIT)
export const mineMessageListInitSuccessAction = createAction(MINE_MESSAGE_LIST_INIT_SUCCESS)
export const mineMessageListInitFailedAction = createAction(MINE_MESSAGE_LIST_INIT_FAILED)

// 消息列表加载更多
export const mineMessageListLoadMoreInitAction = createAction(MINE_MESSAGE_LIST_LOAD_MORE_INIT)
export const mineMessageListLoadMoreSuccessAction = createAction(MINE_MESSAGE_LIST_LOAD_MORE_SUCCESS)
export const mineMessageListLoadMoreFailedAction = createAction(MINE_MESSAGE_LIST_LOAD_MORE_FAILED)



const mineMessage = handleActions({
  MINE_MESSAGE_LIST_INIT: (state, action) => ({
    ...state,
    loadSuccess: false,
  }),
  MINE_MESSAGE_LIST_INIT_SUCCESS: (state, action) => ({
    ...state,
    list: action.payload.data.list,
    messageHasMore: action.payload.data.hasMore,
    loadSuccess: true,
  }),
  MINE_MESSAGE_LIST_INIT_FAILED: (state, action) => ({
    ...state,
    loadSuccess: false,
  }),

  MINE_MESSAGE_LIST_LOAD_MORE_INIT: (state, action) => ({
    ...state,
    isLoadingMore: true
  }),
  MINE_MESSAGE_LIST_LOAD_MORE_SUCCESS: (state, action) => ({
    ...state,
    isLoadingMore: false,
    messageHasMore: action.payload.data.hasMore,
    list: state.list.concat(action.payload.data.list || []),
  }),
  MINE_MESSAGE_LIST_LOAD_MORE_FAILED: (state, action) => ({
    ...state,
    isLoadingMore: false,
  }),
}, initialState = {
  isLoadingMore: false,
  loadSuccess: true,
  messageHasMore: false,
  list: [],
});



export default mineMessage