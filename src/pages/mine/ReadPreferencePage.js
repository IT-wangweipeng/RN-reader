import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {DeviceEventEmitter, Image, NativeModules, StyleSheet, Text, TouchableOpacity, View, Platform, BackHandler} from 'react-native'
import IMAGES from '../../component/images'
import {UpdateUserInfoApi} from '../../apis/Api'
import {showToast} from '../../actions/toastAction'

import {Config} from "../../config/Config";


class ReadPreference extends Component {

  constructor(props) {
    super(props)

  }

  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <TouchableOpacity
        style={{marginLeft: 16}}
        onPress={() => {
          navigation.state.params.pressLeft()
        }}
      >
        <Image
          source={IMAGES.left_arrow}
        />
      </TouchableOpacity>
    ),
    headerRight: !!navigation.state.params.isHiddenJumpButton ? null : (
      <TouchableOpacity
        style={{marginRight: 16}}
        onPress={() => {
          navigation.state.params.pressRight()
        }}
      >
        <Text style={{fontSize: 15, color: '#999ba1', fontWeight: "500"}}>
          {'跳过'}
        </Text>
      </TouchableOpacity>
    ),
  })

  resumeNativeReadPage() {
    const { navigation } = this.props
    if (navigation.state.params && navigation.state.params.jumpFlag === 1) {
      DeviceEventEmitter.emit('resumeToReadPage')
    } else if(navigation.state.params && navigation.state.params.jumpFlag === 2) {
      navigation.navigate('Web', {
        url: Config.vip.url(),
        fromReadBookPage: true
      })
    } else if(navigation.state.params && navigation.state.params.jumpFlag === 3) {
      navigation.navigate('PublishingPost', {
        bookId: navigation.state.params.bookId,
        fromReadBookPage: true,
      })
    }
  }

  _pressLeft = () => {
    this.props.navigation.goBack()
    this.resumeNativeReadPage()
  }

  _pressRight = () => {
    const {navigation} = this.props
    navigation.goBack()
    if (navigation.state.params && navigation.state.params.jumpFlag === 1) {
      DeviceEventEmitter.emit('resumeToReadPage')
    } else if(navigation.state.params && navigation.state.params.jumpFlag === 2){
      navigation.navigate('Web', {
        url: Config.vip.url(),
        fromReadBookPage: true
      })
    } else if(navigation.state.params && navigation.state.params.jumpFlag === 3) {
      navigation.navigate('PublishingPost', {
        bookId: navigation.state.params.bookId,
        fromReadBookPage: true,
      })
    } else {
      navigation.navigate('Market')
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({pressLeft: this._pressLeft})
    this.props.navigation.setParams({pressRight: this._pressRight})

    const {navigation} = this.props
    if (Platform.OS === 'android' && navigation.state.params && (navigation.state.params.jumpFlag === 1 || navigation.state.params.jumpFlag === 2 || navigation.state.params.jumpFlag === 3)) {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  componentWillUnmount() {
    const {navigation} = this.props
    if (Platform.OS === 'android' && navigation.state.params && (navigation.state.params.jumpFlag === 1 || navigation.state.params.jumpFlag === 2 || navigation.state.params.jumpFlag === 3)) {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }

  onBackAndroid = () => {
    this.props.navigation.goBack()
    this.resumeNativeReadPage()
    return true
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', marginTop: 60}}>
        <Text style={{fontSize: 24, color: '#191d21', fontWeight: "bold"}}>
          {'选择性别'}
        </Text>
        <Text style={{marginTop: 10, fontSize: 13, color: '#878787', fontWeight: "500"}}>
          {'男女皆有好书看'}
        </Text>

        <View style={{marginTop: 120, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              this._updateReadPreference(1)
            }}
          >
            <View style={{alignItems: 'center'}}>
              <Image
                style={{width: 90, height: 90}}
                source={IMAGES.male}
              />
              <View style={this.props.user.info.sex === 1 ? styles.selectContainer : styles.unselectContainer}>
                <Text style={this.props.user.info.sex === 1 ? styles.selectText : styles.unselectText}>
                  {'男生'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this._updateReadPreference(2)
            }}
          >
            <View style={{alignItems: 'center', marginLeft: 48}}>
              <Image
                style={{width: 90, height: 90}}
                source={IMAGES.female}
              />
              <View style={this.props.user.info.sex === 2 ? styles.selectContainer : styles.unselectContainer}>
                <Text style={this.props.user.info.sex === 2 ? styles.selectText : styles.unselectText}>
                  {'女生'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _updateReadPreference = (sex) => {
    const {user} = this.props
    UpdateUserInfoApi(user.token, user.info.id, sex).then(ret => {
      console.log('update user info: ', ret)
      if (ret.status === 200) {
        this.props.user.info.sex = sex
        showToast('更新成功')

        const {navigation} = this.props
        if (navigation.state.params && (navigation.state.params.jumpFlag === 1 || navigation.state.params.jumpFlag === 2)) {
          this.props.navigation.navigate('CategoryPreference', {
            isHiddenJumpButton: false,
            jumpFlag: navigation.state.params.jumpFlag,
          })
        } else if(navigation.state.params && navigation.state.params.jumpFlag === 3) {
          navigation.navigate('CategoryPreference', {
            isHiddenJumpButton: false,
            bookId: navigation.state.params.bookId,
            jumpFlag: navigation.state.params.jumpFlag,
          })
        } else {
          navigation.navigate('CategoryPreference', {
            isHiddenJumpButton: false,
          })
        }

      } else {
        showToast(ret.message)
      }
    })
      .catch(error => {
        console.log('update user info error: ', error)
        if (error.message) {
          showToast(error.message)
        }
      })
  }
}

ReadPreference.propTypes = {}

const styles = StyleSheet.create({
  unselectContainer: {
    marginTop: 40,
    backgroundColor: '#f1f1f6',
    width: 75,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  unselectText: {
    fontSize: 15,
    color: '#949ba5'
  },
  selectContainer: {
    marginTop: 40,
    backgroundColor: '#f85836',
    width: 75,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold'
  },
})

export default connect(({user, bookshelf}) => {
  return {
    user,
    bookshelf,
  }
}, null)(ReadPreference)
