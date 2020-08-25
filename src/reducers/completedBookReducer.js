import {createAction, handleActions} from 'redux-actions'

export const COMPLETED_BOOK_INIT = 'COMPLETED_BOOK_INIT'
export const COMPLETED_BOOK_INIT_SUCCESS = 'COMPLETED_BOOK_INIT_SUCCESS'
export const COMPLETED_BOOK_INIT_FAILED = 'COMPLETED_BOOK_INIT_FAILED'

export const completedBookInitAction = createAction(COMPLETED_BOOK_INIT)
export const completedBookInitSuccessAction = createAction(COMPLETED_BOOK_INIT_SUCCESS)
export const completedBookInitFailedAction = createAction(COMPLETED_BOOK_INIT_FAILED)



const hotBeans = handleActions({
  COMPLETED_BOOK_INIT: (state, action) => ({
    ...state,
    isLoading: true,
  }),
  COMPLETED_BOOK_INIT_SUCCESS: (state, action) => ({
    ...state,
    data: action.payload.data.complete_list,
    count: action.payload.data.complete_num,
    isLoading: false,
  }),
  COMPLETED_BOOK_INIT_FAILED: (state, action) => ({
    ...state,
    isLoading: false,
  }),
}, initialState = {
  data: [],
  count: 0,
  isLoading: false,
});

export default hotBeans