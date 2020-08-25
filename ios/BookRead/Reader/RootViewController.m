//
//  RootViewController.m
//  Reader
//
//  Created by Droi on 2019/10/15.
//  Copyright © 2019 JY. All rights reserved.
//

#import <UMAnalytics/MobClick.h>
#import <BUAdSDK/BUNativeAdsManager.h>
#import <AVFoundation/AVFoundation.h>
#import "RootViewController.h"
#import "PageContentController.h"
#import "TYAttributedLabel.h"
#import "ReaderChapter.h"
#import "ReaderPage.h"
#import "BUDAdManager.h"
#import "BookContentModel.h"
#import "TReaderManager.h"
#import "EReaderTopBar.h"
#import "EReaderFontBar.h"
#import "UIView+NIB.h"
#import "AppDelegate.h"
#import "BookContentFetcher.h"
#import "DBManager.h"
#import "MBProgressHUD+Message.h"
#import "NSString+Rex.h"
#import "ReaderHeader.h"
#import "PushTransition.h"
#import "UIColor+TReaderTheme.h"
#import "ShareViewController.h"
#import "BookEventEmitter.h"
#import "AdViewController.h"
#import "EBookCatalogController.h"
#import "UserUtil.h"
#import "UserDefaults.h"
#import "AFNetworking.h"
#import "MusicPanelViewController.h"
#import "TipsViewController.h"
#import "AVPlayerManager.h"
#import "MusicModel+ModelTransform.h"
#import "VipBookManager.h"
#import "TimeUtil.h"
#import "BUDAdManager.h"
#import "BottomAdsView.h"
#import "ADAnalysis.h"
#import "NetworkManager.h"
#import "EMaskView.h"
#import "BrightnessManager.h"
#import "PartformUtil.h"
#import "RDProgressView.h"
#import "HotBeanView.h"
#import "TXAdsManager.h"
#import "FeedAdsRequestManager.h"
#import "RequestBottomBannerAdsManager.h"
#import "RandomAdsGenerate.h"


#define BOTTOM_ADS_VIEW_HEIGHT 44
#define AD_COUNT 5

@interface RootViewController ()
<
UIPageViewControllerDelegate,
UIPageViewControllerDataSource,
UINavigationControllerDelegate,
EReaderTopBarDelegate,
EReaderFontBarDelegate,
EBookCatalogControllerDelegate,
BUNativeAdDelegate,
BottomAdsViewDelegate,
AdViewControllerDelegate,
PageContentControllerDelegate,
LoadFeedAdsDelegate,
RequestBottomBannerAdsManagerDelegate
>


@property (nonatomic, weak) EReaderTopBar *topBar;
@property (nonatomic, weak) EReaderFontBar *fontBar;
@property (nonatomic, strong) PageContentController *pageVC;
@property (nonatomic, strong) ReaderChapter *readerChapter;
@property (nonatomic, strong) BookChapterContentModel *chapterModel;
@property (nonatomic, strong) AdViewController *adVC;
@property (nonatomic, copy) NSArray *pageInternalAds;
@property (nonatomic, strong) NSArray *musicData;
@property (nonatomic, strong) BottomAdsView *bottomAdsView;

@property (nonatomic, strong) UIButton *hotbeanButton;
@property (nonatomic, strong) NSTimer *refreshAdsTimer;
@property (nonatomic, strong) UIImageView *bottomImageView;
@property (nonatomic, strong) UIView *EMaskView;
@property (nonatomic, strong) UIPageViewController *pageController;
@property (nonatomic, strong) NSTimer *controlTimer;
@property (nonatomic, strong) NSTimer *readTimer;

@property (nonatomic, assign) NSInteger readOffset;
@property (nonatomic, assign) NSUInteger currentIndex;
@property (nonatomic, assign) NSUInteger nextIndex;
@property (nonatomic, assign) NSInteger startTimestamp;
@property (nonatomic, assign) BOOL showPannel;
@property (nonatomic, assign) BOOL statusBarHidden;
@property (nonatomic, assign) BOOL isWifiOnly;
@property (nonatomic, assign) BOOL showAd;
@property (nonatomic, strong) FeedAdsRequestManager *manager;
@property (nonatomic, strong) RequestBottomBannerAdsManager *bannerAdManager;


@end


@implementation RootViewController {
  NSInteger _backgroundTimestamp;
  NSInteger _enterBackgroundDuration;
  NSString *_token;
  NSInteger _totalReadTime;

  NSInteger _count;
  BOOL _isReview;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    _backgroundTimestamp = 0;
    _enterBackgroundDuration = 0;
    _isWifiOnly = NO;
    _statusBarHidden = YES;
    _startTimestamp = [TimeUtil timestampSinceNow:0];
    _token = [UserUtil token];
    _totalReadTime = 0;
    _count = 0;
    _isReview = [UserDefaults boolForKey:IS_REVIEW_VERSION];
  }
  return self;
}

- (void)setupPageViewController
{
  UIPageViewController *pageController = [[UIPageViewController alloc]
                                          initWithTransitionStyle:UIPageViewControllerTransitionStylePageCurl
                                          navigationOrientation:UIPageViewControllerNavigationOrientationHorizontal
                                          options:nil];
  self.pageController = pageController;
  self.pageController.view.backgroundColor = [UIColor redColor];
  CGRect rect = self.view.frame;
  pageController.view.frame = CGRectMake(0, 0, rect.size.width, rect.size.height - BOTTOM_ADS_VIEW_HEIGHT);
  PageContentController *pageVC = [self viewControllerAtIndex:self.currentIndex];
  [self.pageController setViewControllers:@[pageVC]
                                direction:UIPageViewControllerNavigationDirectionForward
                                 animated:YES
                               completion:nil];

  [self addChildViewController:pageController];
  [self.view addSubview:pageController.view];
  self.pageController.delegate = self;
  self.pageController.dataSource = self;
  UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc]
                                        initWithTarget:self
                                        action:@selector(singleTapAction:)];
  [self.view addGestureRecognizer:tapGesture];
}

- (void)viewDidDisappear:(BOOL)animated {
  [super viewDidDisappear:animated];

  self.hotbeanButton.hidden = YES;
  
  [_readTimer invalidate];
  [_controlTimer invalidate];
  [_refreshAdsTimer invalidate];
  _readTimer = nil;
  _controlTimer = nil;
  _refreshAdsTimer = nil;
  
}

