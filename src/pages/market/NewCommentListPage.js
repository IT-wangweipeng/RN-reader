import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlatList, View } from 'react-native'
import BookCommentCell from './BookCommentCell'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import R from 'ramda'
import * as bookCommentAction from '../../reducers/bookCommentReducer'
import {DislikeApi, LikeApi, DeleteBookCommentApi} from "../../apis/Api";
import {showToast} from "../../actions/toastAction";
import ListFooter from "../../component/ListFooter";
import {IncreaseHotBean} from "../../utils/IncreaseHotBean";



class NewCommentListPage extends Component {

  componentWillMount(): void {
    this._fetchBookComment()
  }

  render () {
    const {bookComment} = this.props
    return (
      <FlatList
        style={{flex: 1}}
        listKey={() => 'list_key_' + this.props.types.toString()}
        data={bookComment.newComments || []}
        extraData={this.state}
        onScroll={this.props.onScroll}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this._ListFooterComponent}
        onEndReached={this._handleLoadingMore}
        onEndReachedThreshold={0.1}
      />
    )
  }

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({item, index}) => {
    return (
      <BookCommentCell
        key={`${this.props.cellKey}${index}`}
        item={item}
        onPressCell={() => {
          this._toCommentDetailPage(item)
        }}
        deleteComment={(obj) => {
          this._deleteComment(obj, index)
        }}
        onPressReply={() => {
          this._toCommentDetailPage(item)
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
  }

  _deleteComment = (obj, index) => {
    const {navigation} = this.props
    navigation.navigate('AlertView', {
      onConfirm: () => {
        const {user, bookComment, types} = this.props
        let ids = []
        ids.push(obj.id)
        DeleteBookCommentApi(user.token, ids)
          .then(ret => {
            console.log('ret ====== ', ret);
            if (ret.status === 200) {
              bookComment.newComments = R.remove(index, 1, bookComment.newComments)
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

  _handleLoadingMore = () => {
    const {bookComment, types} = this.props
    const hasMore = bookComment.newCommentsHasMore
    const start = bookComment.newComments.length
    if (!bookComment.isCommentListLoadingMore && hasMore) {
      this.props.actions.bookCommentLoadingMoreInitAction({
        book_id: this.props.bookId,
        types: 1,
        start,
        size: 10,
      })
    }
  }

  _ListFooterComponent = () => {
    const {bookComment, types} = this.props
    const comment = bookComment.newComments
    const hasMore = bookComment.newCommentsHasMore
    if (comment.length > 0) {
      return (
        <ListFooter
          hasMore={hasMore}
        />
      )
    }

    return null
  }


  _showLoginPage = () => {
    const {navigation} = this.props
    navigation.navigate('Login', {
      loginSuccess: () => {
        this._fetchBookComment()
      }
    })
  }

  _fetchBookComment = () => {
    this.props.actions.bookCommentInitAction({
      book_id: this.props.bookId,
      types: this.props.types,
      start: 0,
      size: 10,
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
    const {user, bookComment, types} = this.props
    LikeApi(user.token, item.id, item.id, 1)
      .then(ret => {
        console.log('ret ====== ', ret);
        if (ret.status === 200) {
          bookComment.newComments[rowIndex].is_praise = true
          bookComment.newComments[rowIndex].praise_num = bookComment.newComments[rowIndex].praise_num + 1
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
    const {user, bookComment, types} = this.props
    DislikeApi(user.token, item.id, 1)
      .then(ret => {
        console.log('ret ====== ', ret);
        if (ret.status === 200) {
          bookComment.newComments[rowIndex].is_praise = false
          bookComment.newComments[rowIndex].praise_num = bookComment.newComments[rowIndex].praise_num - 1
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

  _toCommentDetailPage = (item) => {
    this.props.navigation.navigate('BookCommentDetail', {
      comment_id: item.id,
      book_id: this.props.bookId,
      showDeleteButton: item.is_self_comments,
      deleteCommentSuccessCallback: () => {
        this.props.actions.bookCommentInitAction({
          book_id: this.props.bookId,
          types: this.props.types,
          start: 0,
          size: 10,
        })
      }
    })
  }
}

NewCommentListPage.propTypes = {}


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...bookCommentAction,
  }, dispatch),
})

export default connect(({user, bookComment}) => ({
  user,
  bookComment
}), mapDispatchToProps)(NewCommentListPage)
