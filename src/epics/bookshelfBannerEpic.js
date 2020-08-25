import {of, from, forkJoin} from 'rxjs'
import {map, flatMap, catchError} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import {BookshelfBannerApi, BookshelfRecommendRefreshApi, BookshelfHornApi} from '../apis/Api'
import * as actions from '../reducers/bookshelfBanner'
import {showToast} from '../actions/toastAction'


const bookshelfBannerEpic = action$ => action$.pipe(
  ofType(actions.BOOKSHELF_BANNER_INIT),
  flatMap((it) => {
    return forkJoin(BookshelfBannerApi(6), BookshelfHornApi())
  }),
  map(ret => {
    console.log('itsss ======== ', ret)
    const bannerData = ret[0]
    const hornData = ret[1]
    if (bannerData.status === 200 && hornData.status === 200) {
      const banners = bannerData.data
      const horns = hornData.data
      return actions.bookshelfBannerSuccessAction({
        banners,
        horns
      })
    } else {
      showToast(ret.message)
      return actions.bookshelfBannerFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.bookshelfBannerFailedAction()
    }
  })
)

const bookshelfRecommendRefreshEpic = action$ => action$.pipe(
  ofType(actions.BOOKSHELF_RECOMMEND_REFRESH_INIT),
  flatMap((it) => {
    return BookshelfRecommendRefreshApi(3)
  }),
  map(ret => {
    console.log('it ======== ', ret)
    if (ret.status === 200) {
      return actions.bookshelfRecommendRefreshInitSuccessAction(ret)
    } else {
      showToast(ret.message)
      return actions.bookshelfRecommendRefreshInitFailedAction()
    }
  }),
  catchError((error) => {
    if (error.message) {
      showToast(error.message)
      return actions.bookshelfRecommendRefreshInitFailedAction()
    }
  })
)



export default combineEpics(bookshelfBannerEpic, bookshelfRecommendRefreshEpic)
