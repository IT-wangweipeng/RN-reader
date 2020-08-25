import {createAction, handleActions} from 'redux-actions'

export const READ_TIME_INIT = 'READ_TIME_INIT'
export const READ_TIME_INIT_SUCCESS = 'READ_TIME_INIT_SUCCESS'
export const READ_TIME_INIT_FAILED = 'READ_TIME_INIT_FAILED'

export const READ_TIME_LOAD_MORE_INIT = 'READ_TIME_LOAD_MORE_INIT'
export const READ_TIME_LOAD_MORE_SUCCESS = 'READ_TIME_LOAD_MORE_SUCCESS'
export const READ_TIME_LOAD_MORE_FAILED = 'READ_TIME_LOAD_MORE_FAILED'


export const readTimeInitAction = createAction(READ_TIME_INIT)
export const readTimeInitSuccessAction = createAction(READ_TIME_INIT_SUCCESS)
export const readTimeInitFailedAction = createAction(READ_TIME_INIT_FAILED)

export const readTimeLoadMoreInitAction = createAction(READ_TIME_LOAD_MORE_INIT)
export const readTimeLoadMoreSuccessAction = createAction(READ_TIME_LOAD_MORE_SUCCESS)
export const readTimeLoadMoreFailedAction = createAction(READ_TIME_LOAD_MORE_FAILED)




const readTime = handleActions({
  READ_TIME_INIT: (state, action) => ({
    ...state,
  }),
  READ_TIME_INIT_SUCCESS: (state, action) => ({
    ...state,
    list: action.payload.list,
    hasMore: action.payload.hasMore,
    cur_month_read_ts: action.payload.cur_month_read_ts,
    pre_month_read_ts: action.payload.pre_month_read_ts,
    total_read_ts: action.payload.total_read_ts,
    loadSuccess: true
  }),
  READ_TIME_INIT_FAILED: (state, action) => ({
    ...state,
    loadSuccess: false
  }),
  READ_TIME_LOAD_MORE_INIT: (state, action) => ({
    ...state,
    isLoadingMore: true,
  }),
  READ_TIME_LOAD_MORE_SUCCESS: (state, action) => ({
    ...state,
    isLoadingMore: false,
    hasMore: action.payload.hasMore,
    list: state.list.concat(action.payload.list || []),
    start: state.start + state.size,
  }),
  READ_TIME_LOAD_MORE_FAILED: (state, action) => ({
    ...state,
    isLoadingMore: false,
  })
}, initialState = {
  list: [],
  hasMore: false,
  cur_month_read_ts: 0,
  pre_month_read_ts: 0,
  total_read_ts: 0,
  loadSuccess: false,
  isLoadingMore: false
});



export default readTime