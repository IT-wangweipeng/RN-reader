import React, {Component} from 'react'
import {
  View,
  FlatList, Text, Image,
  StyleSheet,
  TouchableOpacity, Alert,
  ImageBackground,
  Switch,
  DeviceEventEmitter, NativeModules, Platform
} from 'react-native'
import JPush from 'jpush-react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as CELL from './MinePageCellConfig'
import * as userAction from '../../actions/userAction'
import * as bookshelfAction from '../../actions/bookshelfAction'
import * as hotBeansAction from '../../reducers/hotBeansReducer'
import * as notificationAction from '../../reducers/notificationReducer'
import {getItem, removeItem, setItem} from '../../utils/AsyncStorageManager'
import {KEY_RECOMMEND_BOOK, KEY_TOKEN} from '../../utils/AsyncStorageKey'
import {
  FloatWindowApi,
  launcherAlertWindowApi,
  HotBeansPaymentApi,
  GetUserInfoApi,
  UserSignStatusApi
} from '../../apis/Api'
import {showToast} from '../../actions/toastAction'
import {deleteAll, query} from '../../model/BookModelManager'
import {Config} from '../../config/Config'
import {queryBooks} from '../../model/BookModelManager'
import images from '../../component/images'
import Toast from "react-native-root-toast";
import FloatView from '../../component/FloatVeiw'
import {sendAction, UMCPS} from '../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../utils/Analysis/UMConfig'
import {isIOS} from "../../utils/PlatformUtils";
import R from "ramda";
import CryptoJS from 'crypto-js'
import {shanDianWanGameURL} from "../../utils/ShanDianWanGame";
import {READ_GIFT} from "./MinePageCellConfig";


const CONST_FLOAT_VIEW_POSITION = 4
const BookReadManager = NativeModules.BookReadManager
const nativeModule = NativeModules.OpenNativeModule

