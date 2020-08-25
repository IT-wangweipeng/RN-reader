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
  Platform,
  Dimensions,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as shortessayBookAction from '../../../actions/shortessayBookAction'
import AdView from "../../../component/AdView";
import images from "../../../component/images";
import ListFooter from "../../../component/ListFooter";

const {width, height} = Dimensions.get('window')

const PADDING_HORIZONTAL = 16
const START_PAGE = 0
const ONE_PAGE_SIZE = 10
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 106
const SCORE_TEXT_WIDTH = 40
const TEXT_WIDTH = width - PADDING_HORIZONTAL*2 - PADDING_HORIZONTAL - IMAGE_WIDTH - SCORE_TEXT_WIDTH

class ShortessayBookPage extends Component {

  constructor(props) {
    super(props)
    console.log('this.props.user.info ==== ', this.props.user)
    this.state = {
      sex: this.props.user.info.sex || 3,
      adHeight: 0,
    }
  }

  componentWillMount() {
    this.props.actions.shortessayBookInit({
      sex: this.state.sex,
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
          data={this.props.shortessayBook.list}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={this._loadMore}
          refreshControl={(
            <RefreshControl
              onRefresh={this._onRefresh}
              color="#ccc"
              refreshing={this.props.shortessayBook.isRefreshing}
            />)}
          ListHeaderComponent={this._renderHeader}
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
    this.props.actions.shortessayBookInit({
      sex: this.state.sex,
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
          marginTop: 15,
          paddingHorizontal: PADDING_HORIZONTAL
        }}>
          <ImageBackground source={{uri: item.cover, cache: 'force-cache'}}
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
                marginTop: 9,
                fontSize: 13,
                lineHeight: 20,
                color: '#939aa2',
              }}>{item.brief}</Text>
            <View style={{flex: 1}}/>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={{fontSize: 11, color: '#939aa2'}}>{item.author}</Text>
              <View style={{flex: 1}}/>
              <View style={{
                height: 18,
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
    if (!this.props.shortessayBook.isLoadingMore && this.props.shortessayBook.loadMore && !this.props.shortessayBook.isRefreshing) {
      this.props.actions.shortessayBookLoadMore({
        sex: this.state.sex,
        size: ONE_PAGE_SIZE,
        start: this.props.shortessayBook.list.length,
      })
    }
  }

  _renderHeader = () => {
    if (this.state.adHeight === 1) {
      // 避免广告加载失败 flatlist 没有刷新
      return null
    }
    return (
      <AdView
        style={{width: width, height: this.state.adHeight, backgroundColor: '#fff'}}
        onNativeAdDidLoad={(e) => {
          this.setState({
            adHeight: Platform.OS === 'ios' ? 121 : parseInt(e.nativeEvent.height),
          })
        }}
        onNativeAdLoadFailed={(e) => {
          this.setState({
            adHeight: 1,
          })
        }}
      />
    )
  }

  _renderFooter = () => {
    const {shortessayBook} = this.props
    if (shortessayBook.list.length > 0) {
      return <ListFooter hasMore={shortessayBook.loadMore}/>
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
  actions: bindActionCreators({...shortessayBookAction,}, dispatch),
})

export default connect(({shortessayBook, user}) => ({
  shortessayBook,
  user,
}), mapDispatchToProps)(ShortessayBookPage)