- (void)dealloc
{
  NSLog(@"RootVC 释放了");
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];

  if (_isReview) {
    self.hotbeanButton.hidden = YES;
  } else {
    self.hotbeanButton.hidden = NO;
  }
  [self.navigationController setNavigationBarHidden:YES animated:YES];
}

- (void)viewDidLoad {
  [super viewDidLoad];

  [self loadReadTime];
  [self loadChapterContent];

  [BUDAdManager shareInstance].start_ad_ts = self.bookModel.start_ad_ts;
  [BUDAdManager shareInstance].end_ad_ts = self.bookModel.end_ad_ts;

  self.navigationController.delegate = self;



  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(appWillTerminate:)
                                               name:UIApplicationWillTerminateNotification
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(applicationDidBecomeActive:)
                                               name:UIApplicationDidBecomeActiveNotification
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(applicationDidEnterBackground:)
                                               name:UIApplicationDidEnterBackgroundNotification
                                             object:nil];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(userLogin:)
                                               name:TReaderUserLoginNofication
                                             object:nil];

  [self changeViewTheme];
  [self setupProgressView];

  [self controlTimer];
  [self bottomImageView];
  [self loadAds];
}

- (void)loadAds
{
  if ([BUDAdManager isAdsEnable] && [RandomAdsGenerate canShowAds]) {
    if ([RandomAdsGenerate isGDTAds]) {
      [self loadBottomBannerGTDAds];
      [self loadPageInternalGDTFeedsAds];
    } else {
      [self loadBUDPageInternalBannerAds];
      [self loadBottomBannerBUDAds];
    }
    [self refreshAdsTimer];
  } else {
    [self removeAds];
  }
}

// 每30s刷新广告
- (void)refreshAds
{
  if ([RandomAdsGenerate isGDTAds]) {
    [self loadBottomBannerGTDAds];
  } else {
    [self loadBottomBannerBUDAds];
  }
}

- (void)loadReadTime {
  if (!_token || [_token isEqualToString:@""]) {
    return;
  }
  [[NetworkManager shareInstance] request:RequestTypePost
                                urlString:READ_TIME_API
                                parameter:@{@"token" : _token}
                              resultBlock:^(id obj, NSError *error) {
    if (error) {
      [MBProgressHUD showMessage:error.localizedDescription];
      return;
    }

    NSInteger status = [[obj objectForKey:@"status"] integerValue];
    if (status != 200) {
      [MBProgressHUD showMessage:[obj objectForKey:@"message"]];
      return;
    }

    NSDictionary *data = [obj objectForKey:@"data"];
    self->_totalReadTime = [[data objectForKey:@"ts"] integerValue];


  }];
}

- (void)timerFire:(NSTimer *)timer {
  _totalReadTime = _totalReadTime + 1;;
  NSLog(@"totalReadTime ===== %ld", (long)_totalReadTime);
  // 阅读时长类型（5阅读30分钟；6阅读60；7阅读120；18阅读180）
  // 每日最高可得1000热豆
  if (1800 == _totalReadTime) {
    [self incrementHotBean:5];
  } else if (3600 == _totalReadTime) {
    [self incrementHotBean:6];
  } else if (7200 == _totalReadTime) {
    [self incrementHotBean:7];
  } else if (10800 == _totalReadTime) {
    [self incrementHotBean:18];
  }
}


- (void)controlTimerFire:(NSTimer *)timer
{
  NSLog(@"count ================ %ld", (long)_count);

  if (0 == _count) {
    [self readTimer];
  }

  _count ++;
  if (302 == _count) {
    // 停止阅读计时计时
    [_readTimer invalidate];
    _readTimer = nil;
  }
}

- (void)incrementHotBean:(NSInteger)type
{
  [[NetworkManager shareInstance] request:RequestTypePost
                                urlString:READ_HOTBEANS_API
                                parameter:@{@"token" : _token, @"task_type" : @(type)}
                              resultBlock:^(id obj, NSError *error) {
    if (error) {
      [MBProgressHUD showMessage:error.localizedDescription];
      return;
    }

    NSInteger status = [[obj objectForKey:@"status"] integerValue];
    if (status != 200) {
      [MBProgressHUD showMessage:[obj objectForKey:@"message"]];
      return;
    }

    NSInteger min = 0;
    NSInteger hotbean = 0;
    switch (type) {
      case 5:
        min = 30;
        hotbean = 100;
        break;
      case 6:
        min = 60;
        hotbean = 200;
        break;
      case 7:
        min = 120;
        hotbean = 500;
        break;
      case 18:
        min = 180;
        hotbean = 1000;
        break;
      default:
        break;
    }

    NSString *title = [NSString stringWithFormat:@"已阅读%ld分钟", (long)min];
    NSString *msg = [NSString stringWithFormat:@"恭喜获得%ld热豆", (long)hotbean];
    [self showAlertWithTitle:title message:msg];
  }];
}

- (void)showAlertWithTitle:(NSString *)title message:(NSString *)message {
  UIAlertController *alert = [UIAlertController alertControllerWithTitle:title
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];
  [alert addAction:[UIAlertAction actionWithTitle:@"确定"
                                              style:UIAlertActionStyleDefault
                                            handler:^(UIAlertAction * _Nonnull action) {

                                            }]];
  [self presentViewController:alert animated:YES completion:nil];
}

- (void)setupProgressView {
  UIButton *hotbeanButton = [UIButton buttonWithType:UIButtonTypeSystem];
  self.hotbeanButton = hotbeanButton;
  [hotbeanButton setBackgroundImage:[UIImage imageNamed:@"hot_bean"] forState:UIControlStateNormal];
  [hotbeanButton addTarget:self action:@selector(hotbeanButtonAction:) forControlEvents:UIControlEventTouchUpInside];
  CGFloat buttonY = -6;
  CGFloat buttonW = 20;
  CGFloat buttonH = 20;
  CGFloat buttonX = self.view.frame.size.width - buttonW - 15;

  if ([PartformUtil isIPhoneXSupport]) {
    if (@available(iOS 11.0, *)) {
      UIEdgeInsets edgeInsets = [UIApplication sharedApplication].delegate.window.safeAreaInsets;
      buttonY = edgeInsets.top;
      hotbeanButton.frame = CGRectMake(buttonX, buttonY, buttonW, buttonH);
    }
  } else {
    buttonY = 14;
    hotbeanButton.frame = CGRectMake(buttonX, buttonY, buttonW, buttonH);
  }
  UIWindow *keyWindow = [[[UIApplication sharedApplication] delegate] window];
  [keyWindow addSubview:hotbeanButton];
}

