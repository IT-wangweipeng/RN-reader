import {Config} from '../config/Config'
import * as APP_CONFIG from "./ApiConfig";

export const API_DEV = 'http://10.20.70.219'
export const HOST_DEV = `${API_DEV}/read/4/${Config.channel}`

export const API_PREFIX_1 = 'https://read.1bookreader.com'
export const API_PREFIX_2 = 'https://read.wzbookreader.com'
export const API_PREFIX_PRODUCTION_1 = `${API_PREFIX_1}/read/4/${Config.channel}`
export const API_PREFIX_PRODUCTION_2 = `${API_PREFIX_2}/read/4/${Config.channel}`


const postApi = (path, params) => {
  console.log('--------------- POST ----------------')
  console.log('path = ', path)
  console.log('params = ', JSON.stringify(params))
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      Connection: 'close',
    },
    body: JSON.stringify(params),
  })
    .then(response => response.json())
    .then((ret) => {
      console.log('Api response：', ret)
      return ret
    })
    .catch((error) => {
      console.log('Api ERROR: ', error)
      console.log('Api ==== ', path)
      return {
        status: -1,
        message: '网络连接失败，请检查网络状态',
      }
    })
}

const getApi = (path, params) => {
  console.log('--------------- GET ----------------')
  let query = ''
  for (const key in params) {
    query = `${query}${key}=${params[key]}&`
  }
  query = query.substring(0, query.length - 1)
  const url = `${path}?${query}`
  console.log('path = ', url)
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      Connection: 'close',
    },
  })
    .then(response => response.json())
    .then((ret) => {
      console.log('Api response：', ret)
      return ret
    })
    .catch((error) => {
      console.log('Api ERROR: ', error)
      console.log('Api ==== ', path)
      return {
        status: -1,
        message: "网络连接失败，请检查网络状态",
      }
    })
}

const whichApi = () => {
  if (Config.isProduction) {
    const instance = APP_CONFIG.ApiConfig.getInstance()
    console.log('instance --------- ', instance)
    return instance.ip
  }
  return HOST_DEV
}

// 书籍分类
export const BookCategoryApi = () => {
  return getApi(`${whichApi()}/category`, {})
}

// 书城首页
export const bookMarketApi = (sex) => {
  return getApi(`${whichApi()}/index/${sex}`, {})
}

// 书城首页，主编推荐的内容根据用户选择的偏好获取
export const bookMarketWithTokenApi = (sex, token) => {
  return postApi(`${whichApi()}/index/${sex}`, {
    token,
  })
}


// // 书城Banner
// export const bookMarketBannerApi = () => {
//   return getApi(`${whichApi()}/banner`, {})
// }

// 书城换一换
export const bookMarketChangeApi = (id, sex, token) => {
  return postApi(`${whichApi()}/module/refresh/${id}`, {
    sex,
    token,
  })
}

// 书城查看更多
export const viewMoreApi = (id,size,start) => {
  return getApi(`${whichApi()}/module/list/${id}/${size}/${start}`, {})
}

// 书城icon(sex: 1男频,2女频,3精选,4图书)
export const marketIconApi = (sex) => {
  return getApi(`${whichApi()}/index/icon/${sex}`)
}

// 书城人气/收藏排行页(type：1收藏，2人气)
export const bookRankApi = (sex,type,size,start) => {
  return getApi(`${whichApi()}/ranking/${sex}/${type}/${size}/${start}`, {})
}

// 书城完本页(sex: 1男频，2女频，3未知，4图书)
export const completeBookApi = (sex,size,start) => {
  return getApi(`${whichApi()}/book/complete/${sex}/${size}/${start}`, {})
}

// 书城连载页(sex: 1男频，2女频，3未知，4图书)
export const serializeBookApi = (sex,type,size,start) => {
  return getApi(`${whichApi()}/book/uncomplete/rank/${sex}/${type}/${size}/${start}`, {})
}

// 书城短篇页
export const shortessayBookApi = (sex,size,start) => {
  return getApi(`${whichApi()}/book/shortessay/${sex}/${size}/${start}`, {})
}

// 书城icon下方主编力荐上方可编辑模块
export const marketEditableModelApi = (sex) => {
  return getApi(`${whichApi()}/index/editablemodel/${sex}`)
}

// 书籍详情
export const bookDetailApi = (bookId) => {
  return getApi(`${whichApi()}/book/${bookId}`, {})
}

// 统计书籍收藏(POST方法)
export const bookFavoritesApi = (id) => {
  return postApi(`${whichApi()}/book/favorites/counter`, {
    id: id,
  })
}

// 统计书籍阅读
export const bookCounterApi = (bookId) => {
  return getApi(`${whichApi()}/book/counter/${bookId}`, {})
}

