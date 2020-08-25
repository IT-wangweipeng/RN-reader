import Toast from 'react-native-root-toast'

export const SHOW_TOAST = 'SHOW_TOAST';

export function showToast(payload, position = Toast.positions.BOTTOM) {
  Toast.show(payload, {
    duration: Toast.durations.LONG,
    position,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  })
  return {
    type: SHOW_TOAST,
    payload
  }
}