- (void)hotbeanButtonAction:(UIButton *)button {
  [self showAlertWithTitle:@"" message:@"每天正常在线阅读获得热豆。阅读越多，奖励越多哦！"];
}

// MARK: - UIPageViewControllerDataSource
// 返回上一个视图控制器。
- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(UIViewController *)viewController
{
  NSUInteger index;
  if ([viewController isMemberOfClass:[AdViewController class]]) {
    index = ((AdViewController *)viewController).itemIndex;
    if (self.adVC.goPre == NO) {
      index = index + 1;
    }
  } else {
    index = ((PageContentController *)viewController).itemIndex;
  }

  if (index == NSNotFound) {
    return nil;
  }

 if ([BUDAdManager isAdsEnable] && index != 0 && index % AD_COUNT == 0 && self.adVC != viewController && self.pageInternalAds.count > 0) {
    AdViewController *adVC = [[AdViewController alloc] initWithNibName:@"AdViewController" bundle:[NSBundle mainBundle]];
    adVC.delegate = self;
   adVC.ads = self.pageInternalAds;
    adVC.itemIndex = index;
    adVC.goPre = YES;
    adVC.goNext = NO;
    self.adVC = adVC;
    return adVC;
  }


  if (self.chapterIndex == 0 && index == 0) {
    [MBProgressHUD showMessage:@"已经是第一页"];
    return nil;
  } else {
    if (index == 0) {
      [self resetPrePage];
      [self loadAds];
      return nil;
    }
  }

  // 当前章节的前一页
  --index;
  PageContentController *vc = [self viewControllerAtIndex:index];
  self.pageVC.currentPage = [self showPage:index];
  [self.pageVC updatePageContent:self.pageVC.currentPage];
  return vc;
}

// 返回下一个视图控制器
- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController
       viewControllerAfterViewController:(UIViewController *)viewController
{
  NSUInteger index;
  if ([viewController isMemberOfClass:[AdViewController class]]) {
    index = ((AdViewController *)viewController).itemIndex;
    if (self.adVC.goNext == NO) {
      index = index - 1;
    }
  } else {
    index = ((PageContentController *)viewController).itemIndex;
  }

  if (index == NSNotFound) {
    return nil;
  }

  NSUInteger totalPage = self.readerChapter.totalPage - 1;
  if ([BUDAdManager isAdsEnable] && index != totalPage && (index + 1) % AD_COUNT == 0 && self.adVC != viewController && self.pageInternalAds.count > 0) {
    AdViewController *adVC = [[AdViewController alloc] initWithNibName:@"AdViewController" bundle:[NSBundle mainBundle]];
    adVC.delegate = self;
    adVC.ads = self.pageInternalAds;
    adVC.itemIndex = index;
    adVC.goNext = YES;
    adVC.goPre = NO;
    self.adVC = adVC;
    return adVC;
  }

  NSUInteger totalChapter = self.bookModel.chapters.count - 1;
  if (self.chapterIndex == totalChapter && index == totalPage) {
    // 最后一章，最后一页
    [MBProgressHUD showMessage:@"全书完"];
    return nil;
  } else {
    // 本章节结束，加载下一章节
    if (index == totalPage) {
      self.currentIndex = 0;
      [self loadNextChapter];
      [self loadAds];
      return nil;
    }
  }

  // 本章节下一页
  ++index;
  PageContentController *vc = [self viewControllerAtIndex:index];
  self.pageVC.currentPage = [self showPage:index];
  [self.pageVC updatePageContent:self.pageVC.currentPage];
  return vc;
}

// 返回指定index的视图控制器
- (PageContentController *)viewControllerAtIndex:(NSUInteger)index {
//  PageContentController *pageVC = [[PageContentController alloc] init];
  PageContentController *pageVC = [[PageContentController alloc] initWithNibName:@"PageContentController" bundle:[NSBundle mainBundle]];
  self.pageVC = pageVC;
  pageVC.itemIndex = index;
  pageVC.delegate = self;
//  pageVC.delegate = self;
  pageVC.view.frame = self.pageController.view.frame;
  return pageVC;
}


// MARK: - UIPageViewControllerDelegate
// 手势导航开始前调用该方法。
- (void)pageViewController:(UIPageViewController *)pageViewController willTransitionToViewControllers:(NSArray<UIViewController *> *)pendingViewControllers {
  // 如果终止了滑动导航，transition将不能完成，页面也将保持不变。
  UIViewController *pendingVC = pendingViewControllers.firstObject;
  if ([pendingVC isMemberOfClass:[PageContentController class]]) {
    PageContentController *pageVC = (PageContentController *)pendingVC;
    if (pageVC) {
      self.nextIndex = pageVC.itemIndex;
      NSLog(@"index ==== next: %lu, current: %lu", (unsigned long)self.nextIndex, (unsigned long)self.currentIndex);
      // 滑动方向
      if (self.currentIndex < self.nextIndex) {
        NSLog(@"向前");
      } else {
        NSLog(@"向后");
      }
    }
  }
}

// 手势导航结束后调用该方法。
- (void)pageViewController:(UIPageViewController *)pageViewController didFinishAnimating:(BOOL)finished previousViewControllers:(NSArray<UIViewController *> *)previousViewControllers transitionCompleted:(BOOL)completed {
  if (completed) {
    self.currentIndex = self.nextIndex;
    _count = 0;
  }
}

- (void)loadChapterContent {
  NSInteger bookId = _bookModel.book_id;
  BookContentModel *bookContent = [[DBManager shareInstance] queryBook:bookId];
  NSInteger chapterID = [bookContent.chapter_id integerValue];
  NSInteger readPage = [bookContent.page integerValue];

  NSLog(@"self.chapterIndex ---------- %ld", self.chapterIndex);
  if (_bookModel.chapters.count == 0) {
    [MBProgressHUD showMessage:@"章节不存在"];
    return;
  }

  if (self.chapterIndex == -1) {
    // 从数据库查询当前书本的阅读记录
    chapterID = [bookContent.chapter_id integerValue];
    self.chapterIndex = [self chapterIndexWithChapterId:bookContent];
    if (chapterID == 0) {
      // 没有查询到，默认第一章节
      BookChapterModel *chapter = _bookModel.chapters[0];
      chapterID = chapter.chapter_id;
      self.chapterIndex = 0;
      readPage = 0;
    }
  } else {
    // 从详情某个章节开始阅读
    BookChapterModel *model = _bookModel.chapters[self.chapterIndex];
    chapterID = model.chapter_id;
    readPage = 0;
  }
  self.currentIndex = readPage;

  [self setupPageViewController];

  WS(weakSelf)
  [self fetchChapterContentWithBookId:bookId
                            chapterId:chapterID
                             callback:^(BookChapterContentModel *m) {
                               [weakSelf parserChatpterContent];
                             }];

}

