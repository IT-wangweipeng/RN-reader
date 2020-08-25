import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  FlatList,
  SectionList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  NativeModules,
  Platform,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import R from 'ramda'
import * as crediteActions from '../../actions/creditScoreAction'
import {WebView} from "react-native-webview";
import IMAGES from "../../component/images";



class HotBeanRulesDetailPage extends Component {

  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title != null ? navigation.state.params.title : ''}`,
  })

  render () {
    return (
      <WebView
        style={{flex: 1}}
        useWebKit={true}
        source={{uri: `${this.props.navigation.state.params.url}`}}
      />
    )
  }
}

HotBeanRulesDetailPage.propTypes = {}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...crediteActions}, dispatch)
})

export default connect(({creditScore, user}) => {
  return {
    creditScore,
    user,
  }
}, mapDispatchToProps)(HotBeanRulesDetailPage)