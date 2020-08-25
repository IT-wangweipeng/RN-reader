import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import R from 'ramda'
import ProgressHUD from 'react-native-progress-hud'
import {
  SectionList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  Animated,
  LayoutAnimation
} from 'react-native'
import * as categoryDetailAction from '../../actions/categoryDetailAction'
import BookCell from '../../component/BookCell'
import AdView from '../../component/AdView'
import EmptyView from '../../component/EmptyView'
import ListFooter from '../../component/ListFooter'
import images from '../../component/images'
import {UMCPS} from '../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../utils/Analysis/UMConfig'
import {isIOS} from "../../utils/PlatformUtils";


const {width, height} = Dimensions.get('window')



class SecondCatagoryPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      adHeight: 0,
      tagIndex: 0,
      compositeIndex: 0,
      stateIndex: 0,
      wordsIndex: 0,
      showMiniHeader: false
    }

    this.tagId = this.props.navigation.state.params.tag_id || 0
    this.wordId = 0
    this.stateId = 0
    this.compositeId = 0
  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title
  })

  componentWillMount () {
    const {navigation} = this.props
    this.props.actions.categoryDetailInit({
      sex: navigation.state.params.sex,
      id: navigation.state.params.id,
      tag_id: this.tagId,
      composite: this.compositeId,
      state: this.stateId,
      words: this.wordId,
      start: 0
    })
  }

  componentDidMount () {

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.categoryDetail !== nextProps.categoryDetail && nextProps.categoryDetail.loadSuccess && nextProps.categoryDetail.config.tags && nextProps.categoryDetail.config.tags.length > 0) {
      const index = R.findIndex(R.propEq('id', this.props.navigation.state.params.tag_id))(nextProps.categoryDetail.config.tags)
      if (this.props.navigation.state.params.tag_id === this.tagId) {
        this.setState({
          tagIndex: index === -1 ? 0 : index,
        })
      }
      nextProps.categoryDetail.loadSuccess = false
    }
  }

  componentWillUnmount() {
    this.props.categoryDetail.data = []
  }

  render () {
    const {categoryDetail} = this.props
    return (
      <View style={{flex: 1}}>
        <FlatList
          style={{flex: 1, backgroundColor: '#fff'}}
          data={categoryDetail.data || []}
          stickyHeaderIndices={[0]}
          extraData={this.state}
          onRefresh={() => {
            this.props.actions.categoryDetailInit({
              sex: this.props.navigation.state.params.sex,
              id: this.props.navigation.state.params.id,
              tag_id: this.tagId,
              composite: this.compositeId,
              state: this.stateId,
              words: this.wordId,
              start: 0
            })
          }}
          onScroll={(e) => {
            if (categoryDetail.data.length === 0) {
              return
            }
            this.offsetY = e.nativeEvent.contentOffset.y
            if (this.offsetY <= 100) {
              LayoutAnimation.easeInEaseOut()
              this.setState({
                showMiniHeader: true
              })
            }
            if (this.offsetY === 0) {
              LayoutAnimation.easeInEaseOut()
              this.setState({
                showMiniHeader: false
              })
            }
          }}
          refreshing={categoryDetail.loadSuccess}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderListHeaderComponent}
          ListFooterComponent={this._ListFooterComponent}
          ListEmptyComponent={this._ListEmptyView}
          onEndReached={this.handleLoadingMore}
          onEndReachedThreshold={0.1}
        />
        {/*<ProgressHUD*/}
          {/*showHUD={categoryDetail.isLoading}*/}
          {/*showLoading={categoryDetail.isLoading}*/}
        {/*/>*/}
      </View>
    )
  }

  _ListFooterComponent = () => {
    const {categoryDetail} = this.props
    if (categoryDetail.data.length > 0) {
      return (
        <ListFooter
          hasMore={categoryDetail.hasMore}
        />
      )
    }

    return null
  }

  _ListEmptyView = () => {
    const {categoryDetail} = this.props
    if (!categoryDetail.isEmpty && this.props.categoryDetail.data.length == 0) {
      return (
        <EmptyView/>
      )
    }
    return null
  }

  handleLoadingMore = () => {
    const {categoryDetail} = this.props
    if (!categoryDetail.isLoadingMore && categoryDetail.hasMore) {
      this.props.actions.categoryLoadMoreInit({
        sex: this.props.navigation.state.params.sex,
        id: this.props.navigation.state.params.id,
        tag_id: this.tagId,
        composite: this.compositeId,
        state: this.stateId,
        words: this.wordId,
        start: categoryDetail.categoryList.length
      })
    }
  }

  _renderAdsView = () => {
    if (Platform.OS === 'ios') {
      return (
        <AdView
          style={{width: width, height: 120, backgroundColor: 'cyan',}}
        />
      )
    }
     return null

  }

  _renderListHeaderComponent = () => {
    const {categoryDetail} = this.props
    const tag = categoryDetail.config.tags && categoryDetail.config.tags[0]
    const composite = categoryDetail.config.composite && categoryDetail.config.composite[0]
    if (this.state.showMiniHeader) {
      return (
        <View style={styles.minStickyHeader}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#545c67', fontSize: 14}}>
              {`${tag && tag.name || ''}`}
            </Text>
            <Text style={{color: '#545c67', fontSize: 14, marginLeft: 24}}>
              {`${composite && composite.name || ''}`}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.easeInEaseOut()
              this.setState({
                showMiniHeader: this.offsetY <= 100 ? true : false
              })
            }}
          >
            <Image
              style={{width: 30, height: 30, }}
              source={images.arrow_down}
            />
          </TouchableOpacity>
        </View>
      )
    }
    return (

        <View style={{backgroundColor: '#fff', paddingHorizontal: 16, borderBottomColor: '#eeeeee', borderBottomWidth: 1}}>
          <View>
            <View style={{flexWrap: 'wrap', flexDirection: 'row', marginVertical: 12}}>
              {
                categoryDetail.config && categoryDetail.config.tags ? (
                    categoryDetail.config.tags.map((item, idx) => {
                      return (
                          <TouchableOpacity
                              key={`config_${idx}`}
                              style={{marginRight: 24, justifyContent: 'center', }}
                              onPress={() => {
                                this.setState({
                                  tagIndex: idx
                                })
                                this.tagId = item.id
                                this._refreshData()
                                UMCPS(UMConfig.ACTION_CATEGORY_ITEM, {name: item.name})
                              }}
                          >
                            <Text style={{ marginVertical: 6, color: this.state.tagIndex === idx ? '#f85836' : '#545c67'}}>{`${item.name}`}</Text>
                          </TouchableOpacity>
                      )
                    })
                ) : null
              }
            </View>

            <View style={{flexWrap: 'wrap', flexDirection: 'row',}}>
              {
                categoryDetail.config && categoryDetail.config.composite ? (
                    categoryDetail.config.composite.map((item, idx) => {
                      return (
                          <TouchableOpacity
                              key={`composite_${idx}`}
                              style={{marginRight: 24, justifyContent: 'center', }}
                              onPress={() => {
                                this.setState({
                                  compositeIndex: idx
                                })
                                this.compositeId = item.id
                                this._refreshData()
                                UMCPS(UMConfig.ACTION_CATEGORY_ITEM, {name: item.name})
                              }}
                          >
                            <Text style={{ marginVertical: 6, color: this.state.compositeIndex === idx ? '#f85836' : '#545c67'}}>{`${item.name}`}</Text>
                          </TouchableOpacity>
                      )
                    })
                ) : null
              }
            </View>

            <View style={{flexWrap: 'wrap', flexDirection: 'row', marginVertical: 12}}>
              {
                categoryDetail.config && categoryDetail.config.state ? (
                    categoryDetail.config.state.map((item, idx) => {
                      return (
                          <TouchableOpacity
                              key={`state_${idx}`}
                              style={{marginRight: 24, justifyContent: 'center', }}
                              onPress={() => {
                                this.setState({
                                  stateIndex: idx
                                })
                                this.stateId = item.id
                                this._refreshData()
                                UMCPS(UMConfig.ACTION_CATEGORY_ITEM, {name: item.name})
                              }}
                          >
                            <Text style={{ marginVertical: 6, color: this.state.stateIndex === idx ? '#f85836' : '#545c67'}}>{`${item.name}`}</Text>
                          </TouchableOpacity>
                      )
                    })
                ) : null
              }
            </View>


            <View style={{flexWrap: 'wrap', flexDirection: 'row', marginBottom: 12}}>
              {
                categoryDetail.config && categoryDetail.config.words ? (
                    categoryDetail.config.words.map((item, idx) => {
                      return (
                          <TouchableOpacity
                              key={`words_${idx}`}
                              style={{marginRight: 24, justifyContent: 'center', }}
                              onPress={() => {
                                this.setState({
                                  wordsIndex: idx
                                })
                                this.wordId = item.id
                                this._refreshData()
                                UMCPS(UMConfig.ACTION_CATEGORY_ITEM, {name: item.name})
                              }}
                          >
                            <Text style={{ marginVertical: 6, color: this.state.wordsIndex === idx ? '#f85836' : '#545c67'}}>{`${item.name}`}</Text>
                          </TouchableOpacity>
                      )
                    })
                ) : null
              }
            </View>
          </View>
          {this._renderAdsView()}
        </View>
    )
  }

  _refreshData = () => {
    // sex, id, tag_id, composite, state, words, start
    console.log('tag ======== ', this.tagId, this.compositeId, this.stateId)
    this.props.actions.categoryDetailInit({
      sex: this.props.navigation.state.params.sex,
      id: this.props.navigation.state.params.id,
      tag_id: this.tagId,
      composite: this.compositeId,
      state: this.stateId,
      words: this.wordId,
      start: 0
    })
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({item, index}) => {
    if (item.hasAd && item.hasAd === true) {
      if(isIOS()){
        return null
      }else {
        return (
            <AdView
                style={{width: width, height: this.state.adHeight}}
                onNativeAdDidLoad={e => {
                  console.log('yy secondCategory onNativeAdDidLoad')
                  this.setState({
                    adHeight: parseInt(e.nativeEvent.height),
                  })
                }}
                onNativeAdLoadFailed={(e) => {
                  console.log('yy secondCategory onNativeAdLoadFailed')
                  this.setState({
                    adHeight: 0,
                  })
                }}
            />
        )
      }

    }

    return (
      <BookCell
        cellKey={`category_${index}`}
        data={item}
        onPressCell={() => {
          this.props.navigation.navigate('Detail', {
            bookId: item.id
          })
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row'
  },
  headerTitle: {
    color: '#1e252f',
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
  },
  headerTrailTitle: {
    color: '#f85836',
    fontWeight: "500",
    fontSize: 14,
  },
  bookName: {
    fontSize: 15,
    color: '#1e252f',
    marginLeft: 12,
    fontWeight: "500",
    alignSelf: 'center'
  },
  minStickyHeader: {
    height: 30,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingHorizontal: 16,
    alignItems: 'center'
  }

})

SecondCatagoryPage.propTypes = {}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...categoryDetailAction}, dispatch)
})

export default connect(({user, categoryDetail}) => {
  return {
    user,
    categoryDetail,
  }
}, mapDispatchToProps)(SecondCatagoryPage)

