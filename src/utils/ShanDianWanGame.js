import CryptoJS from "crypto-js";


export function shanDianWanGameURL(user) {
  const {info} = user
  // 验签参数
  const channel = '12476'
  const openid = info.id
  const nick = decodeURIComponent(info.nickname)
  const avatar = info.pic || "http://lsbumbzh-sand.droibaascdn.com/droi/lsbumbzhiThyGIaQKFiNLUGFAiInO5Z1lQDPUxsc/1155773683380666368/5d3ebdbd3d7784851.png"
  const sex = info.sex
  const phone = info.phone
  const time = (Date.now() / 1000).toFixed(0)
  const key = '29e05ab4160e45f8ab36b0f01a222f67'
  console.log('gg info=',info)

  // sign
  const StringA = `channel=${channel}&openid=${openid}&time=${time}&nick=${nick}&avatar=${avatar}&sex=${sex}&phone=${phone}`;
  const StringB = StringA + key;
  console.log('gg before stringB=',StringB)
  // const sign = CryptoJS.MD5(StringB).toLocaleLowerCase();
  const sign = CryptoJS.MD5(StringB).toString()
  console.log('gg after sign=',sign)

  // auth params
  const urlParam = {
    channel: channel,
    openid: openid,
    nick: encodeURIComponent(nick),
    avatar: encodeURIComponent(avatar),
    sex: sex,
    phone: phone,
    time: time,
    sign: sign,
    sdw_simple: 2,
    sdw_tt: 1,
  };

  const authPage = 'http://www.shandw.com/auth/?' + _urlEncode(urlParam);
  console.log('gg authPage=',authPage)
  return authPage
}



const _urlEncode = (urlParam) => {
  let ret = ""
  for (let key in urlParam) {
    ret += key + "=" + urlParam[key] + "&"
  }
  ret = ret.substring(0, ret.length - 1)
  return ret

}