import {combineEpics} from 'redux-observable'
import categoryEpic from './categoryEpic'
import bookshelfEpic from './bookshelfEpic'
import marketSearchRecommendEpic from './marketSearchRecommendEpic'
import bookDetailEpic from './bookDetailEpic'
import bookRelatedEpic from './bookRelatedEpic'
import bookChapterListEpic from './bookChapterListEpic'
import searchWordEpic from './searchWordEpic'
import searchEpic from './searchEpic'
import searchRecommendEpic from './searchRecommendEpic'
import searchBannerEpic from './searchBannerEpic'
import bookFavoritesEpic from './bookFavoritesEpic'
import bookCounterEpic from './bookCounterEpic'
import viewMoreEpic from './viewMoreEpic'
import completeBookMaleEpic from './completeBookMaleEpic'
import completeBookFemaleEpic from './completeBookFemaleEpic'
import completeBookTushuEpic from './completeBookTushuEpic'
import serializeBookMaleEpic from './serializeBookMaleEpic'
import serializeBookFemaleEpic from './serializeBookFemaleEpic'
import serializeBookTushuEpic from './serializeBookTushuEpic'
import shortessayBookEpic from './shortessayBookEpic'
import categoryDetailEpic from './categoryDetailEpic'
import rankMaleRenqiEpic from './rankMaleRenqiEpic'
import rankMaleFavoriteEpic from './rankMaleFavoriteEpic'
import rankFemaleRenqiEpic from './rankFemaleRenqiEpic'
import rankFemaleFavoriteEpic from './rankFemaleFavoriteEpic'
import rankTushuRenqiEpic from './rankTushuRenqiEpic'
import rankTushuFavoriteEpic from './rankTushuFavoriteEpic'
import discoveryEpic from './discoveryEpic'
import discoverySecondaryEpic from './discoverySecondaryEpic'
import discoveryRecommendEpic from './discoveryRecommendEpic'
import discoveryRecommendChangeEpic from './discoveryRecommendChangeEpic'
import submitPreferenceEpic from './savePreferenceEpic'
import bookshelfBannerEpic from './bookshelfBannerEpic'
import userEpic from './userEpic'
import creditScore from './creditScoreEpic'
import hotBeansEpic from './hotBeansEpic'
import completedBookEpic from './completedBookEpic'
import readTimeEpic from './readTimeEpic'
import notificationEpic from './notificationEpic'
import quduEpic from './quduEpic'
import bookCommentEpic from './bookCommentEpic'
import mineCommentEpic from './mineCommentsEpic'
import mineMessageEpic from './mineMessageEpic'


export default combineEpics(
  categoryEpic,
  bookshelfEpic,
  marketSearchRecommendEpic,
  bookDetailEpic,
  bookRelatedEpic,
  bookChapterListEpic,
  searchWordEpic,
  searchEpic,
  searchBannerEpic,
  searchRecommendEpic,
  bookFavoritesEpic,
  bookCounterEpic,
  viewMoreEpic,
  completeBookMaleEpic,
  completeBookFemaleEpic,
  completeBookTushuEpic,
  serializeBookMaleEpic,
  serializeBookFemaleEpic,
  serializeBookTushuEpic,
  shortessayBookEpic,
  categoryDetailEpic,
  rankMaleRenqiEpic,
  rankMaleFavoriteEpic,
  rankFemaleRenqiEpic,
  rankFemaleFavoriteEpic,
  rankTushuRenqiEpic,
  rankTushuFavoriteEpic,
  discoveryEpic,
  discoverySecondaryEpic,
  discoveryRecommendEpic,
  discoveryRecommendChangeEpic,
  submitPreferenceEpic,
  bookshelfBannerEpic,
  userEpic,
  creditScore,
  hotBeansEpic,
  completedBookEpic,
  readTimeEpic,
  notificationEpic,
  quduEpic,
  bookCommentEpic,
  mineCommentEpic,
  mineMessageEpic
)

