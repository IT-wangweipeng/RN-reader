import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet, ImageBackground,
} from 'react-native'
import images from '../../component/images'

const {width, height} = Dimensions.get('window')
const ITEM_MARGIN = 26
const ITEM_WIDTH = (width - 32 - ITEM_MARGIN * 2) / 3



export default class BookshelfCell extends Component {
  render () {
    const {item, index} = this.props
    return (
      <TouchableOpacity
        style={this.props.cellStyle}
        onPress={() => {
          this.props.onPressCell && this.props.onPressCell()
        }}
        onLongPress={() => {
          this.props.onLongPressCell && this.props.onLongPressCell()
        }}
      >
        <View style={{marginLeft: index % 3 === 0 ? 0 : ITEM_MARGIN, width: ITEM_WIDTH}}>
          {
            (item.isGame === true && this.props.game) ? this._renderGameView(item) : this._renderBookView(item)
          }
        </View>
      </TouchableOpacity>
    )
  }

  _renderGameView = (item) => {
    return (
      <View>
        <Image
          resizeMode={'stretch'}
          style={{width: ITEM_WIDTH, height: 140}}
          source={{uri: `${this.props.game.cover}`}}
        />
        <Text
          numberOfLines={2}
          style={{fontSize: 14, color: '#1e252f', marginTop: 10, lineHeight: 17}}
        >
          {`${this.props.game.name}`}
        </Text>
      </View>
    )
  }

  _renderBookView = (item) => {
    return (
      <View>
        {
          item.end === true ? (
            <Image
              resizeMode={'stretch'}
              style={{width: ITEM_WIDTH, height: 140}}
              source={images.add_book}
            />
          ) : (
            <ImageBackground
              resizeMode={'cover'}
              defaultSource={images.image_placeholder}
              style={{width: ITEM_WIDTH, height: 140}}
              imageStyle={{borderRadius: 3}}
              source={{uri: `${item.cover}`}}
            >
              {
                (item.book_type === 1 && this.props.hasBadge) ? (
                  <Image
                    style={{width: 30, height: 30}}
                    source={item.icon_status > 1 ? '' : item.icon_status === 1 ? images.image_update_icon : images.image_recommend_icon}
                  />
                ) : null
              }

              {
                this.props.showCheckMark ? (
                  <Image
                    style={styles.checkmark}
                    source={item.select === true ? images.checkmark_selected : images.checkmark_default}
                  />
                ) : null
              }
            </ImageBackground>
          )
        }
        {
          item.end === true ? (
            <Text
              style={{fontSize: 12, color: '#949BA5', marginTop: 10}}
            >
              {'添加喜欢的小说'}
            </Text>
          ) : (
            <Text
              numberOfLines={2}
              style={{fontSize: 14, color: '#1e252f', marginTop: 10, lineHeight: 17}}
            >
              {`${item.name || ''}`}
            </Text>
          )
        }

        {
          item.book_type !== 1 || item.game === true || this.props.hiddenBottom ? null : (item.end && item.end === true) ? null : (!!item.chapter_sort && item.chapter_sort !== 0 ? (
            <Text
              style={{fontSize: 11, color: '#949BA5', marginTop: 8}}
            >
              {`已读${item.chapter_sort}章`}
            </Text>
          ) : (
            <View style={{flexDirection: 'row',}}>
              <Text
                style={{fontSize: 11, color: '#949BA5', marginTop: 8}}
              >
                {'未阅读'}
              </Text>
              <View style={styles.dot}/>
            </View>
          ))
        }
      </View>
    )
  }
}



const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#f85836',
    borderRadius: 3,
    marginLeft: 3,
    marginTop: 8,
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: 'blue',
    height: 56,
    // justifyContent: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 24,
    height: 24
  }
})
