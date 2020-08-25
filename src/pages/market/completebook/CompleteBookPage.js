import React, {Component} from 'react'

import ScrollableTabView from 'react-native-scrollable-tab-view'
import {SafeAreaView} from 'react-navigation'
import TopTabBar from '../../category/TopTabBar'
import {sendAction} from '../../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../../utils/Analysis/UMConfig'
import CompleteBookMalePage from './CompleteBookMalePage'
import CompleteBookFemalePage from './CompleteBookFemalePage'
import CompleteBookTushuPage from './CompleteBookTushuPage'

class CompleteBookPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sex: this.props.navigation.state.params.sex,
    }

    this.sex = this.props.navigation.state.params.sex
  }

  render() {
    const {navigation} = this.props
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollableTabView
          initialPage={this.sex === 2 && 1 || 0}
          renderTabBar={() => (
            <TopTabBar
              style={{
                paddingHorizontal: 90,
              }}
              fontSize={17}
              showBackButton={true}
              activeColor={'#F85836'}
              inactiveColor="#939aa2"
              tabUnderlineDefaultWidth={24}
              tabUnderlineScaleX={3}
              onPressSearch={() => {
                this.props.navigation.navigate('Search', {
                  keywords: ''
                })
                sendAction(UMConfig.ACTION_CATEGORY_SEARCH)
              }}
              onPressBack={() => {
                this.props.navigation.goBack()
              }}
            />
          )}
        >
          <CompleteBookMalePage
            tabLabel="男频"
            navigation={navigation}
          />
          <CompleteBookFemalePage
            tabLabel="女频"
            navigation={navigation}/>
          <CompleteBookTushuPage
            tabLabel="图书"
            navigation={navigation}/>
        </ScrollableTabView>
      </SafeAreaView>
    )

  }

}

export default CompleteBookPage
