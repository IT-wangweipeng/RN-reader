import React, {Component, PureComponent} from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  Easing,
  Image,
  PixelRatio,
  Platform,
} from 'react-native'


import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation';
import IMAGES from '../component/images'
import * as hotbeanActions from '../reducers/hotBeansReducer'


// 书城
import BookMarketPage from '../pages/market/BookMarketPage'
import DetailPage from '../pages/market/detail/DetailPage'
import SearchPage from '../pages/market/search/SearchPage'
import ViewMorePage from '../pages/market/viewmore/ViewMorePage'
import CompleteBookPage from '../pages/market/completebook/CompleteBookPage'
import SerializeBookPage from '../pages/market/serializebook/SerializeBookPage'
import RankPage from '../pages/market/rank/RankPage'
import DiscoveryPage from '../pages/market/discovery/DiscoveryPage'
import DiscoveryBookPage from '../pages/market/discovery/DiscoveryBookPage'
import DiscoveryAuthorPage from '../pages/market/discovery/DiscoveryAuthorPage'
import ShortessayBookPage from '../pages/market/shortessaybook/ShortessayBookPage'
import PublishingPostPage from '../pages/market/PublishingPostPage'
import BookCommentDettailePage from '../pages/market/BookCommentDetailPage'
import BookCommentsPage from '../pages/market/BookCommentsPage'
import AlertViewPage from '../component/AlertViewComponent'
import CommentPage from '../pages/market/CommentPage'
// 分类
import BookCategoryPage from '../pages/category/BookCategoryPage'
import SecondCatagoryPage from '../pages/category/SecondCatagoryPage'
// 趣读
import BookQuduPage from '../pages/qudu/BookQuduPage'
import WelfarePage from '../pages/welfare/WelfarePage'
// 书架
import BookshelfPage from '../pages/bookshelf/BookshelfPage'
import ReadHistoryPage from '../pages/bookshelf/ReadHistoryPage'
import EditBookshelfPage from '../pages/bookshelf/EditBookshelfPage'
import EditBookshelfTipsPage from '../pages/bookshelf/EditBookshelfTipsPage'
// 我的
import MinePage from '../pages/mine/MinePage'
import SettingPage from '../pages/mine/SettingPage'
import ReadPreferencePage from '../pages/mine/ReadPreferencePage'
import CategoryPreferencePage from '../pages/mine/CategoryPreferencePage'
import FeedbackPage from '../pages/mine/FeedbackPage'
import EditUserInfoPage from '../pages/mine/EditUserInfoPage'
import EditNicknamePage from '../pages/mine/EditNicknamePage'
import EditSexPage from '../pages/mine/EditSexPage'
import EditBirthdayPage from '../pages/mine/EditBirthdayPage'
import MissionRulesPage from '../pages/mine/MissionRulesPage'
import HotBeanRulesDetailPage from '../pages/mine/HotBeanRulesDetailPage'
import DeleteReadRecordTipsPage from '../pages/bookshelf/DeleteReadRecordTipsPage'
import CompletedBookPage from '../pages/mine/CompletedBookPage'
import NotificationPage from '../pages/mine/NotificationMessagePage'
import ReadTimeRecordPage from '../pages/mine/ReadTimeRecordPage'
import MineCommentsPage from '../pages/mine/MineCommentsPage'
import MineCommentListPage from '../pages/mine/MineCommentListPage'
import MineMessagePage from '../pages/mine/MineMessagePage'
// 登录
import LoginPage from '../pages/login/LoginPage'
import SplashPage from '../pages/login/SplashPage'
import GreetingViewPage from '../pages/login/GreetingViewPage'
import BindPhonePage from "../pages/login/BindPhonePage";
// Component
import WebPage from '../component/WebPage'
import WelfareWebPage from "../component/WelfareWebPage";
import BackComponent from '../component/BackComponent'
import SharePage from '../component/SharePage'
import LauncherAlertPage from '../component/LauncherAlertPage'
import NewWebPage from "../component/NewWebPage";


