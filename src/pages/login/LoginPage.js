import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  DeviceEventEmitter, NativeModules, Platform,
} from 'react-native'
import * as WeChat from 'react-native-wechat'
import ProgressHUD from 'react-native-progress-hud'
import JPush from 'jpush-react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-root-toast'
import * as QQAPI from 'react-native-qq';
import {checkPhone, checkCaptcha} from '../../utils/CheckUtil'
import {showToast} from '../../actions/toastAction'
import * as userAction from '../../actions/userAction'
import * as bookshelfAction from '../../actions/bookshelfAction'
import {
  CaptchApi,
  LoginApi,
  ThirdLoginApi,
  FavoriteBooksApi,
  BookSyncApi,
  BindThirdApi,
  AutoLoginApi
} from '../../apis/Api'
import * as ERROR from '../../constant/errorMsg'
import {Config} from '../../config/Config'
import IMAGES from '../../component/images'
import {getItem, removeItem, setItem} from '../../utils/AsyncStorageManager'
import {KEY_TOKEN, KEY_RECOMMEND_BOOK} from '../../utils/AsyncStorageKey'
import {query, queryShelfBooks} from '../../model/BookModelManager'
import {convertToArray} from '../../utils/CommonUtil'
import moment from 'moment'

var nativeModule = NativeModules.OpenNativeModule
const BookReadManager = NativeModules.BookReadManager;

class LoginPage extends Component {

  constructor(props) {
    super(props)

    this.conterTime = 60

    this.state = {
      captcha: '',
      phone: '',
      captchaButtonColor: '#cccccc',
      isCounting: false,
      counterText: '获取验证码',
      counter: this.conterTime,
      updateColor: false,
      wechatInstalled: false,
      isLoading: false,
    }
    this.jumpToReadPreference = false
  }

  componentDidMount(): void {

  }

  componentWillMount() {
    WeChat.isWXAppInstalled().then(ret => {
      this.setState({
        wechatInstalled: ret,
      })
    })
  }

  componentWillUnmount() {
    console.log('yy Login componentWillUnmount jumpToReadPreference=', this.jumpToReadPreference)
    if (this.jumpToReadPreference) {
      //do nothing
    } else {
      this.resumeNativeReadPage()
    }
  }


