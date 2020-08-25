import React, {Component} from 'react'
import {
  View,
  Text,
  DeviceEventEmitter,
  Image,
  LayoutAnimation,
  TouchableOpacity, Dimensions,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {SafeAreaView} from "react-navigation";
import AutoRollingMessage from './AutoRollingMessage'
import {isIphoneX} from '../../utils/DeviceUtils'
import * as marketSearchRecommendAction from '../../actions/marketSearchRecommendAction'
import * as hotBeansAction from '../../reducers/hotBeansReducer'

import {sendAction, UMCPS} from '../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../utils/Analysis/UMConfig'
import BookMarketQualityPage from  './BookMarketQualityPage'
import BookMarketTopTabBar from "./BookMarketTopTabBar"
import images from "../../component/images";
import R from "ramda";
import {Header} from 'react-navigation'
import {getItem} from '../../utils/AsyncStorageManager'
import {KEY_TOKEN} from '../../utils/AsyncStorageKey'
import FloatView from '../../component/FloatVeiw'
import {FloatWindowApi, HotBeansPaymentApi, launcherAlertWindowApi} from '../../apis/Api'
import {showToast} from "../../actions/toastAction";
import {Config} from "../../config/Config";
import {isIOS} from "../../utils/PlatformUtils";
import {shanDianWanGameURL} from "../../utils/ShanDianWanGame";
const {width, height} = Dimensions.get('window')

const CONST_FLOAT_VIEW_POSITION = 1

class BookMarketPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sex: this.props.user.info.sex || 3,
      showTitle: true,
      showSearch: false
    }
    this.scrollViewStartOffsetY = 0 //用于记录手指开始滑动时ScrollView组件的Y轴偏移量，通过这个变量可以判断滚动方向
  }

  _openSearchPage = (keywords) => {
    console.log('yy _openSearchPage() keywords=', keywords)
    this.props.navigation.navigate('Search', {keywords: keywords})
  }

  getFloatWindow() {
    // 小浮窗
    getItem(KEY_TOKEN).then((token) => {
      FloatWindowApi(this.props.user.info.sex || 3, CONST_FLOAT_VIEW_POSITION, token)
        .then((ret) => {
          console.log('yy FloatWindow api result:  ', ret)
          if (ret.status === 200) {
            if (JSON.stringify(ret.data) === '{}' || ret.data === undefined) {
              // do nothing
            } else {
              this.setState({
                data: ret.data,
              }, () => {
                this.floatViewRef.showFloatView()
              })
            }

          } else {
            showToast(ret.message)
          }
        })
        .catch((error) => {
          console.log('FloatWindow api error: ', error)
          if (error.message) {
            showToast(error.message)
          }
        })
    })
  }

  getLaunchAlertWindow() {
    //启动页弹窗
    getItem(KEY_TOKEN).then((token) => {
      console.log('yy launcherAlertWindowApi token=', token)
      launcherAlertWindowApi(token)
        .then((ret) => {
          console.log('yy launcherAlertWindowApi result:  ', ret)
          if (ret.status === 200) {
            if (ret.data.length > 0) {
              switch (ret.data[0].type) {
                case 1://书籍id
                case 2://url链接
                case 4://发现二级页面
                case 5://登录
                  this.props.navigation.navigate('LauncherAlert', {
                    data: ret.data[0],
                    fromFloatView: CONST_FLOAT_VIEW_POSITION,
                  })
                  break;
                default:
                  break;
              }
            }

          }
        })
        .catch((error) => {
          console.log('launcherAlertWindowApi error: ', error)
          if (error.message) {
            showToast(error.message)
          }
        })
    })
  }

  componentDidMount() {
    this.props.actions.marketSearchRecommendInit();

    DeviceEventEmitter.addListener('showFloatView', (e) => {
      if (e.fromFloatView === CONST_FLOAT_VIEW_POSITION) {
        this.getFloatWindow()
      }
    })

    this.getFloatWindow()
  }

  onScroll = (e) => {
    this.offsetY = e.nativeEvent.contentOffset.y
    // console.log('gg onScroll offsetY=', this.offsetY)
    if (/*this.offsetY === 0*/ this.offsetY - this.scrollViewStartOffsetY < -50 && !this.state.showTitle) {//下滑
      LayoutAnimation.easeInEaseOut()
      this.setState({
        showTitle: true,
        showSearch: false
      })
    } else if (this.offsetY - this.scrollViewStartOffsetY > 50 && this.state.showTitle) {//上滑
      LayoutAnimation.easeInEaseOut()
      this.setState({
        showTitle: false,
        showSearch: true
      })
    }
  }

  onScrollBeginDrag = (e) => {
    this.scrollViewStartOffsetY = e.nativeEvent.contentOffset.y
    // console.log('gg onScrollBeginDrag scrollViewStartOffsetY=' + this.scrollViewStartOffsetY + ',offsetY=' + this.offsetY)
    if (this.scrollViewStartOffsetY === 0 && !this.state.showTitle) {
      this.lastOffsetY = this.offsetY
      setTimeout(()=>{
        // console.log('gg timeout offsetY='+this.offsetY+',lastOffsetY='+this.lastOffsetY)
        if(this.offsetY === this.lastOffsetY) {
          LayoutAnimation.easeInEaseOut()
          this.setState({
            showTitle: true,
            showSearch: false,
          })
        }
      },30)
    }
  }


  _paddingTop() {
    const ret = this.state.showTitle
    if (ret) {
      return 0
    } else {
      return isIphoneX() ? 43 : 20
    }
  }

  _fetchHotBeans = () => {
    if (!!this.props.user.token) {
      this.props.actions.getHotBeansInitAction()
    }
  }

  renderTitle() {
    if (this.state.showTitle) {
      return (
        <View style={{
          marginTop: isIOS() ? 6 : 0,
          marginBottom: isIOS() ? 18 : 0,
          flexDirection: 'row',
          marginHorizontal: 16,
          height: isIOS() ? undefined : Header.HEIGHT,
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 20,
            color: '#1e252f'
          }}>
            书城
          </Text>
          <View
            style={{
              flex: 1,
              marginStart: 18,
              height: 30,
              backgroundColor: '#f1f1f6',
              borderRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              style={{
                width: 20,
                height: 20,
                marginLeft: 16,
                marginRight: 13,
              }}
              source={images.search}
            />
            {this.props.marketSearchRecommend.data.length > 0 ?
              <AutoRollingMessage
                height={30}
                childrenHeight={20}
                duration={5000}
                delay={25000}
                containerStyle={{backgroundColor: '#f1f1f6', marginStart: 5, marginEnd: 15, flex: 1}}
                childrenStyle={{backgroundColor: '#f1f1f6', color: '#1e252f', fontSize: 12, justifyContent: 'center'}}
                onPressItem={(index) => {
                  this._openSearchPage(this.props.marketSearchRecommend.data[index])
                }}
              >
                {R.addIndex(R.map)((value, index) => (
                  <Text
                    key={index}
                    numberOfLines={1}
                    ellipsizeMode='tail'>{value}</Text>
                ), this.props.marketSearchRecommend.data)
                }
              </AutoRollingMessage>
              : null
            }
          </View>

          {
            Config.iosReviewVersion ? null : (
              <TouchableOpacity
                style={{marginStart: 16}}
                onPress={() => {
                  this.props.navigation.navigate('Web', {
                    url: `${Config.url.missionURL()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
                    title: '福利任务',
                    rightIcon: '规则',
                    rightIconType: 2,
                    updateHotBeansCallback: () => {
                      this._fetchHotBeans()
                    },
                    h5PlayGameCallback: () => {
                      const {user} = this.props
                      if (!!user.token) {
                        this.goToGameCenter()
                      }
                    }
                  })
                  sendAction(UMConfig.market_taskcenter_clicked)
                }}
              >
                <Image
                  style={{width: 33, height: 33}}
                  source={images.image_bookmarket_welfare}
                />
              </TouchableOpacity>
            )
          }

        </View>
      )
    }

    return null
  }


  goToGameCenter(){
    this.props.navigation.navigate('Web',{
      url: shanDianWanGameURL(this.props.user),
      callback: () => {
        const {user} = this.props
        if (!!user.token) {
          HotBeansPaymentApi(user.token, 13)
            .then((ret) => {
              console.log('HotBeansPaymentApi result:  ', ret)
              if (ret.status === 200) {
                if(ret.data.task_complete_state === false) {
                  showToast('已成功领取热豆')
                  this._fetchHotBeans()
                }
              }
            })
            .catch((error) => {
              console.log('HotBeansPaymentApi error: ', error)
            })
        }
      }
    })
  }

  render() {
    const {navigation} = this.props
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.renderTitle()}
        <ScrollableTabView
          // style={{paddingTop: Platform.OS === 'ios' ? this._paddingTop() : 0}}
          initialPage={0}
          renderTabBar={() => (
              <BookMarketTopTabBar
                style={{
                  width: width - 50,
                  backgroundColor: '#fff'
                }}
                onSearchClick={() => {
                  navigation.navigate('Search', {
                    keywords: ''
                  })
                }}
                showSearch={this.state.showSearch}
                activeFontSize={17}
                inactiveFontSize={14}
                activeColor={'#F85836'}
                inactiveColor="#939aa2"
                tabUnderlineDefaultWidth={24}
                tabUnderlineScaleX={3}
              />
          )}
        >
          <BookMarketQualityPage
            tabLabel="精选"
            bannerPosition={1}
            sex={3}
            navigation={navigation}
            onScroll={this.onScroll}
            onScrollBeginDrag={this.onScrollBeginDrag}
            showTitle={this.state.showTitle}
          />
          <BookMarketQualityPage
            tabLabel="男频"
            bannerPosition={4}
            sex={1}
            navigation={navigation}
            onScroll={this.onScroll}
            onScrollBeginDrag={this.onScrollBeginDrag}
            showTitle={this.state.showTitle}
          />
          <BookMarketQualityPage
            tabLabel="女频"
            bannerPosition={5}
            sex={2}
            navigation={navigation}
            onScroll={this.onScroll}
            onScrollBeginDrag={this.onScrollBeginDrag}
            showTitle={this.state.showTitle}
          />
          <BookMarketQualityPage
            tabLabel="图书"
            bannerPosition={9}
            sex={4}
            navigation={navigation}
            onScroll={this.onScroll}
            onScrollBeginDrag={this.onScrollBeginDrag}
            showTitle={this.state.showTitle}
          />
          {
            Config.iosReviewVersion ? null : (
              <BookMarketQualityPage
                tabLabel="VIP"
                bannerPosition={13}
                sex={5}
                navigation={navigation}
                onScroll={this.onScroll}
                onScrollBeginDrag={this.onScrollBeginDrag}
                showTitle={this.state.showTitle}
              />
            )
          }

        </ScrollableTabView>
        <FloatView
          ref={(n) => {
            this.floatViewRef = n
          }}
          position={CONST_FLOAT_VIEW_POSITION}
          data={this.state.data}
          navigation={this.props.navigation}
          onPress={() => {
            console.log('yy onPress data=', this.state.data)
            switch (this.state.data.type) {
              case 1:// bookid
                this.props.navigation.navigate('Detail', {bookId: this.state.data.url})
                break;
              case 2:// url
                this.props.navigation.navigate('Web', {
                  url: this.state.data.url,
                })
                break;
              case 7:// 调用启动弹窗
                this.floatViewRef.hideFloatView()
                this.getLaunchAlertWindow()
                break;
              case 8://趣读跳转
                this.props.navigation.navigate('Qudu')
                break;
            }
            UMCPS(UMConfig.market_floatview_clicked, {position: CONST_FLOAT_VIEW_POSITION})
          }}
        />
      </SafeAreaView>
    )
  }

}


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({...marketSearchRecommendAction, ...hotBeansAction}, dispatch),
})

export default connect(({user, marketSearchRecommend, hotBeans}) => ({
  user, marketSearchRecommend, hotBeans
}), mapDispatchToProps)(BookMarketPage)
