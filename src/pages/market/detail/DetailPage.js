import React, {Component} from 'react'
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  PixelRatio,
  DeviceEventEmitter,
  NativeModules,
  Modal,
  FlatList,
  Platform,
  Dimensions,
  NativeEventEmitter,
} from 'react-native'

import {Header, SafeAreaView} from 'react-navigation'
import NetInfo from '@react-native-community/netinfo';
import ProgressHUD from 'react-native-progress-hud'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import moment from 'moment'
import * as bookDetailAction from '../../../actions/bookDetailAction'
import * as bookRelatedlAction from '../../../actions/bookRelatedlAction'
import * as bookFavoritesAction from '../../../actions/bookFavoritesAction'
import * as bookCounterAction from '../../../actions/bookCounterAction'
import * as bookChapterListAction from '../../../actions/bookChapterListAction'
import * as bookshelfAction from '../../../actions/bookshelfAction'
import * as bookCommentAction from '../../../reducers/bookCommentReducer'
import {isIphoneX} from "../../../utils/DeviceUtils";

import R from 'ramda'
import AdView from '../../../component/AdView'
import images from '../../../component/images'
import SameItem from './SameItem'
import {insertBook, updateBook, queryBooks, queryShelfBooks, insertShelfBook} from '../../../model/BookModelManager'
import {convertToArray} from '../../../utils/CommonUtil'
import {Config} from '../../../config/Config'

import {UMCPS} from '../../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../../utils/Analysis/UMConfig'
import {isToday, isYesterday} from "../../../utils/TimeUtil";
import BookCommentCell from "../BookCommentCell";
import * as EmmiterKey from '../../../utils/EventEmmiterKey'
import {DeleteBookCommentApi, DislikeApi, LikeApi, bookDetailApi} from "../../../apis/Api";
import {IncreaseHotBean} from '../../../utils/IncreaseHotBean'
import {showToast} from "../../../actions/toastAction";
import Toast from "react-native-root-toast";
import * as APP_CONFIG from '../../../apis/ApiConfig'

var nativeModule = NativeModules.OpenNativeModule;

const COMMON_ITEM_HEIGHT = 34
const {width} = Dimensions.get('window')
const ITEM_HEIGHT = 40
const BookReadManager = NativeModules.BookReadManager;

const WEBPAGE_URL = ()=>{
  return `${APP_CONFIG.ApiConfig.getInstance().h5ApiPrefix}/share/detail.html?custom=${Config.channel}&sex=`
}

const HEADER_HEIGHT = isIphoneX() ? Header.HEIGHT + 34 : Header.HEIGHT
const CATEGORY_TEXT_WIDTH = width - 100

