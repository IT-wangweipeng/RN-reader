import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native'

const {width, height} = Dimensions.get('window')

const MARGIN_LEFT = 16
const ITEM_WIDTH = (width - MARGIN_LEFT * 5)/4

class FourColumnCell extends Component {
  render () {
    return (
      <FlatList
        data={this.props.data}
        numColumns={4}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        // ListFooterComponent={this._renderFlatListFooter()}
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
            style={{width: 76, height: 106, backgroundColor: '#f1f1f6'}}
            source={{uri: item.cover, cache: 'force-cache'}}
          />
          <Text
            style={styles.name}
            numberOfLines={2}
          >
            {`${item.name}`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12,
    color: '#1e252f'
  },
  viewWrapper: {
    marginTop: 12,
    marginBottom: 12,
    width: ITEM_WIDTH,
  },
})

FourColumnCell.propTypes = {}

export default FourColumnCell
