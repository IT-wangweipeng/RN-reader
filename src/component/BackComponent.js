import React, {PureComponent} from 'react'
import { Image, TouchableOpacity } from 'react-native'
import IMAGES from './images'


export default class BackComponent extends PureComponent {
  render () {
    return (
      <TouchableOpacity
        style={{marginLeft: 10}}
        onPress={() => {
          if (this.props.onPressItem) {
            this.props.onPressItem()
            return
          }
          this.props.router.goBack()
        }}
      >
        <Image
          source={IMAGES.left_arrow}
        />
      </TouchableOpacity>
    )
  }
}