const MarketStack = createStackNavigator({
  Market: {
    screen: BookMarketPage,
    navigationOptions: ({navigation}) => ({
      header: null,
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
    })
  },
})

const BookCategoryStack = createStackNavigator({
  BookCategory: {
    screen: BookCategoryPage,
    navigationOptions: ({navigation}) => ({
      header: null
    })
  },
})

// const QuduStack = createStackNavigator({
//   Qudu: {
//     screen: BookQuduPage,
//     navigationOptions: ({navigation}) => ({
//       headerTitle: '趣读原创互动小说',
//       headerTitleStyle: {
//         fontSize: 20,
//       },
//       headerStyle: {
//         borderBottomWidth: 0,
//         elevation: 0,
//       },
//     })
//   },
// })

const WelfareStack = createStackNavigator({
  welfare: {
    screen: WelfareWebPage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "福利任务",
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
    })
  },
})

const BookshelfStack = createStackNavigator({
  Bookshelf: {
    screen: BookshelfPage,
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      }
    })
  },
})

const MineStack = createStackNavigator({
  Mine: {
    screen: MinePage,
    navigationOptions: ({navigation}) => ({
      headerTitle: '我的',
      header: null
    })
  },
})

const BottomTabStack = createBottomTabNavigator({
  Market: {
    screen: MarketStack,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: '书城',
      tabBarIcon: ({focused}) => (
        focused ? <Image source={IMAGES.tab_book_store_highlight}/> :
          <Image source={IMAGES.tab_book_store_default}/>
      )
    })
  },
  BookCategory: {
    screen: BookCategoryStack,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: '分类',
      tabBarIcon: ({focused}) => (
        focused ? <Image source={IMAGES.tab_book_category_highlight}/> :
          <Image source={IMAGES.tab_book_category_default}/>
      ),
      tabBarOnPress:({...tab}) => {
        const routes = navigation.state.routes[0]
        routes && routes.params && routes.params.onPressCategoryTab()
        tab.defaultHandler()
      }
    })
  },
  Welfare: {
    screen: WelfareStack,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: '福利',
      tabBarIcon: ({focused}) => (
        focused ? <Image source={IMAGES.tab_welfare_highlight}/> :
          <Image source={IMAGES.tab_welfare_default}/>
      ),
      // tabBarOnPress:({...tab}) => {
      //   const routes = navigation.state.routes[0]
      //   routes && routes.params && routes.params.onPressWelfareTab()
      //   tab.defaultHandler()
      // }
    })
  },
  // Qudu: {
  //   screen: QuduStack,
  //   navigationOptions: ({navigation}) => ({
  //     tabBarIcon: ({focused}) => (
  //       focused ? <Image source={IMAGES.tab_book_qudu_highlight}/> :
  //         <Image source={IMAGES.tab_book_qudu_default}/>
  //     ),
  //     tabBarLabel: ({focused}) => {
  //       return null
  //     }
  //   })
  // },
  Bookshelf: {
    screen: BookshelfStack,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: '书架',
      tabBarIcon: ({focused}) => (
        focused ? <Image source={IMAGES.tab_book_shelf_highlight}/> :
          <Image source={IMAGES.tab_book_shelf_default}/>
      )
    })
  },
  Mine: {
    screen: MineStack,
    navigationOptions: ({navigation}) => ({
      tabBarLabel: '我的',
      tabBarIcon: ({focused}) => (
        focused ? <Image source={IMAGES.tab_mine_highlight}/> : <Image source={IMAGES.tab_mine_default}/>
      ),
      tabBarOnPress:({...tab}) => {
        const routes = navigation.state.routes[0]
        routes && routes.params && routes.params.onPressMineTab()
        tab.defaultHandler()
      }

    })

  },
}, {
  initialRouteName: 'Bookshelf',
  backBehavior: 'none', //按 back 键是否跳转到第一个 Tab， none 为不跳转
  headerTitleAllowFontScaling: false,
  tabBarOptions: {
    activeTintColor: '#191d21',
    inactiveTintColor: '#a4a4a4',
    allowFontScaling: false,
  }
})