class DetailPage extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: navigation.state.params ? navigation.state.params.headerColor : '#fff',
    },
    headerTitle: navigation.state.params && navigation.state.params.alpha >= 1 ? navigation.state.params.name : null,
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
    },
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack()
        }}>
        <Image style={{marginLeft: 16, width: 24, height: 24,}}
               source={navigation.state.params && (navigation.state.params.alpha >= 1 || navigation.state.params.isEmpty) ? images.left_arrow : images.image_bookdetail_arrow_left}
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          if (navigation.state.params && navigation.state.params.isEmpty) {
            return
          }
          navigation.state.params.shareAction()
        }}>
        <Image style={{marginRight: 16, width: 24, height: 24,}}
               source={navigation.state.params && navigation.state.params.alpha >= 1 ? images.image_share : images.image_bookdetail_share}
        />
      </TouchableOpacity>
    ),
  })

  constructor(props) {
    super(props)
    this.state = {
      bookId: this.props.navigation.state.params.bookId,
      order: 1,
      isCollected: false,
      animationType: 'fade', // none slide fade
      visible: false,
      transparent: true,
      adHeight: 0,
      isConnected: null,
      seletedBrief: true,
      bookDetail:{},
      isLoading: false,
    }
  }

  _openSharePage = () => {
    if (!this.state.isConnected) {
      return
    }

    UMCPS(UMConfig.book_detail_share, {book_id: this.state.bookId})

    const sex = this.props.user.info.sex || 3
    const id = this.state.bookDetail.id
    const webpageUrl = WEBPAGE_URL() + sex + "&id=" + id
    console.log('yy webpageUrl=', webpageUrl)
    this.props.navigation.navigate('Share', {
      title: `发现一本好书《${this.state.bookDetail.name}》`,
      description: this.state.bookDetail.brief.substr(0, 100),
      thumbImage: this.state.bookDetail.cover,
      webpageUrl: webpageUrl,
    })
  }

  refreshData() {
    this.props.actions.bookRelatedInit({bookId: this.state.bookId})
    // this.props.actions.bookChapterListInit({
    //   bookId: this.state.bookId,
    //   order: this.state.order
    // })

    // 查询本地数据库，判断当前book是否已加入书架
    const book = queryShelfBooks().filtered(`id == ${this.state.bookId}`)
    if (book.length === 0) {
      this.setState({
        isCollected: false,
      })
    } else {
      this.setState({
        isCollected: true,
      })
    }

  }

  clearData() {
    this.props.bookRelated.data = []
    this.props.bookChapterList.data = []
  }

  _handleConnectivityChange = isConnected => {
    this.setState({
      isConnected,
    });
  };
  componentWillMount(): void {
    //获取书籍详情页信息
    bookDetailApi(this.state.bookId)
      .then((ret) => {
        console.log('bookDetailApi result:  ', ret)
        if (ret.status === 200) {
          this.setState({
            bookDetail: ret.data,
            // isLoading: false,
          })
          this.props.navigation.setParams({'name': ret.data.name})
          this._requestOtherApi()
        } else {
          this.props.navigation.setParams({'isEmpty': true})
          // this.setState({
          //   isLoading: false,
          // })
        }

      })
      .catch((error) => {
        console.log('bookDetailApi error: ', error)
        this.props.navigation.setParams({'isEmpty': true})
        // this.setState({
        //   isLoading: false,
        // })
      })
  }

  _requestOtherApi(){
    //获取其他相关信息
    this.timer = setTimeout(()=>{
      const height = Header.HEIGHT
      console.log('yy height=', height)
      // this.props.navigation.setParams({'value': true})

      //监听网络状态改变
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleConnectivityChange,
      );
      NetInfo.isConnected.fetch().done(isConnected => {
        this.setState({isConnected});
      });

      this.props.navigation.setParams({shareAction: this._openSharePage})
      this.refreshData()
      this._syncToShelf()
      global.refDetailNavigation = this.props.navigation

      this._fetchBookComment()
      this.updateCommentListListener = DeviceEventEmitter.addListener(EmmiterKey.PUBLISH_COMMENT_SUCCESS, (e) => {
        this._fetchBookComment()
      })
    }, 100)
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange,
    );
    this.clearData()
    this._removeListener()
    global.refDetailNavigation = null
    if(!!this.updateCommentListListener){
      this.updateCommentListListener.remove()
    }
    this.props.actions.deleteBookComment()
    this.timer && clearTimeout(this.timer)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bookshelf && nextProps.bookshelf.addBookSuccess) {
      nextProps.bookshelf.addBookSuccess = false
      if (!!this.props.user.token) {
        this.props.actions.favoriteBookInit()
      }
    }
  }

  _syncToShelf() {
    // 同步书到书架
    if (Platform.OS === 'ios') {
      const {BookEventEmitter} = NativeModules
      this.syncToShelfListener = new NativeEventEmitter(BookEventEmitter)
      this.syncToShelfListener.addListener('onSyncBookToShelf', (e) => {
        console.log('detail page onSyncBookToShelf ===== ', e)
        this.setState({
          isCollected: e.isCollected
        })

        // 阅读记录
        const aBook = queryBooks().filtered(`id == ${e.book_id}`)
        const ret = {
          id: e.book_id,
          author: e.author,
          brief: e.brief,
          cover: e.cover,
          name: e.name,
          create_time: e.create_time,
          chapter: e.chapter,
          chapter_id: e.chapter_id,
          start_ad_ts: e.start_ad_ts,
          end_ad_ts: e.end_ad_ts,
          isCollected: e.isCollected,
          start_vip_ts: e.start_vip_ts,
          end_vip_ts: e.end_vip_ts,
          complete_status: e.complete_status,
        }
        if (aBook.length === 0) {
          insertBook(ret)
        } else {
          updateBook(ret)
        }
      })
    } else {
      this.listener = DeviceEventEmitter.addListener('updateBookShelf', (bookDetail) => {
        this.setState({
          isCollected: true,
        })
      })
    }
  }

  _removeListener() {
    if (Platform.OS === 'ios') {
      this.syncToShelfListener && this.syncToShelfListener.removeAllListeners('onSyncBookToShelf')
    } else {
      this.listener && this.listener.remove()
    }
  }

  render() {
    if (this.props.navigation.state.params.isEmpty) {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Image
            source={images.image_book_detail_empty}
            style={{
              width: 101,
              height: 101,
            }}
          ></Image>
          <Text style={{
            marginTop: 12,
            width: 180,
            fontSize: 15,
            color: '#ACACB9',
            textAlign: 'center',
            lineHeight: 25,
          }}>因系统升级，部分作品暂时无法阅读，敬请谅解</Text>
        </View>
      )
    }

    return (
      <View style={{flex: 1}}>
        <ScrollView
          onScroll={(e) => {
            const alpha = e.nativeEvent.contentOffset.y / 64
            this.props.navigation.setParams({
              headerColor: `rgba(255, 255, 255, ${alpha})`,
              alpha,
            });
          }}
          style={{flex: 1, backgroundColor: '#f1f1f6'}}>
          {this.renderContent()}
          {this.renderTable()}
          {this.renderAd()}
          {this.renderComment()}
          {this.renderRelated()}
          {this.renderCopyright()}
        </ScrollView>
        {this.renderBottomButton()}
        <Modal
          animationType={this.state.animationType}
          visible={this.state.visible}
          transparent={this.state.transparent}
          onRequestClose={() => {
            this.setState({
              visible: false
            })
          }}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.setState({
                visible: false
              })}/>
            <View style={{flex: 2, backgroundColor: '#fff'}}>
              <View style={{flexDirection: 'row', height: 60, alignItems: 'center', paddingHorizontal: 33}}>
                <Text style={{
                  fontSize: 15,
                  color: '#1e252f'
                }}>{this.state.bookDetail.complete_status == 1 ? "已完本" : "连载"}</Text>
                <Text style={{
                  marginStart: 8,
                  fontSize: 15,
                  color: '#1e252f'
                }}>共{this.state.bookDetail.chapter_count}章</Text>
                <View style={{flex: 1}}/>
                <TouchableOpacity
                  onPress={() => {
                    const order = this.state.order == 1 ? 2 : 1
                    console.log('yy order=' + this.state.order + ',newOrder=' + order)
                    this.props.actions.bookChapterListInit({
                      bookId: this.state.bookId,
                      order: order,
                    })
                    this.setState({
                      order: order,
                    })

                  }}
                >
                  <Text style={{fontSize: 15, color: '#f85836'}}>{this.state.order == 1 ? "倒序" : "正序"}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                style={{backgroundColor: 'white', marginStart: 33}}
                keyExtractor={(item, index) => index.toString()}
                data={this.props.bookChapterList.data}
                renderItem={this._renderItem}
                // getItemLayout={(data, index) => (
                //   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
                // )}
              />
            </View>
          </View>
        </Modal>
        <ProgressHUD
          showHUD={this.state.isLoading}
          showLoading={this.state.isLoading}
        />
      </View>
    )
  }

  _renderItem = ({item, index}) => <TouchableOpacity
    onPress={() => {
      console.log('yy click item.sort=', item, this.state.bookDetail, this.props.bookChapterList)
      this.setState({
        visible: false,
      }, () => {
        if (Platform.OS === 'ios') {
          const data = {...this.state.bookDetail}
          data.chapters = this.props.bookChapterList.data
          data.chapter_id = item.id
          data.chapter_sort = this.props.bookChapterList.order || 0
          // 避免因为 view controller 与 Modal 层级冲突
          // see: https://github.com/facebook/react-native/issues/10471
          if (this.state.order == 2) {
            const ageNameSort = R.sortWith([
              R.ascend(R.prop('sort')),
            ]);
            data.chapters = ageNameSort(data.chapters)
          }
          console.log('item ===== ', item)
          setTimeout(() => {
            BookReadManager.openBookWithInfo(data, this.props.user, 0, this.state.isCollected, item.sort - 1, Config.iosReviewVersion)
          }, 500)

        } else {
          let newIndex = index
          if (this.state.order === 2) {
            newIndex = this.props.bookChapterList.data.length - 1 - index
          }
          const {user} = this.props
          nativeModule.openNativeReaderPage(this.state.bookDetail, this.state.isCollected, newIndex, user.info.sex || 3, user.token || "",
            user.info.free_ad_expirets || 0, user.info.is_vip || 0);
        }
      })
    }}>
    {
      item.isvip === 1 && (!this.props.user.token || this.props.user.token && this.props.user.info.is_vip === 0) ?
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: ITEM_HEIGHT,
          justifyContent: 'space-between',
          marginEnd: 28
        }}>
          <Text style={{fontSize: 14, color: '#d2d2d2', width: CATEGORY_TEXT_WIDTH}} numberOfLines={1}
                ellipsizeMode='tail'>{item.title}</Text>
          <Image style={{width: 24, height: 24,}} source={images.image_chapter_lock}/>
        </View> :
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: ITEM_HEIGHT,
          justifyContent: 'space-between',
          marginEnd: 28
        }}>
          <Text style={{fontSize: 14, color: '#545c67', width: CATEGORY_TEXT_WIDTH}} numberOfLines={1}
                ellipsizeMode='tail'>{item.title}</Text>
        </View>
    }

  </TouchableOpacity>

  renderCopyright() {
    if (!!this.state.bookDetail.copyright_info) {
      return (
        <View style={{
          width: width,
          height: 100,
          paddingHorizontal: 16,
          justifyContent: 'center',
          backgroundColor: 'white'
        }}>
          <Text style={{fontSize: 12, color: '#a0a7b2'}}>
            {this.state.bookDetail.copyright_info}
          </Text>
        </View>
      )
    }

    return null
  }

  renderBottomButton() {
    return (
      <View style={{
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#ffffff',
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#cccccc'
      }}>
        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                          onPress={() => {
                            if (!this.state.isCollected && this.state.isConnected) {
                              this.setState({
                                isCollected: true,
                              })
                              UMCPS(UMConfig.book_detail_addshelf_button_click, {book_id: this.state.bookId})
                              // 统计收藏次数
                              this.props.actions.bookFavoritesInit({
                                id: this.state.bookId,
                              })

                              // 加入收藏
                              const book = queryShelfBooks().filtered(`id == ${this.state.bookId}`)
                              if (book.length === 0) {
                                const data = this.state.bookDetail
                                data.timestamp = `${Date.now()}`
                                data.icon_status = 2
                                console.log('jy detail =========== ', data, book)
                                insertShelfBook(data)
                                this.props.actions.recommendBookInitSuccess({data: convertToArray(queryShelfBooks().sorted('timestamp', true))})

                                // 更新服务器数据
                                if (!!this.props.user.token) {
                                  this.props.actions.addBookInit({
                                    book_id: this.state.bookId,
                                    chapter_id: 0,
                                    chapter_sort: 0,
                                  })
                                }
                              }
                            }
                          }}>
          <Text style={{
            fontSize: 15,
            color: this.state.isCollected ? '#fccfc9' : '#f85836'
          }}>{this.state.isCollected ? "已加入" : "加入书架"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: 141, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f85836'}}
          onPress={() => {
            if (JSON.stringify(this.state.bookDetail) == '{}' || JSON.stringify(this.state.bookDetail) == '[]' || this.state.bookDetail === undefined) {
              return
            }

            UMCPS(UMConfig.book_detail_read_button_click, {book_id: this.state.bookId})
            this.props.actions.bookCounterInit({
              id: this.state.bookId,
            })

            if (Platform.OS === 'ios') {
              const data = {...this.state.bookDetail}
              if (this.state.order == 2) {
                const ageNameSort = R.sortWith([
                  R.ascend(R.prop('sort')),
                ]);
                data.chapters = ageNameSort(this.props.bookChapterList.data)
              } else {
                data.chapters = this.props.bookChapterList.data
              }

              data.chapter_id = 0
              data.chapter_sort = 0
              BookReadManager.openBookWithInfo(data, this.props.user, 0, this.state.isCollected, -1, Config.iosReviewVersion)
            } else {
              const {user} = this.props
              nativeModule.openNativeReaderPage(this.state.bookDetail, this.state.isCollected, -1, user.info.sex || 3, user.token || "",
                user.info.free_ad_expirets || 0, user.info.is_vip || 0);
            }
          }}>
          <Text style={{fontSize: 15, color: '#ffffff'}}>免费阅读</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                          onPress={() => {
                            this._openSharePage()
                          }}>
          <Text style={{fontSize: 15, color: '#f85836'}}>分享</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _onPressSameItem = () => {
    UMCPS(UMConfig.book_detail_refresh_item_clicked, {book_id: this.state.bookId})
    this.props.actions.bookRelatedInit({bookId: this.state.bookId})
  }

  renderRelated() {
    return (
      <SameItem
        data={this.props.bookRelated.data}
        navigation={this.props.navigation}
        bookId={this.state.bookId}
        onPressItem={() => {
          this._onPressSameItem()
        }}
      />
    )
  }

  // 跳转到全部想法
  _jumpToAllComments = (page) => {
    setTimeout(() => {
      this.props.navigation.navigate('BookComments', {
        bookId: this.state.bookId,
        page
      })
    }, 500)
  }

  _fetchBookComment = () => {
    this.props.actions.bookCommentInitAction({
      book_id: this.state.bookId,
      types: 2,
      start: 0,
      size: 4,
    })
  }

  _jumpToCommentDetailPage = (value) => {
    this.props.navigation.navigate('BookCommentDetail', {
      comment_id: value.id,
      book_id: this.state.bookId,
      showDeleteButton: value.is_self_comments,
      deleteCommentSuccessCallback: () => {
        this._fetchBookComment()
      }
    })
  }


  renderComment() {
    const {bookComment} = this.props
    const commentList = bookComment.hotComments
    return (
      <View style={{
        backgroundColor: '#fff',
        marginBottom: 8,
        flexDirection: 'column',
      }}>
        <View style={{
          marginTop: 20,
          height: 20,
          flexDirection: 'row',
          backgroundColor: '#fff',
          alignItems: 'center',
          paddingHorizontal: 16,
          justifyContent: 'space-between'
        }}>
          <Text
            style={{fontSize: 16, color: '#1e252f'}}
          >
            {'想法'}
          </Text>

          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              const {user, navigation} = this.props
              if (!!user.token) {
                navigation.navigate('PublishingPost', {
                  bookId: this.state.bookId,
                  postSuccessCallback: () => {
                    this._jumpToAllComments(1)
                  }
                })
                return
              }
              navigation.navigate('Login')
            }}
          >
            <Image
              style={{
                width: 10,
                height: 10,
                marginEnd: 6,
              }}
              source={images.image_detail_edit}
            />
            <Text style={{
              fontSize: 14,
              color: '#f85836',
            }}>有话想说</Text>
          </TouchableOpacity>
        </View>

        {
          R.addIndex(R.map)((value, index) => {
            if (index >= 3) {//若commentList大于3个，则只显示3个
              return null
            }
            return (
              <BookCommentCell
                key={`detail_cell_${index}`}
                item={value}
                onPressCell={() => {
                  this._jumpToCommentDetailPage(value)
                }}
                deleteComment={(obj) => {
                  this._deleteComment(obj, index)
                }}
                onPressReply={() => {
                  this._jumpToCommentDetailPage(value)
                }}
                onPressPraise={(item) => {
                  const {user} = this.props
                  if (!!user.token) {
                    this._onPressPraise(item, index)
                  } else {
                    this._showLoginPage()
                  }
                }}
              />
            )
          }, commentList)
        }
        {commentList.length > 0 ?
          <TouchableOpacity
            style={{
              height: 40,
              marginBottom: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this._jumpToAllComments(0)
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: '#F85836'
              }}
            >全部想法</Text>
            <Image
              style={{
                marginStart: 8,
                width: 5,
                height: 10,
              }}
              source={images.image_view_all}
            />
          </TouchableOpacity>
          : null
        }

        {
          (bookComment.bookCommentListLoadSuccess && commentList.length === 0) ? (
            <View style={{marginVertical: 53, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 14, color: '#BDC5CF'}}>
                {'快来发表第一篇想法吧~'}
              </Text>
            </View>
          ) : null
        }
      </View>
    )
  }

  _deleteComment = (obj, index) => {
    const {navigation} = this.props
    navigation.navigate('AlertView', {
      onConfirm: () => {
        const {user, bookComment} = this.props
        let ids = []
        ids.push(obj.id)
        DeleteBookCommentApi(user.token, ids)
          .then(ret => {
            console.log('ret ====== ', ret);
            if (ret.status === 200) {
              bookComment.hotComments = R.remove(index, 1, bookComment.hotComments)
              this.setState({
                data: ''
              })
            } else {
              showToast(ret.message)
            }
          })
          .catch(error => {
            showToast(error.message)
          })
      },
    })
  }

  _showLoginPage = () => {
    const {navigation} = this.props
    navigation.navigate('Login', {
      loginSuccess: () => {
        this._fetchBookComment()
      }
    })
  }

  _onPressPraise = (item, index) => {
    if (item.is_praise === false) {
      this._like(item, index)
    } else {
      this._dislike(item, index)
    }
  }

  _like = (item, rowIndex) => {
    const {user, bookComment} = this.props
    LikeApi(user.token, item.id, item.id, 1)
      .then(ret => {
        console.log('ret ====== ', ret);
        if (ret.status === 200) {
          bookComment.hotComments[rowIndex].is_praise = true
          bookComment.hotComments[rowIndex].praise_num = bookComment.hotComments[rowIndex].praise_num + 1
          this.setState({
            data: ''
          })
          IncreaseHotBean(user.token, 16).then(resolve => {
            if (!resolve.taskCompleted) {
              showToast('已成功领取热豆')
            }
          })
        } else {
          showToast(ret.message)
        }
      })
      .catch(error => {
        showToast(error.message)
      })
  }

  _dislike = (item, rowIndex) => {
    const {user, bookComment} = this.props
    DislikeApi(user.token, item.id, 1)
      .then(ret => {
        console.log('ret ====== ', ret);
        if (ret.status === 200) {
          bookComment.hotComments[rowIndex].is_praise = false
          bookComment.hotComments[rowIndex].praise_num = bookComment.hotComments[rowIndex].praise_num - 1
          this.setState({
            data: ''
          })
        } else {
          showToast(ret.message)
        }
      })
      .catch(error => {
        showToast(error.message)
      })
  }

  renderAd() {
    if (Platform.OS === 'ios') {
      return (
        <AdView
          style={{
            marginTop: 8,
            marginBottom: this.state.adHeight === 0 ? 0 : 8,
            width: width,
            height: this.state.adHeight
          }}
          onNativeAdDidLoad={e => {
            this.setState({
              adHeight: 121,
            })
          }}
          onNativeAdLoadFailed={(e) => {
            this.setState({
              adHeight: 0,
            })
          }}
        />
      )
    }

    return (
      <AdView
        style={{
          marginTop: 8,
          marginBottom: this.state.adHeight === 0 ? 0 : 8,
          width: width,
          height: this.state.adHeight,
        }}
        onNativeAdDidLoad={e => {
          this.setState({
            adHeight: parseInt(e.nativeEvent.height),
          })
        }}
        onNativeAdLoadFailed={(e) => {
          console.log('yy onNativeAdLoadFailed')
          this.setState({
            adHeight: 0,
          })
        }}
      />
    )
  }


  renderTable() {
    const {chapter_count, complete_status} = this.state.bookDetail

    return (
      <TouchableOpacity
        onPress={() => {
          UMCPS(UMConfig.book_detail_menu_clicked, {book_id: this.state.bookId})
          this.props.actions.bookChapterListInit({
            bookId: this.state.bookId,
            order: this.state.order
          })
          this.setState({
            visible: true
          })

        }}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          height: 49,
          backgroundColor: '#ffffff',
          paddingHorizontal: 16
        }}>
          <Text style={{fontSize: 16, color: '#1e252f'}}>目录</Text>
          <Text style={{marginStart: 14, fontSize: 12, color: '#949ba5'}}>共{chapter_count}章</Text>
          <View style={{flex: 1}}/>
          <Text style={{
            fontSize: 14,
            color: complete_status === 1 ? '#ffa60a' : '#2a90ef'
          }}>{complete_status === 1 ? "已完结" : "连载中"}</Text>
          <Image source={images.image_detail_table_expand}
                 style={{marginStart: 8, width: 15, height: 18}}/>
        </View>
      </TouchableOpacity>
    )
  }

  _renderPopularity() {
    const {popularity} = this.state.bookDetail
    if (popularity < 10000) {
      return (<CommonItem
        name="人气值"
        value={popularity}
        unit=""
      />)
    } else if (popularity > 100 * 10000) {
      return (<CommonItem
        name="人气值"
        value={100}
        unit="万"
      />)
    }

    let popularityCount = popularity / 10000
    return (<CommonItem
      name="人气值"
      value={popularityCount.toFixed(1)}
      unit="万"
    />)
  }

  renderContent() {
    const {name, author, complete_status, word_count, category_name, brief, cover, popularity, score, online_count, recommend_text, keywords} = this.state.bookDetail//this.props.bookDetail.data
    let wordCount = word_count / 10000
    return (
      <View style={{flex: 1, backgroundColor: '#fff',}}>
        <ImageBackground
          style={{width: width, height: HEADER_HEIGHT + 140,}}
          source={{uri: cover, cache: 'force-cache'}}
          resizeMethod="resize"
          blurRadius={10}
        >
          <View style={{width: width, height: HEADER_HEIGHT + 140, backgroundColor: 'rgba(0,0,0,0.4)'}}>
            <View style={{
              width: width,
              height: HEADER_HEIGHT,
            }}>
            </View>
            <View style={{flexDirection: 'row', width: width, height: 140, paddingTop: 10}}>
              <View style={{marginStart: 38, flex: 1, height: 113, justifyContent: 'space-between'}}>
                <Text style={{fontSize: 18, color: '#fff',}}
                      numberOfLines={2}
                      ellipsizeMode='tail'>{name}</Text>
                <Text style={{fontSize: 12, color: '#fff'}}
                      numberOfLines={1}
                      ellipsizeMode='tail'>{author}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{
                    fontSize: 12,
                    color: complete_status === 1 ? '#ffde00' : '#83cfff'
                  }}>{complete_status === 1 ? "已完结" : "连载"}</Text>
                  <View style={{marginLeft: 10, marginRight: 10, width: 1, height: 8, backgroundColor: '#fff'}}/>
                  <Text style={{fontSize: 12, color: '#fff'}}>{wordCount.toFixed(1)}万字</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{
                    borderRadius: 8,
                    backgroundColor: '#f85836',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 9,
                    paddingBottom: 1,
                    height: 18
                  }}>
                    <Text style={{fontSize: 11, color: '#fff',}}>{category_name}</Text>
                  </View>
                  <View style={{flex: 1}}/>
                </View>
              </View>
              <Image
                source={{uri: cover, cache: 'force-cache'}}
                resizeMethod="resize"
                defaultSource={images.image_placeholder}
                style={{marginStart: 16, marginEnd: 40, width: 80, height: 113, borderRadius: 3}}
              />
            </View>
          </View>

        </ImageBackground>

        <View style={{
          marginTop: 24,
          flex: 1,
          height: COMMON_ITEM_HEIGHT,
          alignItems: 'center',
          backgroundColor: '#ffffff',
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>
          {this._renderPopularity()}
          <View style={{width: 1 / PixelRatio.get(), height: COMMON_ITEM_HEIGHT, backgroundColor: '#dcdcdc'}}/>
          <CommonItem
            name="评分"
            value={score}
            unit="分"
          />
          <View style={{width: 1 / PixelRatio.get(), height: COMMON_ITEM_HEIGHT, backgroundColor: '#dcdcdc'}}/>
          <CommonItem
            name="同时在线人数"
            value={online_count}
            unit="人"
          />
        </View>
        {
          !!recommend_text ?
            (
              <ImageBackground
                source={images.image_bookdetail_recommend_bg}
                style={{
                  marginTop: 20,
                  width: width - 16 * 2,
                  height: 80,
                  marginHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                resizeMode='contain'
              >
                <Image
                  source={images.image_bookdetail_recommend_book}
                  style={{
                    marginStart: 8,
                    width: 50,
                    height: 58,
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    marginStart: 4,
                    marginEnd: 24,
                    fontSize: 13,
                    color: '#d8bc9c',
                    lineHeight: 20,
                  }}
                  numberOfLines={2}
                  ellipsizeMode='tail'
                >
                  {recommend_text}
                </Text>
              </ImageBackground>
            )
            : null
        }


        {
          <View style={{marginTop: 24, marginHorizontal: 16}}>
            <Text
              onPress={() => {
                this.setState({
                  seletedBrief: !this.state.seletedBrief
                })
                UMCPS(UMConfig.book_detail_synopsis_clicked, {book_id: this.state.bookId})
              }}
              numberOfLines={this.state.seletedBrief ? 3 : 200}
              style={{
                fontSize: 14,
                color: '#545c67',
                lineHeight: 20,
                marginBottom: 5
              }}
            >
              {brief}
            </Text>
          </View>
        }
        {
          !!keywords ?
            (<View style={{marginTop: 5, marginHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap'}}>
              {
                R.addIndex(R.map)((value, index) => {
                  return (
                    <View
                      key={`keyword_${index}`}
                      style={{
                        marginTop: 5,
                        marginEnd: 10,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: '#f1f1f6',
                        paddingHorizontal: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text>{value}</Text>
                    </View>
                  )
                }, keywords.split(/[\n\s+,，]/g))
              }
            </View>) : null
        }

        <View style={{marginTop: !!keywords ? 16 : 5, height: 1, backgroundColor: '#f1f1f6'}}/>
      </View>)

  }
}

class CommonItem extends Component {
  render() {
    if (this.props.value === undefined || this.props.value === 'NaN') {
      return null
    }

    const {name, value, unit} = this.props

    return (
      <View style={{flex: 1, height: COMMON_ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 19,
            color: '#1e252f'
          }}
        >
          {value + " "}
          <Text style={{marginStart: 6, fontSize: 11, color: '#1e252f'}}>
            {unit}
          </Text>
        </Text>

        <View style={{flex: 1}}/>
        <Text style={{
          fontSize: 11,
          color: '#949ba5'
        }}>{name}</Text>
      </View>
    )
  }
}


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...bookCommentAction,
    ...bookDetailAction,
    ...bookRelatedlAction,
    ...bookFavoritesAction,
    ...bookCounterAction,
    ...bookChapterListAction,
    ...bookshelfAction
  }, dispatch),
})

export default connect(({bookDetail, bookRelated, bookFavorites, bookCounter, bookChapterList, bookshelf, user, bookComment}) => ({
  bookDetail, bookRelated, bookFavorites, bookCounter, bookChapterList, bookshelf, user, bookComment
}), mapDispatchToProps)(DetailPage)
