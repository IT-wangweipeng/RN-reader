import React, { Component} from 'react'
import {
  Text,
  View,
  StyleSheet
} from 'react-native'

export default class ListFooter extends Component {
  render () {
    const {hasMore} = this.props
    const text = hasMore ? '正在加载...' : '────  已经拉到底啦  ────'
    return (
      <View style={[{justifyContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#fff'}, this.props.footerStyle]}>
        <Text
          style={styles.textStyle}
          numberOfLines={1}
        >
          {`${text}`}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    color: '#d1d1d9',
    fontSize: 15
  }
})
