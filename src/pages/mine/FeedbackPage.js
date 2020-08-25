import React, {Component} from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  PixelRatio,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native'

import {FeedbackApi} from '../../apis/Api'
import {showToast} from "../../actions/toastAction";

const {width, height} = Dimensions.get('window')

class FeedbackPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animationType: 'fade', // none slide fade
      visible: false,
      transparent: true,
      contact: "",
      contents: "",
    }
  }

  _feedback = () => {
    if (this.state.contents.length == 0) {
      showToast('请填写意见反馈内容')
      return
    }

    if (this.state.contact.length == 0) {
      showToast('请填写联系方式')
      return
    }

    FeedbackApi(this.state.contact, this.state.contents)
      .then((ret) => {
        console.log('yy feedback result:  ', ret)
        if (ret.status === 200) {
          this.setState({
            visible: true
          })
        } else {
          showToast(ret.message)
        }
      })
      .catch((error) => {
        console.log('feedback api error: ', error)
        if (error.message) {
          showToast(error.message)
        }
      })
  }

  render() {
    return (
      <ScrollView style={{paddingHorizontal: 22}}>
        <Text style={{marginTop: 12, fontSize: 15, color: '#191d21'}}>欢迎给我们反馈您的使用感受和建议</Text>
        <View style={{
          height: 178,
          marginTop: 15,
          backgroundColor: '#fff',
          borderRadius: 5,
          borderColor: '#c3c3c3',
          borderWidth: 1 / PixelRatio.get(),
        }}>
          <TextInput
            style={{fontSize: 15, minHeight: 168, height: 168, paddingStart: 10}}
            multiline={true}
            allowFontScaling={false}
            textAlignVertical={'top'}
            maxLength={200}
            placeholder="请填写意见反馈内容"
            placeholderTextColor="#a4a4a4"
            onChangeText={(text) => {
              const newText = text.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
              console.log('yy contents=',newText)
              this.setState({contents: newText})
            }}
          />
          <Text style={{
            bottom: 3,
            right: 10,
            fontSize: 15,
            color: '#c3c3c3',
            position: 'absolute',
            alignSelf: 'flex-end',
          }}>
            {this.state.contents.length}/200
          </Text>
        </View>

        <View
          style={{
            height: 55,
            marginTop: 15,
            backgroundColor: '#fff',
            borderRadius: 5,
            borderColor: '#c3c3c3',
            borderWidth: 1 / PixelRatio.get(),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{marginStart: 10, fontSize: 15, color: '#000'}}>联系方式:</Text>
          <TextInput style={{flex: 1, marginStart: 25, fontSize: 15}}
                     keyboardType="numeric"
                     placeholder="QQ/手机号"
                     allowFontScaling={false}
                     placeholderTextColor="#a4a4a4"
                     onChangeText={(text) => {
                       const newText = text.replace(/[^\d]+/, '');
                       console.log('yy contact=',newText)
                       this.setState({contact: newText})
                     }}
          />
        </View>

        <Text style={{marginTop: 10, fontSize: 15, color: '#000'}}>留下您的联系方式有助于我们沟通解决问题，仅工作人员可见。您也可以直接联系客服QQ:2420248161,成为我们的首席体验师，更有精美奖品等着您哦~</Text>

        <View style={{
          marginTop: 25,
          alignItems: 'center',
          justifyContent:'center',
        }}>
          <TouchableOpacity
            onPress={() => {this._feedback()}}
            style={{
              width: 300,
              height: 45,
              backgroundColor: '#f85836',
              borderRadius: 22,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{fontSize: 18, color: '#fff',}}>提交</Text>
          </TouchableOpacity>
        </View>


        <Modal
          animationType={this.state.animationType}
          visible={this.state.visible}
          transparent={this.state.transparent}
          onRequestClose={() => {
            this.setState({
              visible: false
            })
          }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}>
              <View
              style={{
                width: 250,
                height: 140,
                backgroundColor: '#fff',
                borderRadius: 9,
              }}>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center',}}>
                  <Text style={{fontSize: 15, color: '#1e252f'}}>意见已提交，感谢您的反馈</Text>
                </View>
                <TouchableOpacity
                  onPress={()=>{
                    this.setState({
                      visible: false,
                    })
                    this.props.navigation.goBack()
                  }}
                  style={{
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:'#f1f1f6',
                  borderBottomStartRadius: 9,
                  borderBottomEndRadius: 9,
                }}>
                  <Text style={{fontSize: 16, color:'#f85836'}}>我知道啦</Text>
                </TouchableOpacity>
              </View>

            </View>
        </Modal>

      </ScrollView>
    )
  }
}

export default FeedbackPage
