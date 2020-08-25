import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform, BackHandler,
} from 'react-native'

import * as WeChat from 'react-native-wechat'
import * as QQAPI from 'react-native-qq'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import images from './images'
import {showToast} from '../actions/toastAction'
import * as hotBeanActions from "../reducers/hotBeansReducer";
import {getItem} from "../utils/AsyncStorageManager";
import {KEY_TOKEN} from "../utils/AsyncStorageKey";
import {HotBeansPaymentApi} from "../apis/Api";
import Toast from "react-native-root-toast";


class SharePage extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      isWechatInstalled: false,
      isQQInstalled: false,
    }
  }


  componentWillMount(): void {
    WeChat.isWXAppInstalled().then(ret => {
      this.setState({
        isWechatInstalled: ret,
      })
    })
    QQAPI.isQQInstalled().then(ret => {
      this.setState({
        isQQInstalled: ret,
      })
    })

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  componentWillUnmount(): void {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }


  onBackAndroid = () => {
    this.props.navigation.goBack()
    return true
  }

  shareToFriend = () => {
    this.props.navigation.goBack()
    WeChat.shareToSession(this._shareWechatInfo())
      .then(ret => {
        this._increaseHotBeans()
      })
      .catch((error) => {
        console.log('yy error=',error.message)
        showToast('分享失败')
      });
  }

  shareToFriendCircle = () => {
    this.props.navigation.goBack()
    WeChat.shareToTimeline(this._shareWechatInfo())
      .then(ret => {
        console.log('share ret ======================= ', ret)
        this._increaseHotBeans()
      })
      .catch((error) => {
        showToast('分享失败')
      });
  }

  _increaseHotBeans = () => {
    if (!!this.props.user.token) {
      // this.props.actions.hotBeansPaymentInitAction({
      //   hotbeans_type: 9
      // })
      // showToast('已成功领取10热豆')
      HotBeansPaymentApi(this.props.user.token, 9)
        .then((ret) => {
          console.log('HotBeansPaymentApi result:  ', ret)
          if (ret.status === 200) {
            if(ret.data.task_complete_state == false) {
              showToast('已成功领取热豆')
            } else {
              showToast('分享成功')
            }
          }
        })
        .catch((error) => {
          console.log('HotBeansPaymentApi error: ', error)
        })
    } else {
      showToast('分享成功')
    }
  }

  _shareToQQZone = () => {
    this.props.navigation.goBack()
    QQAPI.shareToQzone(this._shareQQInfo()).then(ret => {
      console.log('share qq zone result: ', ret)
      if (ret.errCode === 0) {
        this._increaseHotBeans()
      } else {
        showToast('分享失败')
      }
    })
      .catch(error => {
        console.log('share qq zone error: ', error)
        showToast('分享失败')
      })
  }

  _shareToQQ = () => {
    this.props.navigation.goBack()
    QQAPI.shareToQQ(this._shareQQInfo()).then(ret => {
      console.log('share qq result: ', ret)
      if (ret.errCode === 0) {
        this._increaseHotBeans()
      } else {
        showToast('分享失败')
      }
    })
      .catch(error => {
        console.log('share qq error: ', error)
        showToast('分享失败')
      })
  }

  _shareWechatInfo () {
    const {
      title, description, thumbImage, webpageUrl,
    } = this.props.navigation.state.params
    return {
      type: 'news',
      title,
      description,
      thumbImage,
      webpageUrl,
    }
  }

  _shareQQInfo () {
    const {
      title, description, thumbImage, webpageUrl,
    } = this.props.navigation.state.params
    return {
      type: 'news',
      title,
      description,
      webpageUrl,
      imageUrl: thumbImage,
    }
  }



  render() {
    const {navigation} = this.props
    return (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.mainContainer}>
          <Text style={styles.title}>分享到</Text>
          <View style={styles.subContainer}>
            <TouchableOpacity
              onPress={() => {
                if (!this.state.isWechatInstalled) {
                  return
                }
                this.shareToFriend()
              }}
              style={styles.button}
            >
              <Image
                source={this.state.isWechatInstalled ? images.wechat : images.wechat_disable}
              />
              <Text style={styles.text}>
                {'微信好友'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!this.state.isWechatInstalled) {
                  return
                }
                this.shareToFriendCircle()
              }}
              style={styles.button}
            >
              <Image
                source={this.state.isWechatInstalled ? images.wechat_timeline : images.wechat_timeline_disable}
              />
              <Text style={styles.text}>
                {'朋友圈'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!this.state.isQQInstalled) {
                  return
                }
                this._shareToQQ()
              }}
              style={styles.button}
            >
              <Image
                source={this.state.isQQInstalled ? images.qq : images.qq_disable}
              />
              <Text style={styles.text}>
                {'QQ好友'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!this.state.isQQInstalled) {
                  return
                }
                this._shareToQQZone()
              }}
              style={styles.button}
            >
              <Image
                source={this.state.isQQInstalled ? images.qq_zone : images.qq_zone_disable}
              />
              <Text style={styles.text}>
                {'QQ空间'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    height: 190,
    alignItems: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    marginTop: 33,
    width: 320,
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
  },
  title: {
    marginTop: 25,
    fontSize: 16,
    color: '#1E252F',
  },
  text: {
    marginTop: 6,
    fontSize: 12,
    color: '#545C67',
    textAlign: 'center'
  },
  button: {
    width: 50,
    height: 50,
  },
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...hotBeanActions
  }, dispatch)
})

export default connect(({user}) => {
  return {
    user,
  }
}, mapDispatchToProps)(SharePage)
