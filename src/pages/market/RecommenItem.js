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
import images from '../../component/images'

const {width} = Dimensions.get('window')

const TITLE_HEIGHT = 60
const PADDING_HORIZONTAL = 16
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 106
const SCORE_TEXT_WIDTH = 40
const TEXT_WIDTH = width - PADDING_HORIZONTAL*2 - PADDING_HORIZONTAL - IMAGE_WIDTH - SCORE_TEXT_WIDTH

const FOUR_ITEM_MARGIN = 10
const FOUR_ITEM_IMAGE_WIDTH = width > IMAGE_WIDTH*4 + PADDING_HORIZONTAL*2 ? IMAGE_WIDTH : (width - PADDING_HORIZONTAL*2 - FOUR_ITEM_MARGIN*3)/ 4
const FOUR_ITEM_IMAGE_HEIGHT = (FOUR_ITEM_IMAGE_WIDTH * IMAGE_HEIGHT) / IMAGE_WIDTH
const FOUR_ITEM_TEXT_WIDTH = width - PADDING_HORIZONTAL*2 - PADDING_HORIZONTAL - FOUR_ITEM_IMAGE_WIDTH - SCORE_TEXT_WIDTH

class RecommenItem extends Component {
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

  renderFirstItem() {
    const firstItem = R.head(this.props.data.list)
    if (firstItem === undefined) {
      return null
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Detail', {bookId: firstItem.id,})
        }}>
        <View style={{flex: 1, flexDirection: 'row', height: FOUR_ITEM_IMAGE_HEIGHT, paddingHorizontal: PADDING_HORIZONTAL}}>
          <ImageBackground
            source={{uri: firstItem.cover, cache: 'force-cache'}}
            resizeMethod="resize"
            defaultSource={images.image_placeholder}
            style={{width: FOUR_ITEM_IMAGE_WIDTH, height: FOUR_ITEM_IMAGE_HEIGHT, borderRadius: 3}}
            imageStyle={{width: FOUR_ITEM_IMAGE_WIDTH, height: FOUR_ITEM_IMAGE_HEIGHT, borderRadius: 3}}>
            {
              firstItem.isvip === 1 ?
                <Image
                  style={{position: 'absolute',width: 18, height: 16, right: 5}}
                  source={images.image_vip_xianmian_bage}
                />: null
            }
          </ImageBackground>

          <View style={{flex: 1, marginStart: 16}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 16, color: '#1e252f', width: FOUR_ITEM_TEXT_WIDTH}}
                    numberOfLines={1}
                    ellipsizeMode='tail'>{firstItem.name}</Text>
              <Text style={{fontSize: 16, color: '#f85836'}}>{firstItem.score}分</Text>
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={{
                marginTop: 9,
                fontSize: 13,
                lineHeight: 20,
                color: '#939aa2',
              }}>{firstItem.brief}</Text>

            <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={{fontSize: 11, color: '#939aa2'}}>{firstItem.author}</Text>

              <View style={{
                height: 18,
                borderRadius: 8,
                backgroundColor: '#f1f1f6',
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{fontSize: 11, color: '#949ba5',}}>{firstItem.category_name}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderOtherItem() {
    const list = R.tail(this.props.data.list)
    if (list === undefined) {
      return null
    }

    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingVertical: 20,
      }}>
        {
          R.addIndex(R.map)((value, index) => (
            <TouchableOpacity
              key={`recommend_${index}`}
              onPress={() => {
                this.props.navigation.navigate('Detail', {bookId: value.id,})
              }}>
              <View style={{width: FOUR_ITEM_IMAGE_WIDTH}}>
                <ImageBackground
                  source={{uri: value.cover, cache: 'force-cache'}}
                  resizeMethod="resize"
                  defaultSource={images.image_placeholder}
                  style={{width: FOUR_ITEM_IMAGE_WIDTH, height: FOUR_ITEM_IMAGE_HEIGHT, borderRadius: 3}}
                  imageStyle={{width: FOUR_ITEM_IMAGE_WIDTH, height: FOUR_ITEM_IMAGE_HEIGHT, borderRadius: 3}}
                >
                  {
                    value.isvip === 1 ?
                      <Image
                        style={{position: 'absolute',width: 18, height: 16, right: 5}}
                        source={images.image_vip_xianmian_bage}
                      />: null
                  }
                </ImageBackground>

                <Text numberOfLines={1}
                      ellipsizeMode='tail'
                      style={{
                        marginTop: 10,
                        fontSize: 14,
                        color: '#1e252f',
                        lineHeight: 18,
                      }}>{value.name}</Text>

                <Text numberOfLines={1}
                      ellipsizeMode='tail'
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: '#939aa2',
                      }}>{(value.popularity / 10000).toFixed(1) + "万人气值"}</Text>
              </View>
            </TouchableOpacity>
          ), list)
        }
      </View>
    )
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

  render() {
    if (JSON.stringify(this.props.data) == '{}' || this.props.data === undefined) {
      return null
    }

    const {name} = this.props.data
    return (
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: '#ffffff'}}>
        <View style={{
          flex: 1,
          height: TITLE_HEIGHT,
          flexDirection: 'row',
          paddingHorizontal: PADDING_HORIZONTAL,
          alignItems: 'center'
        }}>
          <Text style={{fontSize: 18, color: '#1e252f'}}>{name}</Text>
          <View style={{flex: 1}}/>
          {this.renderRight()}
        </View>
        {this.renderFirstItem()}
        {this.renderOtherItem()}
      </View>
    )
  }
}


export default RecommenItem
