export const checkPhone = (phone) => {
  if ((/^1[3|5|6|7|8|9][0-9]\d{4,8}$/.test(phone)) && phone.length === 11) {
    return true
  }
  return false
}

export const checkCaptcha = (captcha) => {
  if (captcha.length === 6) {
    return true
  }
  return false
}

export const checkPassword = (password) => {
  if (password.length >= 6) {
    return true
  }
  return false
}
