import React, {
  Component,
} from 'react';

import {
  View,
  Text,
} from 'react-native';

import moment from 'moment'

class CountDownTimer extends Component {

  constructor(props) {
    super(props)

    const date = this.getDateData(this.props.date);
    if (date) {
      this.state = {
        date: {
          day: date.day,
          hour: date.hour,
          min: date.min,
          sec: date.sec,
        }
      }
    } else {
      this.state = {
        date: {
          day: 0,
          hour: 0,
          min: 0,
          sec: 0,
        }
      }
    }

  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const date = this.getDateData(this.props.date);
      if (date) {
        this.setState({
          date: date,
        });
      } else {
        this.stop();
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.stop();
  }

  getDateData(endDate) {
    let diff = (Date.parse(moment(endDate).toDate()) - Date.parse(new Date)) / 1000;
    if (diff < 0) {
      return false;
    }

    const timeLeft = {
      day: 0,
      hour: 0,
      min: 0,
      sec: 0,
    };


    if (diff >= 86400) {
      timeLeft.day = Math.floor(diff / 86400);
      diff -= timeLeft.day * 86400;
    }
    if (diff >= 3600) {
      timeLeft.hour = Math.floor(diff / 3600);
      diff -= timeLeft.hour * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;
    return timeLeft;
  }

  render() {
    const {day, hour, min, sec} = this.state.date;


    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={{
          fontSize: 14,
          color: '#f85836'
        }}>{day === 0 ? "" : day + "天"}{day === 0 && hour === 0 ? "" : hour + "时"}{day === 0 && hour === 0 && min === 0 ? "" : min + "分"}{day === 0 && hour === 0 && min === 0 && sec === 0 ? "活动结束" : sec + "秒"}</Text>
      </View>
    );
  }

  stop() {
    clearInterval(this.interval);
  }

}

export default CountDownTimer
