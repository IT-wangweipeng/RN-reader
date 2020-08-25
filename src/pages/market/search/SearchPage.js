import React, {Component} from 'react'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  TextInput,
  Dimensions,
  PixelRatio,
  RefreshControl,
  StyleSheet,
} from 'react-native'

import dismissKeyboard from 'dismissKeyboard'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as searchRecommendAction from '../../../actions/searchRecommendAction'
import * as searchBannerAction from '../../../actions/searchBannerAction'
import * as searchAction from '../../../actions/searchAction'
import * as searchWordAction from '../../../actions/searchWordAction'
import images from '../../../component/images'
import ListFooter from '../../../component/ListFooter'
import {getItem, setItem} from '../../../utils/AsyncStorageManager'
import {KEY_SEARCH_HISTORY} from '../../../utils/AsyncStorageKey'
import BannerView from '../BannerView'

import R from 'ramda'

import {sendAction, UMCPS} from '../../../utils/Analysis/UMengEvent'
import * as UMConfig from '../../../utils/Analysis/UMConfig'

const {width} = Dimensions.get('window')

const PADDING_HORIZONTAL = 16
const ITEM_WIDTH = (width - PADDING_HORIZONTAL * 3) / 2
const START_PAGE = 0
const ONE_PAGE_SIZE = 10
const IMAGE_WIDTH = 75
const IMAGE_HEIGHT = 110
const SCORE_TEXT_WIDTH = 40
const TEXT_WIDTH = width - PADDING_HORIZONTAL*2 - PADDING_HORIZONTAL - IMAGE_WIDTH - SCORE_TEXT_WIDTH


class SearchPage extends Component {