// 相关推荐
export const bookRelatedApi = (bookId) => {
  return getApi(`${whichApi()}/book/related/${bookId}`, {})
}

// 章节列表(order: 1是正序，2是倒序)
export const bookChapterListApi = (bookId, order) => {
  return getApi(`${whichApi()}/book/chapter/list/${bookId}/${order}`, {})
}

// 单词搜索
export const searchWordApi = (word) => {
  return getApi(`${whichApi()}/search/word/${word}`, {})
}

// 搜索
export const searchApi = (token, start, size, keyword) => {
  return postApi(`${whichApi()}/search/${size}/${start}/${keyword}`, {
    token,
  })
}

// 搜索推荐
export const searchRecommendApi = (sex) => {
  return getApi(`${whichApi()}/search/recommend/${sex}`, {})
}

// 登录
export const LoginApi = (phone, code) => {
  return postApi(`${whichApi()}/login`, {
    phone,
    code
  })
}

// 自动登录
export const AutoLoginApi = (token) => {
  return postApi(`${whichApi()}/login/auto`, {
    token
  })
}

// 获取验证码
export const CaptchApi = (phone) => {
  return postApi(`${whichApi()}/phone/send`, {
    phone,
  })
}

// 第三方登录
// type: 1:微信 2:QQ
export const ThirdLoginApi = (openid, wechat_openid, nickname, type, avatar) => {
  return postApi(`${whichApi()}/third/login`, {
    openid,
    wechat_openid,
    nickname,
    type,
    avatar,
  })
}

// 退出登录
export const LogoutApi = (token) => {
  return postApi(`${whichApi()}/login/out`, {
    token,
  })
}

// 获取用户信息
export const GetUserInfoApi = (token) => {
  return postApi(`${whichApi()}/user/info`, {
    token,
  })
}

// 更新用户基本信息
export const UpdateUserInfoApi = (token, id, sex, nickname, pic, birthday) => {
  return postApi(`${whichApi()}/user/update/info`, {
    token,
    id,
    nickname,
    sex,
    pic,
    birthday
  })
}

// 更新第三方用户基本信息
// type: 1:微信 2:QQ
export const UpdateThirdUserInfoApi = (token, id, openid, nickname, type) => {
  return postApi(`${whichApi()}/user/update/third`, {
    token,
    id,
    openid,
    nickname,
    type,
  })
}

// 推荐书籍
export const RecommendBookApi = (sex, token) => {
  return postApi(`${whichApi()}/book/bookrack/recommend/${sex}`, {
    token: token || '',
  })
}

// 书架
export const FavoriteBooksApi = (token) => {
  return postApi(`${whichApi()}/book/favorites/info`, {
    token
  })
}

// 书籍同步
/*
*
token：授权码
type：类型 （1收藏 2阅读时长）
ts：阅读时间（单位秒）,如果是阅读时长同步，此参数必填
list：收藏夹的列表（数据格式:{"book_id":0,"chapter_id":0,"chapter_sort",0}）,如果是收藏夹同步，此参数必填
* */
export const BookSyncApi = (token, type, ts, list) => {
  return postApi(`${whichApi()}/book/favorites/sync`, {
    token,
    type,
    ts,
    list
  })
}

// 分类详情
export const CategoryDetailApi = (sex, id, tag_id, composite, state, words, start) => {
  return postApi(`${whichApi()}/category/list/${sex}/${id}`, {
    tag_id,
    composite,
    state,
    words,
    start,
    size: 10,
  })
}

// 分类条件查询
export const CategoryConfigApi = (id) => {
  return getApi(`${whichApi()}/category/config/${id}`)
}

//将book加入书架
export const AddToBookshelfApi = (token, book_id, chapter_id, chapter_sort) => {
  return postApi(`${whichApi()}/book/favorites/add`, {
    token,
    book_id,
    chapter_id,
    chapter_sort
  })
}

//将book移除书架
export const DeleteFromBookShelfApi = (token, book_id) => {
  return postApi(`${whichApi()}/book/favorites/delete`, {
    token,
    book_id
  })
}

//意见反馈
export const FeedbackApi = (contact, contents) => {
  return postApi(`${whichApi()}/feedback`, {
    contact,
    contents
  })
}

// 启动页弹窗
export const launcherAlertWindowApi = (token) => {
  return postApi(`${whichApi()}/launcher/alertwindow`, {token})
}

// 书城发现模块一级页面
export const BookDiscoveryApi = () => {
  return getApi(`${whichApi()}/discovery`, {})
}

// 书城专题模块，带size参数，最大只能返回5个
export const MarketDiscoveryApi = (size) => {
  return getApi(`${whichApi()}/discovery/${size}`, {})
}

