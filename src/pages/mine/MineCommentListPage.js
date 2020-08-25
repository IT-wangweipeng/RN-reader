import React, {Component} from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  PixelRatio
} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import images from '../../component/images'
import * as mineCommentAction from "../../reducers/mineCommentListReducer";
import BookCommentCell from "../market/BookCommentCell";
import ListFooter from "../../component/ListFooter";
import {DeleteBookCommentApi} from "../../apis/Api";
import R from "ramda";
import {showToast} from "../../actions/toastAction";

const {width, height} = Dimensions.get('window')



class MineCommentListPage extends Component {

  constructor(props) {
    super(props)

    this.bookId = this.props.navigation.state.params.book_id
    this.data = {

    }
  }

  componentWillMount(): void {
    this._mineBookCommentDetail()
  }

  componentWillUnmount(): void {
    const {callback} = this.props.navigation.state.params
    callback && callback()
  }


  render() {
    return (
      <FlatList
        style={{flex: 1}}
        data={this.props.mineComment.commentDetailList || []}
        extraData={this.state}
        initialNumToRender={10}
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
        key={`mine_comment_detail_${index}`}
        item={item}
        canDelete={true}
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
          this._toCommentDetailPage(item)
        }}
      />
    )
  }

  _deleteComment = (obj, index) => {
    const {navigation, mineComment} = this.props
    navigation.navigate('AlertView', {
      onConfirm: () => {
        const {user, bookComment, types} = this.props
        let ids = []
        ids.push(obj.id)
        DeleteBookCommentApi(user.token, ids)
          .then(ret => {
            console.log('ret ====== ', ret);
            if (ret.status === 200) {
              mineComment.commentDetailList = R.remove(index, 1, mineComment.commentDetailList)
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

  _mineBookCommentDetail = () => {
    this.props.actions.mineBookCommentDetailListInitAction({
      book_id: this.bookId,
      start: 0,
      size: 10,
    })
  }


  _toCommentDetailPage = (item) => {
    this.props.navigation.navigate('BookCommentDetail', {
      comment_id: item.comment_id,
      book_id: this.bookId,
      showDeleteButton: true,
      deleteCommentSuccessCallback: () => {
        this._mineBookCommentDetail()
      }
    })
  }

  _handleLoadingMore = () => {
    const {mineComment} = this.props
    if (!mineComment.isCommentDetailLoadingMore && mineComment.commentDetailListHasMore) {
      this.props.actions.mineBookCommentDetailLoadMoreInitAction({
        book_id: this.bookId,
        start: mineComment.commentDetailList.length,
        size: 10,
      })
    }
  }

  _ListFooterComponent = () => {
    const {mineComment} = this.props
    if (mineComment.commentDetailList.length > 0) {
      return (
        <ListFooter
          hasMore={mineComment.commentDetailListHasMore}
        />
      )
    }

    return null
  }
}

MineCommentListPage.propTypes = {}

const styles = StyleSheet.create({

})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...mineCommentAction,
  }, dispatch)
})

export default connect(({user, mineComment}) => {
  return {
    user,
    mineComment,
  }
}, mapDispatchToProps)(MineCommentListPage)
