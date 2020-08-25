import {
  AsyncStorage,
} from 'react-native'

export const setItem = async (key, value) => {
  try {
    const ret = await AsyncStorage.setItem(key, value)
    if (ret === null) {
      return true
    }
    return false
  } catch (error) {
    console.log('set item error: ', error)
  }
}

export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
    return null
  } catch (error) {
    console.log('get storage error: ', error)
  }
}

export const removeItem = async (key) => {
  try {
    const ret = await AsyncStorage.removeItem(key)
    console.log('removeItem ret=', ret)
    if (ret === null) {
      return true
    }
    return false
  } catch (error) {
    console.log('remove item error: ', error)
  }
}
