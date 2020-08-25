import React, {Component} from 'react'
import {
  View,
  Text,
  FlatList,
  PixelRatio,
  RefreshControl, Platform, Dimensions,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as completeBookMaleAction from '../../../actions/completeBookMaleAction'
import AdView from '../../../component/AdView'
import ListFooter from '../../../component/ListFooter'
import CompleteItem from "./CompleteItem";

const {width, height} = Dimensions.get('window')

const START_PAGE = 0
const ONE_PAGE_SIZE = 10

const CONST_SEX = 1

class CompleteBookMalePage extends Component {

  constructor(props) {
    super(props)
    console.log('this.props.user.info ==== ', this.props.user)
    this.state = {
      adHeight: 0,
    }
  }

  componentWillMount() {
    this.props.actions.completeBookMaleInit({
      sex: CONST_SEX,
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
          data={this.props.completeBookMale.list}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={this._loadMore}
          refreshControl={(
            <RefreshControl
              onRefresh={this._onRefresh}
              color="#ccc"
              refreshing={this.props.completeBookMale.isRefreshing}
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
    this.props.actions.completeBookMaleInit({
      sex: CONST_SEX,
      size: ONE_PAGE_SIZE,
      start: START_PAGE,
    })
  }

  _renderItem = ({item, index}) => {
    return (
      <CompleteItem
        data={item}
        onPress={() => {
          this.props.navigation.navigate('Detail', {bookId: item.id,})
        }}
      />
    )
  }

  _loadMore = () => {
    if (!this.props.completeBookMale.isLoadingMore && this.props.completeBookMale.loadMore && !this.props.completeBookMale.isRefreshing) {
      this.props.actions.completeBookMaleLoadMore({
        sex: CONST_SEX,
        size: ONE_PAGE_SIZE,
        start: this.props.completeBookMale.list.length,
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
    const {completeBookMale} = this.props
    if (completeBookMale.list.length > 0) {
      return  <ListFooter hasMore={completeBookMale.loadMore}/>
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
  actions: bindActionCreators({...completeBookMaleAction,}, dispatch),
})

export default connect(({completeBookMale, user}) => ({
  completeBookMale,
  user,
}), mapDispatchToProps)(CompleteBookMalePage)
