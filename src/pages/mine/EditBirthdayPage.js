import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet, Text, Image,
  TouchableOpacity
} from 'react-native'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'



class EditBirthdayPage extends Component {

  constructor (props) {
    super(props)

    this.state = { date: new Date() }
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
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {

          }}
        >
          <View style={styles.wrapper}>
            <Text style={{fontSize: 19, color: '#1E252F', marginVertical: 20}}>
              {'选择日期'}
            </Text>
            <DatePicker
              style={{height: 150, width: 300}}
              mode={'date'}
              locale={'zh'}
              date={this.state.date}
              minimumDate={this.state.data}
              onDateChange={date => {
                const newDate = moment(date).format('YYYYMMDD')
                const now = moment(new Date()).format('YYYYMMDD')
                if (newDate > now) {
                  this.setState({
                    date: new Date()
                  })
                } else {
                  this.setState({ date })
                }
              }}
            />

            <View style={{flexDirection: 'row', height: 50,  alignItems: 'center'}}>
              <TouchableOpacity
                style={{flex: 1, alignItems: 'center'}}
                onPress={() => {
                  const {navigation} = this.props
                  navigation.goBack()
                }}
              >
                <Text style={{fontSize: 16, color: '#F85836'}}>
                  {'取消'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{flex: 1, alignItems: 'center'}}
                onPress={() => {
                  const date = moment(this.state.date).format('YYYY-MM-DD')
                  const {navigation} = this.props
                  navigation.goBack()
                  navigation.state.params.callback && navigation.state.params.callback(date)
                }}
              >
                <Text style={{fontSize: 16, color: '#F85836'}}>
                  {'确定'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>

      </TouchableOpacity>
    )
  }
}

EditBirthdayPage.propTypes = {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  wrapper: {
    width: 300,
    // height: 240,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
})

export default EditBirthdayPage