// 书城发现模块二级页面上半区获取书籍/作者信息
export const BookDiscoverySecondaryApi = (id) => {
  return getApi(`${whichApi()}/discovery/secondary/${id}`, {})
}

// 书城发现模块二级页面下半区获取书籍/作者信息
export const BookDiscoveryRecommendApi = (id) => {
  return getApi(`${whichApi()}/discovery/recommend/${id}`, {})
}

// 保存阅读偏好设置
export const SubmitReadPreferenceApi = (token, category_ids) => {
  return postApi(`${whichApi()}/user/preference/add`, {
    token,
    category_ids
  })
}

// 获取用户偏好
export const UserPreferenceApi = (token) => {
  return postApi(`${whichApi()}/user/preference`, {
    token
  })
}

// 书架banner
// 1：精选Banner，6：书架Banner， 4：男频Banner， 5：女频Banner, 9:图书banner, 12:serach页面书荒banner
export const BookshelfBannerApi = (position) => {
  return getApi(`${whichApi()}/banner/${position}`)
}

// 书架换一换随机推荐
export const BookshelfRecommendRefreshApi = (size) => {
  return getApi(`${whichApi()}/random/search/${size}`)
}

// 小喇叭
export const BookshelfHornApi = () => {
  return getApi(`${whichApi()}/horn`)
}

// 书城搜索推荐内容
export const MarketSearchRecommendApi = () => {
  return getApi(`${whichApi()}/search/content`)
}

// 保存用户阅读记录
export const SaveReadRecordApi = (token, book_id, chapter_id, chapter_sort) => {
  return postApi(`${whichApi()}/user/read/record/add`, {
    token,
    book_id,
    chapter_id,
    chapter_sort,
  })
}

// 添加已经读完的书
export const AddCompleteBookApi = (token, book_id) => {
  return postApi(`${whichApi()}/user/read/complete/add`, {
    token,
    book_id,
  })
}

export const TotalCompleteBookApi = (token) => {
  return postApi(`${whichApi()}/user/read/complete/total`, {
    token,
  })
}

// 连载书籍更新状态
export const SerialBookUpdateApi = (book_ids, sex) => {
  return postApi(`${whichApi()}/book/updatestate/${sex}`, {
    book_ids,
    sex
  })
}

// 小浮窗
export const FloatWindowApi = (sex, position, token) => {
  return postApi(`${whichApi()}/user/smallbuoy/${sex}/${position}`, {token})
}

// 热豆明细
export const CreditScoreDetailApi = (token, date) => {
  return postApi(`${whichApi()}/user/hotbens/detaillog/${10}`, {
    token,
    date,
  })
}

// 我的热豆
export const HotBeansApi = (token) => {
  return postApi(`${whichApi()}/user/hotbeans`, {
    token,
  })
}

// 热豆收入或支出
// 热豆类型
// 1 签到；
// 2 新手首次登陆；
// 3 新手收藏书籍；
// 4 新手答题；
// 5 日常看书30分；
// 6 日常看书60分；
// 7 日常 看书120分；
// 8 日常看广告；
// 9 日常分享；
// 10 兑换688,
// 11 兑换1288；
// 12 兑换8888
// 13 玩游戏得热豆
// 15 评论加热豆;
// 16 点赞加热豆

// 热豆类型 1签到，8日常看广告（新版看视频），9日常分享，15评论加热豆，16点赞加热豆，19日常邀请好友， 27签到后看视频
export const HotBeansPaymentApi = (token, hotbeans_type) => {
  return postApi(`${whichApi()}/user/hotbens/payment`, {
    token,
    hotbeans_type,
  })
}

// 用户读完书列表
export const CompletedBookApi = (token) => {
  return postApi(`${whichApi()}/user/read/complete/list`, {
    token,
  })
}

// 展示用户阅读时长
export const ReadTimeApi = (token, size, start) => {
  return postApi(`${whichApi()}/user/readts/display/${size}/${start}`, {
    token,
  })
}

// 书籍更新通知
export const NotificationApi = (token) => {
  return postApi(`${whichApi()}/user/book/update/notify`, {
    token,
  })
}

// 删除通知
export const DeleteNotificationApi = (token, book_ids) => {
  return postApi(`${whichApi()}/user/book/notify/delete`, {
    token,
    book_ids,
  })
}

// 获取小红点儿
export const NotificationTipsApi = (token, type) => {
  return postApi(`${whichApi()}/user/book/notify/newreddot`, {
    token,
    type
  })
}

// 趣读首页
export const QuduIndexApi = (sex) => {
  return getApi(`${whichApi()}/relax/read/index/${sex}`)
}

// 书架游戏
export const BookshelfGameApi = (sex, size) => {
  return getApi(`${whichApi()}/bookrack/games/${sex}/${size}`)
}


