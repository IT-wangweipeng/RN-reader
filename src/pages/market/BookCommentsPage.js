import React, {Component} from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  PixelRatio,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Flatlist,
  StyleSheet, ImageBackground, DeviceEventEmitter
} from 'react-native'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Header, SafeAreaView} from "react-navigation";
import * as bookCommentAction from '../../reducers/bookCommentReducer'
import TopTabBar from '../category/TopTabBar'
import images from '../../component/images'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {isIphoneX} from "../../utils/DeviceUtils";
import BackComponent from "../../component/BackComponent";
import * as EmmiterKey from "../../utils/EventEmmiterKey";
import HotCommentListPage from './HotCommentListPage'
import NewCommentListPage from './NewCommentListPage'


const {width, height} = Dimensions.get('window')
const HEADER_HEIGHT = isIphoneX() ? Header.HEIGHT + 34 : Header.HEIGHT



class BookCommentsPage extends Component {

  constructor(props) {
    super(props)
    this.bookId = this.props.navigation.state.params.bookId
    this.types = 2
    this.state = {
      initialPage: this.props.navigation.state.params.page || 0
    }
  }

  componentDidMount(): void {
    this.updateCommentListListener = DeviceEventEmitter.addListener(EmmiterKey.PUBLISH_COMMENT_SUCCESS, (e) => {
      this._scrollTabRef.goToPage(1)
      this.props.actions.bookCommentInitAction({
        book_id: this.bookId,
        types: 1,
        start: 0,
        size: 10,
      })
    })
  }

  componentWillUnmount() {
    this.updateCommentListListener.remove()
    const {fromReadBookPage, readBookPageCallback} = this.props.navigation.state.params
    if (fromReadBookPage) {
      readBookPageCallback && readBookPageCallback()
    }
  }


  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        {this._renderList()}
        {/*发表想法*/}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this._onPressButton()
          }}
        >
          <Text style={{fontSize: 16, color: '#fff'}}>
            {'发表想法'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  _renderList = () => {
    return (
      <ScrollableTabView
        ref={(scrollTabRef) => {this._scrollTabRef = scrollTabRef}}
        initialPage={this.state.initialPage}
        renderTabBar={() => (
          <TopTabBar
            style={{
              paddingHorizontal: 90,
            }}
            tabStyle={{
              borderColor: '#ff00ff00',
              borderWidth: 0,
            }}
            fontSize={17}
            activeColor={'#F85836'}
            inactiveColor="#939aa2"
            tabUnderlineDefaultWidth={24}
            tabUnderlineScaleX={3}
            showBackButton={true}
            onPressBack={() => {
              this.props.navigation.goBack()
            }}
          />
        )}
      >
        <HotCommentListPage
          cellKey='hot_comment_'
          navigation={this.props.navigation}
          bookId={this.bookId}
          types={2}
          tabLabel="最热"
        />
        <NewCommentListPage
          cellKey='new_comment_'
          navigation={this.props.navigation}
          bookId={this.bookId}
          types={1}
          tabLabel="最新"
        />
      </ScrollableTabView>
    )
  }


  _onPressButton = () => {
    const {user, navigation} = this.props
    if (!!user.token) {
      navigation.navigate('PublishingPost', {
        bookId: this.bookId,
      })
      return
    }
    navigation.navigate('Login')
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 125,
    height: 44,
    bottom: 22,
    borderRadius: 22,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#F85836'
  }
})


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...bookCommentAction,
  }, dispatch),
})

export default connect(({user, bookComment, bookDetail}) => ({
  user,
  bookComment,
  bookDetail
}), mapDispatchToProps)(BookCommentsPage)
