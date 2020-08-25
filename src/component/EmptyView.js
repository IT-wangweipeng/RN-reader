import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  Image,
} from 'react-native'
import images from '../component/images'


class EmptyView extends Component {
  render () {
    return (
      <View style={{
        justifyContent: 'center', alignItems: 'center',
      }}
      >
        <Image
          style={{marginTop: 108}}
          source={images.image_search_empty}
        />
        <Text style={{marginTop: 10, color: '#acacb9', fontSize: 12}}>
          {'未找到结果，我们会努力丰富书库哒!'}
        </Text>
      </View>
    )
  }
}

EmptyView.propTypes = {}

export default EmptyView
