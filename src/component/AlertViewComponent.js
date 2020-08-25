import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native'



class AlertViewComponent extends Component {


  render() {
    const {navigation} = this.props
    return (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center'}}>
        <View
          removeClippedSubviews={false}
          overflow={'hidden'}
          style={styles.mainContainer}
        >
          <Text style={{marginTop: 42, color: '#656565', fontSize: 16, alignSelf: 'center'}}>
            {'是否删除？'}
          </Text>


          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              underlayColor={'#ffffff'}
              style={styles.button}
              onPress={() => {
                navigation.goBack()
                navigation.state.params.onCancle && navigation.state.params.onCancle()
              }}
            >
              <Text style={{fontWeight: "500", color: '#f85836', fontSize: 15}}>
                {'取消'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              underlayColor={'#ffffff'}
              style={styles.button}
              onPress={() => {
                navigation.goBack()
                navigation.state.params.onConfirm && navigation.state.params.onConfirm()
              }}
            >
              <Text style={{fontWeight: "500", color: '#f85836', fontSize: 15}}>
                {'删除'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 250,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonWrapper: {
    height: 50,
    backgroundColor: '#f1f1f6',
    marginTop: 30,
    marginBottom: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button: {
    height: 50,
    backgroundColor: '#f1f1f6',
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
})

export default AlertViewComponent
