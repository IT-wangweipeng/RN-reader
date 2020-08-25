import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  PixelRatio,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as rankMaleRenqiAction from '../../../actions/rankMaleRenqiAction'
import * as rankMaleFavoriteAction from '../../../actions/rankMaleFavoriteAction'
import ListFooter from '../../../component/ListFooter'
import RankItem from './RankItem'

const START_PAGE = 0
const ONE_PAGE_SIZE = 10
const CONST_SEX = 1
const CONST_DEFAULT_TYPE = 2 //1：收藏，2：人气
const {width, height} = Dimensions.get('window')

class RankMalePage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      whichType: CONST_DEFAULT_TYPE,
    }
  }

  componentWillMount() {
    this.props.actions.rankMaleFavoriteInit({
      sex: CONST_SEX,
      type: 1,
      size: ONE_PAGE_SIZE,
      start: START_PAGE,
    })
    this.props.actions.rankMaleRenqiInit({
      sex: CONST_SEX,
      type: 2,
      size: ONE_PAGE_SIZE,
      start: START_PAGE,
    })
  }

  renderTab() {
    return (
      <View style={{width: 85, height, paddingTop: 5,}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.setState({
              whichType: 2,
            })
          }}
        >
          <Text
            style={this.state.whichType === 2 ? styles.select : styles.deselect}
          >
            人气榜
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.setState({
              whichType: 1,
            })

          }}
        >
          <Text
            style={this.state.whichType === 1 ? styles.select : styles.deselect}
          >
            收藏榜
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderContent() {
    return (
      <FlatList
        style={{width: width - 85}}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={this._empty}
        removeClippedSubviews
        data={this.state.whichType == 1 ? this.props.rankMaleFavorite.list : this.props.rankMaleRenqi.list}
        renderItem={this._renderItem}
        onEndReachedThreshold={0.1}
        onEndReached={this._loadMore}
        refreshControl={(
          <RefreshControl
            onRefresh={this._onRefresh}
            color="#ccc"
            refreshing={this.state.whichType == 1 ? this.props.rankMaleFavorite.isRefreshing : this.props.rankMaleRenqi.isRefreshing}
          />)}
        ListFooterComponent={this._renderFooter}
      />
    )
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        {this.renderTab()}
        {this.renderContent()}
      </View>
    )
  }

  _onRefresh = () => {
    if (this.state.whichType == 1) {
      this.props.actions.rankMaleFavoriteInit({
        sex: CONST_SEX,
        type: this.state.whichType,
        size: ONE_PAGE_SIZE,
        start: START_PAGE,
      })
    } else if (this.state.whichType == 2) {
      this.props.actions.rankMaleRenqiInit({
        sex: CONST_SEX,
        type: this.state.whichType,
        size: ONE_PAGE_SIZE,
        start: START_PAGE,
      })
    }
  }

  _renderItem = ({item, index}) => {
    return (
      <RankItem
        data={item}
        onPress={() => {
          this.props.navigation.navigate('Detail', {bookId: item.id,})
        }}
      />
    )
  }

  _loadMore = () => {
    if (this.state.whichType == 1) {
      if (!this.props.rankMaleFavorite.isLoadingMore && this.props.rankMaleFavorite.loadMore && !this.props.rankMaleFavorite.isRefreshing) {
        this.props.actions.rankMaleFavoriteLoadMore({
          sex: CONST_SEX,
          type: this.state.whichType,
          size: ONE_PAGE_SIZE,
          start: this.props.rankMaleFavorite.list.length,
        })
      }
    } else if (this.state.whichType == 2) {
      if (!this.props.rankMaleRenqi.isLoadingMore && this.props.rankMaleRenqi.loadMore && !this.props.rankMaleRenqi.isRefreshing) {
        this.props.actions.rankMaleRenqiLoadMore({
          sex: CONST_SEX,
          type: this.state.whichType,
          size: ONE_PAGE_SIZE,
          start: this.props.rankMaleRenqi.list.length,
        })
      }
    }
  }

  _renderFooter = () => {
    if (this.state.whichType == 1) {
      const {rankMaleFavorite} = this.props
      if (rankMaleFavorite.list.length > 0) {
        return <ListFooter hasMore={rankMaleFavorite.loadMore}/>
      } else {
        return <View/>
      }
    } else if (this.state.whichType == 2) {
      const {rankMaleRenqi} = this.props
      if (rankMaleRenqi.list.length > 0) {
        return <ListFooter hasMore={rankMaleRenqi.loadMore}/>
      } else {
        return <View/>
      }
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

const styles = StyleSheet.create({
  button: {
    width: 85,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  select: {
    fontSize: 16,
    color: '#f85836'
  },
  deselect: {
    fontSize: 14,
    color: '#545c67'
  },
  bookName: {
    fontSize: 15,
    color: '#1e252f',
    marginLeft: 12,
    fontWeight: "500",
    alignSelf: 'center'
  }
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({...rankMaleRenqiAction, ...rankMaleFavoriteAction}, dispatch),
})

export default connect(({rankMaleRenqi, rankMaleFavorite, user}) => ({
  rankMaleRenqi,
  rankMaleFavorite,
  user,
}), mapDispatchToProps)(RankMalePage)