  static navigationOptions = ({navigation}) => ({
    headerLeft: null,
    headerTitle: (
      <View
        style={{
          marginTop: 6,
          flexDirection: 'row',
          marginHorizontal: PADDING_HORIZONTAL,
          alignItems: 'center',
        }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          height: 36,
          borderRadius: 18,
          backgroundColor: '#f1f1f6',
          alignItems: 'center',
        }}>
          <Image source={images.search}
                 style={{marginStart: 18}}/>
          <TextInput
            style={{marginStart: 10, fontSize: 16, flex: 1, padding: 0}}
            placeholderTextColor="#acacb9"
            allowFontScaling={false}
            placeholder={navigation.state.params && navigation.state.params.keywords && navigation.state.params.keywords.length > 0 ? navigation.state.params.keywords : "搜索书籍、作者"}
            returnKeyType="search"
            autoFocus={navigation.state.params && navigation.state.params.keywords && navigation.state.params.keywords.length > 0 ? true : false}
            value={navigation.getParam('value')}
            onChangeText={(keyword) => {
              navigation.state.params.setKeyword(keyword)
            }}
            onSubmitEditing={() => {
              console.log('yy onSubmitEditing')
              navigation.state.params.search()
            }}
          />
          {
            navigation.getParam('value') !== "" && navigation.getParam('value') !== undefined && navigation.getParam('value') !== null ?
              <TouchableOpacity
                onPress={() => {
                  navigation.state.params.setKeyword("")
                }}
              >
                <Image source={images.image_textinput_delete}
                       style={{marginStart: 4, marginEnd: 16}}/>
              </TouchableOpacity>
              : null
          }
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}>
          <Text style={{marginStart: PADDING_HORIZONTAL, fontSize: 16, color: '#f85836'}}>取消</Text>
        </TouchableOpacity>
      </View>
    ),
  })

  constructor(props) {
    super(props)
    this.state = {
      sex: this.props.user.info.sex || 3,
      isSearched: false,
      isWordSearched: false,
      keyword: "",
      history: [],
    }
  }

  _setKeyword = (keyword) => {
    console.log('yy _setKeyword keyword=', keyword)
    if (keyword.length > 0) {
      this.setState({
        keyword: keyword,
        isSearched: false,
        isWordSearched: true,
      }, () => {
        console.log('yy _setKeyword searchWordInit word=', keyword)
        this.props.actions.searchWordInit({
          word: keyword,
        })
      })
    } else {
      this.setState({
        keyword: keyword,
        isSearched: false,
        isWordSearched: false,
      }, () => {
        this.props.searchWord.data = []
      })
    }
    this.props.navigation.setParams({'value': keyword})
  }

  _search = () => {
    const {keyword} = this.state
    const {navigation} = this.props

    if (keyword.length === 0 && navigation.state.params && navigation.state.params.keywords) {
      this.setState({
        keyword: navigation.state.params.keywords
      }, () => {
        navigation.setParams({'value': this.state.keyword})
        this._search()
      })
      return
    }


    if (keyword.length > 0) {
      this.setState({
        isSearched: true,
      })

      const newKeyword = keyword.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      console.log('yy newKeyword=', newKeyword)

      this.props.search.type = 0
      this.props.search.list = []
      if (newKeyword.length > 0) {
        this.props.actions.searchInit({
          token: this.props.user.token,
          start: START_PAGE,
          size: ONE_PAGE_SIZE,
          keyword: newKeyword,
        })
      }

      getItem(KEY_SEARCH_HISTORY).then((history) => {
        console.log('history =====', history)
        if (history !== null) {
          let storeStr = keyword + ','
          let strArr = history.split(',')
          console.log('strArr ====', strArr)
          let tempStr = ''
          let isStore = true
          for (let i = 0; i < strArr.length; i++) {
            if (strArr[i] === keyword) {
              isStore = false
              return
            }
          }
          console.log('aa 00 strArr=', strArr)
          if (strArr.length >= 11 && keyword.length > 0 && isStore) {
            let tempArr = strArr.splice(1, 9)
            console.log('aa 11 tempArr=', tempArr)
            for (let i = 0; i < tempArr.length; i++) {
              tempStr = tempStr + tempArr[i] + ','
              if (i === tempArr.length - 1 && isStore) {
                setItem(KEY_SEARCH_HISTORY, tempStr + storeStr)
              }
            }
          } else {
            setItem(KEY_SEARCH_HISTORY, history + storeStr)
          }
        } else {
          setItem(KEY_SEARCH_HISTORY, keyword + ',')
        }

        //设置完成后更新state
        getItem(KEY_SEARCH_HISTORY).then((history) => {
          let strArr = history.split(',')
          this.setState({
            history: strArr,
          })
        })
      })
    }
  }

  componentWillMount() {
    this.props.actions.searchRecommendInit({
      sex: this.state.sex,
    })

    this.props.actions.searchBannerInit()
  }

  componentDidMount() {
    this.props.navigation.setParams({'value': this.state.keyword})
    this.props.navigation.setParams({search: this._search})
    this.props.navigation.setParams({setKeyword: this._setKeyword})

    getItem(KEY_SEARCH_HISTORY).then((history) => {
      if (history !== null) {
        let strArr = history.split(',')
        this.setState({
          history: strArr,
        })
      }
    })
  }

  _renderHistoryView = () => {
    const views = []
    const {history} = this.state
    for (let i = history.length - 2; i >= 0; i--) {
      views.push(
        <TouchableOpacity
          style={styles.historySubviewStyle}
          key={`${i}view`}
          onPress={() => {
            console.log('i ===', i)
            this.props.navigation.setParams({'value': history[i]})
            this.setState({
              isSearched: true,
              keyword: history[i],
            }, () => this._search())
          }}
        >
          <Text style={styles.historyTextStyle}>
            {history[i]}
          </Text>
        </TouchableOpacity>,
      )
    }
    return (
      <View style={styles.historyViewStyle}>
        {views}
      </View>
    )
  }

  _highlightKeyword = (data) => {
    const key = this.state.keyword
    let newData = data.split(key)       //  通过关键字的位置开始截取，结果为一个数组
    console.log('yy newData=', newData)
    return (
      <Text>
        {
          newData.map((item, index) => {
            console.log('yy item=' + item + ',key=' + key)
            if (index === newData.length - 1) {
              return (
                <Text>
                  {item}
                </Text>
              )
            }
            return (
              <Text>
                {item}
                <Text style={{color: '#f85836'}}>
                  {key}
                </Text>
              </Text>
            )
          })
        }
      </Text>
    )
  }

  _renderWordItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.setParams({'value': item})
          dismissKeyboard()
          this.setState({
            keyword: item,
          }, () => {
            this._search()
          })
        }}>
        <View style={{
          flexDirection: 'row',
          height: 56,
          alignItems: 'center',
          paddingStart: PADDING_HORIZONTAL * 2,
          paddingEnd: PADDING_HORIZONTAL,
        }}>
          <Text style={{
            fontSize: 16,
            color: '#1e252f'
          }}>
            {this._highlightKeyword(item, this.state.keyword)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    if (this.state.isSearched) {

      if(this.props.search.type === 2) {
        return (
          <ScrollView>
            {this._renderHeader()}
            {
              this.props.search.list.length > 0 ?
                R.addIndex(R.map)((value, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Detail', {bookId: value.id,})
                      UMCPS(UMConfig.book_search_list_item_clicked, {book_id: value.bookId})
                    }}>
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      height: 106,
                      marginTop: 12,
                      paddingHorizontal: PADDING_HORIZONTAL
                    }}>
                      <ImageBackground source={{uri: value.cover}}
                             resizeMethod="resize"
                             defaultSource={images.image_placeholder}
                             style={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
                             imageSstyle={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
                      >
                        {
                          value.isvip === 1 ?
                            <Image
                              style={{position: 'absolute',width: 18, height: 16, right: 5}}
                              source={images.image_vip_xianmian_bage}
                            />: null
                        }
                      </ImageBackground>
                      <View style={{flex: 1, marginStart: 16}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={{fontSize: 16, color: '#1e252f', width:TEXT_WIDTH}}
                                numberOfLines={1}
                                ellipsizeMode='tail'
                          >{value.name}</Text>
                          <Text style={{fontSize: 16, color: '#f85836'}}>{value.score}分</Text>
                        </View>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode='tail'
                          style={{
                            marginTop: 12,
                            fontSize: 14,
                            color: '#545c67'
                          }}>{value.brief}</Text>
                        <View style={{flex: 1}}/>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={{fontSize: 11, color: '#939aa2'}}>{value.author}</Text>
                          <View style={{flex: 1}}/>
                          <View style={{
                            borderRadius: 8,
                            backgroundColor: '#f1f1f6',
                            paddingHorizontal: 6,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Text style={{fontSize: 11, color: '#949ba5',}}>{value.category_name}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ), this.props.search.list)
                : null
            }
            {this._renderFooter()}
          </ScrollView>
        )
      } else {
        return (
          <View style={{flex: 1}}>
            <FlatList
              keyboardDismissMode={'on-drag'}
              keyExtractor={(item, index) => index.toString()}
              removeClippedSubviews
              data={this.props.search.list}
              renderItem={this._renderItem}
              onEndReachedThreshold={0.1}
              onEndReached={this._loadMore}
              refreshControl={(
                <RefreshControl
                  onRefresh={this._onRefresh}
                  color="#ccc"
                  refreshing={this.props.search.isRefreshing}
                />)}
              ListHeaderComponent={this._renderHeader}
              ListFooterComponent={this._renderFooter}
            />
          </View>
        )
      }

    } else if (this.state.isWordSearched) {
      return (
        <FlatList
          keyboardDismissMode={'on-drag'}
          keyExtractor={(item, index) => index.toString()}
          data={this.props.searchWord.data}
          renderItem={this._renderWordItem}
          ItemSeparatorComponent={this._separator}
        />
      )
    }

    return (
      <ScrollView
        keyboardDismissMode={'on-drag'}
        style={{backgroundColor: '#fff'}}
      >
        {
          this.state.history.length > 0 ?
            <View style={{
              marginTop: 12,
              height: 20,
              flexDirection: 'row',
              marginStart: PADDING_HORIZONTAL,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{color: "#acacb9", fontSize: 14}}>历史记录</Text>
              <View style={{flex: 1}}/>
              <TouchableOpacity
                onPress={() => {
                  setItem(KEY_SEARCH_HISTORY, "")
                  this.setState({
                    history: "",
                  })
                }}
              >
                <Text
                  style={{color: "#f85836", fontSize: 14, marginEnd: PADDING_HORIZONTAL}}>清空</Text>
              </TouchableOpacity>
            </View>
            : <View/>
        }
        {this._renderHistoryView()}

        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{
            marginStart: PADDING_HORIZONTAL,
            fontSize: 14,
            color: '#acacb9',
          }}>热搜排行</Text>
        </View>
        <View style={{
          marginTop: 20,
          flex: 1,
          paddingHorizontal: PADDING_HORIZONTAL,
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
          {
            R.addIndex(R.map)((value, index) => {
              let style = {};
              switch (index) {
                case 0:
                  style = {backgroundColor: '#ea3d36'}
                  break;
                case 1:
                  style = {backgroundColor: '#f58318'}
                  break;
                case 2:
                  style = {backgroundColor: '#feba28'}
                  break;
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    UMCPS(UMConfig.book_search_item_clicked, {index: index, book_id: value.id})
                    this.props.navigation.navigate('Detail', {bookId: value.id,})
                  }}>
                  <View style={{
                    width: ITEM_WIDTH,
                    flexDirection: 'row',
                    marginBottom: 20,
                    alignItems: 'center',
                  }}>
                    <View style={[{
                      width: 16,
                      height: 16,
                      borderRadius: 2,
                      backgroundColor: '#cccccc',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }, style]}>
                      <Text style={{fontSize: 10, color: '#ffffff'}}>{index + 1}</Text>
                    </View>
                    <Text style={{marginStart: 10, fontSize: 15, color: '#1e252f', width: 120}}
                          numberOfLines={1}>{value.name}</Text>
                  </View>
                </TouchableOpacity>
              )
            }, this.props.searchRecommend.data)
          }
        </View>

        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{
            marginStart: PADDING_HORIZONTAL,
            fontSize: 14,
            color: '#acacb9',
          }}>书荒不用愁</Text>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Discovery')
              sendAction(UMConfig.book_search_viewmore_clicked)
            }}
          >
            <Text
              style={{
                marginEnd: PADDING_HORIZONTAL,
                fontSize: 14,
                color: '#f85836'
              }}
            >
              更多发现
            </Text>
          </TouchableOpacity>
        </View>
        {
          this.props.searchBanner.data.length > 0 ?
            (
              <View style={{marginVertical: 12, paddingHorizontal: 16}}>
                <BannerView
                  navigation={this.props.navigation}
                  data={this.props.searchBanner.data}
                  duration={3000}
                  onPressBanner={() => {
                    UMCPS(UMConfig.market_banner_click, {position: 12})
                  }}
                />
              </View>
            )
            : null

        }

      </ScrollView>
    )
  }


  _onRefresh = () => {
    this.props.actions.searchInit({
      token:this.props.user.token,
      start: START_PAGE,
      size: ONE_PAGE_SIZE,
      keyword: this.state.keyword,
    })
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Detail', {bookId: item.id,})
          UMCPS(UMConfig.book_search_list_item_clicked, {book_id: item.bookId})
        }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          height: 106,
          marginTop: 12,
          paddingHorizontal: PADDING_HORIZONTAL
        }}>
          <ImageBackground source={{uri: item.cover}}
                 resizeMethod="resize"
                 defaultSource={images.image_placeholder}
                 style={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
                 imageStyle={{width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 3}}
          >
            {
              item.isvip === 1 ?
                <Image
                  style={{position: 'absolute',width: 18, height: 16, right: 5}}
                  source={images.image_vip_xianmian_bage}
                />: null
            }
          </ImageBackground>
          <View style={{flex: 1, marginStart: 16}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 16, color: '#1e252f', width:TEXT_WIDTH}}
                    numberOfLines={1}
                    ellipsizeMode='tail'
              >{item.name}</Text>
              <Text style={{fontSize: 16, color: '#f85836'}}>{item.score}分</Text>
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={{
                marginTop: 12,
                fontSize: 14,
                color: '#545c67'
              }}>{item.brief}</Text>
            <View style={{flex: 1}}/>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={{fontSize: 11, color: '#939aa2'}}>{item.author}</Text>
              <View style={{flex: 1}}/>
              <View style={{
                borderRadius: 8,
                backgroundColor: '#f1f1f6',
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{fontSize: 11, color: '#949ba5',}}>{item.category_name}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _loadMore = () => {
    console.log('gg loadMore 00')
    if (!this.props.search.isLoadingMore && this.props.search.loadMore && !this.props.search.isRefreshing) {
      console.log('gg loadMore 11')
      this.props.actions.searchLoadMore({
        token: this.props.user.token,
        start: this.props.search.list.length,
        size: ONE_PAGE_SIZE,
        keyword: this.state.keyword,
      })
    }
  }

  _renderHeader = () => {
    const {search} = this.props
    if (search.type === 2) { //无结果
      return (
        <Text
          style={{
            marginTop: 20,
            marginBottom: 10,
            marginStart: 16,
            fontSize: 14,
            color: '#acacb9'
          }}
        >抱歉，未找到书籍，根据您的口味为您推荐</Text>
      )
    } else {
      return null
    }
  }

  _renderFooter = () => {
    const {search} = this.props
    if (search.list.length > 0) {
      return <ListFooter hasMore={search.loadMore}/>
    } else {
      return <View/>
    }
  }

  _empty = () => (
    <View style={{
      justifyContent: 'center', alignItems: 'center',
    }}
    >
      <Image
        style={{marginTop: 108}}
        source={images.image_search_empty}
      />
      <Text style={{marginTop: 10, color: '#acacb9', fontSize: 12}}>
        未找到结果，我们会努力丰富书库哒!
      </Text>
    </View>
  )

  _separator = () => <View style={{marginStart: 16, height: 1 / PixelRatio.get(), backgroundColor: '#f1f1f6'}}/>

  isEmojiCharacter(substring) {
    if (substring) {
      var reg = new RegExp("[~#^$@%&!?%*]", 'g');
      if (substring.match(reg)) {
        return true;
      }
      for (var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
          if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true;
            }
          }
        } else if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          if (ls == 0x20e3) {
            return true;
          }
        } else {
          if (0x2100 <= hs && hs <= 0x27ff) {
            return true;
          } else if (0x2B05 <= hs && hs <= 0x2b07) {
            return true;
          } else if (0x2934 <= hs && hs <= 0x2935) {
            return true;
          } else if (0x3297 <= hs && hs <= 0x3299) {
            return true;
          } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
            || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
            || hs == 0x2b50) {
            return true;
          }
        }
      }
    }
  };

}


const
  styles = StyleSheet.create({
    historyViewStyle: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 20,
      marginStart: PADDING_HORIZONTAL,
    },
    historySubviewStyle: {
      backgroundColor: '#f7f7f7',
      borderRadius: 5,
      marginEnd: 10,
      marginBottom: 10,
    },
    historyTextStyle: {
      color: '#000000',
      fontSize: 15,
      paddingHorizontal: 15,
      paddingVertical: 8,
    },
  })

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({...searchAction, ...searchRecommendAction, ...searchBannerAction, ...searchWordAction}, dispatch),
})

export default connect(({search, searchRecommend, user, searchBanner, searchWord}) => ({
  search, searchRecommend, user, searchBanner, searchWord
}), mapDispatchToProps)(SearchPage)
