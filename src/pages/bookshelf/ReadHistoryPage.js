import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  NativeModules, DeviceEventEmitter,
  Dimensions,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as bookshelfAction from '../../actions/bookshelfAction'
import {
  queryBooks,
  deleteBooks,
  queryShelfBooks,
  deleteBook,
  insertShelfBook,
  updateBook
} from '../../model/BookModelManager'
import images from '../../component/images'
import moment from "./BookshelfPage";
import {convertToArray} from "../../utils/CommonUtil";
import {showToast} from "../../actions/toastAction";
import {isIOS} from "../../utils/PlatformUtils";
import {Config} from "../../config/Config";

const {width} = Dimensions.get('window')

const PADDING_HORIZONTAL = 16
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 110
const BookReadManager = NativeModules.BookReadManager;


class ReadHistoryPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sex: 1,
      books: queryBooks().sorted('timestamp', true)
    }
  }

  static navigationOptions = ({navigation}) => ({
    headerRight: (
      <TouchableOpacity
        style={{marginRight: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          navigation.state.params.handleAction()
        }}
      >
        <Text>{'清除'}</Text>
      </TouchableOpacity>
    ),
  })

  componentDidMount() {
    this.props.navigation.setParams({handleAction: this._clearDB})

    this.listener = DeviceEventEmitter.addListener('updateReadHistory', () => {
      console.log('yy updateReadHistory()')
      this.setState({
        books: queryBooks().sorted('timestamp', true)
      })
    })
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
    const {callback} = this.props.navigation.state.params
    callback && callback()
  }


  render() {
    return (
      <FlatList
        style={{flex: 1}}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={this._empty}
        removeClippedSubviews
        data={this.state.books || []}
        renderItem={this._renderItem}
        onEndReachedThreshold={0.1}
      />
    )
  }

  _renderItem = ({item, index}) => {
    console.log('gg item=', item)
    let obj = {...item}
    return (
      <TouchableOpacity
        onPress={() => {
          if (isIOS()) {
            BookReadManager.openBookWithInfo(obj, this.props.user, 0, false, -1, Config.iosReviewVersion)
          } else {
            var nativeModule = NativeModules.OpenNativeModule
            nativeModule.openNativeReaderPage(item, item.isCollected, -1, this.props.user.info.sex || 3, this.props.user.token || "",
              this.props.user.info.free_ad_expirets || 0, this.props.user.info.is_vip || 0);
          }
        }}
        onLongPress={() => {
          this.props.navigation.navigate('DeleteReadRecordTips', {
            name: item.name,
            onConfirm: () => {
              deleteBook(item)
              this.setState({
                book: queryBooks().sorted('timestamp', true),
              })
            }
          })
        }}
      >
        <View style={styles.viewWrapper}>
          <Image
            source={{uri: item.cover}}
            style={styles.cover}
          />
          <View style={{flex: 1, marginStart: 16}}>
            <Text style={{fontSize: 16, color: '#191d21', fontWeight: 'bold'}}>
              {item.name}
            </Text>
            <Text style={styles.authorText}>
              {`${item.author}`}
            </Text>

            <View style={{flex: 1,}}/>
            <View
              style={{
                height: 27,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={{
                  fontSize: 15,
                  color: '#F85836',
                  width: 150,
                }}
              >
                {`${item.chapter_title || '暂无阅读章节'}`}
              </Text>

              {/*<TouchableOpacity*/}
              {/*  onPress={() => {*/}
              {/*    if (item.isCollected) {*/}
              {/*      // do nothing*/}
              {/*    } else {*/}
              {/*      //加入书架*/}
              {/*      const shelfRet = {*/}
              {/*        id: item.id,*/}
              {/*        author: item.author,*/}
              {/*        brief: item.brief,*/}
              {/*        cover: item.cover,*/}
              {/*        name: item.name,*/}
              {/*        create_time: item.create_time,*/}
              {/*        chapter_title: item.chapter,*/}
              {/*        chapter_id: item.chapter_id,*/}
              {/*        chapter_sort: item.chapter_sort,*/}
              {/*        timestamp: `${Date.now()}`,*/}
              {/*        icon_status: item.icon_status,*/}
              {/*        complete_status: item.complete_status,*/}
              {/*        start_ad_ts: item.start_ad_ts,*/}
              {/*        end_ad_ts: item.end_ad_ts,*/}
              {/*      }*/}
              {/*      insertShelfBook(shelfRet)*/}
              {/*      this.props.actions.recommendBookInitSuccess({data: convertToArray(queryShelfBooks().sorted('timestamp', true))})*/}
              {/*      // 更新服务器数据*/}
              {/*      if (!!this.props.user.token) {*/}
              {/*        this.props.actions.addBookInit({*/}
              {/*          book_id: item.id,*/}
              {/*          chapter_id: item.chapter_id,*/}
              {/*          chapter_sort: 0,//item.chapter_sort,*/}
              {/*        })*/}
              {/*      }*/}

              {/*      //更新阅读记录*/}
              {/*      const ret = {*/}
              {/*        id: item.id,*/}
              {/*        author: item.author,*/}
              {/*        brief: item.brief,*/}
              {/*        cover: item.cover,*/}
              {/*        name: item.name,*/}
              {/*        create_time: item.create_time,*/}
              {/*        chapter_title: item.chapter_title,*/}
              {/*        chapter_id: item.chapter_id,*/}
              {/*        chapter_sort: item.chapter_sort,*/}
              {/*        timestamp: item.timestamp,*/}
              {/*        icon_status: item.icon_status,*/}
              {/*        complete_status: item.complete_status,*/}
              {/*        start_ad_ts: item.start_ad_ts,*/}
              {/*        end_ad_ts: item.end_ad_ts,*/}
              {/*        isCollected: true,*/}
              {/*      }*/}
              {/*      updateBook(ret)*/}
              {/*      this.setState({*/}
              {/*        books: queryBooks().sorted('timestamp', true),*/}
              {/*      })*/}

              {/*    }*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <View style={{*/}
              {/*    height: 27,*/}
              {/*    borderRadius: 14,*/}
              {/*    backgroundColor: '#fff',*/}
              {/*    paddingHorizontal: 10,*/}
              {/*    borderWidth: 1,*/}
              {/*    borderColor: item.isCollected ? '#DEDFE3': '#999ba1',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'center',*/}
              {/*  }}>*/}
              {/*    <Text style={{fontSize: 12, color: item.isCollected ? '#DBDCE1' : '#999ba1'}}>{item.isCollected ? '已加入书架' : '加入书架'}</Text>*/}
              {/*  </View>*/}
              {/*</TouchableOpacity>*/}
            </View>

          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _clearDB = () => {
    deleteBooks()
    this.setState({
      books: []
    })
  }

  _empty = () => (
    <View style={{
      justifyContent: 'center', alignItems: 'center',
    }}
    >
      <Image
        source={images.image_read_record_nobook}
        style={{marginTop: 128}}
      />
      <Text style={{marginTop: 7, color: '#acacb9', fontSize: 16}}>
        暂无书籍
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: 106,
    marginBottom: 24,
    paddingHorizontal: PADDING_HORIZONTAL
  },
  authorText: {
    fontSize: 11,
    color: '#939aa2',
    marginTop: 12
  },
  cover: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: '#f1f1f6',
    borderRadius: 3,
  }
})


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({...bookshelfAction}, dispatch),
})

export default connect(({user}) => ({
  user,
}), mapDispatchToProps)(ReadHistoryPage)

