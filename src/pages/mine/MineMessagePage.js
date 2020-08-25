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
  SafeAreaView,
  PixelRatio
} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TopTabBar from '../category/TopTabBar'
import images from '../../component/images'
import ListFooter from '../../component/ListFooter'
import * as mineCommentAction from "../../reducers/mineCommentListReducer"
import MineMessageListPage from './MineMessageListPage'
import NotificationMessagePage from './NotificationMessagePage'

const {width, height} = Dimensions.get('window')


class MineMessagePage extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollableTabView
          initialPage={0}
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
              showBackButton={true}
              onPressBack={() => {
                this.props.navigation.goBack()
              }}
            />
          )}
        >
          <MineMessageListPage
            tabLabel="消息"
            navigation={this.props.navigation}
          />
          <NotificationMessagePage
            tabLabel="通知"
            navigation={this.props.navigation}
          />
        </ScrollableTabView>
      </SafeAreaView>
    )
  }
}

MineMessagePage.propTypes = {};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...mineCommentAction,
  }, dispatch)
})

export default connect(({user}) => {
  return {
    user,
  }
}, mapDispatchToProps)(MineMessagePage)