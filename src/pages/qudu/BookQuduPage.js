import React, {Component} from 'react'

import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  DeviceEventEmitter,
  ImageBackground
} from 'react-native'

import Carousel from 'react-native-snap-carousel'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as quduAction from '../../actions/quduAction'
import * as bookshelfAction from '../../actions/bookshelfAction'
import {queryShelfBooks, updateBookShelf} from "../../model/BookModelManager";
import {convertToArray} from "../../utils/CommonUtil";
import {Config} from "../../config/Config";
import images from '../../component/images'
import {isIOS} from "../../utils/PlatformUtils";



const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}


const slideWidth = wp(66)
const slideHeight = slideWidth * 1.34

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth

const TITLE_HEIGHT = 60
const BUTTON_HEIGHT = 40
const BUTTON_WIDTH = 130
const SCROLL_VIEW_HEIGHT = TITLE_HEIGHT + slideHeight + BUTTON_HEIGHT/2
const SLIDE_PADDING_X = 12



class BookQuduPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sliderActiveSlide: 0,
      list: [],
      refreshing: true
    };
  }

  componentDidMount() {
    this._onRefresh()
    this._addListener()
  }

  _addListener() {
    this.listener = DeviceEventEmitter.addListener('bookShelfChange', (e) => {
      this._onRefresh()
    })
  }
  _removeListener() {
    DeviceEventEmitter.removeListener(this.listener)
  }

  componentWillUnmount() {
    this._removeListener()
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.qudu && nextProp.qudu.isSuccess) {
      var list =  nextProp.qudu.list
      for (let i = 0; i < list.length; i++) {
        let id = list[i].id
        let book = queryShelfBooks().filtered(`id == ${id}`)
        if (book.length === 0) {
          list[i].isCollected = false
        } else {
          list[i].isCollected = true
        }
      }
      this.setState({
        list
      })
      nextProp.qudu.isSuccess = false
    }

  }

  _jumpToQudu = (item) => {
    const {user, navigation} = this.props
    if (item.book_type === 2 || !!user.token) {
      this.props.navigation.navigate('Web',{
        url: `${item.url}?token=${user.token}`,
        hiddenHeader: true,
        quduCallback: () => {
          navigation.navigate('Web', {
            url:`${Config.url.missionURL()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
            title: '福利任务',
            rightIcon: '规则',
            rightIconType: 2,
            showCloseIcon: true,
            hiddenHeader: false,
          })
        }
      })
    } else {
      navigation.navigate('Login')
    }
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          // width: 272,
          // height: 354,
          width: itemWidth,
          height: slideHeight + BUTTON_HEIGHT / 2,
          alignItems: 'center',
          marginTop: 20,
      }}
        onPress={()=>{
          this._jumpToQudu(item)
        }}
      >
        <Image
          style={{
            width: itemWidth,
            height: slideHeight,
            borderRadius: 10,
          }}
          defaultSource={images.image_placeholder}
          source={{uri: item.cover}}
        />
        <TouchableOpacity
          onPress={()=>{
            this._jumpToQudu(item)
          }}
        >
          <View style={{
            marginTop: -BUTTON_HEIGHT / 2,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: '#F85733',
            paddingHorizontal: BUTTON_HEIGHT / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{fontSize: 16, color: '#fff'}}>立即阅读</Text>
          </View>
        </TouchableOpacity>

        <View style={{
          position: 'absolute',
          top: 23,
          end: 9,
          height: 13,
          borderBottomLeftRadius: 6,
          borderTopRightRadius: 6,
          backgroundColor: item.category_name == '互动小说'? '#ff5a90' : '#18c7bd',
          paddingHorizontal: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{fontSize: 8, color: '#fff'}}>{item.category_name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _onRefresh= () => {
    // see:
    // https://github.com/facebook/react-native/commit/93b39b73262f20f0d1ec96e0e33d7b4aaff6879b
    // https://github.com/facebook/react-native/issues/20011
    this.setState({
      refreshing: true,
    })

    setTimeout(() => {
      this.props.actions.quduInit({
        sex: this.props.user.info.sex || 3,
      });
      this.setState({
        refreshing: false,
      })
      this.setState({})
    }, 300)

  }

  render() {
    return (
      <SafeAreaView style={{flex: 1,}}>
        <View style={{flex: 1}}>
          <ScrollView
            style={{backgroundColor: '#fff'}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {this._onRefresh()}}
                color="#ccc"
              />
            }
          >
            <View>
              <Image
                source={images.image_qudu_bg}
                style={{width: 110, height: 110, position: 'absolute', right: 16,}}
              />
              <Image
                source={images.image_qudu_bg}
                style={{width: 72, height: 72, position: 'absolute', bottom: 0, left: 16}}
              />

              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={this.state.list}
                removeClippedSubviews={isIOS() ? false : true}
                renderItem={this._renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth + SLIDE_PADDING_X}
                inactiveSlideScale={0.8}
                onSnapToItem={(index) => {
                  console.log('gg snap index=', index)
                  this.setState({
                    sliderActiveSlide: index,
                  })
                }}
              />

            </View>


            {
              this.state.list.length > 0 ?
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 48,
                    flexDirection:'column',
                    justifyContent:'space-between'
                  }}
                >
                  <View
                    style={{
                      marginTop: 20
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                      }}
                    >
                      <View style={{
                        width: 34,
                        height: 16,
                        backgroundColor: this.state.list[this.state.sliderActiveSlide].complete_status === 1 ? '#ffa902' : '#02A9FF',
                        borderRadius: 13,
                        paddingHorizontal: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{fontSize: 10, color: '#fff'}}>{this.state.list[this.state.sliderActiveSlide].complete_status === 1 ? "完结" : "连载"}</Text>
                      </View>
                      {
                        this.state.list[this.state.sliderActiveSlide].icon_status === 1 ?
                          <View style={{
                            marginStart: 10,
                            width: 34,
                            height: 16,
                            backgroundColor: '#7dd229',
                            borderRadius: 13,
                            paddingHorizontal: 6,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Text style={{fontSize: 10, color: '#fff'}}>更新</Text>
                          </View>  : null
                      }
                    </View>
                  </View>


                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 24,
                      marginTop: 12,
                      color: '#939AA2',
                    }}
                    numberOfLines={2}
                  >
                    {this.state.list[this.state.sliderActiveSlide].brief}
                  </Text>


                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems:'center',
                      marginTop: 14,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#939AA2',
                      }}
                    >{this.state.list[this.state.sliderActiveSlide].popularity + "人已读"}</Text>

                    <TouchableOpacity
                      onPress={()=>{
                        if (!this.state.list[this.state.sliderActiveSlide].isCollected) {
                          this._addToBookshelf(this.state.list[this.state.sliderActiveSlide])
                        }
                      }}
                    >
                      <View style={{
                        height: 26,
                        width: 90,
                        borderRadius: 13,
                        borderWidth: 1 / PixelRatio.get(),
                        borderColor: '#F85733',
                        paddingHorizontal: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{fontSize: 12, color: this.state.list[this.state.sliderActiveSlide].isCollected ? '#FCC7BF' : '#F85733'}}>{ this.state.list[this.state.sliderActiveSlide].isCollected ? "已加入书架" : "加入书架"}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                : null
            }
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  _addToBookshelf = (ret) => {
    this.state.list[this.state.sliderActiveSlide].isCollected = true
    let tmpList = this.state.list
    this.setState({
      list: tmpList,
    })

    if (!!this.props.user.token) {
      // 同步到服务端
      this.props.actions.addBookInit({
        book_id: ret.id,
        chapter_id: 0,
        chapter_sort: 0,
      })
    }

    const book = {...ret}
    book.chapter_id = 0
    book.chapter_sort = 0
    book.chapter_title = ""
    book.timestamp = `${Date.now()}`
    book.icon_status = 2
    book.start_ad_ts = ""
    book.end_ad_ts = ""
    book.start_vip_ts = ""
    book.end_vip_ts = ""
    book.url = ret.url
    updateBookShelf(book)
    let newBooks = convertToArray(queryShelfBooks().sorted('timestamp', true));
    this.props.actions.recommendBookInitSuccess({data: newBooks})
  }
}


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({...quduAction, ...bookshelfAction}, dispatch),
})

export default connect(({user, qudu}) => ({
  user,
  qudu
}), mapDispatchToProps)(BookQuduPage)

