import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {bookMarketChangeApi} from '../apis/Api'
import * as actions from '../actions/discoveryRecommendChangeAction'
import {showToast} from '../actions/toastAction'
import {from, of, zip} from "rxjs";
import {getItem} from "../utils/AsyncStorageManager";
import {KEY_TOKEN} from "../utils/AsyncStorageKey";


const discoveryRecommendChangeEpic = action$ => action$.pipe(
  ofType(actions.DISCOVERY_RECOMMEND_CHANGE_INIT),
  mergeMap(action => zip(
    of(action.payload.id),
    of(action.payload.sex),
    from(getItem(KEY_TOKEN)),
    (id, sex, token) => ({
      id, sex, token
    }),
  )),
  flatMap((result) => {
    const {
      id, sex, token
    } = result
    return from(bookMarketChangeApi(id, sex, token))
  }),
  map(ret => {
    console.log('discoveryRecommendChangeEpic it ======== ', ret)
    if (ret.status === 200) {
      return actions.discoveryRecommendChangeInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.discoveryRecommendChangeInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.discoveryRecommendChangeInitFailed()
    }
  })
)


export default combineEpics(discoveryRecommendChangeEpic)
