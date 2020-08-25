import {createAction, handleActions} from 'redux-actions'

export const NOTIFICATION_INIT = 'NOTIFICATION_INIT'
export const NOTIFICATION_INIT_SUCCESS = 'NOTIFICATION_INIT_SUCCESS'
export const NOTIFICATION_INIT_FAILED = 'NOTIFICATION_INIT_FAILED'

export const DELETE_NOTIFICATION_INIT = 'DELETE_NOTIFICATION_INIT'
export const DELETE_NOTIFICATION_SUCCESS = 'DELETE_NOTIFICATION_SUCCESS'
export const DELETE_NOTIFICATION_FAILED = 'DELETE_NOTIFICATION_FAILED'

export const NOTIFICATION_TIPS_INIT = 'NOTIFICATION_TIPS_INIT'
export const NOTIFICATION_TIPS_INIT_SUCCESS = 'NOTIFICATION_TIPS_INIT_SUCCESS'
export const NOTIFICATION_TIPS_INIT_FAILED = 'NOTIFICATION_TIPS_INIT_FAILED'


export const notificationInitAction = createAction(NOTIFICATION_INIT)
export const notificationInitSuccessAction = createAction(NOTIFICATION_INIT_SUCCESS)
export const notificationInitFailedAction = createAction(NOTIFICATION_INIT_FAILED)

export const deleteNotificationInitAction = createAction(DELETE_NOTIFICATION_INIT)
export const deleteNotificationSuccessAction = createAction(DELETE_NOTIFICATION_SUCCESS)
export const deleteNotificationFailedAction = createAction(DELETE_NOTIFICATION_FAILED)

export const notificationTipsInit = createAction(NOTIFICATION_TIPS_INIT)
export const notificationTipsInitSuccess = createAction(NOTIFICATION_TIPS_INIT_SUCCESS)
export const notificationTipsInitFailed = createAction(NOTIFICATION_TIPS_INIT_FAILED)




const notification = handleActions({
  NOTIFICATION_INIT: (state, action) => ({
    ...state,
    loadSuccess: false,
    isLoading: true
  }),
  NOTIFICATION_INIT_SUCCESS: (state, action) => ({
    ...state,
    list: action.payload.list,
    loadSuccess: true,
    isLoading: false
  }),
  NOTIFICATION_INIT_FAILED: (state, action) => ({
    ...state,
    loadSuccess: false,
    isLoading: false,
  }),
  DELETE_NOTIFICATION_INIT: (state, action) => ({
    ...state,
    deleteSuccess: false
  }),
  DELETE_NOTIFICATION_SUCCESS: (state, action) => ({
    ...state,
    deleteSuccess: true
  }),
  DELETE_NOTIFICATION_FAILED: (state, action) => ({
    ...state,
    deleteSuccess: false
  }),
  NOTIFICATION_TIPS_INIT: (state, action) => ({
    ...state,
    showTips: false
  }),
  NOTIFICATION_TIPS_INIT_SUCCESS: (state, action) => ({
    ...state,
    showTips: action.payload.show_redhot,
  }),
  NOTIFICATION_TIPS_INIT_FAILED: (state, action) => ({
    ...state,
    showTips: false,
  })
}, initialState = {
  list: [],
  showTips: false,
  loadSuccess: false,
  deleteSuccess: true,
  isLoading: false,
});



export default notification