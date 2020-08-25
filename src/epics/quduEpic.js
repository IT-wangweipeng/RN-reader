import {of, zip, from} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {QuduIndexApi} from '../apis/Api'
import * as actions from '../actions/quduAction'
import {showToast} from '../actions/toastAction'

const quduEpic = action$ => action$.pipe(
  ofType(actions.QUDU_INIT),
  mergeMap(action => zip(
    of(action.payload.sex),
    (sex) => ({
      sex,
    }),
  )),
  flatMap((result) => {
    const {
      sex,
    } = result

      console.log('yy bookMarketEpic sex=',sex)
      return from(QuduIndexApi(sex))
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.quduInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.quduInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.quduInitFailed()
    }
  })
)


export default combineEpics(quduEpic)
