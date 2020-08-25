import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Dimensions, View, WebView} from "react-native";
import {Config} from "../config/Config";
import {bindActionCreators} from "redux";
import * as hotBeanActions from "../reducers/hotBeansReducer";
import * as userAction from "../actions/userAction";
import {connect} from "react-redux";



const {width, height} = Dimensions.get('window')

const injectedJsCode = `(${String(function () {
  var originalPostMessage = window.postMessage
  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }
  window.postMessage = patchedPostMessage
})})();`

class NewWebPage extends Component {

  static navigationOptions = ({navigation}) => {
    return ({
      title: `${navigation.state.params.title != null ? navigation.state.params.title : ''}`,
    })
  }

  _onNavigationStateChange = (navState) => {
    const {navigation} = this.props
    navigation.setParams({title: navState.title})
  }

  _h5Ready = () => {
    const data = {
      message: !!this.props.user.token,
      token: this.props.user.token,
      source: 4,
      custom: Config.channel
    }
    console.log('data ======= ', data)
    this.webViewRef.postMessage(JSON.stringify({...data}))
  }

  _onMessage = (e) => {
    if (e.nativeEvent.data === '') {
      return
    }
    const data = JSON.parse(e.nativeEvent.data)
    const msg = data.message
    console.log('msg ============= ', msg)

    switch (msg) {
      case 'h5Ready':
        this._h5Ready()
        break;
      default:
        break;
    }
  }

  render() {
    const {url} = this.props.navigation.state.params
    console.log('NewWebPage url ============== ', url)
    return (
      <View style={{flex: 1}}>
        <WebView
          ref={webview => this.webViewRef = webview}
          useWebKit={true}
          source={{uri: `${url}`}}
          onNavigationStateChange={this._onNavigationStateChange}
          injectJavaScript={injectedJsCode}
          onMessage={this._onMessage}
          renderLoading={() => {
            return (
              <ActivityIndicator
                style={{position: "absolute", top: height / 2, left: width / 2}}
                size="small"
              />
            )
          }}
        />
      </View>
    );
  }
}

NewWebPage.propTypes = {};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
  }, dispatch)
})

export default connect(({user}) => {
  return {
    user,
  }
}, mapDispatchToProps)(NewWebPage)

