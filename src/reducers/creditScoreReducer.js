import { handleActions } from 'redux-actions'
import R from 'ramda'

_parseData = (data) => {
  if (data.length === 0) {
    return []
  }
  let newData = []
  R.addIndex(R.map)((val, idx) => {
    let obj = {}
    obj.title = R.keys(val)[0]
    obj.data = R.values(val)[0]
    newData.push(obj)
  }, data)
  return newData
}

const creditScore = handleActions({
  CREDIT_SCORE_INIT: (state, action) => ({
    ...state,
    isLoading: true,
  }),
  CREDIT_SCORE_INIT_SUCCESS: (state, action) => ({
    ...state,
    isLoading: false,
    list: _parseData(action.payload.data.list),
    hasMore: action.payload.data.hasMore,
  }),
  CREDIT_SCORE_INIT_FAILED: (state, action) => ({
    ...state,
    isLoading: false
  }),
  CREDIT_SCORE_LOAD_MORE: (state, action) => ({
    ...state,
    isLoading: true,
    isLoadingMore: true,
  }),
  CREDIT_SCORE_LOAD_MORE_SUCCESS: (state, action) => ({
    ...state,
    isLoading: false,
    list: state.list.concat(action.payload.data.list || []),
    isLoadingMore: false
  }),
  CREDIT_SCORE_LOAD_MORE_FAILED: (state, action) => ({
    ...state,
    isLoading: false,
    isLoadingMore: false,
  }),
}, initialState = {
  isLoading: false,
  hasMore: false,
  list: [],
  isLoadingMore: false,
});

export default creditScore