import {
  HotBeansPaymentApi
} from "../apis/Api";
import {showToast} from "../actions/toastAction";

export const IncreaseHotBean = (token, type) => {
  return HotBeansPaymentApi(token, type)
    .then((ret) => {
      console.log('HotBeansPaymentApi result:  ', ret)
      if (ret.status === 200) {
        return Promise.resolve({taskCompleted: ret.data.task_complete_state})
      } else {
        showToast(ret.message)
        return Promise.reject()
      }
    })
    .catch((error) => {
      console.log('HotBeansPaymentApi error: ', error)
      showToast(error.message)
    })
}