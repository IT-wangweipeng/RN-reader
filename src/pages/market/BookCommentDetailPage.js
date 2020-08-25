import React, {Component} from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  PixelRatio,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StyleSheet, DeviceEventEmitter
} from 'react-native'

import {LikeApi, DislikeApi, DeleteCommentApi} from "../../apis/Api";
import {showToast} from "../../actions/toastAction";
import IMAGES from "../../component/images";
import {sendAction} from "../../utils/Analysis/UMengEvent";
import * as UMConfig from "../../utils/Analysis/UMConfig";

import PropTypes from 'prop-types'
import {SafeAreaView} from "react-navigation";
import ProgressHUD from 'react-native-progress-hud'
import {connect} from "react-redux";
import images from '../../component/images'
import {bindActionCreators} from "redux";
import * as bookCommentAction from '../../reducers/bookCommentReducer'
import BookCommentCell from './BookCommentCell'
import ListFooter from "../../component/ListFooter";
import * as EmmiterKey from '../../utils/EventEmmiterKey'
import NoMessageView from "../../component/NoMessageView";
import R from "ramda";
import {IncreaseHotBean} from "../../utils/IncreaseHotBean";



const {width, height} = Dimensions.get('window')

class BookCommentDetailPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      replyContent: ''
    }
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    headerRight: navigation.state.params.showDeleteButton ? (
      <TouchableOpacity
        style={{marginRight: 14, width: 44, height: 44, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          navigation.state.params.handleAction()
        }}
      >
        <Text style={{color: '#A0A0A0'}}>
          {'删除'}
        </Text>
      </TouchableOpacity>
    ) : null,
  })


  componentWillMount(): void {
    this._fetchBookCommentDetail()
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (nextProps.bookComment.deleteCommentSuccess) {
      const {navigation} = this.props
      navigation.goBack()
      nextProps.bookComment.deleteCommentSuccess = false
      navigation.state.params.deleteCommentSuccessCallback && navigation.state.params.deleteCommentSuccessCallback()
    }
  }

  componentDidMount(): void {
    this.props.navigation.setParams({handleAction: this._deletePostAction})

    this.commentListener = DeviceEventEmitter.addListener(EmmiterKey.COMMENT_SUCCESS_EVENT, (e) => {
      this._fetchBookCommentDetail()
      this._increaseHotBean()
    })
  }

  componentWillUnmount(): void {
    this.commentListener.remove()
    this.props.actions.deleteCommentDetail()
  }

  _increaseHotBean = () => {
    const {user} = this.props
    if (!!user.token) {
      IncreaseHotBean(user.token, 15).then(resolve => {
        if (!resolve.taskCompleted) {
          showToast('已成功领取热豆')
        }
      })
    }
  }

  _fetchBookCommentDetail = () => {
    this.props.actions.bookCommentDetailInitAction({
      comment_id: this.props.navigation.state.params.comment_id,
      start: 0,
    })
  }

  _deletePostAction = () => {
    const {navigation} = this.props
    navigation.navigate('AlertView', {
      onConfirm: () => {
        let comment_ids = []
        comment_ids.push(navigation.state.params.comment_id)
        this.props.actions.deleteBookCommentInitAction({
          comment_ids
        })
      },
    })
  }


  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          style={{flex: 1}}
          data={this.props.bookComment.replyList || []}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={this._renderEmptyView}
          ListHeaderComponent={this._renderListHeader}
          ListFooterComponent={this._ListFooterComponent}
          onEndReached={this._handleLoadingMore}
          onEndReachedThreshold={0.1}
        />
        <View style={styles.comment}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 7, marginRight: 15}}>
            <TouchableOpacity
              style={{justifyContent: 'center', backgroundColor: '#F1F1F6', flex: 1, height: 36}}
              onPress={() => {
                const {user} = this.props
                if (!!user.token) {
                  this._showCommentPage(1, undefined)
                  return
                }
                this._showLoginPage()
              }}
            >
              <View>
                <Text style={{marginLeft: 9, color: '#A0A0A0', fontSize: 15}}>
                  {this.state.replyContent || '有想法大家一起探讨吧！'}
                </Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                this._onPressPraise(-1, undefined)
              }}
            >
              <Image
                style={{width: 20, height: 17, marginLeft: 17}}
                source={this.props.bookComment.commentDetail && this.props.bookComment.commentDetail.is_praise ? images.image_comment_praise_select : images.image_comment_praise_unselect}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ProgressHUD
          showHUD={this.props.bookComment.isLoading}
          showLoading={this.props.bookComment.isLoading}
        />
      </SafeAreaView>
    )
  }

  _keyExtractor = (item, index) => item.id;

  _renderEmptyView = () => {
    if (this.props.bookComment.loadSuccess) {
      return (
        <NoMessageView
          style={{marginTop: 58,}}
        />
      )
    }
    return  null
  }

  _renderListHeader = () => {
    const {bookComment} = this.props
    return (
      <View>
        <BookCommentCell
          item={bookComment.commentDetail}
          hiddenReplyButton={true}
          onPressPraise={() => {
            this._onPressPraise(-1, undefined)
          }}
        />
        <View
          style={{flex: 1, height: 7, backgroundColor: '#F1F1F6'}}
        />
        <Text style={{marginLeft: 15, marginTop: 22, color: '#191D21', fontSize: 16}}>
          {'全部评论'}
        </Text>
      </View>
    )
  }

  _renderItem = ({item, index}) => {
    return (
      <BookCommentCell
        key={`comment_detail_${index}`}
        item={item}
        hiddenReplyButton={false}
        onPressReply={(item) => {
          if (!!this.props.user.token) {
            this._showCommentPage(2, item.id)
            return
          }
          this._showLoginPage()
        }}
        onPressPraise={(item) => {
          this._onPressPraise(index, item)
        }}
        deleteComment={(obj) => {
          this._deleteComment(obj, index)
        }}
      />
    )
  }

  _deleteComment = (obj, index) => {
    const {navigation} = this.props
    navigation.navigate('AlertView', {
      onConfirm: () => {
        const {user, bookComment} = this.props
        let ids = []
        ids.push(obj.id)
        DeleteCommentApi(user.token, ids)
          .then(ret => {
            console.log('ret ====== ', ret);
            if (ret.status === 200) {
              bookComment.replyList = R.remove(index, 1, bookComment.replyList)
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

  _onPressPraise = (rowIndex, item) => {
    this.rowIndex = rowIndex
    const { user, bookComment } = this.props
    console.log('rowIndex  ====== ', rowIndex, bookComment.commentDetail.is_praise )
    const {comment_id} = this.props.navigation.state.params
    if (!!user.token) {
      // 赞想法
      if (rowIndex === -1) {
        if (bookComment.commentDetail.is_praise === true) {
          this._dislike(comment_id, 1)
        } else {
          this._like(comment_id, comment_id, 1)
        }
      } else {
        // 赞评论
        if (item.is_praise === false) {
          this._like(comment_id, item.id, 2)
        } else {
          this._dislike(item.id, 2)
        }
      }
      return
    }
    this._showLoginPage()
  }

  _like = (comment_id, reply_id, types) => {
    const {user, bookComment} = this.props
    LikeApi(user.token, reply_id, comment_id, types)
      .then(ret => {
        console.log('ret ====== ', ret);
        if (ret.status === 200) {
          if (this.rowIndex === -1) {
            bookComment.commentDetail.is_praise = true
            bookComment.commentDetail.praise_num = bookComment.commentDetail.praise_num + 1
          } else {
            bookComment.replyList[this.rowIndex].is_praise = true
            bookComment.replyList[this.rowIndex].praise_num = bookComment.replyList[this.rowIndex].praise_num + 1
          }
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

  _dislike = (reply_id, types) => {
    const {user, bookComment} = this.props
    DislikeApi(user.token, reply_id, types)
      .then(ret => {
        console.log('ret ====== ', ret);
        if (ret.status === 200) {
          if (this.rowIndex === -1) {
            bookComment.commentDetail.is_praise = false
            bookComment.commentDetail.praise_num = bookComment.commentDetail.praise_num -1
          } else {
            bookComment.replyList[this.rowIndex].is_praise = false
            bookComment.replyList[this.rowIndex].praise_num = bookComment.replyList[this.rowIndex].praise_num - 1
          }
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

  _ListFooterComponent = () => {
    const {bookComment} = this.props
    if (bookComment.replyList && bookComment.replyList.length > 0) {
      return (
        <ListFooter
          hasMore={bookComment.replyHasMore}
        />
      )
    }

    return null
  }

  _showLoginPage = () => {
    const {navigation} = this.props
    navigation.navigate('Login', {
      loginSuccess: () => {
        this._fetchBookCommentDetail()
      }
    })
  }

  _showCommentPage = (types, reply_id) => {
    const {book_id, comment_id} = this.props.navigation.state.params
    this.props.navigation.navigate('Comment', {
      book_id,
      comment_id,
      reply_id: reply_id || comment_id, // 回复想法时，默认传 comment_id
      types,
      replyContent: this.state.replyContent,
      commentCallback: (ret) => {
        this.setState({
          replyContent: ret
        })
      }
    })
  }

  _handleLoadingMore = () => {
    const {navigation, bookComment} = this.props
    if (!bookComment.isReplyLoadMore && bookComment.replyHasMore) {
      this.props.actions.bookCommentDetailLoadMoreAction({
        comment_id: navigation.state.params.comment_id,
        start: bookComment.replyList.length,
      })
    }
  }
}

BookCommentDetailPage.defaultProps = {
  comment_id: 0,
  book_id: 0,
}

BookCommentDetailPage.propTypes = {
  comment_id: PropTypes.number.isRequired,
  book_id: PropTypes.number.isRequired,
  showDeleteButton: PropTypes.bool
}


const styles = StyleSheet.create({
  cellWrapper: {
    flexDirection: 'row',
    backgroundColor: 'cyan',
    marginLeft: 16,
    marginRight: 16,
    paddingTop: 20,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  comment: {
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  }
})


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...bookCommentAction,
  }, dispatch),
})

export default connect(({user, bookComment}) => ({
  user,
  bookComment
}), mapDispatchToProps)(BookCommentDetailPage)
