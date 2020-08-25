import React, {Component} from 'react'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  DeviceEventEmitter,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {SafeAreaView} from 'react-navigation'
import R from 'ramda'
import * as bookshelfAction from '../../actions/bookshelfAction'
import { queryShelfBooks, realm } from '../../model/BookModelManager'
import BookshelfCell from './BookshelfCell'



const {width, height} = Dimensions.get('window')
const ITEM_MARGIN = 26
const ITEM_WIDTH = (width - 32 - ITEM_MARGIN * 2) / 3


class EditBookshelfPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCount: 1,
      data: [],
    }

    this.books = R.addIndex(R.map)((value, index) => {
      if (value.end) {
        return value
      }
      if (index === this.props.navigation.state.params.slectedIndex) {
        const obj = {...value}
        obj.select = true
        return obj
      }
      return value
    }, R.clone(this.props.bookshelf.books))
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.header}>
          <Text style={{fontSize: 16, fontWeight: "500", fontStyle: "normal"}}>
            {`已选择${this.state.selectedCount}本`}
          </Text>
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          >
            <Text style={{fontSize: 14, fontWeight: "500", fontStyle: "normal", color: '#f85836'}}>
              {'取消'}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{flex: 1, paddingHorizontal: 16,}}
          numColumns={3}
          data={this.books || []}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />

        <View style={styles.delete}>
          <TouchableOpacity
            onPress={() => {
              const {bookshelf, navigation} = this.props
              const deleteBooks = R.filter((n) => n.select === true, this.books)
              deleteBooks.map((i, j) => {
                const book = queryShelfBooks().filtered(`id == ${i.id}`)
                if (book) {
                  realm.write(() => {
                    realm.delete(book)
                  })
                }
              })
              DeviceEventEmitter.emit('bookShelfChange')
              const remainBooks = R.filter((n) => n.select !== true, this.books)
              this.props.actions.updateBooks({
                data: remainBooks
              })
              navigation.state.params.callback && navigation.state.params.callback(remainBooks)
              navigation.goBack()
            }}
          >
            <Text style={styles.deleteText}>
              {'移出书架'}
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    )
  }

  _keyExtractor = (item, id) => item.id

  _renderItem = ({item, index}) => {
    if (item.isGame === true) {
      return null
    }
    return (
      <BookshelfCell
        cellStyle={{marginTop: 25}}
        item={item}
        index={index}
        showCheckMark={true}
        hiddenBottom={false}
        onPressCell={() => {
          if (item.end && item.end === true) {
            this.props.navigation.goBack()
            this.props.navigation.navigate('Market')
            return
          } else {
            this.books[index].select = !item.select
            if (this.books[index].select) {
              this.setState({
                selectedCount: this.state.selectedCount + 1,
              })
            } else {
              this.setState({
                selectedCount: this.state.selectedCount - 1,
              })
            }
          }
        }}
      />
    )
  }
}


EditBookshelfPage.propTypes = {}

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#f85836',
    borderRadius: 3,
    marginLeft: 3,
    marginTop: 8,
    alignSelf: 'center',
  },
  header: {
    width: width,
    height: Platform.OS === 'ios' ? 44 : 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  delete: {
    width: width,
    height: 50,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(84, 84, 84, 0.16)",
    shadowOffset: {
      width: 0,
      height: -0.5
    },
    shadowRadius: 0.5,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "500",
    fontStyle: "normal",
    color: '#f85836'
  },
  cancel: {
    width: 44,
    height: 44,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({...bookshelfAction}, dispatch),
})

export default connect(({user, bookshelf}) => ({
  user,
  bookshelf,
}), mapDispatchToProps)(EditBookshelfPage)
