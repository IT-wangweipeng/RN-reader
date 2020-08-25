import React, {Component} from 'react'
import {
  View,
  PixelRatio,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native'
import R from 'ramda'
import images from '../../component/images'
import CountDownTimer from '../../component/CountDownTimer'
import {trim} from '../../utils/CommonUtil'
import moment from 'moment'

const {width} = Dimensions.get('window')
const TITLE_HEIGHT = 60
const PADDING_HORIZONTAL = 16
const STYLE_1_IMAGE_WIDTH = 90
const STYLE_1_IMAGE_HEIGHT = 128

const STYLE_3_IMAGE_WIDTH = 75
const STYLE_3_IMAGE_HEIGHT = 106
const SCORE_TEXT_WIDTH = 40
const STYLE_3_TEXT_WIDTH = width - PADDING_HORIZONTAL*2 - PADDING_HORIZONTAL - STYLE_3_IMAGE_WIDTH - SCORE_TEXT_WIDTH

const STYLE_5_IMAGE_WIDTH = width - PADDING_HORIZONTAL * 2
const STYLE_5_IMAGE_HEIGHT = 140

const STYLE_6_ITEM_WIDTH = (width - PADDING_HORIZONTAL * 2 - 20) / 2
const STYLE_6_ITEM_HEIGHT = 80

const STYLE_7_IMAGE_WIDTH = 120
const STYLE_7_IMAGE_HEIGHT = 120

class CustomItem extends Component {
  constructor(props) {
    super(props)

  }

  renderSeperateLine() {
    return (<View style={{width: width, height: 7, backgroundColor: '#f1f1f6'}}/>)
  }

  // 样式1，限时免广告3本书
  renderStyle1(item) {
    // item.end_time = "2019-06-20 11:59:00"
    let diff = (Date.parse(moment(item.end_time).toDate()) - Date.parse(new Date)) / 1000;
    if (diff <= 0) {
      return null
    }

    return (
      <View>
        <View style={{
          height: TITLE_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: PADDING_HORIZONTAL,
          alignItems: 'center',
        }}>
          <Text
            style={{
              width: 200,
              fontSize: 18,
              color: '#1e252f'
            }}
            numberOfLines={1}
            ellipsizeMode='tail'
          >{item.title}</Text>
          <CountDownTimer
            style={{marginStar: 8}}
            date={item.end_time}
          />
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: PADDING_HORIZONTAL,
          paddingBottom: 20
        }}>
          {
            R.addIndex(R.map)((value, index) => (
              <TouchableOpacity
                key={`index_${index}`}
                onPress={() => {
                  const {navigation} = this.props
                  switch (value.jump_type) {
                    case 1://图书编号
                      navigation.navigate('Detail', {bookId: value.id})
                      break;
                  }
                  this.props.onPress()
                }}

              >
                <View style={{width: STYLE_1_IMAGE_WIDTH}}>
                  <ImageBackground
                    style={{
                      width: STYLE_1_IMAGE_WIDTH,
                      height: STYLE_1_IMAGE_HEIGHT,
                      borderRadius: 3
                    }}
                    imageStyle={{width: STYLE_1_IMAGE_WIDTH, height: STYLE_1_IMAGE_HEIGHT, borderRadius: 3}}
                    defaultSource={images.image_placeholder}
                    source={{uri: value.cover, cache: 'force-cache'}}
                    resizeMethod="resize"
                  >
                    <Image
                      style={{width: 28, height: 27}}
                      source={images.image_market_xianmian_book_bage_icon}/>
                    {value.isvip === 1 ?
                      <Image
                        style={{position: 'absolute',width: 18, height: 16, right: 5}}
                        source={images.image_vip_xianmian_bage}
                      /> : null
                    }
                  </ImageBackground>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 14,
                      color: '#1e252f',
                      lineHeight: 18,
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {value.name}
                  </Text>
                  <Text style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: '#939aa2',
                  }}>
                    {(value.popularity / 10000).toFixed(1) + "万人气值"}
                  </Text>
                </View>
              </TouchableOpacity>
            ), item.list)
          }
        </View>
        {this.renderSeperateLine()}
      </View>
    )
  }

  // 样式2，新书尝鲜3本书
  renderStyle2(item) {
    return (
      <View>
        <View style={{
          height: TITLE_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: PADDING_HORIZONTAL,
          alignItems: 'center',
        }}>
          <Text
            style={{
              fontSize: 18,
              color: '#1e252f'
            }}
            numberOfLines={1}
            ellipsizeMode='tail'
          >{item.title}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: PADDING_HORIZONTAL,
            paddingBottom: 20
          }}
        >
          {
            R.addIndex(R.map)((value, index) => (
              <TouchableOpacity
                key={`index_${index}`}
                onPress={() => {
                  const {navigation} = this.props
                  console.log('yy value.jump_type=', value.jump_type)
                  console.log('yy value.id=', value.id)
                  switch (value.jump_type) {
                    case 1://图书编号
                      navigation.navigate('Detail', {bookId: value.id})
                      break;
                  }
                  this.props.onPress()
                }}
              >
                <View style={{width: STYLE_1_IMAGE_WIDTH}}>
                  <Image
                    style={{
                      width: STYLE_1_IMAGE_WIDTH,
                      height: STYLE_1_IMAGE_HEIGHT,
                      borderRadius: 3
                    }}
                    defaultSource={images.image_placeholder}
                    source={{uri: value.cover, cache: 'force-cache'}}
                    resizeMethod="resize"
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 14,
                      color: '#1e252f',
                      lineHeight: 18,
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {value.name}
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: '#939aa2'
                    }}>
                    {(value.popularity / 10000).toFixed(1) + "万人气值"}
                  </Text>
                </View>
              </TouchableOpacity>
            ), item.list)
          }
        </View>
        {this.renderSeperateLine()}
      </View>
    )
  }

  // 样式3，单本书
  renderStyle3(item) {
    if (item.list.length > 0) {
      const value = item.list[0]

      return (
        <View>
          <TouchableOpacity
            style={{paddingBottom: 20}}
            onPress={() => {
              const {navigation} = this.props
              switch (value.jump_type) {
                case 1://图书编号
                  navigation.navigate('Detail', {bookId: value.id})
                  break;
              }
              this.props.onPress()
            }}
          >
            <View style={{
              height: TITLE_HEIGHT,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: PADDING_HORIZONTAL,
            }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#1e252f'
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
              >{item.title}</Text>
            </View>

            <View style={{flexDirection: 'row', height: 106, paddingHorizontal: PADDING_HORIZONTAL}}>
              <ImageBackground
                source={{uri: value.cover, cache: 'force-cache'}}
                resizeMethod="resize"
                defaultSource={images.image_placeholder}
                style={{width: STYLE_3_IMAGE_WIDTH, height: STYLE_3_IMAGE_HEIGHT, borderRadius: 3}}
                imageStyle={{width: STYLE_3_IMAGE_WIDTH, height: STYLE_3_IMAGE_HEIGHT, borderRadius: 3}}
              >
                <Image
                  style={{width: 28, height: 27}}
                  source={images.image_market_zuijia_book_bage_icon}/>
                {value.isvip === 1 ?
                  <Image
                    style={{position: 'absolute',width: 18, height: 16, right: 5}}
                    source={images.image_vip_xianmian_bage}
                  /> : null
                }
              </ImageBackground>
              <View style={{flex: 1, marginStart: 16}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginEnd: 12}}>
                  <Text style={{fontSize: 16, color: '#1e252f', width: STYLE_3_TEXT_WIDTH}}
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
                  }}>{value.author}</Text>
                <View
                  style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end'}}>
                  <View style={{
                    height: 18,
                    borderRadius: 8,
                    backgroundColor: '#f1f1f6',
                    paddingHorizontal: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{fontSize: 11, color: '#949ba5',}}>{value.category_name}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text
              style={{
                marginHorizontal: PADDING_HORIZONTAL,
                marginTop: 9,
                fontSize: 13,
                lineHeight: 20,
                color: '#939aa2',
              }}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {item.desc && item.desc || value.brief}
            </Text>
          </TouchableOpacity>
          {this.renderSeperateLine()}
        </View>
      )
    }

    return null
  }

  // 样式4, 单图
  renderStyle4(item) {
    if (item.list.length > 0) {
      const value = item.list[0]
      return (
        <View>
          <View style={{
            height: TITLE_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: PADDING_HORIZONTAL
          }}>
            <Text
              style={{
                fontSize: 18,
                color: '#1e252f'
              }}
              numberOfLines={1}
              ellipsizeMode='tail'
            >{item.title}</Text>
          </View>

          <TouchableOpacity
            style={{
              paddingBottom: 20,
            }}
            onPress={() => {
              const {navigation} = this.props
              switch (value.jump_type) {
                case 1://图书编号
                  navigation.navigate('Detail', {bookId: value.jump_url})
                  break;
                case 2://URL链接
                  navigation.navigate('Web', {url: value.jump_url})
                  break;
                case 4://发现二级页面
                  if (value.discovery_type == 1) {//书籍
                    this.props.navigation.navigate('DiscoveryBook', {
                      title: value.discovery_title,
                      id: value.discovery_id
                    })
                  } else if (value.discovery_type == 2) {//作者
                    this.props.navigation.navigate('DiscoveryAuthor', {
                      id: value.discovery_id
                    })
                  }
                  break;
              }
              this.props.onPress()
            }}
          >
            <Image
              style={{width: width - 16 * 2, height: 140, marginHorizontal: 16, borderRadius: 3}}
              defaultSource={images.image_discovery_banner_placeholder}
              source={{uri: value.image, cache: 'force-cache'}}
              resizeMethod="resize"
            />
          </TouchableOpacity>
          {this.renderSeperateLine()}
        </View>
      )
    }

    return null
  }

  // 样式5，作家
  renderStyle5(item) {
    if (item.list.length > 0) {
      const value = item.list[0]
      return (
        <View>
          <TouchableOpacity
            style={{paddingBottom: 20}}
            onPress={() => {
              const {navigation} = this.props
              switch (value.jump_type) {
                case 1://图书编号
                  // navigation.navigate('Detail',{bookId: value.jump_url})
                  break;
                case 2://URL链接
                  navigation.navigate('Web', {url: value.jump_url})
                  break;
                case 4://发现二级页面
                  if (value.discovery_type == 1) {//书籍
                    this.props.navigation.navigate('DiscoveryBook', {
                      title: value.discovery_title,
                      id: value.discovery_id
                    })
                  } else if (value.discovery_type == 2) {//作者
                    this.props.navigation.navigate('DiscoveryAuthor', {
                      id: value.discovery_id
                    })
                  }
                  break;
              }
              this.props.onPress()
            }}>
            <View style={{
              height: TITLE_HEIGHT,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: PADDING_HORIZONTAL,
            }}>
              <Image
                style={{width: 34, height: 34, borderRadius: 17}}
                defaultSource={images.image_placeholder}
                source={{uri: value.image_author, cache: 'force-cache'}}
                resizeMethod="resize"
              />

              <Text
                style={{marginStart: 10, fontSize: 18, color: '#1e252f'}}
                numberOfLines={1}
                ellipsizeMode='tail'
              >{item.title}</Text>
              <View style={{
                marginHorizontal: 14,
                width: 1 / PixelRatio.get(),
                height: 15,
                backgroundColor: '#d2d2d2'
              }}/>

              <Text
                style={{fontSize: 15, color: '#939aa2'}}
                numberOfLines={1}
                ellipsizeMode='tail'
              >{item.desc}</Text>
            </View>

            <Image
              style={{width: STYLE_5_IMAGE_WIDTH, height: STYLE_5_IMAGE_HEIGHT, marginHorizontal: PADDING_HORIZONTAL, borderRadius: 3}}
              defaultSource={images.image_discovery_banner_placeholder}
              source={{uri: value.image, cache: 'force-cache'}}
              resizeMethod="resize"
            />
          </TouchableOpacity>
          {this.renderSeperateLine()}
        </View>
      )
    }

    return null
  }

  // 样式6, 双图
  renderStyle6(item) {
    return (
      <View>
        <View style={{marginHorizontal: PADDING_HORIZONTAL, flexDirection: 'row', justifyContent: 'space-between'}}>
          {
            R.addIndex(R.map)((value, index) => (
              <TouchableOpacity
                key={index}
                style={{width: STYLE_6_ITEM_WIDTH, paddingBottom: 20}}
                onPress={() => {
                  const {navigation} = this.props
                  console.log('yy jumpType=', value.jump_type)
                  switch (value.jump_type) {
                    case 1://图书编号
                      navigation.navigate('Detail', {bookId: value.jump_url})
                      break;
                    case 2://URL链接
                      console.log('yy url jump_url=', value.jump_url)
                      navigation.navigate('Web', {url: value.jump_url})
                      break;
                    case 4://发现二级页面
                      if (value.discovery_type == 1) {//书籍
                        this.props.navigation.navigate('DiscoveryBook', {
                          title: value.discovery_title,
                          id: value.discovery_id
                        })
                      } else if (value.discovery_type == 2) {//作者
                        this.props.navigation.navigate('DiscoveryAuthor', {
                          id: value.discovery_id
                        })
                      }
                      break;
                  }
                  this.props.onPress()
                }}
              >
                <View style={{
                  height: TITLE_HEIGHT,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Text
                    style={{fontSize: 18, color: '#1e252f'}}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >{value.title}</Text>
                </View>
                <Image
                  style={{width: STYLE_6_ITEM_WIDTH, height: STYLE_6_ITEM_HEIGHT, borderRadius: 3}}
                  defaultSource={images.image_discovery_banner_placeholder}
                  source={{uri: trim(value.image), cache: 'force-cache'}}
                  resizeMethod="resize"
                />
              </TouchableOpacity>
            ), item.list)
          }
        </View>
        {this.renderSeperateLine()}
      </View>
    )
  }

  // 样式7, 左字右图
  renderStyle7(item) {
    if (item.list.length > 0) {
      const value = item.list[0]
      return (
        <View>
          <TouchableOpacity
            style={{paddingVertical: 20}}
            onPress={() => {
              const {navigation} = this.props
              console.log('yy jumpType=', value.jump_type)
              switch (value.jump_type) {
                case 1://图书编号
                  navigation.navigate('Detail', {bookId: value.jump_url})
                  break;
                case 2://URL链接
                  console.log('yy url jump_url=', value.jump_url)
                  navigation.navigate('Web', {url: value.jump_url})
                  break;
                case 4://发现二级页面
                  if (value.discovery_type == 1) {//书籍
                    this.props.navigation.navigate('DiscoveryBook', {
                      title: value.discovery_title,
                      id: value.discovery_id
                    })
                  } else if (value.discovery_type == 2) {//作者
                    this.props.navigation.navigate('DiscoveryAuthor', {
                      id: value.discovery_id
                    })
                  }
                  break;
              }
              this.props.onPress()
            }}
          >
            <View style={{flexDirection: 'row', marginHorizontal: PADDING_HORIZONTAL}}>
              <View style={{flex: 1, justifyContent:'space-between'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#1e252f'
                  }}
                  numberOfLines={2}
                  ellipsizeMode='tail'
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 20,
                    color: '#939aa2'
                  }}
                  numberOfLines={3}
                  ellipsizeMode='tail'
                >
                  {item.desc}
                </Text>
              </View>
              <Image
                style={{marginStart: 16, width: STYLE_7_IMAGE_WIDTH, height: STYLE_7_IMAGE_HEIGHT, borderRadius: 3}}
                defaultSource={images.image_placeholder}
                source={{uri: trim(value.image), cache: 'force-cache'}}
                resizeMethod="resize"
              />
            </View>
          </TouchableOpacity>
          {this.renderSeperateLine()}
        </View>
      )
    }

    return null
  }

  // 样式8, Vip限时免费3本书
  renderStyle8(item) {
    // item.end_time = "2019-06-20 11:59:00"
    let diff = (Date.parse(moment(item.end_time).toDate()) - Date.parse(new Date)) / 1000;
    if (diff <= 0) {
      return null
    }

    return (
      <View>
        <View style={{
          height: TITLE_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: PADDING_HORIZONTAL,
          alignItems: 'center',
        }}>
          <Text
            style={{
              width: 200,
              fontSize: 18,
              color: '#1e252f'
            }}
            numberOfLines={1}
            ellipsizeMode='tail'
          >{item.title}</Text>
          <CountDownTimer
            style={{marginStar: 8}}
            date={item.end_time}
          />
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: PADDING_HORIZONTAL,
          paddingBottom: 20
        }}>
          {
            R.addIndex(R.map)((value, index) => (
              <TouchableOpacity
                key={`index_${index}`}
                onPress={() => {
                  const {navigation} = this.props
                  switch (value.jump_type) {
                    case 1://图书编号
                      navigation.navigate('Detail', {bookId: value.id})
                      break;
                  }
                  this.props.onPress()
                }}

              >
                <View style={{width: STYLE_1_IMAGE_WIDTH}}>
                  <ImageBackground
                    style={{
                      width: STYLE_1_IMAGE_WIDTH,
                      height: STYLE_1_IMAGE_HEIGHT,
                      borderRadius: 3
                    }}
                    imageStyle={{width: STYLE_1_IMAGE_WIDTH, height: STYLE_1_IMAGE_HEIGHT, borderRadius: 3}}
                    defaultSource={images.image_placeholder}
                    source={{uri: value.cover, cache: 'force-cache'}}
                    resizeMethod="resize"
                  >
                    <Image
                      style={{width: 28, height: 27}}
                      source={images.image_market_xianmian_book_bage_icon}/>
                    {value.isvip === 1 ?
                      <Image
                        style={{position: 'absolute',width: 18, height: 16, right: 5}}
                        source={images.image_vip_xianmian_bage}
                      /> : null
                    }
                  </ImageBackground>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 14,
                      color: '#1e252f',
                      lineHeight: 18,
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {value.name}
                  </Text>
                  <Text style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: '#939aa2',
                  }}>
                    {(value.popularity / 10000).toFixed(1) + "万人气值"}
                  </Text>
                </View>
              </TouchableOpacity>
            ), item.list)
          }
        </View>
        {this.renderSeperateLine()}
      </View>
    )
  }

  render() {
    if (JSON.stringify(this.props.data) == '{}' || this.props.data === undefined) {
      return null
    }
    const value = this.props.data

    switch (value.type) {
      case 1://限时免广告
        return this.renderStyle1(value)
        break;
      case 2://三本书
        return this.renderStyle2(value)
        break;
      case 3://单本书
        return this.renderStyle3(value)
        break;
      case 4://单图
        return this.renderStyle4(value)
        break;
      case 5://作者
        return this.renderStyle5(value)
        break;
      case 6://双图
        return this.renderStyle6(value)
        break;
      case 7://左字右图
        return this.renderStyle7(value)
        break;
      case 8://vip限免
        return this.renderStyle8(value)
      break;
      default:
        return null
        break;
    }

  }
}

export default CustomItem
