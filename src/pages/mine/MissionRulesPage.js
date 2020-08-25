import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  ScrollView, View
} from 'react-native'

class MissionRulesPage extends Component {
  render () {
    return (
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={{marginHorizontal: 16}}>
          <Text style={{ fontSize: 14, marginTop: 10, fontWeight: "500", fontStyle: "normal", color: "#545c67", lineHeight: 25}}>
            {'1. 做任务前需先登录。\n' +
            '2. 签到采用连续签到，如果其中一天没签，则从第一天重新开始\n' +
            '3. 任务每天凌晨5点重新开始。\n' +
            '4. 热豆是热料小说APP的虚拟货币，通过完成每天登录、签到、阅读等任务完成后可以获得。热豆可以兑换免广告特权。\n' +
            '5. 如遇到网络延迟等状况，会导致完成任务后热豆延迟发放 ，请耐心等待'}
          </Text>
        </View>
      </ScrollView>
    )
  }
}

MissionRulesPage.propTypes = {}

export default MissionRulesPage
