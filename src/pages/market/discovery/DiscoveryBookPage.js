import React, {Component} from 'react'
import {
  ScrollView,
  Image,
  Dimensions,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as discoverySecondaryAction from '../../../actions/discoverySecondaryAction'
import * as discoveryRecommendAction from '../../../actions/discoveryRecommendAction'
import * as discoveryRecommendChangeAction from '../../../actions/discoveryRecommendChangeAction'
import DiscoveryItem from './DiscoveryItem'
import images from '../../../component/images'

const {width, height} = Dimensions.get('window')
const ITEM_MARGIN_HORRIZONTAL = 16

const IMAGE_WIDTH = width - ITEM_MARGIN_HORRIZONTAL * 2
const IMAGE_HEIGHT = 110

class DiscoveryBookPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.navigation.state.params.id,
      recommendData: {},
      categoryId: 0,
    }
  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title
  })


  componentWillReceiveProps(nextProp) {
    if (nextProp.discoveryRecommend && nextProp.discoveryRecommend.isSuccess) {
      this.setState({
        recommendData: nextProp.discoveryRecommend.data,
        categoryId: nextProp.discoveryRecommend.data.districts_id,
      })
      nextProp.discoveryRecommend.isSuccess = false
    }

    if (nextProp.discoveryRecommendChange && nextProp.discoveryRecommendChange.isSuccess) {
      let data = nextProp.discoveryRecommendChange.data
      data.title = nextProp.discoveryRecommend.data.title
      data.right = nextProp.discoveryRecommend.data.right
      this.setState({
        recommendData: data,
      })
      nextProp.discoveryRecommendChange.isSuccess = false
    }

  }

  componentDidMount() {
    this.props.actions.discoverySecondaryInit({id: this.state.id})
    this.props.actions.discoveryRecommendInit({id: this.state.id})
  }

  componentWillUnmount() {
    this.props.discoverySecondary.data = {}
  }

  _onPressDiscoveryItem = () => {
    // UMCPS(UMConfig.book_detail_refresh_item_clicked, {book_id: this.state.bookId})
    this.props.actions.discoveryRecommendChangeInit({
      id: this.state.categoryId,
      sex: 0
    })
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <Image style={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 8, marginHorizontal: 16, marginTop: 8}}
               defaultSource={images.image_discovery_banner_placeholder}
               source={{uri: this.props.discoverySecondary.data.image, cache: 'force-cache'}}
               resizeMethod="resize"
        />
        <DiscoveryItem
          data={this.state.recommendData}
          navigation={this.props.navigation}
          onPressItem={() => {
            this._onPressDiscoveryItem()
          }}
        />
      </ScrollView>
    )
  }

}


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...discoverySecondaryAction, ...discoveryRecommendAction, ...discoveryRecommendChangeAction}, dispatch)
})

export default connect(({discoverySecondary, discoveryRecommend, discoveryRecommendChange}) => {
  return {
    discoverySecondary,
    discoveryRecommend,
    discoveryRecommendChange,
  }
}, mapDispatchToProps)(DiscoveryBookPage)
