import {of, from, forkJoin} from 'rxjs'
import {map, flatMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {BookCategoryApi, UserPreferenceApi} from '../apis/Api'
import * as actions from '../actions/categoryAction'
import {showToast} from '../actions/toastAction'


const bookCategoryEpic = action$ => action$.pipe(
  ofType(actions.CATEGORY_INIT),
  flatMap((it) => {
    return BookCategoryApi()
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.categoryInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.categoryInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.categoryInitFailed()
    }
  })
)

const readPreferenceEpic = action$ => action$.pipe(
  ofType(actions.READ_PREFERENCE_INIT),
  flatMap((it) => {
    const {token} = it.payload
    return forkJoin(BookCategoryApi(), UserPreferenceApi(token))
  }),
  map(ret => {
    const categorys = ret[0]
    const preferences = ret[1]
    if (categorys.status === 200 && preferences.status === 200) {
      return actions.readPreferenceSuccessInit({
        category: categorys.data,
        preference: preferences.data
      })
    } else {
      showToast(ret.message)
      return actions.readPreferenceFailedInit()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.readPreferenceFailedInit()
    }
  })
)


export default combineEpics(bookCategoryEpic, readPreferenceEpic)
