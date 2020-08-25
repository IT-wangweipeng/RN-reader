import Realm from 'realm'
import {BookSchema, BookShelfSchema} from './BookModel'
import {Config} from '../config/Config'

export const realm = new Realm({schema: [BookSchema, BookShelfSchema], schemaVersion: Config.db.version});

// Book表存放阅读记录
export const queryBooks = () => {
  return realm.objects('Book')
}

export const deleteBooks = () => {
  try {
    realm.write(() => {
      let allBooks = queryBooks()
      realm.delete(allBooks);
    })
  } catch (error) {
    console.log('delete books error: ', error)
  }
}

export const deleteBook = (book) => {
  try {
    const deleteBook = queryBooks().filtered(`id == ${book.id}`)
    if (deleteBook) {
      realm.write(() => {
        realm.delete(deleteBook)
      })
    }
  } catch (error) {
    console.log('delete book error: ', error)
  }
}


export const insertBook = (book) => {
  try {
    console.log('yy insertBook book=', book)
    realm.write(() => {
      realm.create('Book', {
        id: book.id,
        author: book.author,
        brief: book.brief,
        cover: book.cover,
        name: book.name,
        create_time: book.create_time,
        chapter_title: book.chapter_title,
        chapter_id: book.chapter_id,
        chapter_sort: book.chapter_sort,
        timestamp: book.timestamp,
        icon_status: book.icon_status,
        complete_status: book.complete_status,
        start_ad_ts: book.start_ad_ts,
        end_ad_ts: book.end_ad_ts,
        isCollected: book.isCollected,
        start_vip_ts: book.start_vip_ts,
        end_vip_ts: book.end_vip_ts,
      })
    })
  } catch (error) {
    console.log('insert book error: ', error)
  }
}

export const updateBook = (book) => {
  try {
    realm.write(() => {
      realm.create('Book', {
        id: book.id,
        author: book.author,
        brief: book.brief,
        cover: book.cover,
        name: book.name,
        create_time: book.create_time,
        chapter_title: book.chapter_title,
        chapter_id: book.chapter_id,
        chapter_sort: book.chapter_sort,
        timestamp: book.timestamp,
        icon_status: book.icon_status,
        complete_status: book.complete_status,
        start_ad_ts: book.start_ad_ts,
        end_ad_ts: book.end_ad_ts,
        isCollected: book.isCollected,
        start_vip_ts: book.start_vip_ts,
        end_vip_ts: book.end_vip_ts,
      }, true)
    })
  } catch (error) {
    console.log('update book error: ', error)
  }
}


// BookShelf表存放书架
export const queryShelfBooks = () => {
  return realm.objects('BookShelf')
}

export const insertShelfBook = (book) => {
  try {
    realm.write(() => {
      realm.create('BookShelf', {
        id: book.id,
        author: book.author,
        brief: book.brief,
        cover: book.cover,
        name: book.name,
        create_time: book.create_time,
        chapter_title: book.chapter_title,
        chapter_id: book.chapter_id,
        chapter_sort: book.chapter_sort,
        timestamp: book.timestamp,
        icon_status: book.icon_status,
        complete_status: book.complete_status,
        start_ad_ts: book.start_ad_ts,
        end_ad_ts: book.end_ad_ts,
        book_type: book.book_type,
        url: book.url,
        start_vip_ts: book.start_vip_ts,
        end_vip_ts: book.end_vip_ts,
      })
    })
  } catch (error) {
    console.log('insert shelfbook error: ', error)
  }
}

export const updateBookShelf = (book) => {
  try {
    realm.write(() => {
      realm.create('BookShelf', {
        id: book.id,
        author: book.author,
        brief: book.brief,
        cover: book.cover,
        name: book.name,
        create_time: book.create_time,
        chapter_title: book.chapter_title,
        chapter_id: book.chapter_id,
        chapter_sort: book.chapter_sort,
        timestamp: book.timestamp,
        icon_status: book.icon_status,
        complete_status: book.complete_status,
        start_ad_ts: book.start_ad_ts,
        end_ad_ts: book.end_ad_ts,
        book_type: book.book_type,
        url: book.url,
        start_vip_ts: book.start_vip_ts,
        end_vip_ts: book.end_vip_ts,
      }, true)
    })
  } catch (error) {
    console.log('update bookShelf error: ', error)
  }
}


// --------
// 查询
export const query = (obj) => {
  return realm.objects(obj)
}

// 删除所有数据
export const deleteAll = (obj) => {
  try {
    realm.write(() => {
      let all = query(obj)
      realm.delete(all);
    })
  } catch (error) {
    console.log('delete books error: ', error)
  }
}
