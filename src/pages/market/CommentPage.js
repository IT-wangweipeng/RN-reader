import React, {Component} from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter,
  KeyboardAvoidingView
} from 'react-native'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ProgressHUD from 'react-native-progress-hud'
import * as bookCommentAction from "../../reducers/bookCommentReducer";
import {showToast} from "../../actions/toastAction";
import * as EmmiterKey from '../../utils/EventEmmiterKey'


class CommentPage extends Component {

  constructor(props) {
    super(props)

    const {replyContent} = this.props.navigation.state.params
    this.replyContent = replyContent
    this.state = {
      contents: replyContent || ''
    }
  }

  componentDidMount(): void {
    console.log('siisiis =========== ', this.props.navigation.state.params)

  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (nextProps.bookComment.replySuccess) {
      showToast('评论成功')
      nextProps.bookComment.replySuccess = false
      const {navigation} = this.props
      navigation.state.params.commentCallback && navigation.state.params.commentCallback('')
      navigation.goBack()
      DeviceEventEmitter.emit(EmmiterKey.COMMENT_SUCCESS_EVENT)
    }
  }


  _submitComment = () => {
    if (this.state.contents.length === 0) {
      return
    }
    const {comment_id, reply_id, book_id, types} = this.props.navigation.state.params
    this.props.actions.replyInitAction({
      comment: this.state.contents,
      comment_id,
      reply_id,
      book_id,
      types
    })
  }


  render() {
    return (
      <TouchableOpacity
        style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center'}}
        activeOpacity={1}
        onPress={() => {
          const {navigation} = this.props
          navigation.goBack()
          if (this.state.contents.length > 0) {
            navigation.state.params.commentCallback && navigation.state.params.commentCallback(this.state.contents)
          }
        }}
      >
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              marginTop: 190,
              flex: 1,
              backgroundColor: '#fff',
              paddingHorizontal: 15,
            }}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View>
              <View style={{flexDirection: 'row', height: 55, justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    const {navigation} = this.props
                    navigation.goBack()
                    navigation.state.params.commentCallback && navigation.state.params.commentCallback('')
                  }}
                >
                  <Text style={{color: '#656565', fontSize: 16}}>
                    {'取消'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this._textInputRef.blur()
                    this._submitComment()
                  }}
                >
                  <Text style={{color: (this.state.contents.length > 0 || this.replyContent.length > 0) ? '#F85836' : '#FCC7C0', fontSize: 16}}>
                    {'发布'}
                  </Text>
                </TouchableOpacity>
              </View>


              <View style={{backgroundColor: '#F9FAFE', height: 162, borderRadius: 8}}>
                <TextInput
                  ref={(textInputRef) => this._textInputRef = textInputRef}
                  style={{fontSize: 14, minHeight: 132, margin: 15}}
                  multiline={true}
                  autoFocus={true}
                  allowFontScaling={false}
                  textAlignVertical={'top'}
                  maxLength={500}
                  // onFocus={(e) => {
                  //   console.log('onFocus ========== ', e)
                  //   // if (this.state.contents.length > 0) {
                  //   //   this.props.navigation.setParams({hasContent: true})
                  //   // }
                  // }}
                  defaultValue={this.props.navigation.state.params.replyContent}
                  placeholder='发表评论'
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
                fontSize: 12,
                color: '#B1BBD4',
                alignSelf: 'flex-end',
                marginTop: 14,
              }}>
                {`${this.state.contents.length}/500`}
              </Text>

            </View>
          </TouchableOpacity>
          <ProgressHUD
            showHUD={this.props.bookComment.isLoading}
            showLoading={this.props.bookComment.isLoading}
          />
        </View>
      </TouchableOpacity>
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
}), mapDispatchToProps)(CommentPage)