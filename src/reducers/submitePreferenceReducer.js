import { handleActions } from 'redux-actions'

const preference = handleActions({
  SUBMIT_PREFERENCE_INIT: (state, action) => ({
    ...state,
    isLoading: true,
    updateSuccess: false,
  }),
  SUBMIT_PREFERENCE_INIT_SUCCESS: (state, action) => ({
    ...state,
    isLoading: false,
    updateSuccess: true,
  }),
  SUBMIT_PREFERENCE_INIT_FAILED: (state, action) => ({
    ...state,
    isLoading: false
  }),
}, initialState = {
  isLoading: false
});

export default preference
