import * as TYPES from '../actions/categoryAction'
import R from 'ramda'

const initState = {
  data: [],
  isLoading: true,
  maleChannel: [],
  femaleChannel: [],
  bookChannel: [],
  userPreferences: [],
  maleCategory: [],
  femaleCategory: [],
  bookCategory: [],
}

_mergeData = (data, preference) => {
  let newData = []
  const values = []
  preference.map((item, index) => {
    values.push(item.id)
  })
  if (data && data.list && data.list.length > 0) {
    data.list.map((item, index) => {
      if (R.contains(item.id, values)) {
        item.select = true
      } else {
        item.select = false
      }
      newData.push(item)
    })
  }
  return data;
}


const category = (state = initState, action) => {
  switch (action.type) {
    case TYPES.CATEGORY_INIT: {
      return {
        ...state,
      }
    }
    case TYPES.CATEGORY_INIT_SUCCESS: {
      const maleTag = action.payload.data[0] && action.payload.data[0].tag
      const femaleTag = action.payload.data[1] && action.payload.data[1].tag
      const bookTag = action.payload.data[2] && action.payload.data[2].tag
      return {
        ...state,
        data: action.payload.data,
        maleChannel: maleTag === 1 && action.payload.data[0] || [],
        femaleChannel: femaleTag === 2 && action.payload.data[1] || [],
        bookChannel: bookTag === 3 && action.payload.data[2] || [],
        isLoading: false,
      }
    }
    case TYPES.CATEGORY_INIT_FAILED: {
      return {
        ...state,
        isLoading: false,
      }
    }
    case TYPES.READ_PREFERENCE_INIT: {
      return {
        ...state,
        isLoading: false,
      }
    }
    case TYPES.READ_PREFERENCE_INIT_SUCCESS: {
      const maleTag = action.payload.category[0] && action.payload.category[0].tag
      const femaleTag = action.payload.category[1] && action.payload.category[1].tag
      const bookTag = action.payload.category[2] && action.payload.category[2].tag
      return {
        ...state,
        isLoading: true,
        userPreferences:action.payload.preference,
        maleCategory: maleTag === 1 && _mergeData(action.payload.category[0], action.payload.preference) || [],
        femaleCategory: femaleTag === 2 && _mergeData(action.payload.category[1], action.payload.preference) || [],
        bookCategory: bookTag === 3 && _mergeData(action.payload.category[2], action.payload.preference) || [],
      }
    }
    case TYPES.READ_PREFERENCE_INIT_FAILED: {
      return {
        ...state
      }
    }
    default:
      return state
  }
}

export default category