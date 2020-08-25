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
  DeviceEventEmitter,
} from 'react-native'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ProgressHUD from 'react-native-progress-hud'
import * as bookCommentAction from "../../reducers/bookCommentReducer";
import {PostBookCommentApi} from "../../apis/Api";
import {showToast} from "../../actions/toastAction";
import * as EmmiterKey from '../../utils/EventEmmiterKey'
import {SafeAreaView} from "react-navigation";
import {IncreaseHotBean} from "../../utils/IncreaseHotBean";

const {width, height} = Dimensions.get('window')



class PublishingPostPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animationType: 'fade', // none slide fade
      visible: false,
      transparent: true,
      contact: "",
      contents: "",
      isLoading: false,
    }
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    headerLeft: (
      <TouchableOpacity
        style={{marginLeft: 15, width: 44, height: 44, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          navigation.goBack()
        }}
      >
        <Text style={{color: '#656565'}}>
          {'取消'}
        </Text>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        style={{marginRight: 15, width: 44, height: 44, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          navigation.state.params.handleAction()
        }}
      >
        <Text style={{color: (navigation.state.params && navigation.state.params.hasContent) ? '#F85836' : '#FCC7C0'}}>
          {'发布'}
        </Text>
      </TouchableOpacity>
    ),
  })


  componentDidMount(): void {
    this.props.navigation.setParams({handleAction: this._publishPostAction})
  }

  componentWillUnmount(): void {
    const { navigation } = this.props
    if(navigation.state.params && navigation.state.params.fromReadBookPage) {
      DeviceEventEmitter.emit('resumeToReadPage')
    }
  }

  _publishPostAction = () => {
    if (this.state.contents.length == 0) {
      return
    }

    this._textInputRef.blur()
    this.setState({
      isLoading: true
    })
    const {user, navigation} = this.props
    const {bookId} = this.props.navigation.state.params
    PostBookCommentApi(user.token, bookId, this.state.contents)
      .then(ret => {
        this.setState({
          isLoading: false
        })
        if (ret && ret.status === 200) {
          showToast('发布想法成功')
          navigation.goBack()
          navigation.state.params.postSuccessCallback && navigation.state.params.postSuccessCallback()
          DeviceEventEmitter.emit(EmmiterKey.PUBLISH_COMMENT_SUCCESS)

          IncreaseHotBean(user.token, 15).then(resolve => {
            if (!resolve.taskCompleted) {
              showToast('已成功领取热豆')
            }
          })
        } else {
          showToast(`${ret.message}`)
        }
      })
      .catch(error => {
        showToast(`${error.message}`)
        this.setState({
          isLoading: false
        })
      })

  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{paddingHorizontal: 22}}>
          <View style={{
            height: 268,
            marginTop: 10,
            borderRadius: 5,
            borderColor: '#F9FAFE',
            borderWidth: 1 / PixelRatio.get(),
            backgroundColor: '#F9FAFE',
          }}>
            <TextInput
              ref={(textInputRef) => this._textInputRef = textInputRef}
              style={{fontSize: 14, minHeight: 238, margin: 15}}
              multiline={true}
              allowFontScaling={false}
              textAlignVertical={'top'}
              maxLength={500}
              placeholder="你可以发表书籍评论或推荐理由，关于阅读时的想法、对作家的看法，欢迎多角度的描述"
              placeholderTextColor="#B1BBD4"
              onChangeText={(text) => {
                const newText = text.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
                this.setState({contents: newText})
                if (text.length === 0) {
                  this.props.navigation.setParams({hasContent: false})
                } else {
                  this.props.navigation.setParams({hasContent: true})
                }
              }}
            />

          </View>
          <Text style={{
            fontSize: 15,
            color: '#B1BBD4',
            alignSelf: 'flex-end',
            marginTop: 11,
          }}>
            {`${this.state.contents.length}/500`}
          </Text>
        </ScrollView>
        <ProgressHUD
          showHUD={this.state.isLoading}
          showLoading={this.state.isLoading}
        />
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...bookCommentAction,
  }, dispatch),
})

export default connect(({user, bookComment}) => ({
  user,
  bookComment
}), mapDispatchToProps)(PublishingPostPage)
