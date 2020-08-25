import {map, flatMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {BookshelfBannerApi} from '../apis/Api'
import * as actions from '../actions/searchBannerAction'
import {showToast} from '../actions/toastAction'


const searchBannerEpic = action$ => action$.pipe(
  ofType(actions.SEARCH_BANNER_INIT),
  flatMap((it) => {
    return BookshelfBannerApi(12)
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.searchBannerInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.searchBannerInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.searchBannerInitFailed()
    }
  })
)


export default combineEpics(searchBannerEpic)
