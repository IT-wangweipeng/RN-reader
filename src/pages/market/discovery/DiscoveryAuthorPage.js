import React, {Component} from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  ImageBackground,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as discoverySecondaryAction from '../../../actions/discoverySecondaryAction'
import * as discoveryRecommendAction from '../../../actions/discoveryRecommendAction'
import * as discoveryRecommendChangeAction from '../../../actions/discoveryRecommendChangeAction'
import DiscoveryItem from './DiscoveryItem'
import images from '../../../component/images'

class DiscoveryAuthorPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.navigation.state.params.id,
      recommendData: {},
      categoryId: 0,
    }
  }

  componentDidMount() {
    this.props.actions.discoverySecondaryInit({id: this.state.id})
    this.props.actions.discoveryRecommendInit({id: this.state.id})
  }

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

  _onPressDiscoveryItem = () => {
    // UMCPS(UMConfig.book_detail_refresh_item_clicked, {book_id: this.state.bookId})
    this.props.actions.discoveryRecommendChangeInit({
      id: this.state.categoryId,
      sex: 0
    })
  }

  renderBooks() {
    return (
      <DiscoveryItem
        data={this.state.recommendData}
        navigation={this.props.navigation}
        onPressItem={() => {
          this._onPressDiscoveryItem()
        }}
      />
    )
  }

  renderAuthorInfo() {
    const {author, author_desc, cover, description} = this.props.discoverySecondary.data

    return (
      <View>
        <ImageBackground style={{flexDirection: 'row'}} source={images.image_discovery_author_bg}>
          <Image style={{width: 115, height: 115, borderRadius: 58, marginStart: 38}}
                 defaultSource={images.image_placeholder}
                 source={{uri: cover, cache: 'force-cache'}}
                 resizeMethod="resize"
          />
          <View style={{marginStart: 24, marginEnd: 16, flex: 1}}>
            <Text style={{marginTop: 37, fontSize: 16, color: '#1e252f', fontWeight: 'bold'}}>{author}</Text>
            <Text style={{marginTop: 12, fontSize: 15, color: '#1e252f'}}
                  numberOfLines={2}
                  ellipsizeMode='tail'>{author_desc}</Text>
          </View>
        </ImageBackground>
        <Text style={{marginTop: 28, marginHorizontal: 16, fontSize: 14, color: '#545c67', lineHeight: 24}}
              numberOfLines={5}
              ellipsizeMode='tail'
        >
          {description}
        </Text>

      </View>
    )
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        {this.renderAuthorInfo()}
        {this.renderBooks()}
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
}, mapDispatchToProps)(DiscoveryAuthorPage)