// 书籍想法列表
// types: 1 按时间排序  2 按点赞排序
export const BookCommentApi = (book_id, types, start, size, token) => {
  return postApi(`${whichApi()}/user/book/comments/${start}/${size}`, {
    token,
    book_id,
    types,
  })
}

// 添加书籍想法
export const PostBookCommentApi = (token, book_id, comment) => {
  return postApi(`${whichApi()}/user/book/comments/add`, {
    token,
    book_id,
    comment,
  })
}

// 添加评论
// token 口令
// comment ： 评论内容
// comment_id :  书籍想法ID (require)
// reply_id： 被评论ID（评论想法时传comment_id，评论其他评论时传reply_id）
// book_id:  书籍ID
// types： 1 回复书籍想法  2 回复其他人的评论
export const ReplyApi = (token, comment, comment_id, reply_id, book_id, types) => {
  return postApi(`${whichApi()}/user/book/comments/reply/add`, {
    token,
    comment,
    comment_id,
    reply_id,
    book_id,
    types,
  })
}


// 点赞
// comment_id : 书籍想法ID
// reply_id： 被点赞评论ID（评论想法时传comment_id，评论其他评论时传reply_id）
// types： 1 书籍评论点赞  2 回复点赞
export const LikeApi = (token, reply_id, comment_id, types) => {
  return postApi(`${whichApi()}/user/book/comments/praise/add`, {
    token,
    reply_id,
    comment_id,
    types,
  })
}

// 取消点赞
// reply_id: 取消点赞评论ID
// types: 1 书籍想法取消点赞  2 回复取消点赞
export const DislikeApi = (token, reply_id, types) => {
  return postApi(`${whichApi()}/user/book/comments/praise/del`, {
    token,
    reply_id,
    types,
  })
}

// 删除书籍想法
// comment_ids: Array
export const DeleteBookCommentApi = (token, comment_ids) => {
  return postApi(`${whichApi()}/user/book/comments/del`, {
    token,
    comment_ids,
  })
}

// 删除评论
// reply_ids: Array
export const DeleteCommentApi = (token, reply_ids) => {
  return postApi(`${whichApi()}/user/book/comments/reply/del`, {
    token,
    reply_ids,
  })
}

// 书籍想法评论详情列表
export const BookCommentDetailApi = (token, comment_id, start, size = 10) => {
  return postApi(`${whichApi()}/user/book/reply/${start}/${size}`, {
    token,
    comment_id,
  })
}

// 用户中心评论列表
export const UserCenterCommentListApi = (token, start, size = 10) => {
  return postApi(`${whichApi()}/usercenter/book/comments/${start}/${size}`, {
    token,
  })
}

// 用户中心评论详情列表
export const UserCenterCommentDetailListApi = (token, book_id, start, size = 10) => {
  return postApi(`${whichApi()}/usercenter/book/comments/detail/${start}/${size}`, {
    token,
    book_id,
  })
}

// 用户消息中心
export const UserCenterMessageApi = (token, start, size = 10) => {
  return postApi(`${whichApi()}/usercenter/comments/messages/${start}/${size}`, {
    token,
  })
}

// 是否已经签到
export const UserSignStatusApi = (token) => {
  return postApi(`${whichApi()}/user/today/sign`, {
    token,
  })
}

// 上报用户位置和设备信息
export const UploadDeviceInfoApi = (token, imei, address) => {
  return postApi(`${whichApi()}/user/device/info`, {
    token,
    imei,
    address,
  })
}

// 上传头像
export const UploadAvatarApi = () => {
  return `${whichApi()}/user/img/upload`;
}

// 绑定第三方信息
//   "token": "",                   //token 必填
//   "openid": "",                 //微信openID
//   "nickname": "",              //微信昵称
//   "phone": "",
//   "types": 1                      //1绑定微信 2绑定电话
export const BindThirdApi = (token, openid, unionid, nickname, phone, types) => {
  return postApi(`${whichApi()}/user/bind/thrid/info`, {
    token,
    openid,
    unionid,
    nickname,
    phone,
    types
  })
}

// 强制绑定
//   "token": "",                   //token 必填
//   "openid": "",                 //微信openID
//   "nickname": "",              //微信昵称
//   "phone": "",
//   "types": 1                      //1绑定微信 2绑定电话
// isforce: 1 强制绑定， 0 不强制绑定
export const ForceBindApi = (token, openid, unionid, nickname, phone, types, isforce) => {
  return postApi(`${whichApi()}/user/bind/thrid/info`, {
    token,
    openid,
    unionid,
    nickname,
    phone,
    types,
    isforce
  })
}

// 获取域名对应的ip地址
export const TestApi = (domain) => {
  return getApi(`${domain}/read/test/test`, {})
}


export const AdsSourceApi = () => {
  return getApi(`${whichApi()}/ad/source`, {})
}