const PushStack = createStackNavigator({
  // Splash: {
  //   screen: SplashPage,
  //   navigationOptions: ({navigation}) => ({
  //     header: null
  //   })
  // },
  // Greeting: {
  //   screen: GreetingViewPage,
  //   navigationOptions: ({navigation}) => ({
  //     header: null
  //   })
  // },
  MainTab: {
    screen: BottomTabStack,
    navigationOptions: ({navigation}) => ({
      header: null
    })
  },
  ReadPreference: {
    screen: ReadPreferencePage,
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      // headerLeft: (
      //   <BackComponent router={navigation}/>
      // )
    })
  },
  ReadHistory: {
    screen: ReadHistoryPage,
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitle: "阅读记录",
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
    })
  },
  Feedback: {
    screen: FeedbackPage,
    navigationOptions: ({navigation}) => ({
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitle: "意见反馈",
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <View/>
      ),
    })
  },
  PublishingPost: {
    screen: PublishingPostPage,
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
    })
  },
  BookCommentDetail: {
    screen: BookCommentDettailePage,
    navigationOptions: ({navigation}) => ({
      headerTitle: '详情',
      headerStyle: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e5e5'
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
    })
  },
  EditUserInfo: {
    screen: EditUserInfoPage,
    navigationOptions: ({navigation}) => ({
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0,
        borderBottomColor: '#191D21'
      },
      headerTitle: "账号设置",
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <View/>
      ),
    })
  },
  Notification: {
    screen: NotificationPage,
    navigationOptions: ({navigation}) => ({
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e5e5'
      },
      headerTitle: "消息通知",
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  MineComment: {
    screen: MineCommentsPage,
    navigationOptions: ({navigation}) => ({
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e5e5'
      },
      headerTitle: "我的想法",
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  MineCommentList: {
    screen: MineCommentListPage,
    navigationOptions: ({navigation}) => ({
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e5e5'
      },
      headerTitle: "我的想法",
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  MineMessage: {
    screen: MineMessagePage,
    navigationOptions: ({navigation}) => ({
      header: null
    })
  },
  CategoryDetail: {
    screen: SecondCatagoryPage,
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <TouchableOpacity
          style={{
            marginEnd: 16,
            height: 44,
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('Search', {
            keywords: ''
          })}
        >
          <Image
            source={IMAGES.bookshelf_search}
          />
        </TouchableOpacity>
      ),
    })
  },
  Web: {
    screen: WebPage,
    navigationOptions: ({navigation}) => ({

    })
  },
  NewWeb: {
    screen: NewWebPage,
    navigationOptions: ({navigation}) => ({
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  BindPhone: {
    screen: BindPhonePage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "绑定手机",
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  Detail: {
    screen: DetailPage,
  },
  Search: {
    screen: SearchPage,
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
    })
  },
  ViewMore: {
    screen: ViewMorePage,
    navigationOptions: ({navigation}) => ({
      headerTitle: navigation.state.params.name,
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <View/>
      ),
    })
  },
  CompleteBook: {
    screen: CompleteBookPage,
    navigationOptions: ({navigation}) => ({
      header: null,
      // headerTitle: "完本",
      // headerTitleStyle: {
      //   flex: 1,
      //   textAlign: 'center',
      // },
      // headerStyle: {
      //   borderBottomWidth: 0,
      //   elevation: 0,
      // },
      // headerLeft: (
      //   <BackComponent router={navigation}/>
      // ),
      // headerRight: (
      //   <View/>
      // ),
    })
  },
  SerializeBook: {
    screen: SerializeBookPage,
    navigationOptions: ({navigation}) => ({
      header: null,
      // headerTitle: "连载",
      // headerTitleStyle: {
      //   flex: 1,
      //   textAlign: 'center',
      // },
      // headerStyle: {
      //   borderBottomWidth: 0,
      //   elevation: 0,
      // },
      // headerLeft: (
      //   <BackComponent router={navigation}/>
      // ),
      // headerRight: (
      //   <View/>
      // ),
    })
  },
  ShortessayBook: {
    screen: ShortessayBookPage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "短篇",
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <View/>
      ),
    })
  },
  Setting: {
    screen: SettingPage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "设置",
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <View/>
      ),
    })
  },
  Rank: {
    screen: RankPage,
    navigationOptions: ({navigation}) => ({
      header: null,
      // headerTitle: "排行榜",
      // headerTitleStyle: {
      //   flex: 1,
      //   textAlign: 'center',
      // },
      // headerStyle: {
      //   borderBottomWidth: 0,
      //   elevation: 0,
      // },
      // headerRight: (
      //   <TouchableOpacity
      //     style={{
      //       marginEnd: 16,
      //       height: 44,
      //       justifyContent: 'center',
      //     }}
      //     onPress={() => navigation.navigate('Search')}
      //   >
      //     <Image
      //       source={IMAGES.image_rank_search}
      //     />
      //   </TouchableOpacity>
      // ),
      // headerLeft: (
      //   <BackComponent router={navigation}/>
      // ),
    })
  },
  Discovery: {
    screen: DiscoveryPage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "发现",
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <View/>
      ),
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
    })
  },
  DiscoveryBook: {
    screen: DiscoveryBookPage,
    navigationOptions: ({navigation}) => ({
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <View/>
      ),
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
    })
  },
  DiscoveryAuthor: {
    screen: DiscoveryAuthorPage,
    navigationOptions: ({navigation}) => ({
      headerLeft: (
        <BackComponent router={navigation}/>
      ),
      headerRight: (
        <View/>
      ),
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
    })
  },
  CategoryPreference: {
    screen: CategoryPreferencePage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "阅读口味",
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  MissionRules: {
    screen: MissionRulesPage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "规则",
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  HotBeanDetail: {
    screen: HotBeanRulesDetailPage,
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  BookComments: {
    screen: BookCommentsPage,
    navigationOptions: ({navigation}) => ({
      header: null
      // headerStyle: {
      //   borderBottomWidth: 0,
      //   elevation: 0,
      // },
      // headerLeft: (
      //   <BackComponent router={navigation}/>
      // )
    })
  },
  CompletedBook: {
    screen: CompletedBookPage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "读完",
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
  ReadTime: {
    screen: ReadTimeRecordPage,
    navigationOptions: ({navigation}) => ({
      headerTitle: "阅读时间",
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerLeft: (
        <BackComponent router={navigation}/>
      )
    })
  },
}, {
  headerMode: 'screen'
})

const RootStack = createStackNavigator(
  {
    Main: PushStack,
    // DetailModal: DetailPage,
    Login: {
      screen: LoginPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
      })
    },
    EditBookshelf: {
      screen: EditBookshelfPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: '啊哈哈哈'
      })
    },
    Share: {
      screen: SharePage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
    EditBookshelfTips: {
      screen: EditBookshelfTipsPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
    LauncherAlert: {
      screen: LauncherAlertPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
    AlertView: {
      screen: AlertViewPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
    Comment: {
      screen: CommentPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
    EditNickname: {
      screen: EditNicknamePage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
    EditSex: {
      screen: EditSexPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
    EditBirthday: {
      screen: EditBirthdayPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
    DeleteReadRecordTips: {
      screen: DeleteReadRecordTipsPage,
      navigationOptions: ({navigation}) => ({
        gesturesEnabled: false,
        title: null,
      })
    },
  }, {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      opacity: 1,
    },
    transitionConfig: () => ({
      screenInterpolator: props => {
        const { position, scene } = props;
        const { index } = scene;
        const opacity = position.interpolate({
          inputRange: [index - 0.7, index, index + 0.7],
          outputRange: [0.3, 1, 0.3],
        });
        return {
          opacity,
        };
      },
      containerStyle: {
        backgroundColor: 'transparent',
      },
    }),
  }
)

const TabNavigator = createAppContainer(RootStack);

export default TabNavigator;
