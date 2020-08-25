import {createAction, handleActions} from 'redux-actions'

export const GET_HOT_BEANS_INIT = 'GET_HOT_BEANS_INIT'
export const GET_HOT_BEANS_INIT_SUCCESS = 'GET_HOT_BEANS_INIT_SUCCESS'
export const GET_HOT_BEANS_INIT_FAILED = 'GET_HOT_BEANS_INIT_FAILED'

export const HOT_BEANS_PAYMENT_INIT = 'HOT_BEANS_PAYMENT_INIT'
export const HOT_BEANS_PAYMENT_INIT_SUCCESS = 'HOT_BEANS_PAYMENT_INIT_SUCCESS'
export const HOT_BEANS_PAYMENT_INIT_FAILED = 'HOT_BEANS_PAYMENT_INIT_FAILED'


export const getHotBeansInitAction = createAction(GET_HOT_BEANS_INIT)
export const getHotBeansSuccessAction = createAction(GET_HOT_BEANS_INIT_SUCCESS)
export const getHotBeansFailedAction = createAction(GET_HOT_BEANS_INIT_FAILED)

export const hotBeansPaymentInitAction = createAction(HOT_BEANS_PAYMENT_INIT)
export const hotBeansPaymentInitSuccessAction = createAction(HOT_BEANS_PAYMENT_INIT_SUCCESS)
export const hotBeansPaymentInitFailedAction = createAction(HOT_BEANS_PAYMENT_INIT_FAILED)




const hotBeans = handleActions({
  GET_HOT_BEANS_INIT: (state, action) => ({
    ...state,
  }),
  GET_HOT_BEANS_INIT_SUCCESS: (state, action) => ({
    ...state,
    data: action.payload.data.hotbeans,
  }),
  GET_HOT_BEANS_INIT_FAILED: (state, action) => ({
    ...state,
  }),
  HOT_BEANS_PAYMENT_INIT: (state, action) => ({
    ...state,
  }),
  HOT_BEANS_PAYMENT_INIT_SUCCESS: (state, action) => ({
    ...state,
  }),
  HOT_BEANS_PAYMENT_INIT_FAILED: (state, action) => ({
    ...state,
  })
}, initialState = {
  data: [],
});

export default hotBeans