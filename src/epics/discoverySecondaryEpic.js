import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {BookDiscoverySecondaryApi} from '../apis/Api'
import * as actions from '../actions/discoverySecondaryAction'
import {showToast} from '../actions/toastAction'
import {from, of, zip} from "rxjs";


const discoverySecondaryEpic = action$ => action$.pipe(
  ofType(actions.DISCOVERY_SECONDARY_INIT),
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
    return from(BookDiscoverySecondaryApi(id))
  }),
  map(ret => {
    console.log('discoverySecondaryEpic it ======== ', ret)
    if (ret.status === 200) {
      return actions.discoverySecondaryInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.discoverySecondaryInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.discoverySecondaryInitFailed()
    }
  })
)


export default combineEpics(discoverySecondaryEpic)
