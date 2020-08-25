import {of, from, zip} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {SubmitReadPreferenceApi} from '../apis/Api'
import * as actions from '../actions/submitPreferenceAction'
import {showToast} from '../actions/toastAction'
import { getItem, setItem } from '../utils/AsyncStorageManager'
import { KEY_TOKEN, KEY_RECOMMEND_BOOK, KEY_FIRST_RECOMMEND } from '../utils/AsyncStorageKey'


const submitPreferenceEpic = action$ => action$.pipe(
  ofType(actions.SUBMIT_PREFERENCE_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.category_ids),
    (token, category_ids) => ({token, category_ids})),
  ),
  flatMap((it) => {
    console.log('category_ids ==== ', it)
    const {token, category_ids} = it
    return SubmitReadPreferenceApi(token, category_ids)
  }),
  map(ret => {
    console.log('category_ids ret ======= ', ret)
    if (ret.status === 200) {
      showToast('保存成功')
      return actions.submitPreferenceSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.submitPreferenceFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.submitPreferenceFailedAction()
    }
  })
)


export default combineEpics(submitPreferenceEpic)
