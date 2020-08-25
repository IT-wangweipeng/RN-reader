import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  PixelRatio,
  RefreshControl,
  Dimensions,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as viewMoreAction from '../../../actions/viewMoreAction'
import images from "../../../component/images";
import ListFooter from "../../../component/ListFooter";

const {width} = Dimensions.get('window')

const PADDING_HORIZONTAL = 16
const START_PAGE = 0
const ONE_PAGE_SIZE = 10
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 110
const SCORE_TEXT_WIDTH = 40
const TEXT_WIDTH = width - PADDING_HORIZONTAL*2 - PADDING_HORIZONTAL - IMAGE_WIDTH - SCORE_TEXT_WIDTH

class ViewMorePage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      categoryId: this.props.navigation.state.params.categoryId,
      name: this.props.navigation.state.params.name,
    }
  }

  componentWillMount() {
    this.props.actions.viewMoreInit({
      id: this.state.categoryId,
      size: ONE_PAGE_SIZE,
      start: START_PAGE,
    })
  }

  renderView() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this._empty}
          // ItemSeparatorComponent={this._separator}
          removeClippedSubviews
          data={this.props.viewMore.list}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={this._loadMore}
          refreshControl={(
            <RefreshControl
              onRefresh={this._onRefresh}
              color="#ccc"
              refreshing={this.props.viewMore.isRefreshing}
            />)}
          ListFooterComponent={this._renderFooter}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderView()}
      </View>
    )
  }

  _onRefresh = () => {
    this.props.actions.viewMoreInit({
      id: this.state.categoryId,
      size: ONE_PAGE_SIZE,
      start: START_PAGE,
    })
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Detail', {bookId: item.id,})
        }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          height: 106,
          marginTop: 12,
          paddingHorizontal: PADDING_HORIZONTAL
        }}>
          <ImageBackground source={{uri: item.cover}}
                 resizeMethod="resize"
                 defaultSource={images.image_placeholder}
                 style={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
                 imageStyle={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
          >
            {
              item.isvip === 1 ?
                <Image
                  style={{position: 'absolute',width: 18, height: 16, right: 5}}
                  source={images.image_vip_xianmian_bage}
                />: null
            }
          </ImageBackground>
          <View style={{flex: 1, marginStart: 16}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 16, color: '#1e252f', width: TEXT_WIDTH}}
                    numberOfLines={1}
                    ellipsizeMode='tail'>{item.name}</Text>
              <Text style={{fontSize: 16, color: '#f85836'}}>{item.score}分</Text>
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={{
                marginTop: 12,
                fontSize: 14,
                color: '#545c67'
              }}>{item.brief}</Text>
            <View style={{flex: 1}}/>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={{fontSize: 11, color: '#939aa2'}}>{item.author}</Text>
              <View style={{flex: 1}}/>
              <View style={{
                borderRadius: 8,
                backgroundColor: '#f1f1f6',
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{fontSize: 11, color: '#949ba5',}}>{item.category_name}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _loadMore = () => {
    if (!this.props.viewMore.isLoadingMore && this.props.viewMore.loadMore && !this.props.viewMore.isRefreshing) {
      this.props.actions.viewMoreLoadMore({
        id: this.state.categoryId,
        size: ONE_PAGE_SIZE,
        start: this.props.viewMore.list.length,
      })
    }
  }

  _renderFooter = () => {
    const {viewMore} = this.props
    if (viewMore.list.length > 0) {
      return <ListFooter hasMore={viewMore.loadMore}/>
    } else {
      return <View/>
    }
  }

  _empty = () => (
    <View style={{
      justifyContent: 'center', alignItems: 'center',
    }}
    >
      <Text style={{marginTop: 23, color: '#959595', fontSize: 14}}>
        无
      </Text>
    </View>
  )

  _separator = () => <View style={{marginStart: 16, height: 1 / PixelRatio.get(), backgroundColor: '#e5e5e5'}}/>

}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({...viewMoreAction,}, dispatch),
})

export default connect(({viewMore}) => ({
  viewMore,
}), mapDispatchToProps)(ViewMorePage)
