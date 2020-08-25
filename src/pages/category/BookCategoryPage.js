import React, {Component} from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  Platform,
  SafeAreaView, DeviceEventEmitter
} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import * as categoryAction from '../../actions/categoryAction'
import BookCategoryList from './BookCategoryListPage'
import TopTabBar from './TopTabBar'
import {sendAction, UMCPS} from '../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../utils/Analysis/UMConfig'
import {getItem} from "../../utils/AsyncStorageManager";
import {KEY_TOKEN} from "../../utils/AsyncStorageKey";
import {FloatWindowApi, launcherAlertWindowApi} from "../../apis/Api";
import {showToast} from "../../actions/toastAction";
import Toast from "react-native-root-toast";
import FloatView from '../../component/FloatVeiw'


const {width, height} = Dimensions.get('window')
const CONST_FLOAT_VIEW_POSITION = 3

class CategoryPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      whichType: 2, // 1: 男生，2：女生
    }
  }

  componentWillMount() {
    this.props.actions.categoryInit()
  }

  getFloatWindow() {
    // 小浮窗
    getItem(KEY_TOKEN).then((token) => {
      FloatWindowApi(this.props.user.info.sex || 3, CONST_FLOAT_VIEW_POSITION, token)
        .then((ret) => {
          console.log('FloatWindow api result:  ', ret)
          if (ret.status === 200) {
            if (JSON.stringify(ret.data) == '{}' || ret.data === undefined) {
              // do nothing
            } else {
              this.setState({
                data: ret.data,
              }, () => {
                this.floatViewRef.showFloatView()
              })
            }

          } else {
            showToast(ret.message)
          }
        })
        .catch((error) => {
          console.log('FloatWindow api error: ', error)
          if (error.message) {
            showToast(error.message)
          }
        })
    })
  }

  getLaunchAlertWindow() {
    //启动页弹窗
    getItem(KEY_TOKEN).then((token) => {
      console.log('yy launcherAlertWindowApi token=',token)
      launcherAlertWindowApi(token)
        .then((ret) => {
          console.log('yy launcherAlertWindowApi result:  ', ret)
          if (ret.status === 200) {
            if(ret.data.length > 0) {
              switch(ret.data[0].type) {
                case 1://书籍id
                case 2://url链接
                case 4://发现二级页面
                case 5://登录
                  this.props.navigation.navigate('LauncherAlert',{
                    data: ret.data[0],
                    fromFloatView: CONST_FLOAT_VIEW_POSITION,
                  })
                  break;
                default:
                  break;
              }
            }

          }
        })
        .catch((error) => {
          console.log('launcherAlertWindowApi error: ', error)
          if (error.message) {
            showToast(error.message)
          }
        })
    })
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('showFloatView', (e) => {
      if(e.fromFloatView === CONST_FLOAT_VIEW_POSITION) {
        this.getFloatWindow()
      }
    })
    this.getFloatWindow()
    this.props.navigation.setParams({onPressCategoryTab: this._onPressCategoryTab})
  }

  _onPressCategoryTab = () => {
    const {user} = this.props
    const page = user.info.sex === 2 ? 1 : 0
    this._scrollTabRef.goToPage(page)
  }


  render() {
    const {category} = this.props
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollableTabView
          initialPage={this.props.user.info.sex === 2 ? 1 : 0}
          ref={(scrollTabRef) => {this._scrollTabRef = scrollTabRef}}
          renderTabBar={() => (
            <TopTabBar
              style={{
                paddingHorizontal: 90,
              }}
              fontSize={17}
              activeColor={'#F85836'}
              inactiveColor="#939aa2"
              tabUnderlineDefaultWidth={24}
              tabUnderlineScaleX={3}
              showSearchButton={true}
              onPressSearch={() => {
                this.props.navigation.navigate('Search', {
                  keywords: ''
                })
                sendAction(UMConfig.ACTION_CATEGORY_SEARCH)
              }}
            />
          )}
        >
          <BookCategoryList
            tabLabel="男频"
            data={category.maleChannel}
            isLoading={category.isLoading}
            onClickItem={(item) => {
              this._navigateToCategoryDetail(item, 1)
            }}
          />
          <BookCategoryList
            tabLabel="女频"
            data={category.femaleChannel}
            isLoading={category.isLoading}
            onClickItem={(item) => {
              this._navigateToCategoryDetail(item, 2)
            }}
          />
          <BookCategoryList
            tabLabel="图书"
            data={category.bookChannel}
            isLoading={category.isLoading}
            onClickItem={(item) => {
              this._navigateToCategoryDetail(item, 3)
            }}
          />
        </ScrollableTabView>
        <FloatView
          ref={(n) => {
            this.floatViewRef = n
          }}
          position={CONST_FLOAT_VIEW_POSITION}
          data={this.state.data}
          navigation={this.props.navigation}
          onPress={()=>{
            switch(this.state.data.type) {
              case 1:// bookid
                this.props.navigation.navigate('Detail', {bookId: this.state.data.url})
                break;
              case 2:// url
                this.props.navigation.navigate('Web',{
                  url: this.state.data.url,
                })
                break;
              case 7://调用启动弹窗
                this.floatViewRef.hideFloatView()
                this.getLaunchAlertWindow()
                break;
              case 8://趣读跳转
                this.props.navigation.navigate('Qudu')
                break;
            }
            UMCPS(UMConfig.market_floatview_clicked, {position: CONST_FLOAT_VIEW_POSITION})
          }}
        />
      </SafeAreaView>
    )
  }

  _navigateToCategoryDetail = (item, sex) => {
    this.props.navigation.navigate('CategoryDetail', {
      title: item.name,
      id: item.id,
      sex,
    })
    UMCPS(UMConfig.ACTION_CATEGORY, {sex})
  }
}

CategoryPage.propTypes = {}

const styles = StyleSheet.create({
  button: {
    width: 85,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  select: {
    fontSize: 16,
    color: '#f85836'
  },
  deselect: {
    fontSize: 14,
    color: '#545c67'
  },
  bookName: {
    fontSize: 15,
    color: '#1e252f',
    marginLeft: 12,
    fontWeight: "500",
    alignSelf: 'center'
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...categoryAction}, dispatch)
})

export default connect(({category, user}) => {
  return {
    category,
    user,
  }
}, mapDispatchToProps)(CategoryPage)
