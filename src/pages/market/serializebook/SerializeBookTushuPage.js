import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  PixelRatio,
  RefreshControl, Platform, Dimensions,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as serializeBookTushuAction from '../../../actions/serializeBookTushuAction'
import AdView from '../../../component/AdView'
import images from '../../../component/images'
import ListFooter from '../../../component/ListFooter'
import SerializeItem from './SerializeItem'

const {width, height} = Dimensions.get('window')

const PADDING_HORIZONTAL = 16
const START_PAGE = 0
const ONE_PAGE_SIZE = 10
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 106

const CONST_SEX = 4
const RANK_CONFIG = [{"type": 2, "name": "更新时间"}, {"type": 1, "name": "人气值"}]

class SerializeBookTushuPage extends Component {

  constructor(props) {
    super(props)
    console.log('this.props.user.info ==== ', this.props.user)
    this.state = {
      adHeight: 0,
      type: 2,// 2:更新时间，1：人气值
    }
  }

  componentWillMount() {
    this.props.actions.serializeBookTushuInit({
      sex: CONST_SEX,
      type: this.state.type,
      size: ONE_PAGE_SIZE,
      start: START_PAGE,
    })
  }

  renderTab() {
    return (
      <View style={{flexDirection: 'row', height: 30, alignItems: 'center', marginStart: 16}}>
        {RANK_CONFIG.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{marginEnd: 24}}
              onPress={() => {
                this.setState({
                  type: item.type,
                }, () => {
                  this.props.actions.serializeBookTushuInit({
                    sex: CONST_SEX,
                    type: this.state.type,
                    size: ONE_PAGE_SIZE,
                    start: START_PAGE,
                  })
                })
              }}
            >
              <Text style={{
                fontSize: 14,
                color: this.state.type === item.type ? '#f85836' : '#545c67'
              }}>{item.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

    )
  }

  renderView() {
    return (
      <View style={{flex: 1}}>
        {this.renderTab()}
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this._empty}
          // ItemSeparatorComponent={this._separator}
          removeClippedSubviews
          data={this.props.serializeBookTushu.list}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={this._loadMore}
          refreshControl={(
            <RefreshControl
              onRefresh={this._onRefresh}
              color="#ccc"
              refreshing={this.props.serializeBookTushu.isRefreshing}
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
    this.props.actions.serializeBookTushuInit({
      sex: CONST_SEX,
      type: this.state.type,
      size: ONE_PAGE_SIZE,
      start: START_PAGE,
    })
  }

  _renderItem = ({item, index}) => {
    return (
      <SerializeItem
        data={item}
        onPress={() => {
          this.props.navigation.navigate('Detail', {bookId: item.id,})
        }}
      />
    )
  }

  _loadMore = () => {
    if (!this.props.serializeBookTushu.isLoadingMore && this.props.serializeBookTushu.loadMore && !this.props.serializeBookTushu.isRefreshing) {
      this.props.actions.serializeBookTushuLoadMore({
        sex: CONST_SEX,
        type: this.state.type,
        size: ONE_PAGE_SIZE,
        start: this.props.serializeBookTushu.list.length,
      })
    }
  }

  _renderHeader = () => {
    if (this.state.adHeight === 1) {
      return null
    }
    return (
      <AdView
        style={{width: width, height: this.state.adHeight, backgroundColor: '#fff'}}
        onNativeAdDidLoad={(e) => {
          this.setState({
            adHeight: Platform.OS === 'ios' ? 120 : parseInt(e.nativeEvent.height),
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
    const {serializeBookTushu} = this.props
    if (serializeBookTushu.list.length > 0) {
      return <ListFooter hasMore={serializeBookTushu.loadMore}/>
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
  actions: bindActionCreators({...serializeBookTushuAction,}, dispatch),
})

export default connect(({serializeBookTushu, user}) => ({
  serializeBookTushu,
  user,
}), mapDispatchToProps)(SerializeBookTushuPage)
