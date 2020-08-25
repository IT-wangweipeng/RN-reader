import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ProgressHUD from 'react-native-progress-hud'
import {
  SectionList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native'
import * as categoryDetailAction from '../../actions/categoryDetailAction'
import BookCell from '../../component/BookCell'
import EmptyView from '../../component/EmptyView'
import FourColumnCell from '../../component/FourColumnCell'
import TwoColumnCell from '../../component/TwoColumnCell'


class CategoryDetailPage extends Component {
  constructor (props) {
    super(props)
  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title
  })

  componentWillMount () {
    const {navigation} = this.props
    this.props.actions.categoryDetailInit({
      sex: navigation.state.params.sex,
      id: navigation.state.params.id,
    })
  }

  componentDidMount () {

  }

  render () {
    const {categoryDetail} = this.props
    return (
      <View style={{flex: 1}}>
        <SectionList
          style={{flex: 1}}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={(section) => this._renderSectionHeader(section)}
          renderSectionFooter={(section) => this._renderSectionFooter(section)}
          sections={this._sections()}
          ListEmptyComponent={() => (
            <EmptyView/>
          )}
          ListFooterComponent={() => {
            return (
              <View style={{flex: 1, height: 50, backgroundColor: 'yellow'}}>
                <Text>{'list footer'}</Text>
              </View>
            )
          }}
          onRefresh={() => {
            const {navigation} = this.props
            this.props.actions.categoryDetailInit({
              sex: navigation.state.params.sex,
              id: navigation.state.params.id,
            })
          }}
          refreshing={categoryDetail.isLoading}
        />
        <ProgressHUD
          showHUD={categoryDetail.isLoading}
          showLoading={categoryDetail.isLoading}
        />
      </View>
    )
  }

  _renderFirstComponent = ({ item, index, section: { data } }) => {
    return null
  }

  _renderSecondComponent = ({ item, index, section: { title, data } }) => {
    return (
      <BookCell
        data={item}
        index={index}
        onPressCell={() => {
          this.props.navigation.navigate('Detail', {
            bookId: item.id
          })
        }}
      />
    )
  }

  _renderThirdComponent = ({ item, index, section: { title, data } }) => {
    return null
  }

  _renderFourComponent = ({ item, index, section: { title, data } }) => {
    return null
  }

  _renderFiveComponent = ({ item, index, section: { title, data } }) => {
    return (
      <BookCell
        data={item}
        onPressCell={() => {
          this.props.navigation.navigate('Detail', {
            bookId: item.id
          })
        }}
      />
    )
  }


  _sections = () => {
    const {categoryDetail} = this.props
    let data = categoryDetail.data.map((item, idx) => {
      let obj = {
        ...item,
        renderItem: (idx === 0 && this._renderFirstComponent) ||
        (idx === 1 && this._renderSecondComponent) ||
        (idx === 2 && this._renderThirdComponent) ||
        (idx === 3 && this._renderFourComponent) ||
        (idx === 4 && this._renderFiveComponent)
      }
      return obj
    })
    return data
  }

  _renderSectionHeader = ({ section: {title, right, id, key, index} }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {`${title}`}
        </Text>
        {
          right !== 1 ? (
            <TouchableOpacity
              onPress={() => {
                if (right === 2) {
                  // TODO: 换一换
                } else if (right === 3) {
                  this.props.navigation.navigate('ViewMore', {
                    categoryId: id,
                    name: title,
                  })
                }
              }}
            >
              <Text style={styles.headerTrailTitle}>
                {right === 2 && '换一换' || right === 3 && '查看全部'}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      </View>
    )
  }


  _renderSectionFooter = ({section: {key, data}}) => {
    switch (key) {
      case 0:
        return (
          <TwoColumnCell
            data={data}
            onPressItem={(item) => {
              this.props.navigation.navigate('Detail', {
                bookId: item.id
              })
            }}
          />
        )
        break
      case 1:
        break
      case 2:
        return (
          <FourColumnCell
            data={data}
            onPressItem={(item) => {
              this.props.navigation.navigate('Detail', {
                bookId: item.id
              })
            }}
          />
        )
        break
      case 3:
        return (
          <FourColumnCell
            data={data}
            onPressItem={(item) => {
              this.props.navigation.navigate('Detail', {
                bookId: item.id
              })
            }}
          />
        )
      break
      case 4:
        break
      default:
        return (
          <View style={{width: 50, height: 50, backgroundColor: 'cyan'}}>
            <Text>{'section footer'}</Text>
          </View>
        )
        break
    }
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row'
  },
  headerTitle: {
    color: '#1e252f',
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
  },
  headerTrailTitle: {
    color: '#f85836',
    fontWeight: "500",
    fontSize: 14,
  },

})

CategoryDetailPage.propTypes = {}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({...categoryDetailAction}, dispatch)
})

export default connect(({user, categoryDetail}) => {
  return {
    user,
    categoryDetail,
  }
}, mapDispatchToProps)(CategoryDetailPage)

