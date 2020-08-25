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
import * as rankTushuRenqiAction from '../../../actions/rankTushuRenqiAction'
import * as rankTushuFavoriteAction from '../../../actions/rankTushuFavoriteAction'
import ListFooter from '../../../component/ListFooter'
import RankItem from './RankItem'

const START_PAGE = 0
const ONE_PAGE_SIZE = 10
const CONST_SEX = 4
const CONST_DEFAULT_TYPE = 2 //1：收藏，2：人气

const {width, height} = Dimensions.get('window')

class RankTushuPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      whichType: CONST_DEFAULT_TYPE,
    }
  }

  componentWillMount() {
    this.props.actions.rankTushuFavoriteInit({
      sex: CONST_SEX,
      type: 1,
      size: ONE_PAGE_SIZE,
      start: START_PAGE,
    })
    this.props.actions.rankTushuRenqiInit({
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
        data={this.state.whichType == 1 ? this.props.rankTushuFavorite.list : this.props.rankTushuRenqi.list}
        renderItem={this._renderItem}
        onEndReachedThreshold={0.1}
        onEndReached={this._loadMore}
        refreshControl={(
          <RefreshControl
            onRefresh={this._onRefresh}
            color="#ccc"
            refreshing={this.state.whichType == 1 ? this.props.rankTushuFavorite.isRefreshing : this.props.rankTushuRenqi.isRefreshing}
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
      this.props.actions.rankTushuFavoriteInit({
        sex: CONST_SEX,
        type: this.state.whichType,
        size: ONE_PAGE_SIZE,
        start: START_PAGE,
      })
    } else if (this.state.whichType == 2) {
      this.props.actions.rankTushuRenqiInit({
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
      if (!this.props.rankTushuFavorite.isLoadingMore && this.props.rankTushuFavorite.loadMore && !this.props.rankTushuFavorite.isRefreshing) {
        this.props.actions.rankTushuFavoriteLoadMore({
          sex: CONST_SEX,
          type: this.state.whichType,
          size: ONE_PAGE_SIZE,
          start: this.props.rankTushuFavorite.list.length,
        })
      }
    } else if (this.state.whichType == 2) {
      if (!this.props.rankTushuRenqi.isLoadingMore && this.props.rankTushuRenqi.loadMore && !this.props.rankTushuRenqi.isRefreshing) {
        this.props.actions.rankTushuRenqiLoadMore({
          sex: CONST_SEX,
          type: this.state.whichType,
          size: ONE_PAGE_SIZE,
          start: this.props.rankTushuRenqi.list.length,
        })
      }
    }
  }

  _renderFooter = () => {
    if (this.state.whichType == 1) {
      const {rankTushuFavorite} = this.props
      if (rankTushuFavorite.list.length > 0) {
        return <ListFooter hasMore={rankTushuFavorite.loadMore}/>
      } else {
        return <View/>
      }
    } else if (this.state.whichType == 2) {
      const {rankTushuRenqi} = this.props
      if (rankTushuRenqi.list.length > 0) {
        return <ListFooter hasMore={rankTushuRenqi.loadMore}/>
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
  actions: bindActionCreators({...rankTushuRenqiAction, ...rankTushuFavoriteAction}, dispatch),
})

export default connect(({rankTushuRenqi, rankTushuFavorite, user}) => ({
  rankTushuRenqi,
  rankTushuFavorite,
  user,
}), mapDispatchToProps)(RankTushuPage)
