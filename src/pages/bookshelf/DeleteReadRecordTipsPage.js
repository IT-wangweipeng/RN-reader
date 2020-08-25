import React, { Component } from 'react'
import {
  Dimensions,
  View,
  Text,
  PixelRatio,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

const DIALOG_MARGIN_HORIZONTAL = 40
const { width } = Dimensions.get('window')
const dialogWidth = width - DIALOG_MARGIN_HORIZONTAL * 2

export default class DeleteReadRecordTipsPage extends Component {

  constructor (props) {
    super(props)
  }


  render () {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            提示
          </Text>
          <Text style={styles.content}>
            是否删除《{this.props.navigation.state.params.name}》这条阅读记录
          </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnSubContainer}
              onPress={() => {
                this.props.onCancel && this.props.onCancel()
                this.props.navigation.goBack()
              }}
            >
              <Text style={styles.btnText}>
                {'取消'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSubContainer}
              onPress={() => {
                this.props.navigation.goBack()
                this.props.navigation.state.params.onConfirm()
              }}
            >
              <Text style={styles.btnText}>
                {'确定'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    width: dialogWidth,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',

  },
  title: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    color: "#1e252f"
  },
  content: {
    marginTop: 18,
    fontSize: 15,
    marginHorizontal:16,
    color: "#939aa2"
  },
  btnContainer: {
    marginTop: 24,
    height: 48,
    flexDirection: 'row',
  },
  btnSubContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    color: '#f85836',
  },
  textInputWrapper: {
    height: 44,
    marginHorizontal: 20,
    backgroundColor: '#f1f1f6',
    borderColor: '#e0e0e0',
    borderWidth: 1 / PixelRatio.get(),
    marginTop: 28,
    borderRadius: 4,
  },
})
