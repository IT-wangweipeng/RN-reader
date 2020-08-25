import {of, from, zip} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {CreditScoreDetailApi} from '../apis/Api'
import * as actions from '../actions/creditScoreAction'
import {showToast} from '../actions/toastAction'
import { getItem, setItem } from '../utils/AsyncStorageManager'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'

const creditScoreEpic = action$ => action$.pipe(
  ofType(actions.CREDIT_SCORE_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.date),
    (token, date) => ({token, date})),
  ),
  flatMap((it) => {
    const {token, date} = it
    return CreditScoreDetailApi(token, date)
  }),
  map(ret => {
    if (ret.status === 200) {
      return actions.creditScoreInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.creditScoreInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.creditScoreInitFailedAction()
    }
  })
)

const creditScoreLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.CREDIT_SCORE_LOAD_MORE),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.date),
    (token, date) => ({token, date})),
  ),
  flatMap((it) => {
    const {date, token} = it
    return CreditScoreDetailApi(token, date)
  }),
  map(ret => {
    if (ret.status === 200) {
      return actions.creditScoreLoadMoreAction(ret)
    } else {
      showToast(ret.message)
      return actions.creditScoreLoadMoreFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.creditScoreLoadMoreFailedAction()
    }
  })
)



export default combineEpics(creditScoreEpic, creditScoreLoadMoreEpic)
