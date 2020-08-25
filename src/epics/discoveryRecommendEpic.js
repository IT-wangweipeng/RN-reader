import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {BookDiscoveryRecommendApi} from '../apis/Api'
import * as actions from '../actions/discoveryRecommendAction'
import {showToast} from '../actions/toastAction'
import {from, of, zip} from "rxjs";


const discoveryRecommendEpic = action$ => action$.pipe(
  ofType(actions.DISCOVERY_RECOMMEND_INIT),
  mergeMap(action => zip(
    of(action.payload.id),
    id => ({
      id,
    }),
  )),
  flatMap((result) => {
    const {
      id,
    } = result
    return from(BookDiscoveryRecommendApi(id))
  }),
  map(ret => {
    console.log('discoveryRecommendEpic it ======== ', ret)
    if (ret.status === 200) {
      return actions.discoveryRecommendInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.discoveryRecommendInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.discoveryRecommendInitFailed()
    }
  })
)


export default combineEpics(discoveryRecommendEpic)
