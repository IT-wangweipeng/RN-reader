import {
  Platform,
} from 'react-native'

export const BookSchema = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: 'int',
    author: 'string',
    brief: 'string',
    cover: 'string',
    name: 'string',
    create_time: 'string',
    chapter_title: {type: 'string', default: ''},
    chapter_id: {type: 'int', default: 0},
    chapter_sort: {type: 'int', default: 0},
    timestamp: 'string?',
    icon_status: 'int?',
    complete_status: Platform.OS === 'ios' ? 'int?' : 'int',
    start_ad_ts: 'string',
    end_ad_ts: 'string',
    isCollected: 'bool',
    start_vip_ts: 'string',
    end_vip_ts: 'string',
  }
}

export const BookShelfSchema = {
  name: 'BookShelf',
  primaryKey: 'id',
  properties: {
    id: 'int',
    author: 'string',
    brief: 'string',
    cover: 'string',
    name: 'string',
    create_time: 'string',
    chapter_title: {type: 'string', default: ''},
    chapter_id: {type: 'int', default: 0},
    chapter_sort: {type: 'int', default: 0},
    timestamp: 'string?',
    icon_status: 'int?',
    complete_status: Platform.OS === 'ios' ? 'int?' : 'int',
    start_ad_ts: 'string',
    end_ad_ts: 'string',
    url: 'string?',
    book_type: {type: 'int', default: 1}, // 默认为普通图书
    start_vip_ts: 'string',
    end_vip_ts: 'string',
  }
}

