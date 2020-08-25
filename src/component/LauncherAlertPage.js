import React, {Component} from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native'


class LauncherAlertPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.navigation.state.params.data,
    }
  }

  render() {
    const {navigation} = this.props
    const item = this.state.data
    return (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center'}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => navigation.goBack()}
        />
        <View style={{position: 'absolute', alignSelf: 'center',}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.goBack()
              setTimeout(() => {
                switch (item.type) {
                  case 1://书籍id
                    navigation.navigate('Detail', {bookId: item.url})
                    break;
                  case 2://url链接
                    navigation.navigate('Web', {url: item.url})
                    break;
                  case 4://发现二级页面
                    if (item.discovery_type == 1) {//书籍
                      navigation.navigate('DiscoveryBook', {
                        title: item.discovery_title,
                        id: item.discovery_id
                      })
                    } else if (item.discovery_type == 2) {//作者
                      navigation.navigate('DiscoveryAuthor', {
                        id: item.discovery_id
                      })
                    }
                    break;
                  case 5://登录
                    navigation.navigate('Login')
                    break;
                  case 8://趣读跳转
                    navigation.navigate('Qudu')
                    break;
                  default:
                    break;
                }
              }, 500)

            }}
          >
            <Image
              style={{width: 300, height: 300, borderRadius: 8}}
              source={{uri: item.image, cache: 'force-cache'}}
            />
          </TouchableOpacity>
        </View>

      </View>
    )
  }

  componentWillUnmount(){
    const {navigation} = this.props
    if (!!navigation.state.params.fromFloatView) {
      DeviceEventEmitter.emit('showFloatView',{
        fromFloatView: navigation.state.params.fromFloatView,
      })
    }
  }

}

export default LauncherAlertPage
