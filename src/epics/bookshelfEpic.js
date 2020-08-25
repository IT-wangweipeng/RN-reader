import {
  DeviceEventEmitter,
} from 'react-native'

import {of, from, zip} from 'rxjs'
import {map, flatMap, catchError, mergeMap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {
  RecommendBookApi,
  FavoriteBooksApi,
  BookSyncApi,
  AddToBookshelfApi,
  DeleteFromBookShelfApi,
  SaveReadRecordApi,
  AddCompleteBookApi,
  TotalCompleteBookApi,
} from '../apis/Api'
import * as actions from '../actions/bookshelfAction'
import {showToast} from '../actions/toastAction'
import { getItem, setItem } from '../utils/AsyncStorageManager'
import { KEY_TOKEN, KEY_RECOMMEND_BOOK, KEY_FIRST_RECOMMEND } from '../utils/AsyncStorageKey'
import { deleteAll, realm } from '../model/BookModelManager'

const recommendBookEpic = action$ => action$.pipe(
  ofType(actions.RECOMMEND_BOOK_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.sex),
    (token, sex) => ({token, sex})),
  ),
  flatMap((it) => {
    const {sex, token} = it
    return RecommendBookApi(sex, token)
  }),
  map(ret => {
    if (ret.status === 200) {
      // setItem(KEY_RECOMMEND_BOOK, JSON.stringify(ret.data))
      setItem(KEY_FIRST_RECOMMEND, 'true')
      this._storeRecommendData(ret.data)
      return actions.recommendBookInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.recommendBookInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.recommendBookInitFailed()
    }
  })
)

// 存储推荐数据
_storeRecommendData = (books) => {
  if (books.length > 0) {
    try {
      realm.write(() => {
        books.map(item => {
          if (!item.end) {
            realm.create('BookShelf', {...item})
          }
        })
      });
      DeviceEventEmitter.emit('bookShelfChange')
    } catch (e) {
      console.log("Error on create BookShelf e=",e);
    }
  }
}

_storeFavoriteBook = (books) => {
  if (books.length > 0) {
    try {
      realm.write(() => {
        books.map(item => {
          if (!item.end) {
            realm.create('BookShelf', {...item})
          }
        })
      });
      DeviceEventEmitter.emit('bookShelfChange')
    } catch (e) {
      console.log("Error on create BookShelf e=",e);
    }
  }
}


const favoriteBooksEpic = action$ => action$.pipe(
  ofType(actions.FAVORITES_BOOK_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    (token) => ({token})),
  ),
  flatMap((it) => {
    console.log('tokens ======== ', it)
    return FavoriteBooksApi(it.token)
  }),
  map(ret => {
    if (ret.status === 200) {
      console.log('favorite ====== ', ret)
      deleteAll('BookShelf')
      if (ret && ret.data && ret.data.list && ret.data.list.length > 0) {
        this._storeFavoriteBook(ret.data.list)
      }
      return actions.favoriteBookInitSuccess(ret)
    } else {
      showToast('获取失败')
      return actions.favoriteBookInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.favoriteBookInitFailed()
    }
  })
)

const bookSyncEpic = action$ => action$.pipe(
  ofType(actions.BOOK_SYNC_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.type),
    of(action.payload.ts),
    of(action.payload.list),
    (token, type, ts, list) => ({token, type, ts, list})),
  ),
  flatMap((it) => {
    console.log('it ======== ', it)
    const {token, type, ts, list} = it
    return BookSyncApi(token, type, ts, list)
  }),
  map(ret => {
    console.log('sync ret ======== ', ret)
    if (ret.status === 200) {
      return actions.bookSyncSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.bookSyncFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.bookSyncFailed()
    }
  })
)

const addBookEpic = action$ => action$.pipe(
  ofType(actions.ADD_BOOK_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.book_id),
    of(action.payload.chapter_id),
    of(action.payload.chapter_sort),
    (token, book_id, chapter_id, chapter_sort) => ({token, book_id, chapter_id, chapter_sort})),
  ),
  flatMap((it) => {
    console.log('addBookEpic ======== ', it)
    const {token, book_id, chapter_id, chapter_sort} = it
    return AddToBookshelfApi(token, book_id, chapter_id, chapter_sort)
  }),
  map(ret => {
    console.log('addBookEpic ret ======== ', ret)
    if (ret.status === 200) {
      return actions.addBookInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.addBookInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.addBookInitFailed()
    }
  })
)

const deleteBookEpic = action$ => action$.pipe(
  ofType(actions.DELETE_BOOK_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.book_id),
    (token, book_id) => ({token, book_id})),
  ),
  flatMap((it) => {
    console.log('deleteBookEpic ======== ', it)
    const {token, book_id} = it
    return DeleteFromBookShelfApi(token, book_id)
  }),
  map(ret => {
    console.log('deleteBookEpic ret ======== ', ret)
    if (ret.status === 200) {
      return actions.deleteBookInitSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.deleteBookInitFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.deleteBookInitFailed()
    }
  })
)


const saveReadRecordEpic = action$ => action$.pipe(
  ofType(actions.SAVE_READ_RECORD_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.book_id),
    of(action.payload.chapter_id),
    of(action.payload.chapter_sort),
    (token, book_id, chapter_id, chapter_sort) => ({token, book_id, chapter_id, chapter_sort})),
  ),
  flatMap((it) => {
    console.log('saveReadRecord ======== ', it)
    const {token, book_id, chapter_id, chapter_sort} = it
    return SaveReadRecordApi(token, book_id, chapter_id, chapter_sort)
  }),
  map(ret => {
    console.log('saveReadRecord ret ======== ', ret)
    if (ret.status === 200) {
      return actions.saveReadRecordSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.saveReadRecordFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.saveReadRecordFailed()
    }
  })
)

const addCompletedBookEpic = action$ => action$.pipe(
  ofType(actions.ADD_COMPLETED_BOOK_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    of(action.payload.book_id),
    (token, book_id) => ({token, book_id})),
  ),
  flatMap((it) => {
    console.log('AddCompleteBookApi ======== ', it)
    const {token, book_id} = it
    return AddCompleteBookApi(token, book_id)
  }),
  map(ret => {
    console.log('AddCompleteBookApi ret ======== ', ret)
    if (ret.status === 200) {
      return actions.addCompletedBookSuccess({
        addCompleteSuccess: true
      })
    } else {
      showToast(ret.message)
      return actions.addCompletedBookFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.addCompletedBookFailed()
    }
  })
)

const totalCompletedBookEpic = action$ => action$.pipe(
  ofType(actions.TOTAL_COMPLETED_BOOK_INIT),
  mergeMap(action => zip(
    from(getItem(KEY_TOKEN)),
    (token) => ({token})),
  ),
  flatMap((it) => {
    console.log('TotalCompleteBookApi ======== ', it)
    const {token} = it
    return TotalCompleteBookApi(token)
  }),
  map(ret => {
    console.log('TotalCompleteBookApi ret ======== ', ret)
    if (ret.status === 200) {
      return actions.totalCompletedBookSuccess(ret)
    } else {
      showToast(ret.message)
      return actions.totalCompletedBookFailed()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.totalCompletedBookFailed()
    }
  })
)

export default combineEpics(recommendBookEpic, favoriteBooksEpic, bookSyncEpic, addBookEpic, deleteBookEpic, saveReadRecordEpic, addCompletedBookEpic, totalCompletedBookEpic)
