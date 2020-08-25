import {of, zip, from} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {UpdateUserInfoApi} from '../apis/Api'
import * as actions from '../actions/userAction'
import {showToast} from '../actions/toastAction'
import { KEY_TOKEN } from '../utils/AsyncStorageKey'
import {getItem} from '../utils/AsyncStorageManager'

const updateUserEpic = action$ => action$.pipe(
  ofType(actions.UPDATE_USER_INFO_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.id),
    of(action.payload.sex),
    of(action.payload.nickname),
    of(action.payload.pic),
    of(action.payload.birthday),
    (token, id, sex, nickname, pic, birthday) => ({
      token,
      id,
      sex,
      nickname,
      pic,
      birthday
    }),
  )),
  flatMap((result) => {
    console.log('result =====================', result)
    const {
      token,
      id,
      sex,
      nickname,
      pic,
      birthday
    } = result
    return from(UpdateUserInfoApi(token, id, sex, nickname, pic, birthday))
  }),
  map(ret => {
    console.log('updateUserEpic ======== ', ret)
    if (ret.status === 200) {
      return actions.updateUserSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.updateUserFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.updateUserFailed()
    }
  })
)


export default combineEpics(updateUserEpic)
