import React, { Component } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

export default class loader extends Component {
  constructor (props) {
    super(props)
  }

  _activityindicator () {
    const showLoading = this.props.showLoading
    if (showLoading) {
      return (
        <Image
          style={{width: 60, height: 60, backgroundColor: '#000', opacity: 0.4, borderRadius: 4, }}
          source={require('./book_loading.gif')}
        />
      )
    }
    return null
  }

  _loadingText () {
    if (this.props.text) {
      return (
        <Text style={styles.loadingText}>
          {this.props.text}
          {' '}
        </Text>
      )
    }
  }

  _containerStyle () {
    const { text } = this.props
    // if (text && (text.length > 7)) {
    //     return styles.loadingContainerAutoSize;
    // } else {
    //     return styles.loadingContainer;
    // }
    return styles.loadingContainerAutoSize
  }

  render () {
    return (
      <View style={this._containerStyle()}>


        {this._activityindicator()}
        {this._loadingText()}

      </View>
    )
  }
}

loader.propTypes = {
  name: PropTypes.string,
}
