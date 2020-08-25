export const READ_GIFT = 'READ_GIFT'
export const READ_RECORD = 'READ_RECORD'
export const READ_PREFERENCES = 'READ_PREFERENCES'
export const GAME_CENTER = 'GAME_CENTER'
export const FEEDBACK = 'FEEDBACK'
export const QUESTION = 'QUESTION'
export const ABOUT_US = 'ABOUT_US'
export const CLEAN_CACHE = 'CLEAN_CACHE'
export const NIGHT_MODE = 'NIGHT_MODE'
export const MUSIC_FEATURE = 'MUSIC_FEATURE'
export const NOTIFICATION = 'NOTIFICATION'
export const UPDATE = 'UPDATE'
export const MINE_COMMENTS = 'MINE_COMMENTS'
export const SETTING = 'SETTING'
export const ACCOUNT_SETTING = 'ACCOUNT_SETTING'
export const INVITE_FRIEND = 'INVITE_FRIEND'
export const PRIVACY = 'PRIVACY'
export const SERVICE = 'SERVICE'


export const SETTING_DATA = [
  {
    type: ACCOUNT_SETTING,
    image: undefined,
    title: '账号设置',
  },
  {
    type: READ_PREFERENCES,
    image: undefined,
    title: '阅读偏好',
  },
  {
    type: FEEDBACK,
    image: undefined,
    title: '意见反馈',
  },
  {
    type: CLEAN_CACHE,
    image: undefined,
    title: '清理缓存',
  },
  {
    type: UPDATE,
    image: undefined,
    title: '检查更新',
  },
  {
    type: SERVICE,
    image: undefined,
    title: '用户服务协议',
  },
  {
    type: PRIVACY,
    image: undefined,
    title: '隐私政策',
  },
  {
    type: ABOUT_US,
    image: undefined,
    title: '关于我们',
  },
]


export const DATA_SOURCE = [
  {
    type: READ_GIFT,
    image: require('../../images/image_gift.png'),
    title: '福利任务',
  },
  {
    type: INVITE_FRIEND,
    image: require('../../images/image_invitefriend.png'),
    title: '邀请好友',
  },
  {
    type: NOTIFICATION,
    image: require('../../images/image_message.png'),
    title: '消息通知',
  },
  {
    type: MINE_COMMENTS,
    image: require('../../images/image_mine_message.png'),
    title: '我的想法',
  },
  {
    type: READ_RECORD,
    image: require('../../images/image_read_record.png'),
    title: '阅读记录',
  },
  // {
  //   type: GAME_CENTER,
  //   image: require('../../images/image_game_center.png'),
  //   title: '游戏中心',
  // },
  // {
  //   type: QUESTION,
  //   image: require('../../images/image_question.png'),
  //   title: '常见问题',
  // },
  {
    type: NIGHT_MODE,
    image: require('../../images/image_night_mode.png'),
    title: '夜间模式',
  },
  // {
  //   type: MUSIC_FEATURE,
  //   image: require('../../images/image_music.png'),
  //   title: '音乐开关',
  // },
  {
    type: SETTING,
    image: require('../../images/image_setting.png'),
    title: '设置',
  },
]