class MinePage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: {},
      isNightMode: false,
      isMusicPlay: false,
      isSign: false
    }
  }

  initConfig() {
    if (Platform.OS === 'ios') {
      BookReadManager.nightMode(isNightMode => {
        this.setState({
          isNightMode,
        })
      })
      BookReadManager.musicButtonStatus(isMusicPlay => {
        console.log('isMusicPlay ------ ', isMusicPlay)
        this.setState({
          isMusicPlay,
        })
      })
    } else {
      nativeModule.getNightMode((isNightMode)=>{
        console.log('yy getNightMode isNightMode=',isNightMode)
        this.setState({
          isNightMode: isNightMode,
        })
      })
      nativeModule.getMusicPlayFeature((isMusicPlay)=>{
        console.log('yy getMusicPlayFeature isMusicPlay=',isMusicPlay)
        this.setState({
          isMusicPlay: isMusicPlay,
        })
      })
    }
  }

  getFloatWindow() {
    // 小浮窗
    getItem(KEY_TOKEN).then((token) => {
      FloatWindowApi(this.props.user.info.sex || 3, CONST_FLOAT_VIEW_POSITION, token)
        .then((ret) => {
          console.log('FloatWindow api result:  ', ret)
          if (ret.status === 200) {
            if (JSON.stringify(ret.data) == '{}' || ret.data === undefined) {
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
    DeviceEventEmitter.addListener('showFloatView', (e) => {
      if (e.fromFloatView === CONST_FLOAT_VIEW_POSITION) {
        this.getFloatWindow()
      }
    })
    // DeviceEventEmitter.addListener('nativeUpdateNightMode', (e) => {
    //   console.log('yy nativeUpdateNightMode isNightMode=',e.is_night_mode)
    //   this.setState({
    //     isNightMode: e.is_night_mode,
    //   })
    // })
    DeviceEventEmitter.addListener('LoginSuccess', () => {
      this._fetchSignStatus()
      this._fetchHotBeans()
      this._notificationTips(1)
    })
    DeviceEventEmitter.addListener('Logout', () => {
      this.setState({
        isSign: false
      })
    })
    this.getFloatWindow()
    this.props.navigation.setParams({onPressMineTab: this._onPressMineTab})
  }

  componentWillMount() {
    this.initConfig()
    this._fetchSignStatus()
    this._fetchHotBeans()
    this._notificationTips(1)
  }

  _onPressMineTab = () => {
    console.log('onPressMineTab')
    this.initConfig()
    this._fetchHotBeans()
    this._notificationTips(1)
    this._fetchSignStatus()
  }

  _fetchSignStatus = () => {
    if (!!this.props.user.token) {
      const token = this.props.user.token
      UserSignStatusApi(token).then((ret) => {
        if (ret.status === 200) {
          if (ret.data && ret.data.today_is_sign === true) {
            this.setState({
              isSign: true
            })
          } else {
            this.setState({
              isSign: false
            })
          }
        } else {
          showToast(`${ret.message}`)
        }
      })
        .catch(error => {
          showToast(`获取签到信息失败：${error}`)
        })
    }
  }

  _fetchHotBeans = () => {
    if (!!this.props.user.token) {
      this.props.actions.getHotBeansInitAction()
    }
  }

  _notificationTips = (type) => {
    if (!!this.props.user.token) {
      this.props.actions.notificationTipsInit({
        type
      })
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          style={{flex: 1, backgroundColor: '#f1f1f6'}}
          data={CELL.DATA_SOURCE}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._listHeaderComponent()}
        />
        <FloatView
          ref={(n) => {
            this.floatViewRef = n
          }}
          position={CONST_FLOAT_VIEW_POSITION}
          data={this.state.data}
          navigation={this.props.navigation}
          onPress={() => {
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
      </View>
    )
  }

  _keyExtractor = (item, index) => item.id

  _renderItemRight(item) {
    if(item.type === CELL.NIGHT_MODE) {
      return (
        <Switch
          style={{
            position: 'absolute',
            right: 5,
          }}
          thumbTintColor={Platform.OS === 'ios' ? undefined : '#fff'}
          onTintColor='#f85836'
          tintColor={Platform.OS === 'ios' ? undefined : '#D5D5D5'}
          onValueChange={(value) => {
            if (Platform.OS === 'ios') {
              this.setState({
                isNightMode: value
              })
              BookReadManager.nightModeEnable(value)
            } else {
              this.setState({isNightMode: value},()=>{
                nativeModule.setNightMode(value)
              })
            }
          }}
          value={this.state.isNightMode}
        />
      )
    } else if(item.type === CELL.MUSIC_FEATURE) {
      return (
        <Switch
          style={{
            position: 'absolute',
            right: 5,
          }}
          thumbTintColor={Platform.OS === 'ios' ? undefined : '#fff'}
          onTintColor='#f85836'
          tintColor={Platform.OS === 'ios' ? undefined : '#D5D5D5'}
          onValueChange={(value) => {
            if (Platform.OS === 'ios') {
              this.setState({
                isMusicPlay: value
              })
              BookReadManager.musicButtonEnable(value)
            } else {
              this.setState({isMusicPlay: value},()=>{
                nativeModule.setMusicPlayFeature(value)
              })
            }
          }}
          value={this.state.isMusicPlay}
        />
      )
    } else {
      return (<Image
        style={styles.arrow}
        source={require('../../images/image_arrow_right.png')}
      />)
    }

  }

  _renderItem = ({item, index}) => {

    if (Config.iosReviewVersion) {
      if (item.type == CELL.INVITE_FRIEND || item.type == CELL.READ_GIFT) {
        return null
      }
    }

    return (
      <TouchableOpacity
        key={`mine_${index}`}
        style={styles.row}
        onPress={() => {
          this._onPressItem(item)
        }}
      >
        <Image
          style={{width: 17, height: 17}}
          source={item.image}
        />
        <Text style={styles.cellTitle}>
          {`${item.title}`}
        </Text>

        {/*消息通知*/}
        {
          this.props.notification && this.props.notification.showTips && item.type === CELL.NOTIFICATION ? (
            <View style={styles.notification} />
          ) : null
        }

        {this._renderItemRight(item)}

      </TouchableOpacity>
    )
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
                  showToast('已成功领取10热豆')
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


  _onPressItem = (item) => {
    const {user, navigation} = this.props
    switch (item.type) {
      case CELL.READ_GIFT:
        navigation.navigate('Web', {
          url: `${Config.url.missionURL()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
          showCloseIcon: true,
          pageWillUnmountCallback: () => {
            this._fetchHotBeans()
          }
        })
        // UMCPS(UMConfig.ACTION_MISSION, {})
          sendAction(UMConfig.ACTION_MISSION)
        break
      case CELL.INVITE_FRIEND:
        if (!!user.token) {
          navigation.navigate('Web', {
            url: `${Config.url.invite()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
            showCloseIcon: true,
            pageWillUnmountCallback: () => {
              this._fetchHotBeans()
            }
          })
          return;
        }
        navigation.navigate('Login')
        break
      case CELL.NOTIFICATION:
        if (!!user.token) {
          this._notificationTips(2)
          navigation.navigate('MineMessage')
          return
        }
        navigation.navigate('Login')
        break
      case CELL.SETTING:
        navigation.navigate('Setting')
        break;
      case CELL.MINE_COMMENTS:
        if (!!user.token) {
          navigation.navigate('MineComment')
          return
        }
        navigation.navigate('Login')
        break
      case CELL.READ_RECORD:
          navigation.navigate('ReadHistory', {
            callback: () => {
              this.initConfig()
            }
          })
        break
      case CELL.GAME_CENTER:
        if (!!user.token) {
          this.goToGameCenter()
          return
        }
        navigation.navigate('Login')
        break
      default:
        break
    }
  }


  _listHeaderComponent = () => (
    <View style={{backgroundColor: '#fff',}}>
      <View
        style={[styles.nicknameWrapper, {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}]}
      >
        <TouchableOpacity
          onPress={() => {
            const {user, navigation} = this.props
            if (!!user.token) {
              this.props.navigation.navigate('EditUserInfo')
            } else {
              navigation.navigate('Login')
            }
          }}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <ImageBackground
                style={{width: 60, height: 60, marginTop: 20, backgroundColor: '#fff'}}
                source={require('../../images/image_avatar_shadow.png')}
              >
                {
                  !!this.props.user.token ? (
                    <Image
                      style={[styles.avatar, {backgroundColor: '#f1f1f6',overflow:'hidden', marginTop: -15}]}
                      defaultSource={require('../../images/image_avatar_placeholder.png')}
                      source={this.props.user.info.pic ? {uri: this.props.user.info.pic} : require('../../images/image_avatar_placeholder.png')}
                    />
                  ) : (
                    <Image
                      style={[styles.avatar, {backgroundColor: '#f1f1f6', marginTop: -15}]}
                      source={require('../../images/image_avatar_placeholder.png')}
                    />
                  )
                }
              </ImageBackground>

              {
                (!Config.iosReviewVersion && this.props.user.info.is_vip === 1) ? (
                  <Image
                    style={{width: 24, height: 24, position: 'absolute', right: -6, top: -8 }}
                    source={images.vip_crown}
                  />
                ) : null
              }

            </View>
            {
              !!this.props.user.token ? (
                <Text
                  style={[styles.nickname, {marginLeft: 17}]}
                  numberOfLines={1}
                >
                  {`${this.props.user.info && decodeURIComponent(this.props.user.info.nickname)}`}
                </Text>
              ) : (
                <View style={{marginLeft: 16}}>
                  <Text style={[styles.nickname]}>
                    {'点击登录'}
                  </Text>
                  <Text style={{fontSize: 13, color: '#999ba1', marginTop: 8, fontWeight: "500"}}>
                    {'新用户享3天免广告特权'}
                  </Text>
                </View>
              )
            }
          </View>



          {/*<View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'cyan'}}>*/}
          {/*  <ImageBackground*/}
          {/*    style={{width: 60, height: 60, marginTop: 20}}*/}
          {/*    source={require('../../images/image_avatar_shadow.png')}*/}
          {/*  >*/}
          {/*    {*/}
          {/*      !!this.props.user.token ? (*/}
          {/*        <View style={[styles.avatar, {backgroundColor: '#f1f1f6', overflow:'hidden', marginTop: -15}]}>*/}
          {/*          <Image*/}
          {/*            style={[styles.avatar, {backgroundColor: '#f1f1f6',overflow:'hidden'}]}*/}
          {/*            defaultSource={require('../../images/image_avatar_placeholder.png')}*/}
          {/*            source={this.props.user.info.pic ? {uri: this.props.user.info.pic} : require('../../images/image_avatar_placeholder.png')}*/}
          {/*          >*/}

          {/*          </Image>*/}
          {/*        </View>*/}
          {/*      ) : (*/}
          {/*        <Image*/}
          {/*          style={[styles.avatar, {backgroundColor: '#f1f1f6', marginTop: -15}]}*/}
          {/*          source={require('../../images/image_avatar_placeholder.png')}*/}
          {/*        />*/}
          {/*      )*/}
          {/*    }*/}
          {/*  </ImageBackground>*/}

          {/*  {*/}
          {/*    !!this.props.user.token ? (*/}
          {/*      <Text*/}
          {/*        style={[styles.nickname, {marginLeft: 17}]}*/}
          {/*        numberOfLines={1}*/}
          {/*      >*/}
          {/*        {`${this.props.user.info && decodeURIComponent(this.props.user.info.nickname)}`}*/}
          {/*      </Text>*/}
          {/*    ) : (*/}
          {/*      <View style={{marginLeft: 16}}>*/}
          {/*        <Text style={[styles.nickname]}>*/}
          {/*          {'点击登录'}*/}
          {/*        </Text>*/}
          {/*        <Text style={{fontSize: 13, color: '#999ba1', marginTop: 8, fontWeight: "500"}}>*/}
          {/*          {'新用户享3天免广告特权'}*/}
          {/*        </Text>*/}
          {/*      </View>*/}
          {/*    )*/}
          {/*  }*/}
          {/*</View>*/}
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => {
            if (this.state.isSign) {
              return
            }
            const {user, navigation} = this.props
            if (!!user.token) {
              navigation.navigate('Web', {
                url: `${Config.hotBeans.missionURL}?token=${user.token}&timestamp=${Date.now()}&sign=1`,
                title: '福利任务',
                rightIcon: '规则',
                rightIconType: 2,
                signStatusCallback: () => {
                  console.log('123')
                  this.setState({
                    isSign: true
                  })
                },
                updateHotBeansCallback: () => {
                  this._fetchHotBeans()
                }
              })
              UMCPS(UMConfig.ACTION_MISSION, {})
            } else {
              navigation.navigate('Login')
            }
            UMCPS(UMConfig.ACTION_CHECKIN, {})
          }}
        >
          <View style={styles.checkin}>
            <Text style={{fontSize: 15, fontWeight: "bold", fontStyle: "normal", color: '#fff'}}>
              {this.state.isSign ? '已签到' : '签到'}
            </Text>
          </View>
        </TouchableOpacity> */}
      </View>

      {/* 我的收益 */}
      {
        Config.iosReviewVersion ? null : (
          <View style={{justifyContent:'space-between', alignItems: "center", flexDirection: "row", marginLeft: 30, marginRight: 20}}>
            {
              !!this.props.user.token ? (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Web', {
                      url: `${Config.url.balance()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
                      showCloseIcon: true,
                      pageWillUnmountCallback: () => {
                        this._fetchHotBeans()
                      }
                    })
                  }}
                >
                  {/* 收益数字  需要从后台获取*/}
                  <View style={styles.income}>
                    <View style={styles.income_head}>
                      <Text style={{fontSize:27,color:'#F85836'}}>
                        {!!this.props.hotBeans.data && this.props.hotBeans.data|| '0'}
                      </Text>
                      <View style={{backgroundColor: '#FFDDD8', width: 58, height: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize:11,color:'#F85836'}}>
                          {`约${Number(this.props.hotBeans.data / 10000).toFixed(2)}元`}
                        </Text>
                      </View>
                    </View>
                    <Text style={{marginTop: 11, fontSize:12,color:'#999BA1'}}>我的收益(热豆)</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    const {user, navigation} = this.props
                    navigation.navigate('Login')
                  }}
                >
                  <View style={styles.income}>
                    <View style={{justifyContent: 'center', backgroundColor:'#F85836',height:25,width:100,borderRadius:22,alignItems:'center'}}>
                      <Text style={{fontSize:12,color:'#FFFFFF',textAlign:'center',}}>登录后查看收益</Text>
                    </View>
                    <Text style={{fontSize:12,color:'#999BA1', marginTop: 7,}}>我的收益(热豆)</Text>
                  </View>
                </TouchableOpacity>
              )
            }

            <TouchableOpacity
              onPress={() => {
                const {user, navigation} = this.props
                if (!!user.token) {
                  navigation.navigate('Web', {
                    url: `${Config.url.withdraw()}?token=${user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`,
                    showCloseIcon: true,
                    pageWillUnmountCallback: () => {
                      this._fetchHotBeans()
                    }
                  })
                  return;
                }
                navigation.navigate('Login')
              }}
            >
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize:15, color:'#F85836'}}>{'提现'}</Text>
                <Image
                  style={{marginLeft: 4, width: 16, height: 16}}
                  source={images.image_arrow_right}
                />
              </View>
            </TouchableOpacity>
          </View>
        )
      }


      {
        (this.props.user.info && !Config.iosReviewVersion) ? (
          <TouchableOpacity
            onPress={() => {
              const {navigation} = this.props
              navigation.navigate('Web', {
                url: Config.vip.url(),
                showCloseIcon: true,
                // rightIcon: '购买记录',
                // type: 'PAY_RECORD',
                pageWillUnmountCallback: () => {
                  const {user} = this.props
                  if (!!user.token) {
                    GetUserInfoApi(user.token).then(ret => {
                      if (ret.status === 200) {
                        this.props.actions.userInit({
                          token: user.token,
                          user: ret.data
                        })
                      } else {
                        showToast(`${ret.message}`)
                      }
                    })
                      .catch(error => {
                        showToast(`${error.message}`)
                      })
                  }
                }
              })
            }}
          >
            <ImageBackground
              style={{marginHorizontal: 20, height: 87, justifyContent: 'center', marginTop: 20}}
              source={this.props.user.info.is_vip === 1 ? images.vip_gold : images.vip_gray }
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginLeft: 25}}>
                  <Text style={{fontSize: 21, color: this.props.user.info.is_vip === 1 ? '#504A39' : '#585D64'}}>
                    {'热料VIP会员'}
                  </Text>
                  <Text style={{fontSize: 12, color: this.props.user.info.is_vip === 1 ? '#81785E' : '#585D64', marginTop: 14}}>
                    {'全站小说免广告，放肆看'}
                  </Text>
                </View>

                <View style={{flex: 1}}/>
                <View style={{width: 80, marginRight: 24,  height: 25, borderWidth: 1, borderColor: this.props.user.info.is_vip === 1 ? '#F85836' : '#585D64' , borderRadius: 22, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 14, color: this.props.user.info.is_vip === 1 ? '#F85836' :'#585D64' }}>
                    {this.props.user.info.is_vip === 1 ? '立即续费' : '立即开通'}
                  </Text>
                </View>
              </View>

            </ImageBackground>
          </TouchableOpacity>
        ) : null
      }


      <View style={styles.recordViewWrapper}>
        {/* <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Web', {
              url: `${Config.hotBeans.mineURL}?token=${this.props.user.token}&timestamp=${Date.now()}`,
              title: '我的热豆',
              rightIcon: '明细',
              rightIconType: 1,
              showCloseIcon: true,
              updateHotBeansCallback: () => {
                this._fetchHotBeans()
              }
            })
            UMCPS(UMConfig.ACTION_HOT_BEAN, {})
          }}
        >
          <View style={{alignItems: 'center'}}>
            <Text style={styles.recordTitle}>
              {!!this.props.user.token ? this.props.hotBeans.data || '0' : '-'}
            </Text>
            <Text style={styles.recordDescription}>
              {'热豆'}
            </Text>
          </View>
        </TouchableOpacity> */}


        <TouchableOpacity
          onPress={() => {
            const {user, navigation} = this.props
            if (!!user.token) {
              navigation.navigate('ReadTime')
              return
            }
            navigation.navigate('Login')
          }}
        >
          <View style={{alignItems: 'center'}}>
            <Text style={styles.recordTitle}>
              {!!this.props.user.token ? `${((this.props.bookshelf.readTime.app_ts || 0) / 60).toFixed()}` : '-'}
            </Text>
            <Text style={styles.recordDescription}>
              {'今日已读(分钟)'}
            </Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => {
            const {user, navigation} = this.props
            if (!!user.token) {
              navigation.navigate('CompletedBook')
              return
            }
            navigation.navigate('Login')
          }}
        >
          <View style={{alignItems: 'center'}}>
            <Text style={styles.recordTitle}>
              {!!this.props.user.token ? `${this.props.bookshelf.totalRead}` : '-'}
            </Text>
            <Text style={styles.recordDescription}>
              {'读完(本)'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{height: 6, marginTop: 22, backgroundColor: '#f1f1f6'}}>
      </View>
    </View>
  )
}

MinePage.propTypes = {}

const styles = StyleSheet.create({
  nicknameWrapper: {
    marginTop: 60,
    marginHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    color: "#353535",
    fontSize: 20,
    width: 150,
    fontWeight: "bold",
    fontStyle: "normal",
  },
  recordViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 80,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  recordTitle: {
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    color: "#f85836"
  },
  recordDescription: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "bold",
    fontStyle: "normal",
    color: 'rgb(148, 155, 165)'
  },
  row: {
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  cellTitle: {
    marginLeft: 14,
    fontSize: 16,
    color: '#585D64'
  },
  arrow: {
    position: 'absolute',
    right: 15,
    width: 15,
    height: 18
  },
  footer: {
    height: 55,
    flex: 1,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkin: {
    width: 75,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f85836',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification: {
    backgroundColor: '#F85836',
    width: 6,
    height: 6,
    marginLeft: 4,
    borderRadius: 3,
    marginTop: -15,
  },
  income:{
    alignItems:'center',
    flexDirection:'column',
  },
  income_head:{
    flexDirection:'row',
    alignItems:'center',
  },
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...userAction,
    ...bookshelfAction,
    ...hotBeansAction,
    ...notificationAction,
  }, dispatch)
})

export default connect(({user, bookshelf, hotBeans, notification}) => {
  return {
    user,
    bookshelf,
    hotBeans,
    notification
  }
}, mapDispatchToProps)(MinePage)
