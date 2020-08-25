import React, {Component} from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as discoveryAction from '../../../actions/discoveryAction'
import images from '../../../component/images'

const {width, height} = Dimensions.get('window')
const ITEM_MARGIN_HORRIZONTAL = 16

const IMAGE_WIDTH = width - ITEM_MARGIN_HORRIZONTAL * 2
const IMAGE_HEIGHT = 110

class DiscoveryPage extends Component {


  componentDidMount() {
    this.props.actions.discoveryInit()
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={() => {
          console.log('yy DiscoveryPage item click item.type=', item.type)
          if (item.type == 1) {//书籍
            this.props.navigation.navigate('DiscoveryBook', {
              title: item.title,
              id: item.id
            })
          } else if (item.type == 2) {//作者
            this.props.navigation.navigate('DiscoveryAuthor', {
              id: item.id
            })
          }
        }}>
        <Text style={{fontSize: 16, color: '#1e252f'}}>{item.title}</Text>
        <Image style={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, marginTop: 14, borderRadius: 8,}}
               defaultSource={images.image_discovery_banner_placeholder}
               source={{uri: item.image, cache: 'force-cache'}}
               resizeMethod="resize"
        />
      </TouchableOpacity>
    )
  }

  render() {
    console.log('yy render data=', this.props.discovery.data)
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        style={{flex: 1, paddingHorizontal: 16, backgroundColor: '#fff', paddingTop: 5}}
        data={this.props.discovery.data || []}
        renderItem={this._renderItem}
      />
    )
  }

}


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...discoveryAction}, dispatch)
})

export default connect(({discovery, user}) => {
  return {
    discovery,
    user,
  }
}, mapDispatchToProps)(DiscoveryPage)
