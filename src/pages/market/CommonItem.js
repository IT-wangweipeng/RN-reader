import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'

const COMMON_ITEM_HEIGHT = 60

class CommonItem extends Component {
  render() {
    const {name, image, imageType, onPressItem} = this.props

    return (
      <TouchableOpacity
        onPress={() => onPressItem()}>
        <View style={{width: 35, height: COMMON_ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={{width: 35, height: 35}}
            source={imageType ===1 ? image: {uri: image, cache: 'force-cache'}}
            resizeMethod="resize"
          />
          <View style={{flex: 1}}/>
          <Text style={{
            fontSize: 14,
            color: '#545c67'
          }}
          numberOfLines={1}
          ellipsizeMode='tail'
          >{name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default CommonItem