// MARK: - PageContentControllerDelegate
- (void)vipButtonClicked
{
  if (![UserUtil hasLogin]) {
    [self postLoginNotification];
  }
  [self popViewController];
  [[NSNotificationCenter defaultCenter] postNotificationName:ClickVipButtonActionNotification
                                                      object:self
                                                    userInfo:[self bookInfo]];
}

- (void)removeAds
{
  NSLog(@"移除广告 ======= ");
  self.pageInternalAds = nil;
  [self.bottomAdsView removeFromSuperview];
  _bottomAdsView = nil;
}

// MARK: - EReaderFontBarDelegate
- (void)readerFontBar:(EReaderFontBar *)readerFontBar changeReaderTheme:(NSInteger)readerTheme {
  [TReaderManager saveReaderTheme:readerTheme];
  if (readerTheme == TReaderThemeNight) {
    [BrightnessManager saveNightModeEnable:YES];
  } else {
    [BrightnessManager saveNightModeEnable:NO];
  }
  if ([TReaderManager readerTheme] == TReaderThemeNight) {
    self.EMaskView.hidden = NO;
  } else {
    self.EMaskView.hidden = YES;
  }
  _topBar.titleLabel.textColor = ([TReaderManager readerTheme] == TReaderThemeNight) ? [UIColor RGB:142 g:142 b:142] : [UIColor RGB:30 g:37 b:47];
  [self changeViewTheme];
}

// 改变字体
- (void)readerFontBar:(EReaderFontBar *)readerFontBar changeReaderFont:(BOOL)increaseSize {
  if (increaseSize) {
    [self increaseChangeSizeAction];
  }else {
    [self decreaseChangeSizeAction];
  }
}

// 点击目录
- (void)selectedCatalog {
  [self hidenTopBar];
  [self hideFontToolBar];

  NSLog(@":info:章节index ========== %ld", self.chapterIndex);
  UIImage *snapImage = [self snapView];
  EBookCatalogController *catalogVC = [[EBookCatalogController alloc]init];
  catalogVC.chapters = _bookModel.chapters;
  catalogVC.delegate = self;
  catalogVC.bgImage = snapImage;
  catalogVC.currentChapterIndex = self.chapterIndex;
  catalogVC.bookModel = self.bookModel;
  [self.navigationController pushViewController:catalogVC animated:YES];
}

- (ReaderChapter *)parserChapterWithModel:(BookChapterContentModel *)model
{
  [self.readerChapter parseModel:model renderSize:[self renderSize]];
  return _readerChapter;
}

// 当前章节的上一章节，阅读最后一页
- (void)resetPrePage
{
  self.chapterIndex -= 1;
  WS(weakSelf);
  [self fetchChapterContent:^(BookChapterContentModel *m) {
    ReaderChapter *chapter = [weakSelf parserChapterWithModel:m];
    NSUInteger pageIndex = chapter.totalPage - 1;
    ReaderPage *page = [weakSelf showPage:pageIndex];
    weakSelf.currentIndex = pageIndex;
    [weakSelf resetPageViewController];
    weakSelf.pageVC.currentPage = page;
    [weakSelf.pageVC updatePageContent:page];
    [weakSelf preOrNextchapterButtonEnable];
  }];

}

// 上一章
- (void)loadPreChapter {
  self.chapterIndex -= 1;
  NSLog(@":info:章节index ========== %ld", self.chapterIndex);
  [self resetPageViewController];
  WS(weakSelf);
  [self fetchChapterContent:^(BookChapterContentModel *m) {
    [weakSelf parserChatpterContent];
    [weakSelf preOrNextchapterButtonEnable];
  }];
}

// 下一章
- (void)loadNextChapter {
  self.chapterIndex += 1;
  self.currentIndex = 0;
  NSLog(@":info:章节index ========== %ld", self.chapterIndex);
  [self resetPageViewController];
  WS(weakSelf);
  [self fetchChapterContent:^(BookChapterContentModel *m) {
    [weakSelf parserChatpterContent];
    [weakSelf preOrNextchapterButtonEnable];
  }];
}

- (void)resetPageViewController
{
  [self.pageVC removeFromParentViewController];
  PageContentController *vc = [self viewControllerAtIndex:self.currentIndex];
  [self.pageController setViewControllers:@[vc]
                                direction:UIPageViewControllerNavigationDirectionForward
                                 animated:NO
                               completion:nil];
}

// 获取章节内容
- (void)fetchChapterContent:(void(^)(BookChapterContentModel *m))callback {
  BookChapterModel *m = _bookModel.chapters[self.chapterIndex];
  [self fetchChapterContentWithBookId:m.book_id
                            chapterId:m.chapter_id
                             callback:^void(BookChapterContentModel *ret)
   {
   callback(ret);
   }];
}

- (void)preOrNextchapterButtonEnable {
  if (self.chapterIndex == 0) {
    [self.fontBar enablePreChapterBtn: NO];
    [self.fontBar enableNextChapterBtn:YES];
  } else if (self.chapterIndex < self.bookModel.chapters.count - 1) {
    [self.fontBar enablePreChapterBtn:YES];
    [self.fontBar enableNextChapterBtn:YES];
  } else {
    [self.fontBar enablePreChapterBtn: YES];
    [self.fontBar enableNextChapterBtn:NO];
  }
}

- (void)changeViewTheme {
  TReaderTheme theme = [TReaderManager readerTheme];
  switch (theme) {
    case TReaderThemeNormal:
      self.bottomAdsView.backgroundColor = [UIColor RGB:248 g:237 b:218];
      [self.bottomAdsView updateTextColor:[UIColor RGB:30 g:37 b:47]];
      break;
    case TReaderThemeBeige:
      self.bottomAdsView.backgroundColor = [UIColor RGB:217 g:217 b:224];
      [self.bottomAdsView updateTextColor:[UIColor RGB:30 g:37 b:47]];
      break;
    case TReaderThemeEyeshield:
      self.bottomAdsView.backgroundColor = [UIColor RGB:219 g:236 b:232];
      [self.bottomAdsView updateTextColor:[UIColor RGB:30 g:37 b:47]];
      break;
    case TReaderThemeNight:
      self.bottomAdsView.backgroundColor = [UIColor RGB:35 g:39 b:44];
      [self.bottomAdsView updateTextColor:[UIColor RGB:92 g:95 b:98]];
      break;

    default:
      break;
  }
  UIColor *color = [UIColor whiteBgReaderThemeColor];
  self.pageVC.view.backgroundColor = color;
  self.pageVC.label.backgroundColor = color;
  self.view.backgroundColor = color;
}

