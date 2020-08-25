import React, {Component} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  NativeModules,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import R from 'ramda'
import ProgressHUD from 'react-native-progress-hud'
import * as notificationAction from '../../reducers/notificationReducer'
import IMAGES from '../../component/images'
import ListFooter from "../../component/ListFooter";
import moment from 'moment'
import {showToast} from "../../actions/toastAction";
import {queryShelfBooks} from "../../model/BookModelManager";
import {UMCPS} from "../../utils/Analysis/UMengEvent";
import * as UMConfig from "../../utils/Analysis/UMConfig";
import {isIOS} from "../../utils/PlatformUtils";
import {Config} from "../../config/Config";

const BookReadManager = NativeModules.BookReadManager;


class NotificationMessagePage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isEdit: false,
      refresh: 0,
      data: [],
      hudLoading: false
    }

    this.debounceFlag = true
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    headerRight: (
      (navigation.state.params && navigation.state.params.showEditButton) ? (
        <TouchableOpacity
          style={{marginRight: 16, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            navigation.state.params.selectAllAction()
          }}
        >
          <Text style={{fontSize: 16, fontStyle: "normal", color: '#191D21'}}>
            {navigation.state.params && navigation.state.params.isEdit ? '全选' : '编辑'}
          </Text>

        </TouchableOpacity>
      ) : <View />
    ),
  })

  componentWillMount(): void {
    this.props.actions.notificationInitAction()
  }

  componentDidMount(): void {
    this.props.navigation.setParams({selectAllAction: this._selectAllAction})
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (nextProps.notification.loadSuccess) {
      this.setState({
        data: nextProps.notification.list,
      })
      if (nextProps.notification.list.length > 0) {
        this.props.navigation.setParams({showEditButton: true})
      }
      nextProps.notification.loadSuccess = false
    }

    if (nextProps.notification.deleteSuccess) {
      const remainEvent = x => x.isSelect === false
      const data = R.filter(remainEvent, this.state.data)
      this.setState({
        data,
      })

      nextProps.notification.deleteSuccess = false
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <FlatList
          style={{flex: 1}}
          data={this.state.data || []}
          extraData={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={this._ListEmptyView}
        />
        {
          this.state.isEdit ? (
            <TouchableOpacity
              onPress={() => {
                this._deleteItem()
              }}
            >
              <View style={styles.deleteButton}>
                <Text style={{fontSize: 15, color: '#F85836'}}>
                  {'删除'}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null
        }

        <ProgressHUD
          showHUD={this.props.notification.isLoading || this.state.hudLoading}
          showLoading={this.props.notification.isLoading || this.state.hudLoading}
        />
      </View>
    );
  }

  _renderItem = ({item, index}) => {
    console.log('item ===== ', item)
    return (
      <TouchableOpacity
        onPress={() => {
          this._onPressItem(item, index)
        }}
      >
        <View style={styles.cellWrapper}>
          <Image
            style={{width: 24, height: 24}}
            source={IMAGES.image_edit}
          />
          <View style={{flex: 1, height: 104, marginLeft: 17, borderBottomWidth: 1, borderBottomColor: '#eeeeee'}}>
            <Text style={styles.title}>
              {`${moment.unix(item.ts).format('YYYY年MM月DD日')}`}
            </Text>
            <Text
              style={styles.desc}
              numberOfLines={2}
            >
              {`${item.message}`}
            </Text>
          </View>
          {
            this.state.isEdit ? (
              <Image
                style={{width: 15, height: 15}}
                source={item.isSelect ? IMAGES.image_check_mark_highlight : IMAGES.image_check_mark_default}
              />
            ) : (
              <Image
                style={{width: 15, height: 15}}
                source={IMAGES.image_arrow_right}
              />
            )
          }
        </View>
      </TouchableOpacity>
    )
  }

  _ListEmptyView = () => {
    const {notification} = this.props
    if (!notification.list.isEmpty && notification.list.length == 0) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 200}}>
          <Text style={{color: '#ACACB9', fontSize: 16,}}>
            {'暂无通知'}
          </Text>
        </View>
      )
    }
    return null
  }

  _deleteItem = () => {
    const isEven = n => n.isSelect === true
    const deleteObj = R.filter(isEven, this.state.data)
    if (deleteObj.length === 0) {
      showToast('请选择需要删除的消息')
      return
    }

    const bookIds = R.pluck('id', deleteObj)
    this.props.actions.deleteNotificationInitAction({
      book_ids: bookIds,
    })
  }

  _onPressItem = (item, index) => {
    if (this.state.isEdit) {
      item.isSelect = !item.isSelect
      this.setState({
        refresh: this.state.refresh + 1
      })
    } else {
      // 去读书页面
      if (this.debounceFlag) {
        this.debounceFlag = false
        this._jumpToreadBookPage(item)
      }
    }
  }

  _showHud = () => {
    this.setState({
      hudLoading: true,
    })
  }

  _hiddenHud = () => {
    this.setState({
      hudLoading: false
    })
  }

  _jumpToreadBookPage = (item) => {
    if (isIOS()) {
      let obj = {...item}
      const book = queryShelfBooks().filtered(`id == ${item.id}`)
      if (book.length === 0) {
        obj.isCollected = false
      } else {
        obj.isCollected = true
      }
      this.debounceFlag = true
      BookReadManager.openBookWithInfo(obj, this.props.user, 0, obj.isCollected, -1, Config.iosReviewVersion)
    } else {
      var nativeModule = NativeModules.OpenNativeModule
      let isCollected = false
      // 查询本地数据库，判断当前book是否已加入书架
      const book = queryShelfBooks().filtered(`id == ${item.id}`)
      if (book.length === 0) {
        isCollected = false
      } else {
        isCollected = true
      }
      const { user } = this.props;
      nativeModule.openNativeReaderPage(item, isCollected, -1, user.info.sex || 3, user.token || "",
        user.info.free_ad_expirets || 0, user.info.is_vip || 0);
      this.debounceFlag = true
    }
    UMCPS(UMConfig.ACTION_DETAIL_RECOMMEND, {book_id: item.id || ''})
  }

  _keyExtractor = (item, index) => item.id

  _selectAllAction = () => {
    if (this.state.isEdit) {
      console.log('全选')
      let data = []
      R.addIndex(R.map)((value, index) => {
        let obj = {}
        obj = {...value}
        obj.isSelect = true
        data = R.append(obj, data)
      }, this.props.notification.list)
      console.log('messages ===== ', data)
      this.setState({
        data
      })

      return
    }


    console.log('编辑')
    this.setState({
      isEdit: !this.state.isEdit
    }, () => {
      this.props.navigation.setParams({
        isEdit: this.state.isEdit
      })
    })
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    color: '#545454',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#EEEEEE',
  },
  title: {
    color: '#A1ABB7',
    fontSize: 12,
    marginTop: 22,
  },
  desc: {
    color: '#545C67',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 24,
  },
  cellWrapper: {
    height: 105,
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...notificationAction
  }, dispatch)
})

export default connect(({user, notification}) => {
  return {
    user,
    notification
  }
}, mapDispatchToProps)(NotificationMessagePage)