  resumeNativeReadPage() {
    const { navigation } = this.props
    if (navigation.state.params && navigation.state.params.jumpFlag === 1) {
      DeviceEventEmitter.emit('resumeToReadPage')
    } else if(navigation.state.params && navigation.state.params.jumpFlag === 2) {
      if (!!this.props.user.token) {//若登录成功
        if(this.props.user.info.is_vip === 1) {//若用户已是vip，则退回到阅读页
          DeviceEventEmitter.emit('resumeToReadPage')
        } else {//若用户不是vip，则跳到vip中心
          navigation.navigate('Web', {
            url: Config.vip.url(),
            fromReadBookPage: true
          })
        }

      } else { //若没有登录，例如点击返回，则退回到阅读页
        DeviceEventEmitter.emit('resumeToReadPage')
      }
    } else if(navigation.state.params && navigation.state.params.jumpFlag === 3) {
      if (!!this.props.user.token) {//若登录成功
        navigation.navigate('PublishingPost', {
          bookId: navigation.state.params.bookId,
          fromReadBookPage: true,
        })
      } else { //若没有登录，例如点击返回，则退回到阅读页
        DeviceEventEmitter.emit('resumeToReadPage')
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          keyboardShouldPersistTaps={'handled'}
        >
          <TouchableOpacity
            style={{width: 44, height: 44, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          >
            <Image
              style={{width: 24, height: 24}}
              source={require('../../images/image_arrow_left.png')}
            />
          </TouchableOpacity>

          <Text style={styles.loginText}>
            {'登录'}
          </Text>
          <Text style={styles.loginDesc}>
            {'欢迎您使用热料小说'}
          </Text>


          <View style={{marginHorizontal: 37, marginTop: 60}}>
            <View style={[styles.textInputWrapper]}>
              <TextInput
                style={{height: 48, marginLeft: 16}}
                maxLength={11}
                allowFontScaling={false}
                placeholder="请输入您的手机号"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                underlineColorAndroid="transparent"
                onChangeText={value => {
                  this.setState({phone: value})
                  if (this.state.captcha.length === 6 && value.length === 11) {
                    this.setState({
                      updateColor: true,
                    })
                  } else {
                    this.setState({
                      updateColor: false,
                    })
                  }
                }}
                value={this.state.phone}
              />
            </View>
            <View style={[styles.textInputWrapper, {marginTop: 22, flexDirection: 'row'}]}>
              <TextInput
                style={{height: 48, flex: 2, marginLeft: 16}}
                maxLength={6}
                allowFontScaling={false}
                placeholder="验证码"
                keyboardType="numeric"
                clearButtonMode="while-editing"
                underlineColorAndroid="transparent"
                onChangeText={value => {
                  this.setState({captcha: value})
                  if (value.length === 6 && this.state.phone.length === 11) {
                    this.setState({
                      updateColor: true,
                    })
                  } else {
                    this.setState({
                      updateColor: false,
                    })
                  }
                }}
                value={this.state.captcha}
              />
              <TouchableOpacity
                style={styles.captchaButton}
                onPress={() => {
                  this._getCaptcha()
                }}
              >
                <Text style={{color: this.state.isCounting ? '#cccccc' : '#f85836', fontSize: 15}}>
                  {`${this.state.counterText}`}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{marginTop: 40}}
              onPress={() => {
                this._login()
              }}
            >
              <View style={[styles.loginButton, {backgroundColor: this.state.updateColor ? '#f85836' : '#acacb9'}]}>
                <Text style={{color: '#fff', fontSize: 18}}>
                  {'登录'}
                </Text>
              </View>
            </TouchableOpacity>

            <Text style={{color: '#191d21', fontSize: 12, alignSelf: 'center', marginTop: 14,}}>
              {'登录即同意'}
              <Text
                onPress={() => {
                  this.props.navigation.navigate('Web', {
                    url: Config.url.service()
                  })
                }}
              >
                {'《用户协议》'}

              </Text>
              <Text>{'及'}</Text>
              <Text
                onPress={() => {
                  this.props.navigation.navigate('Web', {
                    url: Config.url.privacy()
                  })
                }}
              >
                {'《隐私服务》'}
              </Text>
            </Text>

          </View>

          {
            Config.iosReviewVersion ? null : (
              <View style={styles.bottomView}>
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                  <View style={{height: 0.5, flex: 1, backgroundColor: '#c3c3c3'}}/>
                  <Text style={{fontSize: 14, color: '#a4a4a4'}}>
                    {'  其他方式登录  '}
                  </Text>
                  <View style={{height: 0.5, flex: 1, backgroundColor: '#c3c3c3'}}/>
                </View>

                <View style={{flexDirection: 'row', marginTop: 16, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center'}}>
                  {
                    this.state.wechatInstalled ? (
                      <TouchableOpacity
                        style={styles.wechat}
                        onPress={() => {
                          this._wechatLogin()
                        }}
                      >
                        <Image
                          style={{width: 40, height: 40,}}
                          source={IMAGES.wechat}
                        />
                      </TouchableOpacity>
                    ) : null
                  }
                  <TouchableOpacity
                    style={[styles.wechat, {marginLeft: this.state.wechatInstalled ? 20 : 0}]}
                    onPress={() => {
                      this._qqLogin()
                    }}
                  >
                    <Image
                      style={{width: 40, height: 40,}}
                      source={IMAGES.qq}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </ScrollView>

        <ProgressHUD
          showHUD={this.state.isLoading}
          showLoading={this.state.isLoading}
        />
      </SafeAreaView>
    )
  }

  _login = () => {
    if (!checkPhone(this.state.phone)) {
      showToast('请输入手机号')
      return
    }
    if (!checkCaptcha(this.state.captcha)) {
      showToast('请输入验证码')
      return
    }

    const {
      navigation
    } = this.props
    this.setState({
      isLoading: true,
    })
    LoginApi(this.state.phone, this.state.captcha)
      .then((ret) => {
        console.log('login result:  ', ret)
        if (ret.status === 200) {
          this._storageUser(ret)
          this._setAlias(ret)
          this.setState({
            isLoading: false,
          })
          this._syncBooks(ret.data.token)
        } else {
          showToast(ret.message, Toast.positions.CENTER)
          this.setState({
            isLoading: false,
          })
        }
      })
      .catch((error) => {
        console.log('login api error: ', error)
        this.setState({
          isLoading: false
        })
        if (error.message) {
          showToast(error.message, Toast.positions.CENTER)
        }
      })
  }

  _getCaptcha = () => {
    const {
      phone,
      isCounting,
    } = this.state
    if (isCounting) {
      return
    }
    if (checkPhone(phone) && !isCounting) {
      CaptchApi(phone).then((ret) => {
        if (ret.status === 200) {
          this._countDown()
          showToast('验证码获取成功')
        } else {
          showToast(ret.message)
        }
      })
        .catch((error) => {
          console.log('captcha api error: ', error)
          if (error.message) {
            showToast(error.message)
          }
        })
    } else {
      showToast(ERROR.ERROR_PHONE_NUMBER)
    }
  }

  _countDown() {
    this.timer = setInterval(() => {
      let timeMinus = this.state.counter - 1
      if (timeMinus === 0) {
        this.setState({
          isCounting: false,
          counter: this.conterTime,
          counterText: '获取验证码',
        })
        clearInterval(this.timer)
      } else {
        this.setState({
          isCounting: true,
          counter: timeMinus,
          counterText: `${timeMinus}秒后重试`,
        })
      }
    }, 1000)
  }

  // 微信登录
  _wechatLogin() {
    WeChat.sendAuthRequest('snsapi_userinfo')
      .then((result) => {
        this._getWeChatOpenId(result.code)
      }).catch((e) => {
      showToast('操作已取消')
    })
  }

  _getWeChatOpenId(code) {
    const oauthUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${Config.wechat.appID}&secret=${Config.wechat.appSecret}&code=${code}&grant_type=authorization_code`
    fetch(oauthUrl).then(response => response.json())
      .then((ret) => {
        console.log('user info ===== ', ret)
        this._getWeChatUserInfo(ret)
      })
      .catch((error) => {
        showToast(error.message)
      })
  }

  _getWeChatUserInfo(ret) {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${ret.access_token}&openid=${ret.openid}`
    fetch(url).then(response =>
      response.json()
    ).then((ret) => {
      console.log('wechat login info: ', ret)
      this._wechatRegister(ret)
    }).catch((error) => {
      showToast(error.message)
    })
  }

  _wechatRegister(info) {
    this.setState({
      isLoading: true,
    })
    ThirdLoginApi(info.unionid, info.openid, encodeURIComponent(info.nickname), 1, info.headimgurl).then(ret => {
      console.log('wechat register result: ', ret)
      if (ret.status === 200) {
        // 产品说去掉微信绑手机的功能

        // const {data} = ret
        // if (data && data.user && data.user.is_bind_phone === false) {
        //   // 微信绑定手机
        //   const user = {
        //     token: data.token,
        //     ...data.user,
        //   }
        //
        //   this.props.navigation.navigate('BindPhone', {
        //     user,
        //     token: data.token,
        //     openid: info.openid,
        //     nickname: data.user.nickname,
        //     bindPhoneSuccessCallback: (phone) => {
        //       console.log('bindPhoneSuccessCallba ===== ', phone, ret.data)
        //       const info = {
        //          ...ret
        //       }
        //       info.data.user.phone = phone;
        //       info.data.user.is_bind_phone = true
        //       this._storageUser(info)
        //       this._updateUserInfo(info)
        //     }
        //   });
        //
        //   this._storageUser(ret)
        //   this._updateUserInfo(ret)
        // } else {
          this._storageUser(ret)
          this._updateUserInfo(ret)
        // }
      } else {
        showToast(ret.message)
      }
      this.setState({
        isLoading: false,
      })
    })
      .catch(error => {
        if (error) {
          showToast(error.message)
        }
        this.setState({
          isLoading: false,
        })
      })
  }

  _updateUserInfo(ret) {
    this._setAlias(ret)
    this._syncBooks(ret.data.token)
  }

  _qqLogin() {
    QQAPI.login().then(ret => {
      console.log('qq login ret ======= ', ret)
      if (ret.errorCode !== 0) {
        this._qqUserInfo(ret)
      } else {
        showToast('QQ授权失败')
      }
    })
      .catch(error => {
        console.log('qq login error ', error)
        const msg = error.message
        if (msg === 'login canceled') {
          showToast('已取消登录')
        } else if (msg === 'login failed') {
          showToast('登录失败')
        } else {
          showToast(error)
        }
      })
  }

  _qqUserInfo (info) {
    let qqUrl = `https://graph.qq.com/user/get_user_info?access_token=${info.access_token}&oauth_consumer_key=${info.oauth_consumer_key}&openid=${info.openid}`
    fetch(qqUrl).then(response => {
      if (response.ok) {
        return response.json()
      }
    })
      .then(json => {
        this._registerQQUser(json, info.openid)
      })
      .catch(error => {
        console.log('QQ授权失败：', error)
      })
  }

  _registerQQUser (qqInfo, openid) {
    console.log('qqInfo ====== ', qqInfo)
    this.setState({
      isLoading: true,
    })
    const avatar = qqInfo.figureurl_qq_2 ? qqInfo.figureurl_qq_2 : qqInfo.figureurl_qq
    ThirdLoginApi(openid, undefined, encodeURIComponent(qqInfo.nickname), 2, avatar).then(ret => {
      console.log('qq register result: ', ret)
      if (ret.status === 200) {
        this._storageUser(ret)
        this._setAlias(ret)
        this._syncBooks(ret.data.token)
      } else {
        showToast(ret.message)
      }
      this.setState({
        isLoading: false,
      })
    })
      .catch(error => {
        if (error) {
          showToast(error.message)
        }
        this.setState({
          isLoading: false,
        })
      })
  }

  _storageUser(ret) {
    this.props.actions.userInit(ret.data)
    if (ret.data && ret.data.token) {
      setItem(KEY_TOKEN, ret.data.token)
    }
    const {navigation} = this.props
    navigation.goBack()
    console.log('yy storageUser goBack')
    navigation.state.params && navigation.state.params.loginSuccess && navigation.state.params.loginSuccess(ret)

    if (ret.data.user && ret.data.user.sex === 3) {
      this.jumpToReadPreference = true
      if (navigation.state.params && (navigation.state.params.jumpFlag === 1 || navigation.state.params.jumpFlag === 2)) {
        navigation.navigate('ReadPreference', {
          isHiddenJumpButton: false,
          jumpFlag: navigation.state.params.jumpFlag,
        })
      } else if(navigation.state.params && navigation.state.params.jumpFlag === 3) {
        navigation.navigate('ReadPreference', {
          isHiddenJumpButton: false,
          bookId: navigation.state.params.bookId,
          jumpFlag: navigation.state.params.jumpFlag,
        })
      }else {
        navigation.navigate('ReadPreference', {
          isHiddenJumpButton: false,
        })
      }
    } else {
      this.jumpToReadPreference = false
    }

    DeviceEventEmitter.emit('LoginSuccess')
    this.props.actions.favoriteBookInit(ret.data.token)
    this.props.actions.totalCompletedBookInit()
  }

  // 同步推荐的书籍
  _syncBooks(token) {
    // 网络获取是否有已经加入书架的书，没有数则同步推荐
    FavoriteBooksApi(token).then(ret => {
      if (ret.data.list && ret.data.list.length === 0) {
        let all = convertToArray(queryShelfBooks())
        let syncBooks = []
        all.map((item, index) => {
          let obj = {}
          obj.book_id = item.id
          obj.chapter_id = item.chapter_id
          obj.chapter_sort = item.chapter_sort
          syncBooks.push(obj)
        })
        BookSyncApi(token, 1, undefined, syncBooks).then(result => {
          console.log('login sync ret ======== ', result)
          if (result.status === 200) {
            this.props.actions.favoriteBookInit(token)
          } else {
            showToast(ret.message)
          }
        })
          .catch(error => {
            console.log('sync error: ', error)
          })
        // this.props.actions.bookSyncInit({
        //   type: 1,
        //   undefined,
        //   list: syncBooks
        // })
      }
    })
      .catch(error => {
        console.log('fetch favorite book error: ', error)
      })
  }

  _setAlias = (ret) => {
    const userId = `${ret.data.user.id}`
    JPush.setAlias(userId, (alias) => {
      console.log('set alias success: ', alias)
    })
  }
}

const styles = StyleSheet.create({
  textInputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  captchaButton: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    marginTop: 35, fontSize: 24,
    fontWeight: "bold",
    color: "#191d21",
    marginLeft: 37,
  },
  loginDesc: {
    marginLeft: 37,
    marginTop: 12,
    color: "#a4a4a4",
    fontWeight: "500",
    fontSize: 16,
  },
  loginButton: {
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wechat: {
    width: 40,
    height: 40,
    // alignSelf: 'center'
  },
  bottomView: {
    marginHorizontal: 36,
    marginVertical: 25,
  }
})

LoginPage.propTypes = {}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...userAction, ...bookshelfAction}, dispatch)
})

export default connect(({category, bookshelf, user}) => {
  return {
    category,
    bookshelf,
    user,
  }
}, mapDispatchToProps)(LoginPage)