// 增大字体
- (void)increaseChangeSizeAction
{
  [TReaderManager saveFontSize:[TReaderManager fontSize] + 1];
  [self resetPage];
}

// 减小字体
- (void)decreaseChangeSizeAction
{
  [TReaderManager saveFontSize:[TReaderManager fontSize] - 1];
  [self resetPage];
}

- (void)resetPage
{
  NSRange range = [self.readerChapter pageRangeWithIndex:self.currentIndex];
  self.readOffset = range.location + range.length / 2;
  NSUInteger page = [self.readerChapter pageIndexWithChapterOffset:self.readOffset];
  self.currentIndex = page;
  [self parserChatpterContent];
}


// MARK: - EBookCatalogControllerDelegate
- (void)selectedChapter:(BookChapterModel *)chapter index:(NSInteger)index {
  self.chapterIndex = [self.bookModel.chapters indexOfObject:chapter];
  self.currentIndex = 0;
  [self resetPageViewController];
  WS(weakSelf);
  [self fetchChapterContent:^(BookChapterContentModel *m) {
    [weakSelf parserChatpterContent];
  }];
}

- (void)parserChatpterContent {
  [self parserChapterWithModel:self.chapterModel];
  ReaderPage *page = [self showPage:self.currentIndex];
  self.pageVC.currentPage = page;
  [self.pageVC updatePageContent:page];
}

- (ReaderPage *)showPage:(NSUInteger)index
{
  ReaderPage *page = [self.readerChapter pageWithIndex:index];
  return page;
}

- (CGSize)renderSize
{
  return self.pageVC.label.frame.size;
}

// MARK: - 阅读控制 Action
- (void)singleTapAction:(UIGestureRecognizer *)gesture {
  UIViewController *vc = self.pageController.viewControllers.firstObject;
  if ([vc isMemberOfClass:[AdViewController class]]) {
    return;
  }
  self.showPannel = !self.showPannel;
  if (self.showPannel) {
    [self showFontToolBar];
    [self showTopBar];
    self.statusBarHidden = NO;
    self.hotbeanButton.hidden = YES;
  } else {
    [self hideFontToolBar];
    [self hidenTopBar];
    self.statusBarHidden = YES;
    self.hotbeanButton.hidden = _isReview;
  }
  [self setNeedsStatusBarAppearanceUpdate];
}

- (void)showTopBar {
  EReaderTopBar *topBar = [EReaderTopBar createViewFromNib];
  topBar.delegate = self;
  topBar.bookshelfBtn.hidden = self.isCollected;
  topBar.bookshelfLable.hidden = self.isCollected;
  topBar.frame = CGRectMake(0, -CGRectGetHeight(topBar.frame), CGRectGetWidth(self.view.frame), CGRectGetHeight(topBar.frame));
  [self.view addSubview:topBar];
  _topBar = topBar;
  _topBar.titleLabel.text = self.bookModel.name;
  _topBar.titleLabel.textColor = ([TReaderManager readerTheme] == TReaderThemeNight) ? [UIColor RGB:142 g:142 b:142] : [UIColor RGB:30 g:37 b:47];

  __weak typeof(self) weakwSelf = self;
  [UIView animateWithDuration:0.2 animations:^{
    weakwSelf.topBar.frame = CGRectMake(0, 0, CGRectGetWidth(weakwSelf.view.frame), CGRectGetHeight(weakwSelf.topBar.frame));
  }];
}

- (void)hidenTopBar {
  __weak typeof(self) weakwSelf = self;
  [UIView animateWithDuration:0.2 animations:^{
    weakwSelf.topBar.frame = CGRectMake(0, -CGRectGetHeight(weakwSelf.topBar.frame), CGRectGetWidth(weakwSelf.view.frame), CGRectGetHeight(weakwSelf.topBar.frame));
  } completion:^(BOOL finished) {
    [weakwSelf.topBar removeFromSuperview];
  }];
}

- (void)showFontToolBar {
  _fontBar = [EReaderFontBar createViewFromNib];
  _fontBar.delegate = self;
  [self.view addSubview:_fontBar];
  _fontBar.frame = CGRectMake(0, CGRectGetHeight(self.view.frame), CGRectGetWidth(self.view.frame), CGRectGetHeight(_fontBar.frame));

  __weak typeof(self) weakSelf = self;
  [UIView animateWithDuration:0.2 animations:^{
    weakSelf.fontBar.frame = CGRectMake(0, CGRectGetHeight(weakSelf.view.frame) - CGRectGetHeight(weakSelf.fontBar.frame), CGRectGetWidth(weakSelf.view.frame), CGRectGetHeight(weakSelf.fontBar.frame));
  }];
  [self preOrNextchapterButtonEnable];
}

- (void)hideFontToolBar {
  __weak typeof(self) weakSelf = self;
  [UIView animateWithDuration:0.2 animations:^{
    weakSelf.fontBar.frame = CGRectMake(0, CGRectGetHeight(weakSelf.view.frame), CGRectGetWidth(weakSelf.view.frame), CGRectGetHeight(weakSelf.fontBar.frame));
  } completion:^(BOOL finished) {
    [weakSelf.fontBar removeFromSuperview];
  }];
}


