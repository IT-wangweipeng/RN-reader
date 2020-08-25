import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native'
import R from 'ramda'
import images from '../../../component/images'

const {width} = Dimensions.get('window')

const TITLE_HEIGHT = 60
const PADDING_HORIZONTAL = 16
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 106
const SCORE_TEXT_WIDTH = 40
const TEXT_WIDTH = width - PADDING_HORIZONTAL*2 - PADDING_HORIZONTAL - IMAGE_WIDTH - SCORE_TEXT_WIDTH

class DiscoveryItem extends Component {
  constructor(props) {
    super(props)
    this.spinValue = new Animated.Value(0)
  }

  spin() {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    ).start(() => {
      this.spinValue.setValue(0)
    })
  }

  renderRight() {
    const {right} = this.props.data
    const {onPressItem} = this.props

    if (right == 2) {
      const spin = this.spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      })

      return (
        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            onPressItem()
            this.spin()
          }}>
          <Text style={{fontSize: 15, color: '#f85836'}}>换一批</Text>
          <Animated.Image style={{
            marginStart: 6,
            transform: [{rotate: spin}],
          }} source={images.image_change}/>
        </TouchableOpacity>
      )
    } else if (right == 3) {
      return (
        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
          onPress={() => onPressItem()}>
          <Text style={{fontSize: 15, color: '#f85836'}}>查看全部</Text>
          <Image style={{marginStart: 6}} source={images.image_view_all}/>
        </TouchableOpacity>
      )
    }

    return <View/>

  }

  renderItem() {
    const {list} = this.props.data
    return (
      <View style={{
        flex: 1,
        paddingHorizontal: PADDING_HORIZONTAL,
      }}>
        {
          R.addIndex(R.map)((value, index) => (
            <TouchableOpacity
              key={`quality_${index}`}
              onPress={() => {
                this.props.navigation.navigate('Detail', {bookId: value.id,})
              }}>
              <View style={{flex: 1, flexDirection: 'row', height: 106, marginBottom: 24}}>
                <ImageBackground source={{uri: value.cover, cache: 'force-cache'}}
                       resizeMethod="resize"
                       defaultSource={images.image_placeholder}
                       style={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
                       imageStyle={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
                >
                  {
                    value.isvip === 1 ?
                      <Image
                        style={{position: 'absolute',width: 18, height: 16, right: 5}}
                        source={images.image_vip_xianmian_bage}
                      />: null
                  }
                </ImageBackground>
                <View style={{flex: 1, marginStart: 16}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 16, color: '#1e252f', width:TEXT_WIDTH}}
                          numberOfLines={1}
                          ellipsizeMode='tail'>{value.name}</Text>
                    <Text style={{fontSize: 16, color: '#f85836'}}>{value.score}分</Text>
                  </View>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={{
                      marginTop: 9,
                      fontSize: 13,
                      lineHeight: 20,
                      color: '#939aa2',
                    }}>{value.brief}</Text>
                  <View style={{flex: 1}}/>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 11, color: '#939aa2'}}>{value.author}</Text>
                    <View style={{flex: 1}}/>
                    <View style={{
                      height: 18,
                      borderRadius: 8,
                      backgroundColor: '#f1f1f6',
                      paddingHorizontal: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={{fontSize: 11, color: '#949ba5'}}>{value.category_name}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ), list)
        }
        {
          <View style={{justifyContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#fff'}}>
            <Text style={{textAlign: 'center', color: '#d1d1d9', fontSize: 15}} numberOfLines={1}>──── 已经拉到底啦
              ────</Text>
          </View>
        }
      </View>

    )
  }

  render() {
    if (JSON.stringify(this.props.data) == '{}' || this.props.data === undefined) {
      return null
    }

    return (
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: '#ffffff'}}>
        <View style={{
          flex: 1,
          height: TITLE_HEIGHT,
          flexDirection: 'row',
          paddingHorizontal: PADDING_HORIZONTAL,
          alignItems: 'center'
        }}>
          <Text style={{fontSize: 18, color: '#1e252f'}}>{this.props.data.title}</Text>
          <View style={{flex: 1}}/>
          {this.renderRight()}
        </View>
        {this.renderItem()}
      </View>
    )
  }
}

export default DiscoveryItem
