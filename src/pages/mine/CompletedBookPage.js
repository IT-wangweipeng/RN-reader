import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  NativeModules, DeviceEventEmitter,
  Dimensions, RefreshControl,
} from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as completedBookAction from '../../reducers/completedBookReducer'
import images from '../../component/images'


const {width} = Dimensions.get('window')

const PADDING_HORIZONTAL = 16
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 110


class CompletedBookPage extends Component {

  constructor(props) {
    super(props)

  }

  componentWillMount(): void {
    this.props.actions.completedBookInitAction()
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _onRefresh = () => {
    this.props.actions.completedBookInitAction()
  }


  render() {
    return (
      <FlatList
        style={{flex: 1}}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={this._empty}
        removeClippedSubviews
        data={this.props.completedBook.data || []}
        renderItem={this._renderItem}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={this.props.completedBook.isLoading}
            onRefresh={this._onRefresh}
            color="#ccc"
          />}
      />
    )
  }

  _onPressItem = (item) => {
    console.log('i -=--------- ', item)
    this.props.navigation.navigate('Detail', {bookId: item.id})
  }

  _renderItem = ({item, index}) => {
    console.log('gg item=', item)
    return (
      <TouchableOpacity
        onPress={() => {
          this._onPressItem(item)
        }}
      >
        <View style={styles.viewWrapper}>
          <Image
            source={{uri: item.cover}}
            style={styles.cover}
          />
          <View style={{flex: 1, marginStart: 16}}>
            <Text style={{fontSize: 16, color: '#191d21', fontWeight: 'bold'}}>
              {item.name}
            </Text>
            <Text style={styles.authorText}>
              {`${item.author}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _empty = () => (
    <View style={{
      justifyContent: 'center', alignItems: 'center',
    }}
    >
      <Image
        source={images.image_read_record_nobook}
        style={{marginTop: 128}}
      />
      <Text style={{marginTop: 7, color: '#acacb9', fontSize: 16}}>
        暂无书籍
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: 106,
    marginBottom: 24,
    paddingHorizontal: PADDING_HORIZONTAL
  },
  authorText: {
    fontSize: 11,
    color: '#939aa2',
    marginTop: 12
  },
  cover: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: '#f1f1f6',
    borderRadius: 3,
  }
})


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...completedBookAction
  }, dispatch),
})

export default connect(({user, completedBook}) => ({
  user,
  completedBook
}), mapDispatchToProps)(CompletedBookPage)

