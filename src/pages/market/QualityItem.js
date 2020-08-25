import React, {Component, PureComponent} from 'react'
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
import images from '../../component/images'
import {trim} from '../../utils/CommonUtil'

const {width} = Dimensions.get('window')

const TITLE_HEIGHT = 60
const PADDING_HORIZONTAL = 16
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 106
const SCORE_TEXT_WIDTH = 40
const TEXT_WIDTH = width - PADDING_HORIZONTAL*2 - PADDING_HORIZONTAL - IMAGE_WIDTH - SCORE_TEXT_WIDTH

class QualityItem extends PureComponent {
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



  render() {
    const {data, index} = this.props
    return (
      <TouchableOpacity
        style={{marginHorizontal: 16}}
        key={`top_quality_${index}`}
        onPress={() => {
          this.props.navigation.navigate('Detail', {bookId: data.id,})
        }}>
        <View style={{flex: 1, flexDirection: 'row', height: 106, marginBottom: 20}}>
          <ImageBackground
            source={{uri: trim(data.cover), cache: 'force-cache'}}
            resizeMethod="resize"
            defaultSource={images.image_placeholder}
            style={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
            imageStyle={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
          >
            {
              data.isvip === 1 ?
                <Image
                  style={{position: 'absolute',width: 18, height: 16, right: 5}}
                  source={images.image_vip_xianmian_bage}
                />: null
            }
          </ImageBackground>

          <View style={{flex: 1, marginStart: 16}}>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <Text style={{fontSize: 16, color: '#1e252f', width: TEXT_WIDTH}}
                    numberOfLines={1}
                    ellipsizeMode='tail'
              >{data.name}</Text>
              <Text style={{fontSize: 16, color: '#f85836'}}>{data.score}分</Text>
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={{
                marginTop: 9,
                fontSize: 13,
                lineHeight: 20,
                color: '#939aa2',
              }}>{data.brief}</Text>
            <View style={{flex: 1}}/>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={{fontSize: 11, color: '#939aa2'}}>{data.author}</Text>
              <View style={{flex: 1}}/>
              <View style={{
                height: 18,
                borderRadius: 8,
                backgroundColor: '#f1f1f6',
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{fontSize: 11, color: '#949ba5'}}>{data.category_name}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default QualityItem
