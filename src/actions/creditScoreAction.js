import { createAction, handleActions } from 'redux-actions'


export const CREDIT_SCORE_INIT = 'CREDIT_SCORE_INIT'
export const CREDIT_SCORE_INIT_SUCCESS = 'CREDIT_SCORE_INIT_SUCCESS'
export const CREDIT_SCORE_INIT_FAILED = 'CREDIT_SCORE_INIT_FAILED'

export const CREDIT_SCORE_LOAD_MORE = 'CREDIT_SCORE_LOAD_MORE'
export const CREDIT_SCORE_LOAD_MORE_SUCCESS = 'CREDIT_SCORE_LOAD_MORE_SUCCESS'
export const CREDIT_SCORE_LOAD_MORE_FAILED = 'CREDIT_SCORE_LOAD_MORE_FAILED'


export const creditScoreInitAction = createAction(CREDIT_SCORE_INIT)
export const creditScoreInitSuccessAction = createAction(CREDIT_SCORE_INIT_SUCCESS)
export const creditScoreInitFailedAction = createAction(CREDIT_SCORE_INIT_FAILED)

export const creditScoreLoadMoreAction = createAction(CREDIT_SCORE_LOAD_MORE)
export const creditScoreLoadMoreSuccessAction = createAction(CREDIT_SCORE_LOAD_MORE_SUCCESS)
export const creditScoreLoadMoreFailedAction = createAction(CREDIT_SCORE_LOAD_MORE_FAILED)
