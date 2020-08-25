import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native'

import images from '../component/images'


class BookCell extends PureComponent {

  render () {
    const {data} = this.props
    return (
      <TouchableOpacity
        key={`cell_${this.props.cellKey}`}
        onPress={() => {
          this.props.onPressCell && this.props.onPressCell()
        }}
      >
        <View style={{flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, marginTop: 12}}>
          <Image
            defaultSource={images.image_placeholder}
            style={{width: 75, height: 106, borderRadius: 3}}
            source={{uri: `${data.cover || ''}`, cache: 'force-cache'}}
          />
          <View style={{flex: 1, marginLeft: 16,}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.bookName}>
                {`${data.name || ''}`}
              </Text>
              <Text style={{fontSize: 16, fontWeight: "bold", color: '#f85836'}}>
                {`${data.score || ''}分`}
              </Text>
            </View>

            <Text
              style={styles.bookBrief}
              numberOfLines={2}
            >
              {data.brief}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,}}>
              <Text style={styles.author}>
                {data.author}
              </Text>
              <View style={{backgroundColor: '#f1f1f6', borderRadius: 8, borderWidth: 1, borderColor: '#f1f1f6'}}>
                <Text style={[styles.author, {marginHorizontal: 6}]}>
                  {`${data.category_name || ''}`}
                </Text>
              </View>
            </View>

          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  bookName: {
    color: '#1e252f',
    fontSize: 16,
    fontWeight: "bold",
  },
  bookBrief: {
    color: '#939aa2',
    fontSize: 14,
    marginTop: 12,
    lineHeight: 25,
  },
  author: {
    color: '#939aa2',
    fontSize: 11,
    // marginTop: 26,
    // paddingTop: 26,
  }
})

BookCell.propTypes = {}

export default BookCell
