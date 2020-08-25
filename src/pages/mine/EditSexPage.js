import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet, Text, Image,
  TouchableOpacity
} from 'react-native'
import images from '../../component/images'


class EditSexPage extends Component {

  constructor (props) {
    super(props)

    this.sex = this.props.navigation.state.params.sex
  }

  render () {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={() => {
          this.props.navigation.goBack()
        }}
      >
        <View style={styles.wrapper}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.state.params.onConfirm(1)
              this.props.navigation.goBack()
            }}
          >
            <View style={{alignItems: 'center'}}>
              <Image
                style={{width: 90, height: 90}}
                source={images.male}
              />
              <View style={this.sex === 1 ? styles.selectContainer : styles.unselectContainer}>
                <Text style={this.sex === 1 ? styles.selectText : styles.unselectText}>
                  {'男生'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.state.params.onConfirm(2)
              this.props.navigation.goBack()
            }}
          >
            <View style={{alignItems: 'center', marginLeft: 48}}>
              <Image
                style={{width: 90, height: 90}}
                source={images.female}
              />
              <View style={this.sex === 2 ? styles.selectContainer : styles.unselectContainer}>
                <Text style={this.sex === 2 ? styles.selectText : styles.unselectText}>
                  {'女生'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
}

EditSexPage.propTypes = {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  wrapper: {
    width: 300,
    height: 225,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  unselectContainer: {
    marginTop: 40,
    backgroundColor: '#f1f1f6',
    width: 75,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  unselectText: {
    fontSize: 15,
    color: '#949ba5'
  },
  selectContainer: {
    marginTop: 40,
    backgroundColor: '#f85836',
    width: 75,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold'
  },
})

export default EditSexPage
