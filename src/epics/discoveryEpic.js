import {map, flatMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {BookDiscoveryApi} from '../apis/Api'
import * as actions from '../actions/discoveryAction'
import {showToast} from '../actions/toastAction'


const discoveryEpic = action$ => action$.pipe(
  ofType(actions.DISCOVERY_INIT),
  flatMap((it) => {
    return BookDiscoveryApi()
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.discoveryInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.discoveryInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.discoveryInitFailed()
    }
  })
)


export default combineEpics(discoveryEpic)