// MARK: - EReaderTopBarDelegate
- (void)readerTopBar:(EReaderTopBar *)readerTopBar didClickedAction:(EReaderTopBarAction)action {
  if (action == EReaderTopBarActionBack) {
    WS(weakSelf);
    // 是否已经添加到书架
    if (!self.isCollected) {
      NSString *title = @"加入书架";
      NSString *message = @"下次阅读时，可直接在书架中找到哦！";
      UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:title
                                                                       message:message
                                                                preferredStyle:UIAlertControllerStyleAlert];
      [alertVC addAction:[UIAlertAction actionWithTitle:@"取消"
                                                  style:UIAlertActionStyleCancel
                                                handler:^(UIAlertAction * _Nonnull action) {
                                                  [weakSelf syncBookShelf];
                                                  [self popViewController];
                                                }]];
      [alertVC addAction:[UIAlertAction actionWithTitle:@"确定"
                                                  style:UIAlertActionStyleDefault
                                                handler:^(UIAlertAction * _Nonnull action) {
                                                  weakSelf.isCollected = YES;
                                                  // 加入书架
                                                  [weakSelf syncBookShelf];
                                                  [weakSelf syncBookRecord];
                                                  [weakSelf popViewController];
                                                }]];
      if ([TReaderManager readerTheme] == TReaderThemeNight) {
        UIView *subView = [alertVC.view.subviews firstObject];
        UIView *alertContentView = [subView.subviews firstObject];
        UIView *bg = [alertContentView.subviews firstObject];
        bg.backgroundColor = [UIColor RGB:66 g:66 b:66];

        alertContentView.layer.cornerRadius = 15;
        alertContentView.layer.backgroundColor = [UIColor darkGrayColor].CGColor;
        alertVC.view.tintColor = [UIColor RGB:121 g:130 b:156];
        [alertVC setValue:[[NSAttributedString alloc]
                           initWithString:title
                           attributes:@{NSFontAttributeName: [UIFont boldSystemFontOfSize:18],
                                        NSForegroundColorAttributeName : [UIColor RGB:121 g:130 b:156]}]
                   forKey:@"attributedTitle"];
        [alertVC setValue:[[NSAttributedString alloc]
                           initWithString:message
                           attributes:@{NSFontAttributeName: [UIFont systemFontOfSize:12],
                                        NSForegroundColorAttributeName : [UIColor RGB:121 g:130 b:156]}]
                   forKey:@"attributedMessage"];
      }
      [self presentViewController:alertVC animated:YES completion:nil];
    } else {
      // 已经添加到书架
      [self popViewController];
      [self syncBookRecord];
    }
  } else if (action == EReaderTopBarActionBookshelf) {
    // 添加到书架
    if (!readerTopBar.bookshelfBtn.isHidden) {
      NSDictionary *info = [self p_bookInfo];
      if (info != nil) {
        [MBProgressHUD showMessage:@"已添加至书架"];
        [readerTopBar.bookshelfBtn setHidden:YES];
        [readerTopBar.bookshelfLable setHidden:YES];
        self.isCollected = YES;
        [self syncBookShelf];
        [MobClick event:@"reader_page_add_book" attributes:@{@"book_id" : [info objectForKey:@"book_id"]}];

      }
    }
  } else if (action == EReaderTopBarActionShare) {
    // present share view
    ShareViewController *shareVC = [[ShareViewController alloc] init];
    shareVC.bookModel = self.bookModel;
    self.definesPresentationContext = YES;
    shareVC.view.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:.4];
    shareVC.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    [self.navigationController presentViewController:shareVC animated:YES completion:nil];
    [MobClick event:@"reader_page_share"];
  }
}


// MARK: - 底部广告
- (void)loadBottomBannerBUDAds {
  if (![BUDAdManager isAdsEnable]) {
    return;
  }
  BUSize *size = [[BUSize alloc] init];
  size.width = [UIScreen mainScreen].bounds.size.width - 32;
  size.height = 138;
  WS(weakSelf)
  [[BUDAdManager shareInstance] loadNativeAdsWithCount:1 imageSize:nil success:^(NSArray<BUNativeAd *> *ads) {
    [weakSelf configBUDBanner:ads];
  } failed:^(NSError *error) {

    
  }];
}


// MARK: -UINavigationControllerDelegate
- (id<UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController
                                  animationControllerForOperation:(UINavigationControllerOperation)operation
                                               fromViewController:(UIViewController *)fromVC
                                                 toViewController:(UIViewController *)toVC {
  if ([toVC isMemberOfClass:[EBookCatalogController class]] &&
      operation == UINavigationControllerOperationPush) {
    return (id)[[PushTransition alloc]init];
  }
  return nil;
}



- (UIImage *)snapView {
  UIGraphicsBeginImageContextWithOptions(self.view.bounds.size, false, 0);
  [self.view drawViewHierarchyInRect:self.view.bounds afterScreenUpdates:YES];
  UIImage *snapImg = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return snapImg;
}

- (CGSize)screenSize {
  return [UIScreen mainScreen].bounds.size;
}

- (UIView *)EMaskView {
  if (_EMaskView == nil) {
    _EMaskView = [[EMaskView alloc]initWithFrame:CGRectMake(0, 0, Screen_Width, Screen_Height)];
    _EMaskView.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.5];
  }
  return _EMaskView;
}

//- (BOOL)prefersStatusBarHidden {
//  return self.statusBarHidden;
//}


// MARK: - AdViewControllerDelegate
- (void)refreshNativeAds {
  self.pageInternalAds = nil;
  if (self.pageInternalAds.count == 0) {
    NSLog(@"重新加载广告");
    if ([RandomAdsGenerate isGDTAds]) {
      _manager = nil;
      [self loadPageInternalGDTFeedsAds];
    } else {
      [self loadBUDPageInternalBannerAds];
    }
  }
}

- (void)rewardVideoPlayFinish
{
  [self removeAds];
  self.currentIndex += 1;
  
  [self.pageVC removeFromParentViewController];
  PageContentController *vc = [self viewControllerAtIndex:self.currentIndex];
  [self.pageController setViewControllers:@[vc]
                                direction:UIPageViewControllerNavigationDirectionForward
                                 animated:NO
                               completion:nil];
  
  ReaderPage *page = [self showPage:self.currentIndex];
  self.pageVC.currentPage = page;
  [self.pageVC updatePageContent:page];
}

- (NSInteger)chapterIndexWithChapterId:(BookContentModel *)content {
  for (int i = 0; i < _bookModel.chapters.count; i++) {
    NSInteger index = _bookModel.chapters[i].chapter_id;
    if (index == [content.chapter_id integerValue]) {
      return i;
    }
  }
  return 0;
}

