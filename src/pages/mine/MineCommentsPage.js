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
import ListFooter from '../../component/ListFooter'
import * as mineCommentAction from "../../reducers/mineCommentListReducer"
import NoMessageView from "../../component/NoMessageView";

const {width, height} = Dimensions.get('window')



class MineCommentsPage extends Component {

  constructor(props) {
    super(props)

    this.data = {

    }
  }

  componentWillMount(): void {
    this._mineBookComment()
  }

  _mineBookComment = () => {
    this.props.actions.mineBookCommentListInitAction({
      start: 0,
      size: 10,
    })
  }


  render() {
    return (
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        data={this.props.mineComment.bookList || []}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this._ListFooterComponent}
        ListEmptyComponent={this._renderEmptyView}
        onEndReached={this._handleLoadingMore}
        onEndReachedThreshold={0.1}
      />
    )
  }

  _keyExtractor = (item, index) => item.id;

  _renderEmptyView = () => {
    if (this.props.mineComment.loadSuccess) {
      return (
        <View style={{justifyContent: 'center', flex: 1}}>
          <NoMessageView
            message={'暂无内容'}
            style={{marginTop: -60}}
          />
        </View>

      )
    } else {
      return null
    }
  }



  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={`mine_comment_${index}`}
        onPress={() => {
          this._toCommentDetailPage(item)
        }}
      >
        <View style={styles.cellWrapper}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                defaultSource={images.image_placeholder}
                style={{width: 50, height: 70}}
                source={{uri: `${item.cover || ''}`}}
              />
              <Text style={styles.name}>
                {`${item.name || ''}`}
              </Text>
            </View>

            <View style={{flexDirection: 'row', marginRight: 15,}}>
              <Text style={{ fontSize: 14, color: '#949BA5'}}>
                {`${item.comment_num}条想法`}
              </Text>
              <Image
                source={images.image_arrow_right}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _toCommentDetailPage = (item) => {
    this.props.navigation.navigate('MineCommentList', {
      book_id: item.book_id,
      callback: () => {
        this._mineBookComment()
      }
    })
  }

  _handleLoadingMore = () => {
    const {mineComment} = this.props
    if (!mineComment.isBookListLoadingMore && mineComment.bookListHasMore) {
      this.props.actions.mineBookCommentListLoadMoreInitAction({
        start: mineComment.bookList.length,
        size: 10,
      })
    }
  }

  _ListFooterComponent = () => {
    const {mineComment} = this.props
    if (mineComment.bookList.length > 0) {
      return (
        <ListFooter
          hasMore={mineComment.bookList.bookListHasMore}
        />
      )
    }

    return null
  }
}

MineCommentsPage.propTypes = {}

const styles = StyleSheet.create({
  cellWrapper: {
    height: 110,
    marginLeft: 15,
    justifyContent: 'center',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1.0 / PixelRatio.get('window'),
  },
  name: {
    marginLeft: 15,
    color: '#191D21',
    fontSize: 16
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...mineCommentAction
  }, dispatch)
})

export default connect(({category, user, mineComment}) => {
  return {
    category,
    user,
    mineComment,
  }
}, mapDispatchToProps)(MineCommentsPage)


