import {combineReducers} from 'redux'
import category from './categoryReducer'
import login from './loginReducer'
import user from './userReducer'
import bookshelf from './bookshelfReducer'
import marketSearchRecommend from './marketSearchRecommendReducer'
import bookDetail from './bookDetailReducer'
import bookRelated from './bookRelatedReducer'
import bookChapterList from './bookChapterListReducer'
import searchWord from './searchWordReducer'
import search from './searchReducer'
import searchRecommend from './searchRecommendReducer'
import searchBanner from './searchBannerReducer'
import bookFavorites from './bookFavoritesReducer'
import bookCounter from './bookCounterReducer'
import viewMore from './viewMoreReducer'
import completeBookMale from './completeBookMaleReducer'
import completeBookFemale from './completeBookFemaleReducer'
import completeBookTushu from './completeBookTushuReducer'
import serializeBookMale from './serializeBookMaleReducer'
import serializeBookFemale from './serializeBookFemaleReducer'
import serializeBookTushu from './serializeBookTushuReducer'
import shortessayBook from './shortessayBookReducer'
import categoryDetail from './categoryDetailReducer'
import rankMaleRenqi from './rankMaleRenqiReducer'
import rankMaleFavorite from './rankMaleFavoriteReducer'
import rankFemaleRenqi from './rankFemaleRenqiReducer'
import rankFemaleFavorite from './rankFemaleFavoriteReducer'
import rankTushuRenqi from './rankTushuRenqiReducer'
import rankTushuFavorite from './rankTushuFavoriteReducer'
import discovery from './discoveryReducer'
import discoverySecondary from './discoverySecondaryReducer'
import discoveryRecommend from './discoveryRecommendReducer'
import discoveryRecommendChange from './discoveryRecommendChangeReducer'
import preference from './submitePreferenceReducer'
import bookRecommend from './bookshelfBanner'
import creditScore from './creditScoreReducer'
import hotBeans from './hotBeansReducer'
import completedBook from './completedBookReducer'
import readTime from './readTimeReducer'
import notification from './notificationReducer'
import qudu from './quduReducer'
import bookComment from './bookCommentReducer'
import mineComment from './mineCommentListReducer'
import mineMessage from './mineMessageReducer'



const reducers = combineReducers({
  login,
  category,
  user,
  bookshelf,
  marketSearchRecommend,
  bookDetail,
  bookRelated,
  bookChapterList,
  searchWord,
  search,
  searchRecommend,
  searchBanner,
  bookFavorites,
  bookCounter,
  viewMore,
  completeBookMale,
  completeBookFemale,
  completeBookTushu,
  serializeBookMale,
  serializeBookFemale,
  serializeBookTushu,
  shortessayBook,
  categoryDetail,
  rankMaleRenqi,
  rankMaleFavorite,
  rankFemaleRenqi,
  rankFemaleFavorite,
  rankTushuRenqi,
  rankTushuFavorite,
  discovery,
  discoverySecondary,
  discoveryRecommend,
  discoveryRecommendChange,
  preference,
  bookRecommend,
  creditScore,
  hotBeans,
  completedBook,
  readTime,
  notification,
  qudu,
  bookComment,
  mineComment,
  mineMessage,
})

export default reducers