// 同步阅读记录
- (void)syncBookRecord {
  NSInteger index = 0;
  for (int i = 0; i < self.bookModel.chapters.count; i++) {
    BookChapterModel *model = self.bookModel.chapters[i];
    if (model.chapter_id == self.chapterModel.chapter_id) {
      index = i + 1;
    }
  }

  NSMutableDictionary *info = [[self.chapterModel toDictionary] mutableCopy];
  [info setObject:@(index) forKey:@"chapter_sort"];
  [info setObject:self.bookModel.author ?: @"" forKey:@"author"];
  [info setObject:self.bookModel.brief ?: @"" forKey:@"brief"];
  [info setObject:self.bookModel.name ?: @"" forKey:@"name"];
  [info setObject:self.bookModel.cover ?: @"" forKey:@"cover"];
  [info setObject:self.bookModel.end_ad_ts ?: @"" forKey:@"end_ad_ts"];
  [info setObject:self.bookModel.start_ad_ts ?: @"" forKey:@"start_ad_ts"];
  [info setObject:self.bookModel.start_vip_ts forKey:@"start_vip_ts"];
  [info setObject:self.bookModel.end_vip_ts forKey:@"end_vip_ts"];
  [info setObject:@(self.isCollected) ?: @"" forKey:@"isCollected"];
  [info setObject:self.bookModel.complete_status forKey:@"complete_status"];

  if (info) {
    [[NSNotificationCenter defaultCenter] postNotificationName:SyncBookRecordNotification
                                                        object:self
                                                      userInfo:info];

  }
}

- (void)syncBookShelf {
  [[NSNotificationCenter defaultCenter] postNotificationName:SyncBookToShelfNotification
                                                      object:self
                                                    userInfo:[self bookInfo]];
}

- (void)popViewController {
  BookChapterModel *model = self.bookModel.chapters[self.chapterIndex];
  [[DBManager shareInstance] updateBook:model readPage:self.currentIndex];
  [(UINavigationController *)AppDelegate.rootViewController popViewControllerAnimated:YES];
//  NSInteger duration = [TimeUtil timestampSinceNow:0] - self.startTimestamp - _enterBackgroundDuration;
//  NSInteger readTime = _count > 300 ? duration + 300 : duration;
  NSInteger readTime = _totalReadTime - _enterBackgroundDuration;

  [[NSNotificationCenter defaultCenter] postNotificationName:SyncReadTimeNotification object:self userInfo:@{@"duration" : @(readTime)}];
  [[UIApplication sharedApplication] setIdleTimerDisabled:NO];
  [[AVPlayerManager shareInstance] clearPlayer];

  if ([BrightnessManager isNightMode]) {
    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
    [app maskView];
  }

  [self.hotbeanButton removeFromSuperview];
}

- (NSDictionary *)p_bookInfo {
  BookContentModel *model = self.bookModel;
  BookChapterContentModel *content = self.chapterModel;
  NSLog(@"加入书架 ------ %@, %@", model, content);
  if (model && content) {
    NSDictionary *info = @{
                           @"chapter" : content.title ?: @"",
                           @"chapter_id" : @(content.chapter_id),
                           @"author" : model.author ?: @"",
                           @"brief" : model.brief ?: @"",
                           @"chapter_sort" : model.chapter_sort ?: @(0),
                           @"book_id" : @(model.book_id),
                           @"create_time" : model.create_time ?: @"",
                           @"cover" : model.cover ?: @"",
                           @"name" : model.name ?: @"",
                           @"name" : model.name ?: @"",
                           @"end_ad_ts" : model.end_ad_ts ?: @"",
                           @"start_ad_ts" : model.start_ad_ts ?: @"",
                           @"start_vip_ts" : model.start_vip_ts ?: @"",
                           @"end_vip_ts" : model.end_vip_ts ?: @"",
                           @"complete_status" : model.complete_status,
                           };

    return info;
  }
  return nil;
}



// 书籍评论
- (void)clickCommentAction:(NSInteger)tag {
  [self popViewController];
  [[NSNotificationCenter defaultCenter] postNotificationName:ClickCommentActionNotification
                                                      object:self
                                                    userInfo:@{
                                                               @"tag" : @(tag),
                                                               @"bookId" : @(_bookModel.book_id),
                                                               @"bookInfo" : [self bookInfo]
                                                               }];
}



- (void)fetchChapterContentWithBookId:(NSInteger)bookId
                            chapterId:(NSInteger)chapterId
                             callback:(void (^)(BookChapterContentModel *ret))callback {
  NSLog(@"\n\n\n获取bookId ----- %ld %ld", bookId, chapterId);
  NSLog(@"章节index: ------ %ld\n\n\n", self.chapterIndex);
//  BookChapterContentModel *model = [[DBManager shareInstance] queryChapterWithId:chapterId];
//  if (model) {
//    NSLog(@"本地加载：----------- %@", model);
//    self.chapterModel = model;
//    callback(model);
//    return;
//  }

  WS(weakSelf);
  MBProgressHUD *hud = [MBProgressHUD showHudToView:nil];
  [BookContentFetcher fetchBookContentWithBookID:bookId
                                         chapter:chapterId
                                       completed:^(NSDictionary *info) {
                                         [hud hideAnimated:YES];
                                         if (info == nil) {
                                           return;
                                         }
                                         NSError *error = nil;
                                         BookChapterContentModel *chapter = [[BookChapterContentModel alloc] initWithDictionary:info error:&error];
                                         if (error) {
                                           NSString *msg = [NSString stringWithFormat:@"ERROR: %ld", (long)error.code];
                                           [MBProgressHUD showMessage:msg];
                                           return;
                                         }


                                         NSString *content = [NSString replaceBookContent:chapter.content];
                                         chapter.content = [NSString stringWithFormat:@"\n%@\n%@", chapter.title, content];
                                         NSLog(@"网络加载：----------- %@", chapter.content);
//                                         NSString *cachesDir = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
//                                         NSString *path = [cachesDir stringByAppendingPathComponent:[NSString stringWithFormat:@"%@/%ld", cachesDir, (long)chapter.book_id]];
//                                         NSLog(@"pa =========== %@", path);

                                         [MobClick event:@"book_read_page_chapter_clicked" attributes:@{@"book_id" : @(bookId), @"chapter_id" : @(chapterId)}];
                                         weakSelf.chapterModel = chapter;
                                         [[DBManager shareInstance] addChapter:chapter toBook:chapterId];
                                         callback(chapter);
                                       }];
}




- (void)appWillTerminate:(NSNotification *)noti {
  BookChapterModel *model = self.bookModel.chapters[self.chapterIndex];
  [[DBManager shareInstance] updateBook:model readPage:self.currentIndex];
}

- (void)applicationDidBecomeActive:(NSNotification *)noti {
  NSInteger now = [TimeUtil timestampSinceNow:0];
  _enterBackgroundDuration = now - _backgroundTimestamp;
}

- (void)applicationDidEnterBackground:(NSNotification *)noti {
  _backgroundTimestamp = [TimeUtil timestampSinceNow:0];
}




