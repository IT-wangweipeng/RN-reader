// 推荐书籍
export const RECOMMEND_BOOK_INIT = 'RECOMMEND_BOOK_INIT'
export const RECOMMEND_BOOK_INIT_SUCCESS = 'RECOMMEND_BOOK_INIT_SUCCESS'
export const RECOMMEND_BOOK_INIT_FAILED = 'RECOMMEND_BOOK_INIT_FAILED'
// 已经加入书架的书
export const FAVORITES_BOOK_INIT = 'FAVORITES_BOOK_INIT'
export const FAVORITES_BOOK_INIT_SUCCESS = 'FAVORITES_BOOK_INIT_SUCCESS'
export const FAVORITES_BOOK_INIT_FAILED = 'FAVORITES_BOOK_INIT_FAILED'

// 同步书架
export const BOOK_SYNC_INIT = 'BOOK_SYNC_INIT'
export const BOOK_SYNC_INIT_SUCCESS = 'BOOK_SYNC_INIT_SUCCESS'
export const BOOK_SYNC_INIT_FAILED = 'BOOK_SYNC_INIT_FAILED'

// 编辑书架
export const UPDATE_BOOK = 'UPDATE_BOOK'

// 将book加入书架
export const ADD_BOOK_INIT = "ADD_BOOK_INIT"
export const ADD_BOOK_INIT_SUCCESS = 'ADD_BOOK_INIT_SUCCESS'
export const ADD_BOOK_INIT_FAILED = 'ADD_BOOK_INIT_FAILED'

//将book移出书架
export const DELETE_BOOK_INIT = "DELETE_BOOK_INIT"
export const DELETE_BOOK_INIT_SUCCESS = 'DELETE_BOOK_INIT_SUCCESS'
export const DELETE_BOOK_INIT_FAILED = 'DELETE_BOOK_INIT_FAILED'

// 增加阅读记录
export const SAVE_READ_RECORD_INIT = 'SAVE_READ_RECORD_INIT'
export const SAVE_READ_RECORD_SUCCESS = 'SAVE_READ_RECORD_SUCCESS'
export const SAVE_READ_RECORD_FAILED = 'SAVE_READ_RECORD_FAILED'

// 添加已读完的书
export const ADD_COMPLETED_BOOK_INIT = 'ADD_COMPLETED_BOOK_INIT'
export const ADD_COMPLETED_BOOK_SUCCESS = 'ADD_COMPLETED_BOOK_SUCCESS'
export const ADD_COMPLETED_BOOK_FAILED = 'ADD_COMPLETED_BOOK_FAILED'

// 获取已经读完书的个数
export const TOTAL_COMPLETED_BOOK_INIT = 'TOTAL_COMPLETED_BOOK_INIT'
export const TOTAL_COMPLETED_BOOK_SUCCESS = 'TOTAL_COMPLETED_BOOK_SUCCESS'
export const TOTAL_COMPLETED_BOOK_FAILED = 'TOTAL_COMPLETED_BOOK_FAILED'


export const recommendBookInit = payload => ({
  type: RECOMMEND_BOOK_INIT,
  payload
})

export const recommendBookInitSuccess = payload => ({
  type: RECOMMEND_BOOK_INIT_SUCCESS,
  payload
})

export const recommendBookInitFailed = payload => ({
  type: RECOMMEND_BOOK_INIT_FAILED,
  payload
})

export const favoriteBookInit = payload => ({
  type: FAVORITES_BOOK_INIT,
  payload,
})

export const favoriteBookInitSuccess = payload => ({
  type: FAVORITES_BOOK_INIT_SUCCESS,
  payload
})

export const favoriteBookInitFailed = payload => ({
  type: FAVORITES_BOOK_INIT_FAILED,
  payload
})

export const bookSyncInit = payload => ({
  type: BOOK_SYNC_INIT,
  payload,
})

export const bookSyncSuccess = payload => ({
  type: BOOK_SYNC_INIT_SUCCESS,
  payload
})

export const bookSyncFailed = payload => ({
  type: BOOK_SYNC_INIT_FAILED,
  payload
})

export const updateBooks = payload => ({
  type: UPDATE_BOOK,
  payload
})

// 将book加入书架
export const addBookInit = payload => ({
  type: ADD_BOOK_INIT,
  payload
})

export const addBookInitSuccess = payload => ({
  type: ADD_BOOK_INIT_SUCCESS,
  payload
})

export const addBookInitFailed = payload => ({
  type: ADD_BOOK_INIT_FAILED,
  payload
})

// 将book移出书架
export const deleteBookInit = payload => ({
  type: DELETE_BOOK_INIT,
  payload
})

export const deleteBookInitSuccess = payload => ({
  type: DELETE_BOOK_INIT_SUCCESS,
  payload
})

export const deleteBookInitFailed = payload => ({
  type: DELETE_BOOK_INIT_FAILED,
  payload
})

export const saveReadRecordInit = payload => ({
  type: SAVE_READ_RECORD_INIT,
  payload
})

export const saveReadRecordSuccess = payload => ({
  type: SAVE_READ_RECORD_SUCCESS,
  payload
})

export const saveReadRecordFailed = payload => ({
  type: SAVE_READ_RECORD_FAILED,
  payload
})

export const addCompletedBookInit = payload => ({
  type: ADD_COMPLETED_BOOK_INIT,
  payload
})

export const addCompletedBookSuccess = payload => ({
  type: ADD_COMPLETED_BOOK_SUCCESS,
  payload
})

export const addCompletedBookFailed = payload => ({
  type: ADD_COMPLETED_BOOK_FAILED,
  payload
})

export const totalCompletedBookInit = payload => ({
  type: TOTAL_COMPLETED_BOOK_INIT,
  payload
})

export const totalCompletedBookSuccess = payload => ({
  type: TOTAL_COMPLETED_BOOK_SUCCESS,
  payload
})

export const totalCompletedBookFailed = payload => ({
  type: TOTAL_COMPLETED_BOOK_FAILED,
  payload
})
