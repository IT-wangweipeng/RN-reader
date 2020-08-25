

import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import PropTypes from 'prop-types'
import LoadingIndicator from './loader'
import styles from './styles'

export default class index extends Component {
  render () {
    if (this.props.showHUD) {
      return (
        <TouchableOpacity style={styles.container} onPress={() => console.log('click')} activeOpacity={1}>
          <LoadingIndicator text={this.props.text} showLoading={this.props.showLoading} />
        </TouchableOpacity>
      )
    }
    return null
  }
}

index.propTypes = {
  text: PropTypes.string,
  showHUD: PropTypes.bool,
}
