import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  PixelRatio,
  RefreshControl, Platform, Dimensions,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as serializeBookFemaleAction from '../../../actions/serializeBookFemaleAction'
import AdView from '../../../component/AdView'
import ListFooter from '../../../component/ListFooter'
import SerializeItem from './SerializeItem'

const {width, height} = Dimensions.get('window')

const START_PAGE = 0
const ONE_PAGE_SIZE = 10

const CONST_SEX = 2
const RANK_CONFIG = [{"type": 2, "name": "更新时间"}, {"type": 1, "name": "人气值"}]

class SerializeBookFemalePage extends Component {

  constructor(props) {
    super(props)
    console.log('this.props.user.info ==== ', this.props.user)
    this.state = {
      adHeight: 0,
      type: 2,// 2:更新时间，1：人气值
    }
  }

  componentWillMount() {
    this.props.actions.serializeBookFemaleInit({
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
                  this.props.actions.serializeBookFemaleInit({
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
          data={this.props.serializeBookFemale.list}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={this._loadMore}
          refreshControl={(
            <RefreshControl
              onRefresh={this._onRefresh}
              color="#ccc"
              refreshing={this.props.serializeBookFemale.isRefreshing}
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
    this.props.actions.serializeBookFemaleInit({
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
    if (!this.props.serializeBookFemale.isLoadingMore && this.props.serializeBookFemale.loadMore && !this.props.serializeBookFemale.isRefreshing) {
      this.props.actions.serializeBookFemaleLoadMore({
        sex: CONST_SEX,
        type: this.state.type,
        size: ONE_PAGE_SIZE,
        start: this.props.serializeBookFemale.list.length,
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
    const {serializeBookFemale} = this.props
    if (serializeBookFemale.list.length > 0) {
      return <ListFooter hasMore={serializeBookFemale.loadMore}/>
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
  actions: bindActionCreators({...serializeBookFemaleAction,}, dispatch),
})

export default connect(({serializeBookFemale, user}) => ({
  serializeBookFemale,
  user,
}), mapDispatchToProps)(SerializeBookFemalePage)
