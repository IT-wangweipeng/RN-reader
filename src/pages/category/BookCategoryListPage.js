/**
 * Created by jy on 2019/4/26 09:51
 *
 * Author: Jingyu
 * Mail: dev.jingyu@gmail.com
 */

import React, {Component} from 'react'
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  PixelRatio,
  DeviceEventEmitter,
  NativeModules,
  Modal,
  FlatList,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import NetInfo from '@react-native-community/netinfo'
import * as categoryAction from '../../actions/categoryAction'
import images from '../../component/images'
import NetworkDisconnectedView from '../../component/NetworkDisconnectedView'


const {width, height} = Dimensions.get('window')
const rowWidth = (width - 42) / 2




class BookCategoryListPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      connected: true,
    }
  }

  componentWillMount() {
    NetInfo.isConnected.fetch().done(connected => {
      this.setState({
        connected
      });
    });
  }

  componentDidMount() {
    // Subscribe
    const subscription = NetInfo.isConnected.addEventListener('connectionChange', (e) => {
      if (e) {
        this.props.actions.categoryInit()
      }
      this.setState({
        connected: e
      })
    })
  }

  componentWillUnmount() {

  }



  render() {
    if (!this.state.connected) {
      return (
        <NetworkDisconnectedView />
      )
    }
    return (
      <FlatList
        style={{flex: 1, paddingHorizontal: 16, backgroundColor: '#fff'}}
        data={this.props.data && this.props.data.list || []}
        numColumns={2}
        extraData={this.state}
        initialNumToRender={10}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        removeClippedSubviews={false}
      />
    )
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={`category_list_${index}`}
        style={{borderWidth: 1/PixelRatio.get(), borderColor: '#dcdcdc', width: rowWidth, height: 100, marginTop: 12, marginLeft: (index !== 0 && index % 2 !== 0) ? 10 : 0, marginBottom: 12, backgroundColor: '#fff'}}
        onPress={() => {
          this.props.onClickItem && this.props.onClickItem(item)
        }}
      >
        <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
          <Text style={styles.bookName}>
            {`${item.name}`}
          </Text>
          <Image
            defaultSource={images.image_placeholder}
            style={{width: 42, height: 58, marginRight: 12, marginTop: 11, borderRadius: 3 }}
            source={{uri: item.image || '', cache: 'force-cache'}}
            resizeMethod="resize"
          />
        </View>
        <Text
          numberOfLines={1}
          style={{fontSize: 11, color: '#606b7a', marginTop: 6, marginLeft: 12}}
        >
          {`${item.tags}`}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  bookName: {
    fontSize: 15,
    color: '#1e252f',
    marginLeft: 12,
    fontWeight: "500",
    alignSelf: 'center',
    marginTop: 24,
  }
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...categoryAction,
  }, dispatch),
})

export default connect(({user, category}) => ({
  user,
  category
}), mapDispatchToProps)(BookCategoryListPage)
