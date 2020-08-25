import {of, zip, from} from 'rxjs'
import {map, flatMap, mergeMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {searchRecommendApi} from '../apis/Api'
import * as actions from '../actions/searchRecommendAction'
import {showToast} from '../actions/toastAction'


const searchRecommendEpic = action$ => action$.pipe(
  ofType(actions.SEARCH_RECOMMEND_INIT),
  mergeMap(action => zip(
    of(action.payload.sex),
    sex => ({
      sex,
    }),
  )),
  flatMap((result) => {
    const {
      sex,
    } = result
    return from(searchRecommendApi(sex))
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.searchRecommendInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.searchRecommendInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.searchRecommendInitFailed()
    }
  })
)


export default combineEpics(searchRecommendEpic)
