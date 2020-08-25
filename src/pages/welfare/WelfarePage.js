import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as hotBeanActions from '../../reducers/hotBeansReducer'
import {Config} from "../../config/Config";
import * as userAction from "../../actions/userAction";
import WebViewPage from '../../component/WebViewPage'




class WelfarePage extends Component {

  constructor() {
    super();
    // this.state = {
    //   shouldReload: false,
    // }
  }

  componentDidMount(): void {
    this.props.navigation.setParams({onPressWelfareTab: this._onPressWelfareTab})
  }

  _onPressWelfareTab = () => {
    // this.setState({
    //   shouldReload: !this.state.shouldReload,
    // })
  }

  render() {
    return (
      <WebViewPage
        navigation={this.props.navigation}
        stopNavigationStateChange={true}
        url={`${Config.url.missionURL()}?token=${this.props.user.token}&custom=${Config.custom}&source=${Config.channel}&timestamp=${Date.now()}`}
      />
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...hotBeanActions,
    ...userAction,
  }, dispatch)
})

export default connect(({user}) => {
  return {
    user,
  }
}, mapDispatchToProps)(WelfarePage)
