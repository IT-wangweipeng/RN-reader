import React, {Component} from 'react'
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  DeviceEventEmitter,
  NativeModules,
  Platform,
  NativeEventEmitter,
  Animated,
  Easing,
  ToastAndroid, Modal,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import R from 'ramda'
import ProgressHUD from 'react-native-progress-hud'
import * as WeChat from 'react-native-wechat'
import NetInfo from "@react-native-community/netinfo"
import * as QQAPI from 'react-native-qq'
import ScrollingMessageView from 'react-native-auto-scrolling-message'
import BannerView from '../market/BannerView'
import IMAGES from '../../component/images'
import * as bookshelfAction from '../../actions/bookshelfAction'
import * as bookChapterListAction from '../../actions/bookChapterListAction'
import * as bookshelfBannerAction from '../../reducers/bookshelfBanner'
import {getItem, setItem} from '../../utils/AsyncStorageManager'
import {BookshelfGameApi} from "../../apis/Api";
import {
  KEY_FIRST_RECOMMEND, KEY_PRIVACY, KEY_RECOMMEND_BOOK,
  KEY_TOKEN,
} from '../../utils/AsyncStorageKey'
import {
  updateBookShelf, query, queryShelfBooks, insertShelfBook, queryBooks,
  insertBook, updateBook, realm,
} from '../../model/BookModelManager'
import moment from 'moment'
// import { showToast } from '../../actions/toastAction'
import {convertToArray} from '../../utils/CommonUtil'
import {UMCPS, sendAction} from '../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../utils/Analysis/UMConfig'
import {
  FloatWindowApi,
  HotBeansPaymentApi,
  launcherAlertWindowApi,
  SerialBookUpdateApi
} from '../../apis/Api'
import {showToast} from '../../actions/toastAction'
import images from '../../component/images'
import BookshelfCell from './BookshelfCell'
import Toast from "react-native-root-toast";
import FloatView from '../../component/FloatVeiw'
import {Config} from "../../config/Config";
import {isIOS} from "../../utils/PlatformUtils";
import PrivacyPage from "../login/PrivacyPage";

const {width, height} = Dimensions.get('window')
const ITEM_MARGIN = 26
const ITEM_WIDTH = (width - 32 - ITEM_MARGIN * 2) / 3
const BookReadManager = NativeModules.BookReadManager;

const CONST_FLOAT_VIEW_POSITION = 2

class BookshelfPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: 0,
      hudLoading: false,
      game: [],
      visible: false,
      // alertWindowType: 0,
      // alertWindowUrl: null,
    }
    this.startTime = 0
    this.endTime = 0
    this.readTime = 0
    this.spinValue = new Animated.Value(0)
    this.spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    this.bookIdFromReadPage = 0
    this.bookInfoFromReadPage = {}
  }

  static parseTime = (second) => {
    const h = Math.floor(second / 3600 % 24);
    const m = Math.round(second / 60 % 60);

    if (h === 0) {
      return (
        <Text style={{fontSize: 27, color: '#f85836'}}>
          {`${m}`}
          <Text style={{fontSize: 17, color: '#1e252f'}}>
            {' 分钟'}
          </Text>
        </Text>
      )
    }
    if (h >= 1) {
      if (m === 0) {
        return (
          <Text style={{fontSize: 27, color: '#f85836'}}>
            {`${h}`}
            <Text style={{fontSize: 17, color: '#1e252f'}}>
              {' 小时'}
            </Text>
          </Text>
        )
      }
      return (
        <Text style={{fontSize: 27, color: '#f85836'}}>
          {`${h}`}
          <Text style={{fontSize: 17, color: '#1e252f'}}>
            {' 小时'}
          </Text>
          <Text style={{fontSize: 27, color: '#f85836'}}>
            {` ${m}`}
            <Text style={{fontSize: 17, color: '#1e252f'}}>
              {' 分钟'}
            </Text>
          </Text>
        </Text>
      )
    }
    return (
      <Text style={{fontSize: 27, color: '#f85836'}}>
        {'0'}
        <Text style={{fontSize: 17, color: '#1e252f'}}>
          {' 分钟'}
        </Text>
      </Text>
    )
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.handleLogin()
        }}
      >
        <View style={{flexDirection: 'row', marginLeft: 16, alignItems: 'flex-end'}}>
          {
            (navigation.state.params && !!navigation.state.params.hasToken && !!(navigation.state.params.time+'')) ? (
              this.parseTime(navigation.state.params.time)
            ) : (
              <Text style={{fontSize: 27, color: '#f85836'}}>
                {'-'}
                <Text style={{fontSize: 17, color: '#1e252f'}}>
                  {' 分钟'}
                </Text>
              </Text>
            )
          }

          <Text style={{fontSize: 13, color: '#949BA5', alignSelf: 'flex-end', marginBottom: 3}}>
            {'（本周已读）'}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    headerRight: (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{marginRight: 20, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            navigation.state.params.handleAction()
          }}
        >
          <Image
            source={IMAGES.read_time}
          />
          <Text style={{fontSize: 10, color: '#1e252f', marginTop: 6}}>
            {'阅读记录'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginRight: 16, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            navigation.navigate('Search', {
              keywords: ''
            })
            sendAction(UMConfig.ACTION_BOOKSHELF_SEARCH)
          }}
        >
          <Image
            source={IMAGES.bookshelf_search}
          />
          <Text style={{fontSize: 10, color: '#1e252f', marginTop: 6}}>
            {'找书'}
          </Text>
        </TouchableOpacity>
      </View>
    ),
  })

  componentWillMount() {
    NetInfo.getConnectionInfo().then(data => {
      if (data.type === 'none') {
        showToast('无网络，请链接网络')
      }
    })

    getItem(KEY_TOKEN).then((token) => {
      if (!!token) {
        console.log('从网络加载')
        this.props.navigation.setParams({hasToken: true})
        this.props.actions.favoriteBookInit()
        this.props.actions.totalCompletedBookInit()
      } else {
        this.props.navigation.setParams({hasToken: false})
        getItem(KEY_FIRST_RECOMMEND).then(isFirst => {
          if (isFirst === null) {
            // 未推荐过，从网络获取，并缓存
            console.log('第一次推荐')
            this.props.navigation.navigate('EditBookshelfTips')
            this.props.actions.recommendBookInit({sex: 3})
          } else {
            // 已推荐，从realm加载
            console.log('从realm加载')
            const allBooks = queryShelfBooks()
            const books = allBooks.sorted('timestamp', true)
            this.props.actions.recommendBookInitSuccess({data: convertToArray(books)})
            // 过滤连载的书，查询是否有更新，用于是否显示更新角标
            const serialBooks = allBooks.filtered('complete_status == 0')
            if (serialBooks.length > 0) {
              let serialBookIds = []
              serialBooks.map((item, idx) => {
                serialBookIds = item.id
              })

              SerialBookUpdateApi(serialBookIds, 3).then((ret) => {
                if (ret && ret.status === 200) {
                  const data = ret.data
                  if (data.length > 0) {
                    data.map((i, idx) => {
                      if (i.update === 1) {
                        // 显示更新角标
                        const aBook = allBooks.filtered(`id == ${i.book_id}`)
                        let tmp = {}
                        if (aBook.length > 0) {
                          R.addIndex(R.map)((value, index) => {
                            tmp = {...value}
                            tmp.icon_status = 1
                          }, aBook)
                          updateBookShelf(tmp)
                        }
                      }
                    })
                    this.props.actions.recommendBookInitSuccess({data: convertToArray(queryShelfBooks().sorted('timestamp', true))})
                  }
                }
              })
                .catch(error => {
                  console.log('check book update error =========== ', error)
                })
            }
          }
        })
      }
    })

    // 获取banner、底部推荐
    this.props.actions.bookshelfBannerInitAction()
    this.props.actions.bookshelfRecommendRefreshInitAction()
  }

  _showLaunch = () => {
    //启动页弹窗
    getItem(KEY_TOKEN).then((token) => {
      console.log('yy launcherAlertWindowApi token=', token)
      launcherAlertWindowApi(token)
        .then((ret) => {
          console.log('yy launcherAlertWindowApi result:  ', ret)
          if (ret.status === 200) {
            if (ret.data.length > 0) {
              switch (ret.data[0].type) {
                case 1://书籍id
                case 2://url链接
                case 4://发现二级页面
                case 5://登录
                case 8://趣读跳转
                  this.props.navigation.navigate('LauncherAlert', {
                    data: ret.data[0],
                  })
                  break;
                default:
                  break;
              }
            }

          }
        })
        .catch((error) => {
          console.log('launcherAlertWindowApi error: ', error)
          if (error.message) {
            showToast(error.message)
          }
        })
    })
  }

  _shareQQInfo (e) {
    const {
      title, description, thumbImage, webpageUrl,
    } = e
    return {
      type: 'news',
      title: `发现一本好书《${title}》`,
      description: description.substr(0, 100),
      webpageUrl: webpageUrl,
      imageUrl: thumbImage,
    }
  }

  _shareWechatInfo (e) {
    const {
      title, description, thumbImage, webpageUrl,
    } = e
    return {
      title: `发现一本好书《${title}》`,
      description: description.substr(0, 100),
      thumbImage: thumbImage,
      type: 'news',
      webpageUrl: webpageUrl
    }
  }

  _increaseHotBeans = () => {
    if (!!this.props.user.token) {
      HotBeansPaymentApi(this.props.user.token, 9)
        .then((ret) => {
          console.log('HotBeansPaymentApi result:  ', ret)
          if (ret.status === 200) {
            if(ret.data.task_complete_state === false) {
              this._showMessage('已成功领取热豆')
            } else {
              this._showMessage('分享成功')
            }
          }
        })
        .catch((error) => {
          console.log('HotBeansPaymentApi error: ', error)
        })
    } else {
      this._showMessage('分享成功')
    }
  }

  _onShareCallback = (e) => {
    console.log('_onShare ======= ', e)
    const {ShareEventEmitter} = NativeModules
    if (e.shareType === 'qq') {
      QQAPI.shareToQQ(this._shareQQInfo(e)).then(ret => {
        console.log('qq ============ ', ret)
        if (ret.errCode === 0) {
          this._increaseHotBeans()
        } else {
          this._showMessage(`分享失败`)
        }
      })
        .catch(error => {
          console.log('share qq error: ', error)
          this._showMessage(`分享失败`)
        })
    } else if (e.shareType === 'qqZone') {
      QQAPI.shareToQzone(this._shareQQInfo(e)).then(ret => {
        if (ret.errCode === 0) {
          this._increaseHotBeans()
        } else {
          this._showMessage(`分享失败`)
        }
      })
        .catch(error => {
          console.log('share qq error: ', error)
          this._showMessage(`分享失败`)
        })
    } else if (e.shareType === 'wechat') {
      WeChat.shareToSession(this._shareWechatInfo(e))
        .then(ret => {
          if (ret.errCode === 0) {
            this._increaseHotBeans()
          } else {
            this._showMessage(`分享失败`)
          }
        })
        .catch((error) => {
          this._showMessage(`分享失败`)
        })
    } else if (e.shareType === 'timeline') {
      WeChat.shareToTimeline(this._shareWechatInfo(e))
        .then(ret => {
          if (ret.errCode === 0) {
            this._increaseHotBeans()
          } else {
            this._showMessage(`分享失败`)
          }
        })
        .catch((error) => {
          this._showMessage(`分享失败`)
        });
    }
  }

  _showMessage = (msg) => {
    if (Platform.OS === 'ios') {
      const {ShareEventEmitter} = NativeModules
      ShareEventEmitter.showMessage(msg)
    } else {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    }
  }

  _addListener() {
    if (Platform.OS === 'ios') {
      // 监听阅读页分享事件
      const {BookEventEmitter, ShareEventEmitter} = NativeModules
      ShareEventEmitter.addShareListener()

      this.shareEmitter = new NativeEventEmitter(ShareEventEmitter)
      this.shareEmitter.addListener('onShare', (e) => {
        this._onShareCallback(e)
      })


      this.bookEmitter = new NativeEventEmitter(BookEventEmitter)
      this.bookEmitter.addListener('onSyncReadTime', (e) => {
        console.log('onSyncReadTime : ===== ', e, this.props.bookshelf.weekly_ts)
        const {user} = this.props
        if (!!user.token) {
          // 同步阅读时长
          const app_ts = this.props.bookshelf.readTime.app_ts
          // const total = e.duration + app_ts
          // const weekly_ts = this.props.bookshelf.weekly_ts.app_ts

          // 今天阅读总时长
          const dailyTime = e.duration
          this.props.actions.bookSyncInit({
            token: user.token,
            type: 2,
            ts: (dailyTime <= 0 || dailyTime == undefined) ? app_ts : dailyTime + app_ts,
          })

          // let weaklyTime = weekly_ts + dailyTime
          // const weaklyTotal = (weaklyTime <= 0 || weaklyTime == undefined) ? weekly_ts : weaklyTime
          // console.log('read time =========== ', weaklyTotal,  dailyTime)
          // this.props.bookshelf.weekly_ts.app_ts = weaklyTotal
          this.props.bookshelf.readTime.app_ts = dailyTime
          // this.props.navigation.setParams({time: weaklyTotal})

          setTimeout(() => {
            this.props.actions.favoriteBookInit()
          }, 1500)
        }
      })


      this.syncBook = new NativeEventEmitter(BookEventEmitter)
      this.syncBook.addListener('onSyncBookRecord', (e) => {
        this.props.actions.bookshelfRecommendRefreshInitAction()
        // 书架的书同步：
        console.log('同步阅读时长onSyncBookRecord ===== ', e)
        const {user} = this.props
        if (!!user.token) {
          // 同步已阅读章节、
          this.props.actions.addBookInit({
            token: user.token,
            book_id: e.book_id,
            chapter_id: e.chapter_id,
            chapter_sort: e.chapter_sort,
          })

          // 同步阅读记录
          this.props.actions.saveReadRecordInit({
            book_id: e.book_id,
            chapter_id: e.chapter_id,
            chapter_sort: e.chapter_sort,
          })
        }

        // 更新书架数据库
        const book = {...e}
        book.id = e.book_id
        book.chapter_id = e.chapter_id
        book.chapter_sort = e.chapter_sort
        book.chapter_title = e.title
        book.timestamp = `${Date.now()}`
        book.icon_status = 2
        book.start_ad_ts = e.start_ad_ts
        book.end_ad_ts = e.end_ad_ts
        book.start_vip_ts = e.start_vip_ts
        book.end_vip_ts = e.end_vip_ts
        updateBookShelf(book)
        //const books = query('BookShelf')
        //this.props.actions.recommendBookInitSuccess({data: books})
        let newBooks = convertToArray(queryShelfBooks().sorted('timestamp', true));
        console.log('newBookf ============== ', newBooks)
        this.props.actions.recommendBookInitSuccess({data: newBooks})

        // 更新阅读记录数据库
        this._syncBookToHistory(e)
      })


      this.syncShelfListener = new NativeEventEmitter(BookEventEmitter)
      // 其他来源书籍同步
      this.syncShelfListener.addListener('onSyncBookToShelf', (e) => {
        console.log('bookshelf page 同步到书架 ===== ', e)
        // 保存已加入书架的书到realm
        if (e && e.isCollected) {
          const ret = {...e}
          ret.id = e.book_id
          ret.chapter_title = e.chapter
          const book = queryShelfBooks().filtered(`id == ${e.book_id}`)
          if (book.length === 0) {
            insertShelfBook(ret)
            this.props.actions.recommendBookInitSuccess({data: convertToArray(queryShelfBooks())})
          }
        }

        this._syncBookToHistory(e)


        // 同步到书架
        const {user} = this.props
        if (e && e.isCollected && !!user.token) {
          this.props.actions.addBookInit({
            book_id: e.book_id,
            chapter_id: e.chapter_id,
            chapter_sort: e.chapter_sort,
          })
        }
      })

      this.syncFinishReadBook = new NativeEventEmitter(BookEventEmitter)
      this.syncFinishReadBook.addListener('onSyncFinishReadBook', (e) => {
        console.log('onSyncFinishReadBook ==== ', e, this.props.actions)
        const {user} = this.props
        if (!!user.token) {
          this.props.actions.addCompletedBookInit({
            book_id: e.book_id,
          })
        }
      })

      this.syncNativeToLogin = new NativeEventEmitter(BookEventEmitter)
      this.syncNativeToLogin.addListener('onSyncUserLogin', (e) => {
        console.log('onSyncUserLogin ==== ', e)
        this.bookIdFromReadPage = e.book_id;
        this.bookInfoFromReadPage = e
        if (e == undefined) {
          this.props.navigation.navigate('Login')
          return
        }
        //iOS跳登录页---将未登录前的阅读记录保存并传递...
        this.props.navigation.navigate('Login', {
          jumpFlag: 1,
        })

      })


    } else {
      // 监听阅读页分享事件
      DeviceEventEmitter.addListener('onShare', (e) => {
        console.log('yy onShare e=',e)
        this._onShareCallback(e)
      })

      // 监听开始阅读时间
      // DeviceEventEmitter.addListener('startTime', () => {
      //   this.startTime = Date.parse(new Date())
      //   console.log('yy startTime=', this.startTime)
      // })

      // 监听结束阅读时间
      // DeviceEventEmitter.addListener('endTime', () => {
      //   getItem(KEY_TOKEN).then((token) => {
      //     console.log('yy endTime 00 token=', token)
      //     if (!!token) {
      //       console.log('yy endTime 11')
      //       this.endTime = Date.parse(new Date())
      //       if (this.props.bookshelf.weekly_ts && this.props.bookshelf.readTime.app_ts >= 0) {
      //         const app_ts = this.props.bookshelf.readTime.app_ts
      //         const duration = (this.endTime - this.startTime) / 1000
      //         const total = duration + app_ts
      //         console.log('total ===================== ', total)
      //         this.props.actions.bookSyncInit({
      //           token: token,
      //           type: 2,
      //           ts: total,
      //         })
      //         const weakTime = this.props.bookshelf.weekly_ts.app_ts + duration
      //         console.log('read time =========== ', weakTime,  total)
      //         this.props.bookshelf.weekly_ts.app_ts = weakTime
      //         this.props.bookshelf.readTime.app_ts = total
      //         this.props.navigation.setParams({time: weakTime})
      //       }
      //     }
      //   })
      // })

      //监听阅读时长
      DeviceEventEmitter.addListener('readTime', (e) => {
        getItem(KEY_TOKEN).then((token) => {
          console.log('yy readTime 00 token='+token+',duration='+e.duration)
          if (!!token && e.duration > 0) {
            if (this.props.bookshelf.weekly_ts && this.props.bookshelf.readTime.app_ts >= 0) {
              const app_ts = this.props.bookshelf.readTime.app_ts
              const duration = e.duration
              const total = duration + app_ts
              console.log('yy total ===================== ', total)
              this.props.actions.bookSyncInit({
                token: token,
                type: 2,
                ts: total,
              })
              const weakTime = this.props.bookshelf.weekly_ts.app_ts + duration
              console.log('yy read time =========== ', weakTime,  total)
              this.props.bookshelf.weekly_ts.app_ts = weakTime
              this.props.bookshelf.readTime.app_ts = total
              this.props.navigation.setParams({time: weakTime})
            }
          }
        })
      })

      // 监听阅读记录
      DeviceEventEmitter.addListener('saveReadRecord', (bookDetail) => {
        console.log('yy saveReadRecord 00')
        // 更新书架到服务器
        getItem(KEY_TOKEN).then((token) => {
          if (!!token) {
            let ret = this.props.bookshelf.books.filter((item) => {
              return item.id === bookDetail.id
            })
            console.log('yy saveReadRecord 11 ret.length=', ret.length)
            if (ret.length > 0) {
              console.log('yy saveReadRecord 22')
              this.props.actions.addBookInit({
                token: token,
                book_id: bookDetail.id,
                chapter_id: bookDetail.chapter_id,
                chapter_sort: bookDetail.chapter_sort,
              })
            }

            // 保存阅读记录
            this.props.actions.saveReadRecordInit({
              book_id: bookDetail.id,
              chapter_id: bookDetail.chapter_id,
              chapter_sort: bookDetail.chapter_sort,
            })
          }
        })

        const shelfBook = queryShelfBooks().filtered(`id == ${bookDetail.id}`)
        if (shelfBook.length > 0) {
          //若此书在书架中，则更新此书
          const shelfRet = {
            id: bookDetail.id,
            author: bookDetail.author,
            brief: bookDetail.brief,
            cover: bookDetail.cover,
            name: bookDetail.name,
            create_time: bookDetail.create_time,
            chapter_title: bookDetail.chapter_title,
            chapter_id: bookDetail.chapter_id,
            chapter_sort: bookDetail.chapter_sort,
            timestamp: `${Date.now()}`,
            icon_status: 2,
            complete_status: bookDetail.complete_status,
            start_ad_ts: bookDetail.start_ad_ts,
            end_ad_ts: bookDetail.end_ad_ts,
            start_vip_ts: bookDetail.start_vip_ts,
            end_vip_ts: bookDetail.end_vip_ts,
          }
          // 更新书架到realm
          updateBookShelf(shelfRet)
          let newBooks = convertToArray(queryShelfBooks().sorted('timestamp', true));
          this.props.actions.recommendBookInitSuccess({data: newBooks})
        }

        // 更新阅读记录到realm
        const isCollected = shelfBook.length > 0 ? true : false
        const book = queryBooks().filtered(`id == ${bookDetail.id}`)
        const ret = {
          id: bookDetail.id,
          author: bookDetail.author,
          brief: bookDetail.brief,
          cover: bookDetail.cover,
          name: bookDetail.name,
          create_time: bookDetail.create_time,
          chapter_title: bookDetail.chapter_title,
          chapter_id: bookDetail.chapter_id,
          chapter_sort: bookDetail.chapter_sort,
          timestamp: `${Date.now()}`,
          icon_status: 2,
          complete_status: bookDetail.complete_status,
          start_ad_ts: bookDetail.start_ad_ts,
          end_ad_ts: bookDetail.end_ad_ts,
          isCollected: isCollected,
          start_vip_ts: bookDetail.start_vip_ts,
          end_vip_ts: bookDetail.end_vip_ts,
        }
        if (book.length === 0) {
          insertBook(ret)
        } else {
          updateBook(ret)
        }
        DeviceEventEmitter.emit('updateReadHistory')

      })

      //监听完成阅读整本书的消息
      DeviceEventEmitter.addListener('onSyncFinishReadBook', (e) => {
        console.log('yy onSyncFinishReadBook ==== ', e)
        const {user} = this.props
        if (!!user.token) {
          this.props.actions.addCompletedBookInit({
            book_id: e.book_id,
          })
        }
      })

      // 监听阅读页发来的登录消息
      DeviceEventEmitter.addListener('nativeLogin', (e) => {
        console.log('gg nativeLogin e=',e)

        this.bookIdFromReadPage = e.id;
        this.bookInfoFromReadPage = {
          id: e.id,
          name: e.name,
          author: e.author,
          cover: e.cover,
          brief: e.brief,
          create_time: e.create_time,
          complete_status: e.complete_status,
          is_collected: e.is_collected,
          sex: e.sex,
          token: e.token,
          start_ad_ts: e.start_ad_ts,
          end_ad_ts: e.end_ad_ts,
          free_ad_expirets: e.free_ad_expirets,
          start_vip_ts: e.start_vip_ts,
          end_vip_ts: e.end_vip_ts,
        }

        this.props.navigation.navigate('Login', {
          jumpFlag: 1,//从阅读页点击登录按钮-->登录页-->阅读页
        })
      })

      //监听加入书架信息
      DeviceEventEmitter.addListener('updateBookShelf', (bookDetail) => {
        // 加入书架
        const book = queryShelfBooks().filtered(`id == ${bookDetail.id}`)
        console.log('yy 00 bookDetail=', bookDetail)
        console.log('yy 11 book.length=', book.length)
        if (book.length === 0) {
          const shelfRet = {
            id: bookDetail.id,
            author: bookDetail.author,
            brief: bookDetail.brief,
            cover: bookDetail.cover,
            name: bookDetail.name,
            create_time: bookDetail.create_time,
            chapter_title: bookDetail.chapter_title,
            chapter_id: bookDetail.chapter_id,
            chapter_sort: bookDetail.chapter_sort,
            timestamp: `${Date.now()}`,
            icon_status: 2,
            complete_status: bookDetail.complete_status,
            start_ad_ts: bookDetail.start_ad_ts,
            end_ad_ts: bookDetail.end_ad_ts,
            start_vip_ts: bookDetail.start_vip_ts,
            end_vip_ts: bookDetail.end_vip_ts,
          }
          console.log('yy 22 insertShelfBook shelfRet=', shelfRet)
          // 更新书架到realm
          insertShelfBook(shelfRet)
          this.props.actions.recommendBookInitSuccess({data: convertToArray(queryShelfBooks())})

          // 更新书架到服务器
          if (!!this.props.user.token) {
            this.props.actions.addBookInit({
              token: this.props.user.token,
              book_id: bookDetail.id,
              chapter_id: bookDetail.chapter_id,
              chapter_sort: bookDetail.chapter_sort,
            })
          }
        }
      })
    }
  }

  _syncBookToHistory = (e) => {
    const aBook = queryBooks().filtered(`id == ${e.book_id}`)
    console.log('aBook ================= ', e)
    const ret = {
      id: e.book_id,
      author: e.author,
      brief: e.brief,
      cover: e.cover,
      name: e.name,
      create_time: e.create_time,
      chapter_title: !!e.title ? e.title : e.chapter,
      chapter_id: e.chapter_id,
      start_ad_ts: e.start_ad_ts,
      end_ad_ts: e.end_ad_ts,
      timestamp: `${Date.now()}`,
      isCollected: e.isCollected,
      complete_status: e.complete_status,
      start_vip_ts: e.start_vip_ts,
      end_vip_ts: e.end_vip_ts,
    }
    if (aBook.length === 0) {
      insertBook(ret)
    } else {
      updateBook(ret)
    }
  }

  _removeListener() {
    if (Platform.OS === 'ios') {
      this.syncBook && this.syncBook.removeAllListeners('onSyncBookRecord')
      this.syncShelfListener && this.syncShelfListener.removeSubscription('onSyncBookToShelf')
      this.bookEmitter && this.bookEmitter.remove()
    }
  }

  componentWillUnmount() {
    this._removeListener()
  }

  getFloatWindow() {
    // 小浮窗
    getItem(KEY_TOKEN).then((token) => {
      FloatWindowApi(this.props.user.info.sex || 3, CONST_FLOAT_VIEW_POSITION, token)
        .then((ret) => {
          console.log('FloatWindow api result:  ', ret)
          if (ret.status === 200) {
            if (JSON.stringify(ret.data) == '{}' || ret.data === undefined) {
              // do nothing
            } else {
              this.setState({
                data: ret.data,
              }, () => {
                this.floatViewRef.showFloatView()
              })
            }

          } else {
            showToast(ret.message)
          }
        })
        .catch((error) => {
          console.log('FloatWindow api error: ', error)
          if (error.message) {
            showToast(error.message)
          }
        })
    })
  }

  getLaunchAlertWindow() {
    //启动页弹窗
    getItem(KEY_TOKEN).then((token) => {
      console.log('yy launcherAlertWindowApi token=', token)
      launcherAlertWindowApi(token)
        .then((ret) => {
          console.log('yy launcherAlertWindowApi result:  ', ret)
          if (ret.status === 200) {
            if (ret.data.length > 0) {
              switch (ret.data[0].type) {
                case 1://书籍id
                case 2://url链接
                case 4://发现二级页面
                case 5://登录
                case 8://趣读跳转
                  this.props.navigation.navigate('LauncherAlert', {
                    data: ret.data[0],
                    fromFloatView: CONST_FLOAT_VIEW_POSITION,
                  })
                  break;
                default:
                  break;
              }
            }

          }
        })
        .catch((error) => {
          console.log('launcherAlertWindowApi error: ', error)
          if (error.message) {
            showToast(error.message)
          }
        })
    })
  }

  _resumeReadBookPage = (bookId, bookInfo) => {
    // this._showHudLoading()
    let obj = {...bookInfo}
    obj.id = bookId
    console.log('currentBook1 ==== ', obj)
    if (Platform.OS === 'ios') {
      const book = queryShelfBooks().filtered(`id == ${obj.book_id}`)
      let isCollected = (book.length === 0) ? false : true
      BookReadManager.openBookWithInfo(obj, this.props.user, 0, isCollected, -1, Config.iosReviewVersion)
    } else {
      // 书架里面的书，点击直接进入阅读页
      var nativeModule = NativeModules.OpenNativeModule;
      console.log('_resumeReadBookPage is_collected=',bookInfo.is_collected)
      nativeModule.openNativeReaderPage(obj, bookInfo.is_collected, -1, this.props.user.info.sex || 3, this.props.user.token || "",
        this.props.user.info.free_ad_expirets || 0, this.props.user.info.is_vip || 0);
    }
  }

  _toReadBookPage = (bookId, bookInfo) => {
    // this._showHudLoading()
    let obj = {...bookInfo}
    obj.id = bookId
    console.log('currentBook2 ==== ', obj)
    if (Platform.OS === 'ios') {
      BookReadManager.openBookWithInfo(obj, this.props.user, 0, true, -1, Config.iosReviewVersion)
    } else {
      // 书架里面的书，点击直接进入阅读页
      var nativeModule = NativeModules.OpenNativeModule;
      nativeModule.openNativeReaderPage(obj, true, -1, this.props.user.info.sex || 3, this.props.user.token || "",
        this.props.user.info.free_ad_expirets || 0, this.props.user.info.is_vip || 0);
    }
  }

  _doCommentActionJump(tag) {
    console.log('_doCommentActionJump ==== ', tag, this.bookIdFromReadPage, this.bookInfoFromReadPage)
    if (this.bookIdFromReadPage == undefined || this.bookInfoFromReadPage == undefined) {
      return
    }
    if (tag === 1000) {
      // 发表想法
      if (!!this.props.user.token) {
        this.props.navigation.navigate('PublishingPost', {
          bookId: this.bookIdFromReadPage,
          fromReadBookPage: true,
        })
      } else {
        this.props.navigation.navigate('Login',{
          bookId: this.bookIdFromReadPage,
          jumpFlag: 3 //阅读页点击发布想法-->登录页-->发布想法-->阅读页
        })
      }

    } else if (tag === 1001) {
      // 全部想法
      this.props.navigation.navigate('BookComments', {
        bookId: this.bookIdFromReadPage,
        page: 0,
        fromReadBookPage: true,
        readBookPageCallback: () => {
          this._resumeReadBookPage(this.bookIdFromReadPage, this.bookInfoFromReadPage)
        }
      })
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({handleAction: this._handleAction})
    this.props.navigation.setParams({handleLogin: this._handleLogin})
    this._addListener()
    DeviceEventEmitter.addListener('resumeToReadPage', (e)=>{
      console.log('gg receive resumeToReadPage bookInfoFromReadPage=',this.bookInfoFromReadPage, e)
      this._resumeReadBookPage(this.bookIdFromReadPage, this.bookInfoFromReadPage)
    })


    if (Platform.OS === 'ios') {
      this.commentEmitter = new NativeEventEmitter(NativeModules.BookEventEmitter)
      this.commentEmitter.addListener('onCommentAction', (e) => {
        console.log('onComment ======= ', e)
        this.bookIdFromReadPage = e.bookId
        this.bookInfoFromReadPage = e.bookInfo
        this._doCommentActionJump(e.tag)
      })

      DeviceEventEmitter.addListener('onVipCenterAction', (e) => {
        console.log('vipcenter -------------- ', e)
        this.bookIdFromReadPage = e.book_id
        this.bookInfoFromReadPage = e
        this._dispatchVipCenterMessage()
      })
    } else {
      // 监听阅读页发来的评论动作
      DeviceEventEmitter.addListener('onCommentAction', (e) => {
        console.log('onComment ======= ', e)
        this.bookIdFromReadPage = e.id;
        this.bookInfoFromReadPage = {
          id: e.id,
          name: e.name,
          author: e.author,
          cover: e.cover,
          brief: e.brief,
          create_time: e.create_time,
          complete_status: e.complete_status,
          is_collected: e.is_collected,
          sex: e.sex,
          token: e.token,
          start_ad_ts: e.start_ad_ts,
          end_ad_ts: e.end_ad_ts,
          free_ad_expirets: e.free_ad_expirets,
          start_vip_ts: e.start_vip_ts,
          end_vip_ts: e.end_vip_ts,
        }
        this._doCommentActionJump(e.tag)
      })

      // 监听阅读页发来的进入vip中心的动作
      DeviceEventEmitter.addListener('onVipCenterAction', (e) => {
        console.log('onVipCenterAction ======= ', e)
        this.bookIdFromReadPage = e.id;
        this.bookInfoFromReadPage = {
          id: e.id,
          name: e.name,
          author: e.author,
          cover: e.cover,
          brief: e.brief,
          create_time: e.create_time,
          complete_status: e.complete_status,
          is_collected: e.is_collected,
          sex: e.sex,
          token: e.token,
          start_ad_ts: e.start_ad_ts,
          end_ad_ts: e.end_ad_ts,
          free_ad_expirets: e.free_ad_expirets,
          start_vip_ts: e.start_vip_ts,
          end_vip_ts: e.end_vip_ts,
        }


        if (this.bookIdFromReadPage == undefined || this.bookInfoFromReadPage == undefined) {
          return
        }

        this._dispatchVipCenterMessage()
      })
    }


    DeviceEventEmitter.addListener('LoginSuccess', () => {
      this.props.navigation.setParams({hasToken: true})
    })

    DeviceEventEmitter.addListener('Logout', () => {
      console.log('login success === ')
      this.props.navigation.setParams({hasToken: false})
    })

    DeviceEventEmitter.addListener('showFloatView', (e) => {
      if (e.fromFloatView === CONST_FLOAT_VIEW_POSITION) {
        this.getFloatWindow()
      }
    })
    this.getFloatWindow()

    BookshelfGameApi(3, 1).then(ret => {
      console.log('game ====== ', ret)
      if (ret && ret.status === 200 && ret.data.length > 0) {
        this.setState({
          game: ret.data[0]
        })
      }
    })

    if (isIOS()) {
      const Emitter = new NativeEventEmitter(NativeModules.BookEventEmitter)
      Emitter.addListener('onSplashAdsClose', (e) => {
        this._showPrivacyPage()
      })
    } else {
      this._showPrivacyPage()
    }
  }

  _showPrivacyPage = () => {
    getItem(KEY_PRIVACY).then(ret => {
      if (ret == null) {
        this.setState({
          visible: true
        })
      } else {
        this._showLaunch()
      }
    })
  }

  _dispatchVipCenterMessage = () => {
    // vipcenter
    if (!!this.props.user.token) {
      this.props.navigation.navigate('Web', {
        url: Config.vip.url(),
        fromReadBookPage: true //阅读页点击开通会员-->会员中心-->阅读页
      })
    } else {
      this.props.navigation.navigate('Login',{
        jumpFlag: 2 //阅读页点击登录并开通会员-->登录页-->会员中心-->阅读页
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bookshelf.weekly_ts !== this.props.bookshelf.weekly_ts) {
      this.props.navigation.setParams({time: nextProps.bookshelf.weekly_ts.app_ts || 0})
    }

    console.log('nextProps.bookshelf.addCompleteSuccess ==== ', nextProps.bookshelf.addCompleteSuccess)

    if (nextProps.bookshelf.addCompleteSuccess) {
      nextProps.bookshelf.addCompleteSuccess = false
      this.props.actions.totalCompletedBookInit()
    }
  }

  render() {
    const {bookshelf} = this.props
    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          style={{flex: 1}}
          columnWrapperStyle={{marginHorizontal: 16}}
          numColumns={3}
          data={bookshelf.books || []}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderListHeaderComponent}
          ListFooterComponent={this._renderListFooterComponent}
        />
        <ProgressHUD
          showHUD={bookshelf.isLoading || this.state.hudLoading}
          showLoading={bookshelf.isLoading || this.state.hudLoading}
        />
        <FloatView
          ref={(n) => {
            this.floatViewRef = n
          }}
          position={CONST_FLOAT_VIEW_POSITION}
          data={this.state.data}
          navigation={this.props.navigation}
          onPress={() => {
            switch (this.state.data.type) {
              case 1:// bookid
                this.props.navigation.navigate('Detail', {bookId: this.state.data.url})
                break;
              case 2:// url
                this.props.navigation.navigate('Web', {
                  url: this.state.data.url,
                })
                break;
              case 7:// 调用启动弹窗
                this.floatViewRef.hideFloatView()
                this.getLaunchAlertWindow()
                break;
              case 8://趣读跳转
                this.props.navigation.navigate('Qudu')
                break;
            }
            UMCPS(UMConfig.market_floatview_clicked, {position: CONST_FLOAT_VIEW_POSITION})
          }}
        />

        <Modal
          animationType={"fade"}
          visible={this.state.visible}
          transparent={true}
          onRequestClose={() => {
            this.setState({
              visible: false
            })
          }}>
          <PrivacyPage
            hiddenModal={() => {
              this.setState({
                visible: false
              })
            }}
            showModal={() => {
              this.setState({
                visible: true
              })
            }}
            showActivityImage={() => {
              this._showLaunch()
            }}
            navigation={this.props.navigation}
          />
        </Modal>
      </SafeAreaView>
    )
  }

  _renderListHeaderComponent = () => {
    return (
      <View style={{paddingHorizontal: 16, paddingTop: 10}}>
        <BannerView
          containerStyle={{width: width - 32, height: 65}}
          navigation={this.props.navigation}
          data={this.props.bookRecommend.banners || []}
          onPressBanner={() => {
            // UMCPS(UMConfig.ACTION_BANNER, {})
            sendAction(UMConfig.ACTION_BANNER)
          }}
        />

        <View style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center'}}>
          <Image
            style={{width: 24, height: 24,}}
            source={images.horn}
          />

          <ScrollingMessageView
            textList = {this.props.bookRecommend.hornsMessage || []}
            width = {width-32}
            height = {30}
            delay={5000}
            direction = {'down'}
            numberOfLines = {1}
            bgContainerStyle = {{backgroundColor : '#fff', width: width - 52}}
            textStyle = {{color: '#1e252f', fontSize: 12}}
            onTextClick = {(obj) => {
              //1：书籍ID， 2：URL链接
              if (obj.type === 1) {
                this.props.navigation.navigate('Detail', {
                  bookId: obj.url
                })
              } else if (item.type === 2) {
                this.props.navigation.navigate('Web', {
                  url: `${obj.url}`
                })
              }
              // UMCPS(UMConfig.ACTION_CATEGORY_HORN, {})
              sendAction(UMConfig.ACTION_CATEGORY_HORN)
            }}
          />

        </View>
      </View>
    )
  }

  _renderListFooterComponent = () => {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return (
      <View style={{backgroundColor: '#fff', height: 300}}>
        <View style={{backgroundColor: '#f1f1f6', height: 8}}/>
        <View style={{flex: 1,}}>
          <FlatList
            columnWrapperStyle={{marginHorizontal: 16}}
            numColumns={3}
            data={this.props.bookRecommend.recommend || []}
            keyExtractor={this._keyExtractor}
            ListHeaderComponent={() => {
              return (
                <View style={styles.footer}>
                  <Text style={{color: '#1e252f', fontWeight: 'bold', fontSize: 18}}>
                    {'百万人都在看'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this._spinAnimation()
                      this.props.actions.bookshelfRecommendRefreshInitAction()
                    }}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{color: '#f85836', fontSize: 14,}}>
                        {'换一批'}
                      </Text>
                      <Animated.Image
                        style={{
                          marginStart: 6,
                          transform: [{rotate: spin}],
                        }} source={images.image_change}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }}
            renderItem={this._renderRecommendItem}
          />
        </View>
      </View>
    )
  }

  _renderRecommendItem = ({item, index}) => {
    return (
      <BookshelfCell
        item={item}
        index={index}
        hiddenBottom={true}
        showCheckMark={false}
        hasBadge={false}
        onPressCell={() => {
          this.props.navigation.navigate('Detail', {
            bookId: item.id
          })
          UMCPS(UMConfig.ACTION_DETAIL_RECOMMEND, {book_id: item.id || ''})
        }}
      />
    )
  }

  _keyExtractor = (item, id) => item.id

  _renderItem = ({item, index}) => {
    if (this.state.game.length === 0 && item.isGame) {
      return null
    }
    return (
      <BookshelfCell
        cellStyle={{marginBottom: 22}}
        item={item}
        index={index}
        hiddenBottom={false}
        showCheckMark={false}
        hasBadge={true}
        game={this.state.game}
        onPressCell={() => {
          const {navigation, user} = this.props
          if (item.isGame === true) {
            navigation.navigate('Web', {
              url: this.state.game.url
            })
            return
          }

          // 互动小说 or 气泡小说
          if (item.book_type === 3 || item.book_type === 2) {
            if (!user.token && item.book_type === 3) {
              navigation.navigate('Login')
              return;
            }

            this.props.navigation.navigate('Web',{
              url: `${item.url}?token=${user.token}`,
              hiddenHeader: true,
              quduCallback: () => {
                this.props.navigation.navigate('Web', {
                  url:`${Config.url.missionURL()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
                  title: '福利任务',
                  rightIcon: '规则',
                  rightIconType: 2,
                  showCloseIcon: true,
                  hiddenHeader: false,
                })
              }
            })
            return
          }

          if (item.end && item.end === true) {
            navigation.navigate('Market')
          } else {
            this.startTime = Date.parse(new Date())
            this._toReadBookPage(item.id, item)
          }
          UMCPS(UMConfig.ACTION_BOOKSHELF_OPEN_BOOK, {book_id: item.id || ''})
        }}
        onLongPressCell={() => {
          if (item.end === true || item.isGame === true) {
            return
          }
          console.log('index ===== ', index)
          this.props.navigation.navigate('EditBookshelf', {
            slectedIndex: index,
            books: this.props.bookshelf.books,
            callback: (ret => {
              let books = []
              ret.map((item, index) => {
                if (item.isGame === true) {
                  return
                }
                if (item.end !== true) {
                  let obj = {}
                  obj.chapter_id = item.chapter_id || 0
                  obj.chapter_sort = item.chapter_sort || 0
                  obj.book_id = item.id
                  books.push(obj)
                }
              })
              const {user} = this.props
              if (!!user.token) {
                // 同步书籍时长
                this.props.actions.bookSyncInit({
                  type: 1,
                  undefined,
                  list: books
                })
              }
            })
          })
        }}
      />
    )
  }

  _showHudLoading = () => {
    if (isIOS()) {
      BookReadManager.showHUD()
    } else {
      this.setState({
        hudLoading: true
      })
    }
  }

  _hiddenHudLoading = () => {
    if (isIOS()) {
      BookReadManager.hiddenHUD()
    } else {
      this.setState({
        hudLoading: false
      })
    }
  }

  _handleAction = () => {
    const {navigation} = this.props
    // if (!!this.props.user.token) {
    //   return navigation.navigate('ReadHistory')
    // }
    // navigation.navigate('Login')
    navigation.navigate('ReadHistory')
  }

  _handleLogin = () => {
    const {navigation, user} = this.props
    if (user.token) {
      return
    }
    navigation.navigate('Login')
  }

  _spinAnimation() {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    ).start(() => {
      this.spinValue.setValue(0)
    })
  }
}

BookshelfPage.propTypes = {}

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#f85836',
    borderRadius: 3,
    marginLeft: 3,
    marginTop: 8,
    alignSelf: 'center',
  },
  footer: {
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...bookshelfAction, ...bookChapterListAction, ...bookshelfBannerAction}, dispatch)
})

export default connect(({user, bookshelf, bookChapterList, bookRecommend, bookDetail}) => {
  return {
    user,
    bookshelf,
    bookChapterList,
    bookRecommend,
    bookDetail,
  }
}, mapDispatchToProps)(BookshelfPage)
