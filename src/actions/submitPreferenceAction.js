import { createAction, handleActions } from 'redux-actions'


export const SUBMIT_PREFERENCE_INIT = 'SUBMIT_PREFERENCE_INIT'
export const SUBMIT_PREFERENCE_INIT_SUCCESS = 'SUBMIT_PREFERENCE_INIT_SUCCESS'
export const SUBMIT_PREFERENCE_INIT_FAILED = 'SUBMIT_PREFERENCE_INIT_FAILED'


export const submitPreferenceInitAction = createAction(SUBMIT_PREFERENCE_INIT)
export const submitPreferenceSuccessAction = createAction(SUBMIT_PREFERENCE_INIT_SUCCESS)
export const submitPreferenceFailedAction = createAction(SUBMIT_PREFERENCE_INIT_FAILED)
