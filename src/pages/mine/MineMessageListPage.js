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
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TopTabBar from '../category/TopTabBar'
import images from '../../component/images'
import ListFooter from '../../component/ListFooter'
import * as mineMessageAction from '../../reducers/mineMessageReducer'
import NoMessageView from "../../component/NoMessageView";

const {width, height} = Dimensions.get('window')




class MineMessageListPage extends Component {

  constructor(props) {
    super(props)

    this.data = {

    }
  }

  componentWillMount(): void {
    this._fetchMineMessage()
  }

  render() {
    return (
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        data={this.props.mineMessage.list || []}
        extraData={this.state}
        ListEmptyComponent={this._empty}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this._ListFooterComponent}
        onEndReached={this._handleLoadingMore}
        onEndReachedThreshold={0.1}
      />
    )
  }

  _keyExtractor = (item, index) => item.id;

  _fetchMineMessage = () => {
    this.props.actions.mineMessageListInitAction({
      start: 0,
      size: 10,
    })
  }

  _onPressItem = (item) => {
    if (item.jump_type === 1) {
      this.props.navigation.navigate('BookCommentDetail', {
        comment_id: item.comment_id,
        book_id: item.book_id,
        showDeleteButton: true,
        deleteCommentSuccessCallback: () => {
          this._fetchMineMessage()
        }
      })
    }
  }

  _empty = () => {
    if (this.props.mineMessage.loadSuccess) {
      return (
        <View style={{justifyContent: 'center', flex: 1}}>
          <NoMessageView
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
        onPress={() => {
          this._onPressItem(item)
        }}
      >
        <View style={styles.cellWrapper}>
          {
            item && item.is_vip === 1 ? (
              <View style={{marginTop: 10,}}>
                <Image
                  source={images.vip_crown}
                  style={{marginLeft: 16, width: 14, height: 14}}
                />

                <Image
                  style={[styles.avatar, {marginTop: -4}]}
                  defaultSource={images.image_avatar_placeholder}
                  source={ item.pic ? {uri: item.pic, cache: 'force-cache'} : images.image_avatar_placeholder}
                />
              </View>
            ) : (
              <Image
                style={[styles.avatar, {marginTop: 21}]}
                defaultSource={images.image_avatar_placeholder}
                source={ item.pic ? {uri: item.pic, cache: 'force-cache'} : images.image_avatar_placeholder}
              />
            )
          }


          <View style={styles.viewWrapper}>
            <Text style={{fontSize: 15, color: '#949BA5', marginTop: 25,}}>
              {`${item.nickname}`}
              {
                item.reply_level === 1 ? (
                  <Text style={{color: '#1E252F', fontWeight: '500'}}>
                    {' 赞了你'}
                  </Text>
                ) : (
                  <Text style={{color: '#1E252F', fontWeight: '500'}}>
                    {' 回复了你'}
                  </Text>
                )
              }
            </Text>
            {
              item.reply_level === 1 ? (
                <Text
                  style={{marginTop: 11, fontSize: 14, color: '#949BA5', marginBottom: 19}}
                  numberOfLines={1}
                >
                  {`${item.content}`}
                </Text>
              ) : (
                <View style={{marginBottom: 19}}>
                  <Text
                    style={{marginTop: 11, fontSize: 14, color: '#545C67', lineHeight: 20}}
                  >
                    {`${item.content}`}
                  </Text>
                  <Text
                    style={{marginTop: 18, fontSize: 14, color: '#949BA5'}}
                    numberOfLines={1}
                  >
                    {`${item.replyed_comment}`}
                  </Text>
                </View>
              )
            }
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _handleLoadingMore = () => {
    const {mineMessage} = this.props
    if (!mineMessage.isLoadingMore && mineMessage.messageHasMore) {
      this.props.actions.mineMessageListLoadMoreInitAction({
        start: mineMessage.list.length,
        size: 10,
      })
    }
  }

  _ListFooterComponent = () => {
    const {mineMessage} = this.props
    if (mineMessage.list.length > 0) {
      return (
        <ListFooter
          hasMore={mineMessage.messageHasMore}
        />
      )
    }

    return null
  }
}

const styles = StyleSheet.create({
  cellWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginLeft: 15,
    flexDirection: 'row'
  },
  viewWrapper: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1.0 / PixelRatio.get('window'),
    borderBottomColor: '#CCCCCC'
  },
  avatar: {
    width: 24,
    height: 24,
    // marginTop: 21,
    borderRadius: 12,
    backgroundColor: '#fff'
  }
})

MineMessageListPage.propTypes = {};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...mineMessageAction
  }, dispatch)
})

export default connect(({user, mineMessage}) => {
  return {
    user,
    mineMessage,
  }
}, mapDispatchToProps)(MineMessageListPage)

