import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, Text,
  TextInput, TouchableOpacity,
  View,
  ScrollView, Alert
} from 'react-native'
import ProgressHUD from 'react-native-progress-hud'
import Toast from 'react-native-root-toast'
import {BindThirdApi, ForceBindApi} from "../../apis/Api";
import {checkPhone} from "../../utils/CheckUtil";
import {showToast} from "../../actions/toastAction";


class BindPhonePage extends Component {

  constructor() {
    super();

    this.state = {
      phone: '',
      hudLoading: false
    }
  }

  _bindPhone = () => {
    if (!checkPhone(this.state.phone)) {
      showToast('请输入正确的手机号', Toast.positions.CENTER)
      return
    }




    this.setState({
      hudLoading: true
    })
    const {token, openid, nickname, bindPhoneSuccessCallback} = this.props.navigation.state.params
    BindThirdApi(token, openid, undefined, nickname, this.state.phone, 2).then(ret => {
      console.log('绑定手机 ===== ', ret)

      if (ret && ret.status === 200) {
        showToast('绑定成功', Toast.positions.CENTER)
        this.props.navigation.goBack()
      } else if (ret.status === 701) {
        this._showUnbindAlert(token, openid, nickname)
      }
      this.setState({
        hudLoading: false
      })
      bindPhoneSuccessCallback && bindPhoneSuccessCallback(this.state.phone)
    })
      .catch(err => {
        showToast(err.message)
        this.setState({
          hudLoading: false
        })
      })
  }

  _showUnbindAlert = (token, openid, nickname) => {
    Alert.alert(
      '温馨提示',
      '此手机号已注册过该应用账号，若确定绑定此手机号，应用内手机账号将会被注销',
      [
        {
          text: '取消',
          onPress: () => {
            showToast('绑定失败', Toast.positions.CENTER)
          },
          style: 'cancel',
        },
        {
          text: '确定', onPress: () => {
            // 强制绑定手机号
            ForceBindApi(token, openid, undefined, nickname, this.state.phone, 2, 1).then(ret => {
              if (ret && ret.status === 200) {
                showToast('绑定成功', Toast.positions.CENTER)
              } else {
                showToast(`${ret.message}`, Toast.positions.CENTER)
              }
            })
              .catch(err => {
                showToast(err.message)
              })
          }
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={{height: 48}}
            maxLength={11}
            allowFontScaling={false}
            placeholder="请输入您的手机号"
            keyboardType="numeric"
            clearButtonMode="while-editing"
            underlineColorAndroid="transparent"
            onChangeText={value => {
              this.setState({phone: value})
            }}
            value={this.state.phone}
          />
        </View>

        <TouchableOpacity
          style={{marginTop: 40, marginHorizontal: 50,}}
          onPress={() => {
            this._bindPhone()
          }}
        >
          <View style={[styles.loginButton, {backgroundColor: '#f85836'}]}>
            <Text style={{color: '#fff', fontSize: 18}}>
              {'绑定手机'}
            </Text>
          </View>
        </TouchableOpacity>

        <ProgressHUD
          showHUD={this.state.hudLoading}
          showLoading={this.state.hudLoading}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  textInputWrapper: {
    marginTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginHorizontal: 16
  },
  loginButton: {
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

BindPhonePage.propTypes = {};

export default BindPhonePage;
