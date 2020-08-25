import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native'



class EditBookshelfTipsPage extends Component {


  render() {
    const {navigation} = this.props
    return (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center'}}>
        <View
          removeClippedSubviews={false}
          overflow={'hidden'}
          style={styles.mainContainer}
        >
          <Text style={{marginTop: 42, color: '#1e252f', fontSize: 15, alignSelf: 'center', fontWeight: "500",   fontStyle: "normal",}}>
            {'长按书本，可进入编辑页面'}
          </Text>
          <TouchableOpacity
            underlayColor={'#ffffff'}
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={{fontWeight: "500", color: '#f85836', fontSize: 15}}>
              {'我知道啦'}
            </Text>
          </TouchableOpacity>
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
  button: {
    height: 50,
    backgroundColor: '#f1f1f6',
    width: 250,
    marginTop: 30,
    marginBottom: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
})

export default EditBookshelfTipsPage