// MARK: - 获取 banner 广告
- (void)loadBUDPageInternalBannerAds {
  if (![BUDAdManager isAdsEnable]) {
    [self removeAds];
    return;
  }
  BUSize *size = [[BUSize alloc] init];
  size.width = [UIScreen mainScreen].bounds.size.width - 32;
  size.height = 138;
  WS(weakSelf)
  [[BUDAdManager shareInstance] loadPageInternalAdsWithCount:1 imageSize:nil success:^(NSArray<BUNativeAd *> *ads) {
    weakSelf.pageInternalAds = ads;
  } failed:^(NSError *error) {
    [self loadPageInternalGDTFeedsAds];
  }];
}

- (void)configBUDBanner:(NSArray *)ads {
  BUNativeAd *nad = ads.firstObject;
  if (!nad && self.bottomAdsView.isHidden) {
    return;
  }
  
  [self.bottomAdsView configBannerAds:nad viewController:self];
}

// MARK: - BUNativeAdDelegate
- (void)nativeAdDidBecomeVisible:(BUNativeAd *)nativeAd {
  [ADAnalysis bannerAdsShowReport];
}

- (void)nativeAdDidClick:(BUNativeAd *)nativeAd withView:(UIView *_Nullable)view {
  [ADAnalysis bannerAdsClickedReport];
}

// MARK: - adViewcontrollerToLogin
- (void)userLogin:(NSNotification *)notification{
  [self postLoginNotification];
  [self popViewController];
}

- (NSDictionary *)bookInfo {
  NSMutableDictionary *info = [[self p_bookInfo] mutableCopy];
  [info setObject:@(self.isCollected) forKey:@"isCollected"];
  return [info copy];
}

- (void)postLoginNotification {
  [[NSNotificationCenter defaultCenter] postNotificationName:SyncUserLoginNotification
                                                      object:self
                                                    userInfo:[self bookInfo]];
}



// MARK: - 腾讯广点通 Banner Ads
- (RequestBottomBannerAdsManager *)bannerAdManager
{
  if (!_bannerAdManager) {
    _bannerAdManager = [RequestBottomBannerAdsManager manager];
    _bannerAdManager.delegate = self;
  }
  return _bannerAdManager;
}

- (void)loadBottomBannerGTDAds
{
  [self.bannerAdManager loadBannerAdsWithID:[TXAdsManager bannerKey] adCount:1];
}

- (void)bannerAdsLoadSuccess:(NSArray<GDTUnifiedNativeAdDataObject *> *)ads
{
  GDTUnifiedNativeAdDataObject *ad = ads.firstObject;
  NSLog(@"腾讯banenr广告获取成功 === %@ %@", ad.title, ad.desc);
  [self.bottomAdsView configBannerAds:ad viewController:self];
}



// MARK: =====
// MARK: - 腾讯广点通信息流广告
- (void)loadPageInternalGDTFeedsAds
{
  [self.manager loadAdsWithAdsID:[TXAdsManager feedKey] adCount:1];
}

- (FeedAdsRequestManager *)manager
{
  if (!_manager) {
    _manager = [FeedAdsRequestManager manager];
    _manager.delegate = self;
  }
  return _manager;
}

// MARK: - LoadFeedAdsDelegate
- (void)feedAdsLoadSuccess:(NSArray<GDTUnifiedNativeAdDataObject *> *)ads
{
  GDTUnifiedNativeAdDataObject *ad = ads.firstObject;
  NSLog(@"腾讯信息流广告获取成功 === %@ %@", ad.title, ad.desc);
  if (ad.imageWidth > ad.imageHeight) {
    NSLog(@"横版素材");
  } else {
    NSLog(@"竖版素材");
  }
  
  NSMutableArray *adsM = [ads mutableCopy];
  self.pageInternalAds = [adsM copy];
  NSLog(@"self.pageInternalAds ===== %@", self.pageInternalAds);
}

- (void)feedAdsLoadFailed:(NSError *)error
{
  NSLog(@"腾讯信息流广告获取失败 === %@", error);
  self.pageInternalAds = nil;
}

// MARK: - 懒加载
- (ReaderChapter *)readerChapter
{
  if (!_readerChapter) {
    _readerChapter = [[ReaderChapter alloc] init];
  }
  return _readerChapter;
}

- (NSTimer *)readTimer
{
  if (!_readTimer) {
    _readTimer = [NSTimer scheduledTimerWithTimeInterval:1
                                                  target:self
                                                selector:@selector(timerFire:)
                                                userInfo:nil
                                                 repeats:YES];
    [_readTimer fire];
  }
  return _readTimer;
}

- (NSTimer *)controlTimer
{
  if (!_controlTimer) {
    _controlTimer = [NSTimer scheduledTimerWithTimeInterval:1.0
                                                     target:self
                                                   selector:@selector(controlTimerFire:)
                                                   userInfo:nil
                                                    repeats:YES];
    [_controlTimer fire];
  }
  return _controlTimer;
}

- (NSTimer *)refreshAdsTimer {
  if (!_refreshAdsTimer) {
    _refreshAdsTimer = [NSTimer scheduledTimerWithTimeInterval:30
                                                        target:self
                                                      selector:@selector(refreshAds)
                                                      userInfo:nil
                                                       repeats:YES];
    [[NSRunLoop currentRunLoop] addTimer:_refreshAdsTimer forMode:NSDefaultRunLoopMode];
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
  }
  return _refreshAdsTimer;
}

- (UIImageView *)bottomImageView {
  if (!_bottomImageView) {
    CGSize size = [self screenSize];
    _bottomImageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(self.pageController.view.frame), size.width, BOTTOM_ADS_VIEW_HEIGHT)];
    _bottomImageView.image = [UIImage imageNamed:@"bottom_ads_placehoder"];
    _bottomImageView.userInteractionEnabled = YES;
    [self.view addSubview:_bottomImageView];
  }
  return _bottomImageView;
}

- (BottomAdsView *)bottomAdsView {
  if (!_bottomAdsView) {
    _bottomAdsView = (BottomAdsView *)[[[NSBundle mainBundle]
                                        loadNibNamed:@"BottomAdsView"
                                        owner:self options:nil] firstObject];
    CGSize size = self.bottomImageView.bounds.size;
    _bottomAdsView.frame = CGRectMake(0, 0, size.width, size.height);
    _bottomAdsView.delegate = self;
    [self.bottomImageView addSubview:_bottomAdsView];
  }
  return _bottomAdsView;
}

- (NSArray *)pageInternalAds
{
  if (!_pageInternalAds) {
    _pageInternalAds = [NSArray array];
  }
  return _pageInternalAds;
}

@end
