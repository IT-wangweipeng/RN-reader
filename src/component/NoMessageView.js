import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native'
import {SafeAreaView} from "react-navigation";
import images from '../component/images'

const {width, height} = Dimensions.get('window')


class NoMessageView extends Component {
  render () {
    return (
      <View style={[{justifyContent: 'center', alignItems: 'center'}, this.props.style]}>
        <Image
          source={images.image_no_message}
        />
        <Text style={{marginTop: 10, color: '#ACACB9', fontSize: 15}}>
          {this.props.message || '暂无评论，快来抢沙发吧'}
        </Text>
      </View>
    )
  }
}

NoMessageView.propTypes = {}

export default NoMessageView
