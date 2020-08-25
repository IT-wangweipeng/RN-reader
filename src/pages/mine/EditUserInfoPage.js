import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet, Text, Image,
  TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ImagePicker from 'react-native-image-picker'
import ProgressHUD from 'react-native-progress-hud'
import images from '../../component/images'
import * as userAction from '../../actions/userAction'
import { showToast } from '../../actions/toastAction'
import {UploadAvatarApi} from "../../apis/Api";
import {isIOS} from "../../utils/PlatformUtils";


class EditUserInfoPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      avatar: props.user.info.pic,
      nickname: props.user.info.nickname,
      sex: props.user.info.sex,
      loading: false,
      birthday: this.props.user.info.birthday
    }
  }

  componentWillMount () {

  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user.updateSuccess) {
      nextProps.user.updateSuccess = false
      const user = nextProps.user
      let ret = {...user}
      ret.info.sex = this.state.sex
      ret.info.nickname = this.state.nickname
      ret.info.pic = this.state.avatar
      ret.info.birthday = this.state.birthday
      this.props.actions.userMerge(ret)
    }
  }

  _chooseImage = () => {
    const options = {
      quality: 0.5,
      maxWidth: 300,
      maxHeight: 300,
      noData: true,
      takePhotoButtonTitle: '相机',
      chooseFromLibraryButtonTitle: '照片',
      cancelButtonTitle: '取消',
      mediaType: 'photo',
      title: '选择照片',
      birthday: this.props.user.info.birthday,
      storageOptions: {
        skipBackup: true
      }
    }

    ImagePicker.showImagePicker(options, (response) => {
      console.log('yy Response = ', response);

      if (response.didCancel) {
        console.log('yy User cancelled image picker');
      } else if (response.error) {
        console.log('yy ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('yy User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this._uploadAvatar(source)
      }
    })
  }

  _uploadAvatar = (source) => {
    this.setState({
      loading: true
    })

    console.log('yy avatar source =========== ', source)
    let uri;
    if(isIOS()){
      uri = source.uri.substr(7)
    }else{
      uri = source.uri;
    }
    console.log('yy uri ============= ', uri)


    const fd = new FormData()
    const file = {
      uri: uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    }
    fd.append('file', file)
    fd.append('token', this.props.user.token)

    console.log('fd ====== ', fd)

    const url = UploadAvatarApi()
    console.log('上传url ==== ', url)
    fetch(url, {
      method: 'POST',
      body: fd,
    }).then(res => {
      return res.json();
    }).then(ret => {
      console.log('上传头像： ====== ', ret);
      if (ret && ret.status === 200 && ret.data.code === 1) {
        this.setState({
          avatar: uri,
          loading: false,
        })
        const {user} = this.props
        this._updateUser(user.info.sex, user.info.nickname, ret.data.url, user.info.birthday)
        showToast('上传头像成功')
      } else {
        showToast('上传头像失败')
      }
      this.setState({
        loading: false
      })
    })
      .catch(err => {
        console.log('上传头像失败： ====== ', err);
        showToast('上传头像失败')
        this.setState({
          loading: false
        })
      })
  }

  _editNickname = () => {
    this.props.navigation.navigate('EditNickname', {
      nickname: this.props.user.info.nickname,
      onConfirm: (name) => {
        this.setState({
          nickname: decodeURIComponent(name)
        })
        const {user} = this.props
        this._updateUser(user.info.sex, name, user.info.pic, user.info.birthday)
      }
    })
  }

  _editSex = () => {
    this.props.navigation.navigate('EditSex', {
      sex: this.props.user.info.sex,
      onConfirm: (sex) => {
        this.setState({
          sex
        })
        const {user} = this.props
        this._updateUser(sex, user.info.nickname, user.info.pic, user.info.birthday)
      }
    })
  }

  _updateUser = (sex, nickname, pic, birthday) => {
    const {user} = this.props
    this.props.actions.updateUserInit({
      id: user.info.id,
      sex,
      nickname,
      pic,
      birthday
    })
  }

  _editBirthday = () => {
    const {navigation} = this.props
    navigation.navigate('EditBirthday', {
      callback: (birthday) => {
        this.setState({
          birthday
        })
        const {info} = this.props.user
        this._updateUser(info.sex, info.nickname, info.pic, birthday)
      }
    })
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#F1F1F6'}}>
        <View
          style={{backgroundColor: '#fff', marginTop: 7}}
        >
          <View style={[styles.row, {marginTop: 7}]}>
            <Text style={styles.rowText}>
              {'账号ID'}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.descText}>
                {`${this.props.user.info.id}`}
              </Text>
            </View>

          </View>
        </View>
        {/*头像*/}
        <TouchableOpacity
          style={{backgroundColor: '#fff'}}
          onPress={() => {
            this._chooseImage()
          }}
        >
          <View style={[styles.row]}>
            <Text style={styles.rowText}>
              {'头像'}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{marginRight: 15, width: 32, height: 32, borderRadius: 16}}
                source={{uri: this.state.avatar}}
              />
              <Image
                style={{width: 18, height: 18}}
                source={images.image_arrow_right}
              />
            </View>

          </View>
        </TouchableOpacity>

        {/*昵称*/}
        <TouchableOpacity
          style={{backgroundColor: '#fff'}}
          onPress={() => {
            this._editNickname()
          }}
        >
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {'昵称'}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.descText}>
                {decodeURIComponent(this.state.nickname)}
              </Text>
              <Image
                style={{width: 18, height: 18}}
                source={images.image_arrow_right}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/*性别*/}
        <TouchableOpacity
          style={{backgroundColor: '#fff'}}
          onPress={() => {
            this._editSex()
          }}
        >
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {'性别'}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.descText}>
                {this.state.sex === 2 ? '女' : '男'}
              </Text>
              <Image
                style={{width: 18, height: 18}}
                source={images.image_arrow_right}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/*生日*/}
        <TouchableOpacity
          style={{backgroundColor: '#fff'}}
          onPress={() => {
            this._editBirthday()
          }}
        >
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {'生日'}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.descText}>
                {!!this.state.birthday ? this.state.birthday : '有生日福利哦'}
              </Text>
              <Image
                style={{width: 18, height: 18}}
                source={images.image_arrow_right}
              />
            </View>
          </View>
        </TouchableOpacity>

        <ProgressHUD
          showHUD={this.state.loading || this.props.user.isLoading}
          showLoading={this.state.loading ||  this.props.user.isLoading}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    height: 54,
    marginHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  rowText: {
    fontSize: 15,
    color: "#585D64"
  },
  descText: {
    fontSize: 14,
    marginRight: 5,
    fontWeight: "500",
    fontStyle: "normal",
    color: "#A4A4A4"
  }
})

EditUserInfoPage.propTypes = {}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...userAction,
  }, dispatch)
})

export default connect(({user}) => {
  return {
    user,
  }
}, mapDispatchToProps)(EditUserInfoPage)
