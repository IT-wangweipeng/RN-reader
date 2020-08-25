import React, { Component } from 'react'
import {
  Dimensions,
  TextInput,
  View,
  Text,
  PixelRatio,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import {showToast} from "../../actions/toastAction";
import {isIOS} from "../../utils/PlatformUtils";

const DIALOG_MARGIN_HORIZONTAL = 40
const TEXTINPUT_MARGIN_HORIZONTAL = 20
const { width, height } = Dimensions.get('window')
const dialogWidth = width - DIALOG_MARGIN_HORIZONTAL * 2

export default class EditNicknamePage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      inputText: this.props.inputText,
      translateY: 0,
    }
  }

  componentDidMount(): void {
    // this.textInputRef.focus()
  }


  render () {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss()
        }}
      >

          <View
            style={styles.container}
          >
            <KeyboardAvoidingView
              style={{flex: 1, justifyContent: 'center'}}
              behavior="position"
              keyboardVerticalOffset={isIOS() ? -100 : -200}
              enabled
            >

              <View style={styles.innerContainer}>
                <Text style={styles.title}>
                  {'输入昵称'}
                </Text>
                <TextInput
                  ref={(textInput) => this.textInputRef = textInput}
                  style={styles.textInput}
                  allowFontScaling={false}
                  autoFocus = {true}
                  underlineColorAndroid="transparent"
                  clearButtonMode="while-editing"
                  // value={this.state.inputText}
                  placeholder={` ${decodeURIComponent(this.props.navigation.state.params.nickname)}`}
                  onChangeText={(text) => {
                    this.setState({
                      inputText: text,
                    })
                  }}
                />
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={styles.btnSubContainer}
                    onPress={() => {
                      this.props.navigation.state.params.onCancel && this.props.navigation.state.params.onCancel()
                      this.props.navigation.goBack()
                    }}
                  >
                    <Text style={styles.btnText}>
                      {'取消'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnSubContainer}
                    onPress={() => {
                      if (!this.state.inputText) {
                        showToast('请输入昵称')
                        return
                      }
                      const name = encodeURIComponent(this.state.inputText)
                      this.props.navigation.state.params.onConfirm && this.props.navigation.state.params.onConfirm(name)
                      this.props.navigation.goBack()
                    }}
                  >
                    <Text style={styles.btnText}>
                      {'确定'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            </KeyboardAvoidingView>
          </View>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    width: dialogWidth,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',

  },
  title: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    color: "#1e252f"
  },
  textInput: {
    height: 44,
    width: dialogWidth - 40,
    marginTop: 30,
    backgroundColor: '#f1f1f6',
    borderRadius: 6,
  },
  btnContainer: {
    marginTop: 24,
    height: 48,
    flexDirection: 'row',
  },
  btnSubContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    color: '#f85836',
  },
  textInputWrapper: {
    height: 44,
    marginHorizontal: 20,
    backgroundColor: '#f1f1f6',
    borderColor: '#e0e0e0',
    borderWidth: 1 / PixelRatio.get(),
    marginTop: 28,
    borderRadius: 4,
  },
})
