import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  FlatList,
  SectionList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  DeviceEventEmitter,
  NativeModules,
  Platform,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {SafeAreaView} from 'react-navigation'
import R from 'ramda'
import * as submitPreference from '../../actions/submitPreferenceAction'
import * as categoryAction from '../../actions/categoryAction'
import { showToast } from '../../actions/toastAction'
import IMAGES from '../../component/images'
import ProgressHUD from 'react-native-progress-hud'
import {Config} from "../../config/Config"


const {width, height} = Dimensions.get('window')


class CategoryPreferencePage extends Component {

  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <TouchableOpacity
        style={{marginLeft: 16}}
        onPress={() => {
          navigation.goBack()
        }}
      >
        <Image
          source={IMAGES.left_arrow}
        />
      </TouchableOpacity>
    ),
    headerRight: !!navigation.state.params.isHiddenJumpButton ? null : (
      <TouchableOpacity
        style={{marginRight: 16}}
        onPress={() => {
          navigation.state.params.pressRight()
        }}
      >
        <Text style={{fontSize: 15, color: '#999ba1', fontWeight: "500"}}>
          {'跳过'}
        </Text>
      </TouchableOpacity>
    ),
  })

  constructor (props) {
    super(props)

    this.state = {
      maleList: [],
      femaleList: [],
      bookList: [],
      selectedCount: 0
    }
  }

  componentWillMount() {
    this.props.actions.readPreferenceInit({
      token: this.props.user.token
    })
  }

  _pressRight = () => {
    this.props.navigation.popToTop()
    this.resumeNativeReadPage()
  }

  resumeNativeReadPage() {
    const { navigation } = this.props
    if (navigation.state.params && navigation.state.params.jumpFlag === 1) {
      DeviceEventEmitter.emit('resumeToReadPage')
    } else if(navigation.state.params && navigation.state.params.jumpFlag === 2) {
      navigation.navigate('Web', {
        url: Config.vip.url(),
        fromReadBookPage: true
      })
    } else if(navigation.state.params && navigation.state.params.jumpFlag === 3) {
      navigation.navigate('PublishingPost', {
        bookId: this.bookIdFromReadPage,
        fromReadBookPage: true,
      })
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({pressRight: this._pressRight})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.preference.updateSuccess) {
      if (this.props.navigation.state.params.page === 'SETTING_PAGE') {
        this.props.navigation.goBack()
      } else {
        this.props.navigation.popToTop()
      }
      this.resumeNativeReadPage()
      // send msg to bookMarketQualityPage update userpreference
      DeviceEventEmitter.emit('updateUserPreference')
      nextProps.preference.updateSuccess = false

    } else {
      if (this.props.category.userPreferences !== nextProps.category.userPreferences) {
        this.setState({
          selectedCount: nextProps.category.userPreferences.length
        })
      }
    }
  }

  render() {
    const {preference} = this.props
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
        <SectionList
          style={{flex: 1, paddingHorizontal: 20}}
          sections={[
            { title: '男生频道', data: [1]},
            { title: '女生频道', data: [2]},
            { title: '图书频道', data: [3]},
          ]}
          renderItem={this.renderSectionListItem}
          renderSectionHeader={this._renderSectionHeader}
          stickySectionHeadersEnabled={false}
        />
        <TouchableOpacity
          onPress={() => {
            this._submitTags()
          }}
        >
          <View style={styles.button}>
            <Text style={styles.buttonTitle}>
              {`确认（${this.state.selectedCount}/5）`}
            </Text>
          </View>
        </TouchableOpacity>
        <ProgressHUD
          showHUD={preference.isLoading}
          showLoading={preference.isLoading}
        />
      </SafeAreaView>
    )
  }

  _submitTags = () => {
    const {category} = this.props
    const isEven = x => x.select == true
    const femaleList = R.filter(isEven, category.femaleCategory.list);
    const maleList = R.filter(isEven, category.maleCategory.list);
    const bookList = R.filter(isEven, category.bookCategory.list);

    const ret = femaleList.concat(maleList).concat(bookList)

    const category_ids = R.pluck('id')(ret)
    this.props.actions.submitPreferenceInitAction({
      category_ids,
    })
  }

  renderSectionListItem = ({item}) => {
    const {category} = this.props
    if (item === 1) {
      return (
        <FlatList
          style={{backgroundColor: '#fff'}}
          numColumns={3}
          data={category.maleCategory.list || []}
          extraData={this.state.maleList}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderMaleFlatListItem}
        />
      )
    } else if (item === 2) {
      return (
        <FlatList
          style={{backgroundColor: '#fff'}}
          numColumns={3}
          data={category.femaleCategory.list}
          extraData={this.state.femaleList}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderFemaleFlatListItem}
        />
      )
    }
    return (
      <FlatList
        style={{backgroundColor: '#fff'}}
        numColumns={3}
        data={category.bookCategory.list}
        extraData={this.state.bookList}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderBookFlatListItem}
      />
    )
  }

  _renderBookFlatListItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.state.selectedCount === 5 && !item.select) {
            showToast('最多只能选择5个标签')
            return
          }
          const {category} = this.props
          category.bookCategory.list[index].select = !item.select
          if (category.bookCategory.list[index].select) {
            this.setState({
              selectedCount: this.state.selectedCount + 1
            })
          } else {
            this.setState({
              selectedCount: this.state.selectedCount - 1
            })
          }
          this.setState({
            bookList: category.bookCategory.list,
          })
        }}
      >
        <View style={[styles.cellWrapper, { backgroundColor: item.select ? '#fff' : '#f1f1f6', borderWidth: 0.5, borderColor: item.select ? '#f85836' : '#f1f1f6', marginLeft: index % 3 === 0 ? 0 : 16}]}>
          <Text style={[styles.name, {color: item.select ? '#f85836' : '#191d21'}]}>
            {`${item.name || ''}`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => item.id

  _renderMaleFlatListItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.state.selectedCount === 5 && !item.select) {
            showToast('最多只能选择5个标签')
            return
          }
          const {category} = this.props
          category.maleCategory.list[index].select = !item.select
          if (category.maleCategory.list[index].select) {
            this.setState({
              selectedCount: this.state.selectedCount + 1
            })
          } else {
            this.setState({
              selectedCount: this.state.selectedCount - 1
            })
          }

          this.setState({
            maleList: category.maleCategory.list,
          })
        }}
      >
        <View style={[styles.cellWrapper, { backgroundColor: item.select ? '#fff' : '#f1f1f6', borderWidth: 0.5, borderColor: item.select ? '#f85836' : '#f1f1f6', marginLeft: index % 3 === 0 ? 0 : 16}]}>
          <Text style={[styles.name, {color: item.select ? '#f85836' : '#191d21'}]}>
            {`${item.name || ''}`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderFemaleFlatListItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.state.selectedCount === 5 && !item.select) {
            showToast('最多只能选择5个标签')
            return
          }
          const {category} = this.props
          category.femaleCategory.list[index].select = !item.select
          if (category.femaleCategory.list[index].select) {
            this.setState({
              selectedCount: this.state.selectedCount + 1
            })
          } else {
            this.setState({
              selectedCount: this.state.selectedCount - 1
            })
          }
          this.setState({
            femaleList: category.femaleCategory.list,
          })
        }}
      >
        <View style={[styles.cellWrapper, { backgroundColor: item.select ? '#fff' : '#f1f1f6', borderWidth: 0.5, borderColor: item.select ? '#f85836' : '#f1f1f6', marginLeft: index % 3 === 0 ? 0 : 16}]}>
          <Text style={[styles.name, {color: item.select ? '#f85836' : '#191d21'}]}>
            {`${item.name || ''}`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderSectionHeader = ({ section: {title} }) => {
    return (
      <Text style={styles.header}>
        {`${title}`}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  cellWrapper: {
    backgroundColor: '#f1f1f6',
    height: 38,
    justifyContent: 'center',
    marginBottom: 20,
    width: (width - 40-16*2)/3,
    borderRadius: 5,
  },
  name: {
    fontSize: 15,
    fontStyle: "normal",
    textAlign: "center",
    color: "#191d21"
  },
  header: {
    paddingVertical: 20,
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "left",
    color: "#191d21"
  },
  button: {
    marginHorizontal: 38,
    marginVertical: 15,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#f85836',
    justifyContent: 'center'
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    textAlign: "center",
    color: "#ffffff"
  }
})

CategoryPreferencePage.propTypes = {}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...submitPreference, ...categoryAction}, dispatch)
})

export default connect(({category, user, preference}) => {
  return {
    category,
    user,
    preference
  }
}, mapDispatchToProps)(CategoryPreferencePage)
