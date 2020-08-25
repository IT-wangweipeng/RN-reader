export const BOOK_CHAPTER_LIST_INIT = 'BOOK_CHAPTER_LIST_INIT'
export const BOOK_CHAPTER_LIST_SUCCESS = 'BOOK_CHAPTER_LIST_SUCCESS'
export const BOOK_CHAPTER_LIST_FAILED = 'BOOK_CHAPTER_LIST_FAILED'

export const bookChapterListInit = payload => ({
  type: BOOK_CHAPTER_LIST_INIT,
  payload,
})

export const bookChapterListInitSuccess = payload => ({
  type: BOOK_CHAPTER_LIST_SUCCESS,
  payload,
})

export const bookChapterListInitFailed = payload => ({
  type: BOOK_CHAPTER_LIST_FAILED,
  payload,
})
