import React, {Component} from 'react'
import {
  View,
  FlatList, Text, Image,
  StyleSheet,
  TouchableOpacity, Alert,
  ImageBackground,
  Switch,
  DeviceEventEmitter,
  NativeModules,
  Platform,
  PixelRatio,
} from 'react-native'
import clear from 'react-native-clear-app-cache'
import JPush from 'jpush-react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as CELL from './MinePageCellConfig'
import * as userAction from '../../actions/userAction'
import * as bookshelfAction from '../../actions/bookshelfAction'
import {removeItem} from '../../utils/AsyncStorageManager'
import {KEY_TOKEN} from '../../utils/AsyncStorageKey'
import {LogoutApi} from '../../apis/Api'
import {showToast} from '../../actions/toastAction'
import {deleteAll} from '../../model/BookModelManager'
import {Config} from '../../config/Config'
import {isIOS} from "../../utils/PlatformUtils";



const BookReadManager = NativeModules.BookReadManager
const nativeModule = NativeModules.OpenNativeModule

class SettingPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: {},
      cacheSize: '0 KB',
      appCacheSize: "",
      appCacheUnit: "",
    }

    clear.getAppCacheSize((value, unit) => {
      this.setState({
        appCacheSize: value, // 缓存大小
        appCacheUnit: unit, // 缓存单位
      })
    })
  }


  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          style={{flex: 1, backgroundColor: '#f1f1f6', paddingTop: 7}}
          data={CELL.SETTING_DATA}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListFooterComponent={this._ListFooterComponent()}
        >
        </FlatList>
      </View>
    )
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={`mine_${index}`}
        style={styles.row}
        onPress={() => {
          this._onPressItem(item)
        }}
      >
        <View style={styles.cellWrapper}>
          {
            item.image ? (
              <Image
                style={{width: 17, height: 17}}
                source={item.image}
              />
            ) : null
          }

          <Text style={styles.cellTitle}>
            {`${item.title}`}
          </Text>
          {
            item.type === CELL.CLEAN_CACHE ? (
              <Text style={{
                right: 15,
                position: 'absolute',
                fontSize: 14,
                fontWeight: "500",
                fontStyle: "normal",
                color: "#bbbcc0"
              }}>
                {this.state.appCacheSize + this.state.appCacheUnit}
              </Text>
            ) : null
          }

          <Image
            style={styles.arrow}
            source={require('../../images/image_arrow_right.png')}
          />
        </View>
      </TouchableOpacity>
    )
  }


  _onPressItem = (item) => {
    const {user, navigation} = this.props
    switch (item.type) {
      case CELL.ACCOUNT_SETTING:
        if (!!user.token) {
          navigation.navigate('EditUserInfo')
          return
        }
        navigation.navigate('Login')
        break;
      case CELL.UPDATE:
        if (isIOS()) {
          NativeModules.CheckUpdateManager.checkNewVersion((e) => {
            showToast(`${e.result}`)
          })
        } else {
          nativeModule.checkUpdate()
        }

        break
      case CELL.READ_PREFERENCES:
        if (!!user.token) {
          navigation.navigate('CategoryPreference', {
            isHiddenJumpButton: true,
            page: 'SETTING_PAGE'
          })
          return
        }
        navigation.navigate('Login')
        break
      case CELL.FEEDBACK:
        this.props.navigation.navigate('Feedback')
        break
      case CELL.CLEAN_CACHE:
        if (Platform.OS === 'ios') {
          BookReadManager.cleanCache().then(ret => {

          }).catch(error => {

          })
        }

        clear.clearAppCache(() => {
          showToast('清理缓存成功')
          clear.getAppCacheSize((value, unit) => {
            this.setState({
              appCacheSize: isIOS() ? '0' : value, // 缓存大小
              appCacheUnit: unit, // 缓存单位
            })
          })

        })
        break
      case CELL.QUESTION:
        break
      case CELL.ABOUT_US:
        this.props.navigation.navigate('Web', {
          url: `${Config.url.aboutUs()}?v=v${Config.app.version}_${Config.app.build}_${Config.app.jsVersion}`
        })
        break
      case CELL.SERVICE:
        this.props.navigation.navigate('Web', {
          url: `${Config.url.service()}`
        })
        break
      case CELL.PRIVACY:
        this.props.navigation.navigate('Web', {
          url: `${Config.url.privacy()}`
        })
        break
      default:
        break
    }
  }

  _ListFooterComponent = () => {
    return (
      !!this.props.user.token ? (
        <TouchableOpacity
          style={{marginTop: 100,}}
          onPress={() => {
            Alert.alert(
              '确定退出登录？',
              '退出后不会删除任何历史数据，下次登录依然可以使用本账号。',
              [
                {
                  text: '取消',
                  onPress: () => {
                  },
                  style: 'cancel',
                },
                {
                  text: '确定', onPress: () => {
                    const {user} = this.props
                    LogoutApi(user.token).then((ret) => {
                      console.log('退出登录成功： ', ret)
                      if (ret.status === 200) {
                        const userId = `${this.props.user.info.id}`
                        JPush.deleteAlias((result) => {
                          console.log('delete alias result: ', result)
                        })
                        deleteAll('BookShelf')
                        this.props.actions.deleteUser()
                        removeItem(KEY_TOKEN)
                        this.props.actions.recommendBookInit({sex: 3})
                        DeviceEventEmitter.emit('Logout')
                        DeviceEventEmitter.emit('bookShelfChange')
                      } else {
                        showToast(`${ret.message}`)
                      }
                    })
                      .catch(error => {
                        console.log('gg logout error',error)
                        showToast('退出登录失败')
                      })
                  }
                },
              ],
              {cancelable: false},
            );
          }}
        >
          <View style={styles.footer}>
            <Text style={{fontSize: 16, color: '#F85836'}}>
              {'退出登录'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null
    )
  }
}

SettingPage.propTypes = {}

const styles = StyleSheet.create({
  row: {
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  cellTitle: {
    fontSize: 15,
    color: '#585D64',
  },
  arrow: {
    position: 'absolute',
    right: 0,
    width: 15,
    height: 18
  },
  footer: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cellWrapper: {
    borderBottomWidth: 1.0 / PixelRatio.get(),
    borderBottomColor: '#C3C3C3',
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...userAction,
    ...bookshelfAction,
  }, dispatch)
})

export default connect(({user}) => {
  return {
    user,
  }
}, mapDispatchToProps)(SettingPage)
