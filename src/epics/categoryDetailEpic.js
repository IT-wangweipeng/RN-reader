import {of, from, forkJoin} from 'rxjs'
import {map, flatMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {CategoryDetailApi, CategoryConfigApi} from '../apis/Api'
import * as actions from '../actions/categoryDetailAction'
import {showToast} from '../actions/toastAction'


const bookCategoryEpic = action$ => action$.pipe(
  ofType(actions.CATEGORY_DETAIL_INIT),
  flatMap((it) => {
    const {sex, id, tag_id, composite, state, words, start} = it.payload
    return forkJoin(CategoryDetailApi(sex, id, tag_id, composite, state, words, start), CategoryConfigApi(id))
  }),
  map(ret => {
    const categoryDetail = ret[0]
    const categoryConfig = ret[1]
    if (categoryDetail.status === 200 && categoryConfig.status === 200) {
      return actions.categoryDetailInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.categoryDetailInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.categoryDetailInitFailed()
    }
  })
)

const bookCategoryLoadMoreEpic = action$ => action$.pipe(
  ofType(actions.CATEGORY_DETAIL_LOAD_MORE_INIT),
  flatMap((it) => {
    console.log('categoryLoadMoreInit ==== ', it)
    const {sex, id, tag_id, composite, state, words, start} = it.payload
    return from(CategoryDetailApi(sex, id, tag_id, composite, state, words, start))
  }),
  map(ret => {
    if (ret.status === 200) {
      return actions.categoryLoadMoreSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.categoryLoadMoreFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.categoryLoadMoreFailed()
    }
  })
)


export default combineEpics(bookCategoryEpic, bookCategoryLoadMoreEpic)
