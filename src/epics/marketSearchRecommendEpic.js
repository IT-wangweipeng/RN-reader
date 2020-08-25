import {map, flatMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {MarketSearchRecommendApi} from '../apis/Api'
import * as actions from '../actions/marketSearchRecommendAction'
import {showToast} from '../actions/toastAction'


const marketSearchRecommendEpic = action$ => action$.pipe(
  ofType(actions.MARKET_SEARCH_RECOMMEND_INIT),
  flatMap((it) => {
    return MarketSearchRecommendApi()
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.marketSearchRecommendInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.marketSearchRecommendInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.marketSearchRecommendInitFailed()
    }
  })
)


export default combineEpics(marketSearchRecommendEpic)
