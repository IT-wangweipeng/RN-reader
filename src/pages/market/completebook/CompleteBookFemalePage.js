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
import * as completeBookFemaleAction from '../../../actions/completeBookFemaleAction'
import AdView from '../../../component/AdView'
import ListFooter from '../../../component/ListFooter'
import CompleteItem from './CompleteItem'

const {width, height} = Dimensions.get('window')

const START_PAGE = 0
const ONE_PAGE_SIZE = 10

const CONST_SEX = 2

class CompleteBookFemalePage extends Component {

  constructor(props) {
    super(props)
    console.log('this.props.user.info ==== ', this.props.user)
    this.state = {
      sex: this.props.user.info.sex || 3,
      adHeight: 0,
    }
  }

  componentWillMount() {
    this.props.actions.completeBookFemaleInit({
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
          data={this.props.completeBookFemale.list}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={this._loadMore}
          refreshControl={(
            <RefreshControl
              onRefresh={this._onRefresh}
              color="#ccc"
              refreshing={this.props.completeBookFemale.isRefreshing}
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
    this.props.actions.completeBookFemaleInit({
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
    if (!this.props.completeBookFemale.isLoadingMore && this.props.completeBookFemale.loadMore && !this.props.completeBookFemale.isRefreshing) {
      this.props.actions.completeBookFemaleLoadMore({
        sex: CONST_SEX,
        size: ONE_PAGE_SIZE,
        start: this.props.completeBookFemale.list.length,
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
    const {completeBookFemale} = this.props
    if (completeBookFemale.list.length > 0) {
      return <ListFooter hasMore={completeBookFemale.loadMore}/>
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
  actions: bindActionCreators({...completeBookFemaleAction,}, dispatch),
})

export default connect(({completeBookFemale, user}) => ({
  completeBookFemale,
  user,
}), mapDispatchToProps)(CompleteBookFemalePage)
