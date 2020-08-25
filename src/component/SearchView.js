import React, {Component} from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import images from "./images"

class SearchView extends Component {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', marginHorizontal: 16, alignItems: 'center'}}>
        <Text style={{
          marginEnd: 18,
          fontSize: 20,
          color:'#1e252f'
        }}>
          书城
        </Text>
        <TouchableOpacity
          style={styles.wrapper}
          onPress={() => {
            this.props.onPressSearch && this.props.onPressSearch()
          }}
        >
          <Image
            style={styles.image}
            source={images.search}
          />
          <Text
            style={styles.text}
          >
            {this.props.searchTitle}
          </Text>
        </TouchableOpacity>
      </View>

    )
  }
}

SearchView.propTypes = {}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: 30,
    backgroundColor: '#f1f1f6',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 20,
    height: 20,
    marginLeft: 16,
    marginRight: 13,
  },
  text: {
    color: '#acacb9',
    fontSize: 14,
  }
})

export default SearchView
