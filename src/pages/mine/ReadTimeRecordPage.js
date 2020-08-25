import React, {Component} from 'react'
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import moment from 'moment'
import {BoxShadow} from 'react-native-shadow'
import * as readTimeAction from '../../reducers/readTimeReducer'
import {timeFormat} from "../../utils/TimeUtil";
import images from '../../component/images'
import ListFooter from "../../component/ListFooter";

const {width, height} = Dimensions.get('window')



class ReadTimeRecordPage extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      current: ''
    }

    this.shadowOpt = {
      color:"#eeeeee",
      border:2,
      radius:3,
      opacity:0.2,
      x:0,
      y:10,
      width: width-30,
      height: 378,
      style:{
        marginVertical:5,
        marginHorizontal: 15,
        bottom: -30,
      }
    }
  }


  componentWillMount(): void {
    this.props.actions.readTimeInitAction()

  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    console.log('nextProps.readTime.loadSuccess ==== ', nextProps.readTime.loadSuccess)
    if (nextProps.readTime.loadSuccess) {
      this.setState({
        current: this._parseReadTime(nextProps.readTime.cur_month_read_ts)
      })
    }
  }


  render() {
    const {readTime} = this.props
    console.log('readTime ====== ', readTime.cur_month_read_ts)
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          style={{flex: 1}}
          source={images.image_read_time_background}
        >
          <View style={{marginHorizontal: 23}}>
            <Text style={{color: '#6B7681', fontSize: 15, marginTop: 30}}>
              {`总共时长   ${readTime.total_read_ts < 60 ? '0分钟' : this._timeParse(readTime.total_read_ts)}`}
            </Text>
            {/*<Text style={{color: '#6B7681', fontSize: 15, marginTop: 30}}>*/}
            {/*  {`上月读书   ${readTime.pre_month_read_ts < 60 ? '0分钟' : this._timeParse(readTime.pre_month_read_ts)}`}*/}
            {/*</Text>*/}
            {
              !!this.state.current && readTime.cur_month_read_ts >= 60 ? (
                <Text style={{color: '#191D21', fontSize: 15, marginTop: 10, marginBottom: 0}}>
                  {`本月读书  `}
                  {
                    this.state.current.day !== 0 ? (
                      <Text style={{color: '#2C5667', fontSize: 38}}>
                        {`${this.state.current.day}`}
                        <Text style={{color: '#191D21', fontSize: 15}}>
                          {'天'}
                        </Text>
                      </Text>
                    ) : null
                  }

                  {
                    this.state.current.hour !== 0 ? (
                      <Text style={{color: '#2C5667', fontSize: 38}}>
                        {`${this.state.current.hour}`}
                        <Text style={{color: '#191D21', fontSize: 15}}>
                          {'小时'}
                        </Text>
                      </Text>
                    ) : null
                  }

                  {
                    this.state.current.min !== 0 ? (
                      <Text style={{color: '#2C5667', fontSize: 38}}>
                        {`${this.state.current.min}`}
                        <Text style={{color: '#191D21', fontSize: 15}}>
                          {'分钟'}
                        </Text>
                      </Text>
                    ) : null
                  }

                </Text>
              ) : (
                <Text style={{color: '#191D21', fontSize: 15, marginTop: 10, marginBottom: 34}}>
                  {`本月读书  `}
                  <Text style={{color: '#2C5667', fontSize: 38}}>
                    {'00'}
                    <Text style={{color: '#191D21', fontSize: 15}}>
                      {'天'}
                    </Text>
                  </Text>
                  <Text style={{color: '#2C5667', fontSize: 38}}>
                    {'00'}
                    <Text style={{color: '#191D21', fontSize: 15}}>
                      {'时'}
                    </Text>
                  </Text>
                  <Text style={{color: '#2C5667', fontSize: 38}}>
                    {'00'}
                    <Text style={{color: '#191D21', fontSize: 15}}>
                      {'分钟'}
                    </Text>
                  </Text>
                </Text>
              )
            }

          </View>

          <ImageBackground
            style={{width, marginTop: 28, marginBottom: 0, flex: 1 }}
            source={images.image_shadow}
          >
            <View style={styles.flatListWrapper}>
              <FlatList
                contentContainerStyle={styles.flatList}
                data={this.props.readTime.list || []}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ListFooterComponent={this._ListFooterComponent}
                ListEmptyComponent={this._ListEmptyView}
                onEndReached={this.handleLoadingMore}
                onEndReachedThreshold={0.1}
              />
            </View>
          </ImageBackground>
        </ImageBackground>

        <Text style={{color: '#B6C6D0', fontSize: 15, alignSelf: 'center', marginBottom: 15, marginTop: 10}}>
          {'一本书一个世界，记得坚持每天读书哦'}
        </Text>
      </View>
    );
  }


  _ListFooterComponent = () => {
    const {readTime} = this.props
    if (readTime.list.length > 0) {
      return (
        <ListFooter
          footerStyle={{
            marginTop: 10
          }}
          hasMore={readTime.hasMore}
        />
      )
    }

    return null
  }

  _ListEmptyView = () => {
    const {readTime} = this.props
    if (readTime.loadSuccess && !readTime.list.isEmpty && readTime.list.length == 0) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 170, marginBottom: 170}}>
          <Text style={{color: '#A3AEB8', fontSize: 15,}}>
            {'暂无记录，去书城找找书吧'}
          </Text>
        </View>
      )
    }
    return null
  }


  handleLoadingMore = () => {
    const {readTime} = this.props
    if (!readTime.isLoadingMore && readTime.hasMore) {
      this.props.actions.readTimeLoadMoreInitAction({
        size: 10,
        start: readTime.list.length
      })
    }
  }

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.cellWrapper}>
        <Text style={styles.fontStyle}>
          {`${moment.unix(item.date).format('YYYY年MM月DD日')}`}
        </Text>
        <Text style={styles.fontStyle}>
          {`${this._timeParse(item.ts)}`}
        </Text>
      </View>
    )
  }

  _parseReadTime = (seconds) => {
    const ret = timeFormat(seconds)
    return ret
  }

  _timeParse = (seconds) => {
    const time = this._parseReadTime(seconds)
    const day = time.day !== 0 ? `${time.day}天` : ''
    const hour = time.hour !== 0 ? `${time.hour}小时` : ''
    const min = time.min !== 0 ? `${time.min}分钟` : ''
    console.log('time ------------ ', time, day, hour, min)
    return day + hour + min
  }

  _keyExtractor = (item, index) => item.id
}

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'center',
  },
  cellWrapper: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E7F2F8',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 23
  },
  fontStyle: {
    color: '#191D21',
    fontSize: 15,
  },
  flatListWrapper: {
    backgroundColor: '#fff',
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 18,
    borderColor: '#fff',
    borderRadius: 7,
    borderWidth: 1,
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...readTimeAction
  }, dispatch)
})

export default connect(({user, readTime}) => {
  return {
    user,
    readTime
  }
}, mapDispatchToProps)(ReadTimeRecordPage)