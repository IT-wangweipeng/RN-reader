import moment from 'moment'


export const timeFormat = (time) => {
  let secondTime = parseInt(time);// 秒
  let minuteTime = 0;// 分
  let hourTime = 0;// 小时
  let dayTime = 0; // 天
  if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if(minuteTime >= 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);

      // 如果小时大于24，将小时转化为天
      if (hourTime >= 24) {
        dayTime = parseInt(hourTime/24)
        hourTime = parseInt(hourTime%24);
      }
    }
  }


  return {
    day: parseInt(dayTime),
    hour: parseInt(hourTime),
    min: parseInt(minuteTime)
  }
}




export const isToday = (ts) => {
  if (ts == null) {
    return false
  }
  const day = moment.unix(ts).format('YYYY-MM-DD')
  if (moment(new Date()).isSame(day, 'd')) {
    return true
  } else {
    return false
  }
}


export const isYesterday = (ts) => {
  if (ts == null) {
    return false
  }
  const day = moment.unix(ts).format('YYYY-MM-DD')
  const now = moment(new Date()).format('YYYY-MM-DD')
  const yesterday = moment(now).subtract(1, 'days').startOf('day')
  if (moment(day).isSame(yesterday, 'd')) {
    return true
  } else {
    return false
  }
}
