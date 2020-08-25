import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  Platform,
} from 'react-native';

import Swiper from 'react-native-swiper'

const {width} = Dimensions.get('window')
const BANNER_WIDTH = width
const BANNER_HEIGHT = Platform.OS === 'ios' ? 150 : 130

import Carousel, {Pagination} from 'react-native-snap-carousel';
import images from "../../component/images";


class LoopBannerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      activeSlide: 0
    };
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{width: BANNER_WIDTH, height: BANNER_HEIGHT,}}
        key={`recommend_${index}`}
        onPress={() => {
          const {navigation} = this.props
          switch (item.type) {
            case 1://图书编号
              navigation.navigate('Detail', {bookId: item.url})
              break;
            case 2://URL链接
              navigation.navigate('Web', {url: item.url})
              break;
            case 4://发现二级页面
              if (item.discovery_type == 1) {//书籍
                this.props.navigation.navigate('DiscoveryBook', {
                  title: item.discovery_title,
                  id: item.discovery_id
                })
              } else if (item.discovery_type == 2) {//作者
                this.props.navigation.navigate('DiscoveryAuthor', {
                  id: item.discovery_id
                })
              }
              break;
            case 5://内部链接(登录)
              break;
            case 6://内部链接(福利)
              break;
            case 7://调起弹窗
              break;
            case 8://趣读跳转
              navigation.navigate('Qudu')
              break;
            default:
              break;
          }

          this.props.onPressBanner && this.props.onPressBanner()
        }}
      >
        <Image
          key={`item${index}`}
          source={{uri: item.image, cache: 'force-cache'}}
          resizeMethod="resize"
          resizeMode={'stretch'}
          defaultSource={images.image_discovery_banner_placeholder}
          style={{width: BANNER_WIDTH, height: BANNER_HEIGHT,}}
        />
      </TouchableOpacity>
    )
  }


  get pagination() {
    const {activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={this.props.data.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.pagination}
        dotStyle={styles.activeDot}
        inactiveDotStyle={styles.inactiveDot}
      />
    );
  }


  render() {

    if (Platform.OS === 'ios') {
      return (
        <View>
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            layout={'default'}
            loop={true}
            autoplay={true}
            useScrollView={true}
            lockScrollWhileSnapping={true}
            autoplayInterval={5000}
            data={this.props.data}
            renderItem={this._renderItem}
            sliderWidth={BANNER_WIDTH}
            sliderHeight={BANNER_HEIGHT}
            itemWidth={BANNER_WIDTH}
            itemHeight={BANNER_HEIGHT}
            onSnapToItem={(index) => this.setState({activeSlide: index})}
          />
          {this.pagination}
        </View>
      )
    }

    return (
      <Swiper
        style={{width: BANNER_WIDTH, height: BANNER_HEIGHT}}
        autoplay={true}
        autoplayTimeout={5}
        removeClippedSubviews={false}
        paginationStyle={{
          position: 'absolute',
          bottom: 4,
          left: 0,
          right: 0,
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        dotStyle={{
          backgroundColor: 'rgba(255,255,255,0.4)',
          width: 6,
          height: 6,
          borderRadius: 3,
          marginStart: 3,
        }}
        activeDotStyle={{
          backgroundColor: '#fff',
          width: 11,
          height: 6,
          borderRadius: 3,
          marginStart: 3,
        }}
      >
        {
          this.props.data.map((item, i) => {
            return (
              <TouchableOpacity
                key={`recommend_${i}`}
                onPress={() => {
                  const {navigation} = this.props
                  console.log('gg type=',item.type)
                  switch (item.type) {
                    case 1://图书编号
                      navigation.navigate('Detail', {bookId: item.url})
                      break;
                    case 2://URL链接
                      navigation.navigate('Web', {url: item.url})
                      break;
                    case 4://发现二级页面
                      if (item.discovery_type == 1) {//书籍
                        this.props.navigation.navigate('DiscoveryBook', {
                          title: item.discovery_title,
                          id: item.discovery_id
                        })
                      } else if (item.discovery_type == 2) {//作者
                        this.props.navigation.navigate('DiscoveryAuthor', {
                          id: item.discovery_id
                        })
                      }
                      break;
                    case 5://内部链接(登录)
                      break;
                    case 6://内部链接(福利)
                      break;
                    case 7://调起弹窗
                      break;
                    case 8://趣读跳转
                      navigation.navigate('Qudu')
                      break;
                    default:
                      break;
                  }

                  this.props.onPressBanner && this.props.onPressBanner()
                }}
              >
                <Image
                  key={`item${i}`}
                  source={{uri: item.image, cache: 'force-cache'}}
                  resizeMethod="resize"
                  style={{
                    width: BANNER_WIDTH,
                    height: BANNER_HEIGHT,
                  }}
                ></Image>
              </TouchableOpacity>
            )
          })
        }
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: -20,
    left: 50,
    right: 50,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 11,
    height: 6,
    borderRadius: 3,
    marginStart: 3,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginStart: 3,
  }
})

export default LoopBannerView
