import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  DeviceEventEmitter,
  Dimensions,
  SectionList,
  Animated,
  FlatList, Easing,
} from 'react-native'
import {connect} from 'react-redux'
import CustomItem from "./CustomItem";
import CommonItem from './CommonItem'
import LoopBannerView from './LoopBannerView'
import RecommenItem from './RecommenItem'
import QualityItem from './QualityItem'
import images from '../../component/images'
import R from 'ramda'
import {sendAction, UMCPS} from '../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../utils/Analysis/UMConfig'
import {getItem} from '../../utils/AsyncStorageManager'
import {KEY_TOKEN} from '../../utils/AsyncStorageKey'
import {
  bookMarketApi,
  bookMarketChangeApi,
  bookMarketWithTokenApi,
  BookshelfBannerApi,
  MarketDiscoveryApi,
  marketIconApi,
  marketEditableModelApi,
  UserPreferenceApi,
} from "../../apis/Api";
import {showToast} from "../../actions/toastAction";

const {width, height} = Dimensions.get('window')
const COMMON_ITEM_HEIGHT = 60
const CONST_RIGHT_CHANGE = 2
const CONST_RIGHT_COMPLETE = 3

class BookMarketQualityPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bannerData: [],
      iconData:[],
      editableData:[],
      discoveryData: [],
      userPreferenceData: [],
      recommendData: {},
      topData: [],
      showTitle: true,
      isLoading: false,
    }
    this.spinValue = new Animated.Value(0)
  }

  componentDidMount() {
    this._onRefresh()
    DeviceEventEmitter.addListener('updateUserPreference', (e) => {
      if(!!this.props.user.token) {
        this._marketUserPreferenceApi(this.props.user.token)
      }
    })
  }

  _marketBannerApi(position){
    BookshelfBannerApi(position)
      .then(ret => {
        if (ret.status === 200) {
          this.setState({
            bannerData: ret.data,
          })
        } else {
          showToast(ret.message)
        }
      })
      .catch(error => {
        showToast(error.message)
      })
  }

  _marketIconApi(sex){
    marketIconApi(sex)
      .then(ret => {
        if (ret.status === 200) {
          this.setState({
            iconData: ret.data,
          })
        } else {
          showToast(ret.message)
        }
      })
      .catch(error => {
        showToast(error.message)
      })
  }

  _marketEditableApi(sex){
    marketEditableModelApi(sex)
      .then(ret => {
        if (ret.status === 200) {
          this.setState({
            editableData: R.sort(R.ascend(R.prop('sort')))(ret.data),
          })
        } else {
          showToast(ret.message)
        }
      })
      .catch(error => {
        showToast(error.message)
      })
  }

  _marketDiscoveryApi(size){
    MarketDiscoveryApi(size)
      .then(ret => {
        if (ret.status === 200) {
          this.setState({
            discoveryData: ret.data,
          })
        } else {
          showToast(ret.message)
        }
      })
      .catch(error => {
        showToast(error.message)
      })
  }

  _marketUserPreferenceApi(token){
    UserPreferenceApi(token)
      .then(ret => {
        if (ret.status === 200) {
          this.setState({
            userPreferenceData: ret.data,
          })
        } else {
          showToast(ret.message)
        }
      })
      .catch(error => {
        showToast(error.message)
      })
  }

  _refactoringData = (data) => {
    if (data.length === 0) {
      return []
    }
    const fn = (x, idx) => {
      return {
        index: idx,
        id: x.id,
        name: x.name,
        data: x.list,
        right: x.right
      }
    }
    const ret =  R.addIndex(R.map)(fn, data)
    return ret;
  }

  _marketApi(sex, token){
    this.setState({
      isLoading: true,
    })
    if(!!token){
      bookMarketWithTokenApi(sex, token)
        .then(ret => {
          this._resolveBookMarketApiResult(ret)
          this.setState({
            isLoading: false,
          })
        })
        .catch(error => {
          showToast(error.message)
          this.setState({
            isLoading: false,
          })
        })
    }else{
      bookMarketApi(sex)
        .then(ret => {
          this._resolveBookMarketApiResult(ret)
          this.setState({
            isLoading: false,
          })
        })
        .catch(error => {
          showToast(error.message)
          this.setState({
            isLoading: false,
          })
        })
    }
  }

  _resolveBookMarketApiResult(ret){
    if (ret.status === 200) {
      this.setState({
        recommendData: R.nth(0)(ret.data),
        topData: this._refactoringData(R.slice(1, Infinity)(ret.data)),
        isLoading: false,
      })
    } else {
      showToast(ret.message)
    }
  }

  _marketChangeApi(id, sex, token) {
    bookMarketChangeApi(id, sex, token)
      .then(ret => {
        if (ret.status === 200) {
          let data = ret.data
          if (data.id === this.state.recommendData.id) {
            data.name = this.state.recommendData.name
            data.right = this.state.recommendData.right
            this.setState({
              recommendData: data,
            })
          } else {
            let index = 0
            for (let i = 0; i < this.state.topData.length; i++) {
              if (this.state.topData[i].id == data.id) {
                index = i
                this.state.topData[i].data = data.list
                this.setState({
                  topData: this.state.topData
                })
                break
              }
            }
          }
        } else {
          showToast(ret.message)
        }
      })
      .catch(error => {
        showToast(error.message)
      })
  }


  _onPressRecommendItem = () => {
    if (this.state.recommendData.right == CONST_RIGHT_CHANGE) {
      sendAction(UMConfig.market_more_refresh_item_clicked)
      this._marketChangeApi(this.state.recommendData.id, this.props.sex, this.props.user.token)
    } else if (this.state.recommendData.right == CONST_RIGHT_COMPLETE) {
      sendAction(UMConfig.market_more_clicked)
      this.props.navigation.navigate('ViewMore', {
        categoryId: this.state.recommendData.id,
        name: this.state.recommendData.name,
      })
    }
  }

  renderReadPreference() {
    if (JSON.stringify(this.state.recommendData) == '{}' || this.state.recommendData === undefined || this.props.sex !== 3 ||
        (!!this.props.user.token && this.state.userPreferenceData.length > 0)) {
      return null
    }

    return (
      <TouchableOpacity onPress={() => {
        getItem(KEY_TOKEN).then((token) => {
          if (!!token) {
            this.props.navigation.navigate('CategoryPreference', {
              isHiddenJumpButton: true,
            })
          } else {
            this.props.navigation.navigate('Login')
          }
        })
      }}>
        {this.renderSeperateLine()}
        <View style={{height: 82, flexDirection: 'row', flex: 1, alignItems: 'center', marginHorizontal: 16}}>
          <Image
            style={{width: 36, height: 36,}}
            source={images.image_market_read_preference}
          />
          <View style={{marginStart: 11}}>
            <Text style={{fontSize: 15, color: '#1e252f'}}>
              调整我的阅读口味
            </Text>
            <Text style={{fontSize: 12, color: '#939aa2', marginTop: 6}}>
              调整口味，为您精准推荐好书
            </Text>

          </View>
          <View style={{flex: 1}}/>
          <Image
            source={images.image_view_all}
          />
        </View>
      </TouchableOpacity>
    )
  }


  renderDiscovry() {
    if(this.props.sex !== 3){
      return null
    }

    return (
      <View style={{height: 172}}>
        {this.renderSeperateLine()}
        <View style={{
          height: 60,
          flexDirection: 'row',
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text style={{fontSize: 18, color: '#1e252f'}}>发现</Text>
          <TouchableOpacity
            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.navigation.navigate('Discovery')
            }}>
            <Text style={{fontSize: 15, color: '#f85836'}}>查看全部</Text>
            <Image style={{marginStart: 6}} source={images.image_view_all}/>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginHorizontal: 16}}
          data={this.state.discoveryData || []}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={`discover_item_${index}`}
                style={{height: 80, marginRight: index === this.state.discoveryData.length - 1 ? 0 : 16}}
                onPress={() => {
                  if (item.type == 1) {//书籍
                    this.props.navigation.navigate('DiscoveryBook', {
                      title: item.title,
                      id: item.id
                    })
                  } else if (item.type == 2) {//作者
                    this.props.navigation.navigate('DiscoveryAuthor', {
                      id: item.id
                    })
                  }
                }}>
                <Image
                  style={{
                    width: 252,
                    height: 80,
                    borderRadius: 5,
                  }}
                  defaultSource={images.image_discovery_banner_placeholder}
                  source={{uri: item.image}}
                  resizeMethod="resize"
                />
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }

  renderCommomItems() {
    if(this.state.iconData.length > 0) {
      return (
        <View style={{
          flex: 1,
          height: COMMON_ITEM_HEIGHT,
          marginBottom: 20,
          alignItems: 'center',
          backgroundColor: '#ffffff',
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>
          {
            R.addIndex(R.map)((value, index) => (
              <CommonItem
                key={index}
                name={value.name}
                image={value.image}
                onPressItem={() => {
                  UMCPS(UMConfig.market_icon_item_clicked, {name: value.name, id: value.id})
                  const {navigation} = this.props
                  const sex = this.props.user.info.sex
                  switch (value.type) {
                    case 1://分类
                      console.log('gg category title=' + value.name + ',id=' + value.category_id + ',tag=' + value.tag_id)
                      navigation.navigate('CategoryDetail', {
                        title: value.category_title,
                        id: value.category_id,
                        sex: this.props.sex,
                        tag_id: value.tag_id,
                      })
                      break;
                    case 2://发现
                      if (value.discovery_view === 1) {//发现一级页面
                        navigation.navigate('Discovery')
                      } else if (value.discovery_view === 2) {//发现二级页面
                        if (value.discovery_type === 1) {//书籍
                          this.props.navigation.navigate('DiscoveryBook', {
                            title: value.discovery_title,
                            id: value.discovery_id
                          })
                        } else if (value.discovery_type === 2) {//作者
                          this.props.navigation.navigate('DiscoveryAuthor', {
                            id: value.discovery_id
                          })
                        }
                      }
                      break;
                    case 3://url
                      navigation.navigate('Web', {url: value.url})
                      break;
                    case 4://排行
                      if(this.props.sex === 3){//若是精选，则跳转时选用户性别
                        navigation.navigate('Rank', {
                          sex,
                        })
                      } else {
                        navigation.navigate('Rank', {
                          sex: this.props.sex,
                        })
                      }
                      break;
                    case 5://完本
                      if(this.props.sex === 3){//若是精选，则跳转时选用户性别
                        navigation.navigate('CompleteBook', {
                          sex,
                        })
                      }else{
                        navigation.navigate('CompleteBook', {
                          sex: this.props.sex,
                        })
                      }
                      break;
                    case 6://连载
                      if(this.props.sex === 3){//若是精选，则跳转时选用户性别
                        navigation.navigate('SerializeBook', {
                          sex,
                        })
                      } else {
                        navigation.navigate('SerializeBook', {
                          sex: this.props.sex,
                        })
                      }
                      break;
                    case 7://短篇
                      navigation.navigate('ShortessayBook')
                      break;
                  }
                }}
              />
            ), this.state.iconData)
          }
        </View>
      )
    }

    return null

  }

  renderBanner() {
    if (this.state.bannerData.length > 0) {
      return (
        <View style={{marginBottom: 12}}>
          <LoopBannerView
            navigation={this.props.navigation}
            data={this.state.bannerData}
            onPressBanner={() => {
              UMCPS(UMConfig.market_banner_click, {sex: this.props.sex})
            }}
          />
        </View>
      )
    }

    return (
      <View style={{
        marginBottom: 12,
        height: 130,
      }}/>
    )
  }

  renderSeperateLine() {
    return (<View style={{width: width, height: 7, backgroundColor: '#f1f1f6'}}/>)
  }

  _onRefresh = () => {
    this._marketApi(this.props.sex,this.props.user.token)
    this._marketBannerApi(this.props.bannerPosition)
    this._marketIconApi(this.props.sex)
    this._marketEditableApi(this.props.sex)

    //精选才有发现和用户偏好
    if(this.props.sex === 3){
      this._marketDiscoveryApi(5)
      if(!!this.props.user.token) {
        this._marketUserPreferenceApi(this.props.user.token)
      }
    }

  }


  _spinAnimation = () => {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    ).start(() => {
      this.spinValue.setValue(0)
    })
  }


  _renderRight = (id, name, right, index) => {
    if (right == 2) {
      const spin = this.spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      })

      return (
        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            sendAction(UMConfig.market_more_refresh_item_clicked)
            this._marketChangeApi(id, this.props.sex, this.props.user.token)
            this._spinAnimation()
          }}>
          <Text style={{fontSize: 15, color: '#f85836'}}>换一批</Text>

          <Animated.Image style={{
            marginStart: 6,
            transform: [{rotate: spin}],
          }} source={images.image_change}/>
        </TouchableOpacity>
      )
    } else if (right == 3) {
      return (
        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            sendAction(UMConfig.market_more_clicked)
            this.props.navigation.navigate('ViewMore', {
              categoryId: id,
              name: name,
            })
          }}>
          <Text style={{fontSize: 15, color: '#f85836'}}>查看全部</Text>
          <Image style={{marginStart: 6}} source={images.image_view_all}/>
        </TouchableOpacity>
      )
    }

    return <View/>

  }

  _renderItem = ({ item, index, section })=>{
    return (
      <QualityItem
        data={item}
        index={index}
        navigation={this.props.navigation}
        onPressItem={() => {
          UMCPS(UMConfig.market_unit_clicked, {
            sex: this.props.sex,
            id: value.id,
            name: value.name
          })
        }}
      />
    )
  }

  _renderSectionHeader = ({section: {id, name, right, index}}) => {
    return (
      <View>
        {this.renderSeperateLine()}
        <View style={{
          flex: 1,
          height: 60,
          flexDirection: 'row',
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text style={{fontSize: 18, color: '#1e252f'}}>
            {`${name}`}
          </Text>
          {this._renderRight(id, name, right, index)}
        </View>
      </View>

    )
  }

  _renderSectionFooter = ({section: {name, index, right}}) => {
    if (index === 0) {
      return (
        <View>
          {this.renderDiscovry()}
        </View>
      )
    }
    return null
  }

  _renderListHeader = () =>{
      return (
        <View>
          {this.renderBanner()}
          {this.renderCommomItems()}
          {this.renderSeperateLine()}
          {
            this.state.editableData.length > 0 ?
              R.addIndex(R.map)((value, index) => (
                <CustomItem
                  key={index}
                  onPress={() => {
                    UMCPS(UMConfig.market_editablemodel_clicked, {sex: this.props.sex, type: value.type})
                  }}
                  data={value}
                  navigation={this.props.navigation}
                />
              ), this.state.editableData)
              : null
          }

          <RecommenItem
            data={this.state.recommendData}
            navigation={this.props.navigation}
            onPressItem={() => {
              UMCPS(UMConfig.market_unit_clicked, {
                sex: this.props.sex,
                id: this.state.recommendData.id,
                name: this.state.recommendData.name
              })
              this._onPressRecommendItem()
            }}
          />

          {this.renderReadPreference()}
        </View>
      )
  }



  render() {
    return (
      <SectionList
        removeClippedSubviews={false}
        stickySectionHeadersEnabled={false}
        initialNumToRender={10}
        // onScroll={(e) => {
        //   this.props.onScroll(e)
        // }}
        // onScrollBeginDrag={(e) => {
        //   this.props.onScrollBeginDrag(e)
        // }}
        renderItem={({ item, index, section }) => this._renderItem({ item, index, section })}
        renderSectionHeader={(section) => this._renderSectionHeader(section)}
        renderSectionFooter={(section) => this._renderSectionFooter(section)}
        sections={this.state.topData}
        keyExtractor={(item, index) => item + index}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={() => {
              this._onRefresh()
            }}
            enabled={this.props.showTitle}
            color="#ccc"
          />}
        ListHeaderComponent={this._renderListHeader}
        ListFooterComponent={() => {
          return (
            <View>
              {
                this.state.topData.length > 0 ? (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#fff'}}
                  >
                    <Text
                      style={{textAlign: 'center', color: '#d1d1d9', fontSize: 15}} numberOfLines={1}
                    >
                      {'──── 已经拉到底啦 ────'}
                    </Text>
                  </View>
                ) : null
              }
            </View>
          )
        }}
      />
    )
  }
}

export default connect(({user}) => ({
  user
}), null)(BookMarketQualityPage)
