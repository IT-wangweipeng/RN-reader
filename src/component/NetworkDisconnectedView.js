import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
} from 'react-native'

import images from './images'


export default class NetworkDisconnectedView extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Image
          style={{justifyContent: 'center', marginTop: 100, alignSelf: 'center'}}
          source={images.network_disconnected}
        />
        <Text style={{alignSelf: 'center', marginTop: 2, fontWeight: "500", fontSize: 15, color: 'rgb(172, 172, 185)'}}>
          {'咦？好像暂时找不到网络了呢'}
        </Text>
      </View>
    )
  }
}