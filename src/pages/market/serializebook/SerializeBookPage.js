import React, {Component} from 'react'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {SafeAreaView} from 'react-navigation'
import TopTabBar from '../../category/TopTabBar'
import {sendAction} from '../../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../../utils/Analysis/UMConfig'
import SerializeBookMalePage from "./SerializeBookMalePage"
import SerializeBookFemalePage from "./SerializeBookFemalePage"
import SerializeBookTushuPage from "./SerializeBookTushuPage"

class SerializeBookPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sex: this.props.navigation.state.params.sex,
    }
  }

  render() {
    const {navigation} = this.props
    let index = 0
    if (this.state.sex == 1) {//男频
      index = 0
    } else if (this.state.sex == 2) {//女频
      index = 1
    } else if(this.state.sex == 3) {//精选
      index = 0
    } else if(this.state.sex == 4) {//图书
      index = 2
    }

    console.log('yy rankPage index=', index)

    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollableTabView
          initialPage={index}
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
          <SerializeBookMalePage
            tabLabel="男频"
            navigation={navigation}
          />
          <SerializeBookFemalePage
            tabLabel="女频"
            navigation={navigation}/>
          <SerializeBookTushuPage
            tabLabel="图书"
            navigation={navigation}/>
        </ScrollableTabView>
      </SafeAreaView>
    )
  }

}

export default SerializeBookPage
