import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  FlatList,
  Dimensions
} from 'react-native'

const {width, height} = Dimensions.get('window')
const MARGIN_LEFT = 16
const ITEM_WIDTH = (width - MARGIN_LEFT * 3)/2

class TwoColumnCell extends Component {

  render () {
    return (
      <FlatList
        data={this.props.data}
        numColumns={2}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderListFooter()}
      />
    )
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onPressItem && this.props.onPressItem(item)
        }}
      >
        <View style={[styles.viewWrapper, { marginLeft: MARGIN_LEFT  }]}>
          <Image
            style={styles.cover}
            source={{uri: `${item.cover || ''}`}}
          />
          <View style={{marginLeft: 14, flex: 1,}}>
            <Text
              numberOfLines={2}
              style={styles.bookName}
            >
              {`${item.name}`}
            </Text>
            <Text style={styles.author}>
              {`${item.author}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderListFooter = () => {
    return (
      <View style={{flex: 1, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'yellow'}}>
        <Text>{'广告位招租'}</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  viewWrapper: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
    width: ITEM_WIDTH,
  },
  cover: {
    width: 50,
    height: 70,
    backgroundColor: '#f1f1f6',
  },
  bookName: {
    fontSize: 14,
    fontWeight: "bold",
    color: '#1e252f',
  },
  author: {
    fontSize: 12.5,
    fontWeight: "500",
    color: '#939aa2',
    marginTop: 12
  }
})

TwoColumnCell.propTypes = {}

export default TwoColumnCell