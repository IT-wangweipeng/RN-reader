//
//  AdViewController.m
//  reader
//
//  Created by JY on 2019/5/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AdViewController.h"
#import "ADAnalysis.h"
#import "NetworkManager.h"
#import "UIImageView+AFNetworking.h"
#import "UIColor+TReaderTheme.h"
#import "UILabel+YBAttributeTextTapAction.h"
#import "TReaderManager.h"
#import "UserDefaults.h"
#import "GDTUnifiedNativeAdDataObject.h"
#import "LandscapeFeedAdsView.h"
#import "PortraitFeedAdsView.h"
#import "PageInternalFeedAdsView.h"
#import "RewardVideoManager.h"
#import "RandomAdsGenerate.h"
#import <BUAdSDK/BURewardedVideoAd.h>
#import "GDTRewardVideoAd.h"
#import "MBProgressHUD+Message.h"
#import "TimeUtil.h"
#import "BUDAdManager.h"


#define kBottomMargin 80
#define kTopMargin 80

@interface AdViewController ()
<
LandscapeFeedAdsViewDelegate,
PortraitFeedAdsViewDelegate,
PageInternalFeedAdsViewDelegate,
RewardVideoManagerDelegate
>

@property (weak, nonatomic) IBOutlet UIButton *nUserLoginButton;
@property (weak, nonatomic) IBOutlet UIView *wrapperAdsView;
@property (weak, nonatomic) IBOutlet UILabel *tipsLabel;

@property (nonatomic, strong) LandscapeFeedAdsView *landscapeAdsView;
@property (nonatomic, strong) PortraitFeedAdsView *portraitAdsView;
@property (nonatomic, strong) PageInternalFeedAdsView *budFeedAdsView;
@property (nonatomic, strong) RewardVideoManager *manager;


@end



@implementation AdViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  
  [self setupUI];
  [self cinfigAdsInfo];
}

- (void)dealloc {
  NSLog(@"AdViewController释放了");
}

- (void)cinfigAdsInfo
{
  id adData = self.ads.firstObject;
  // 广点通广告
  if ([adData isMemberOfClass:[GDTUnifiedNativeAdDataObject class]]) {
    GDTUnifiedNativeAdDataObject *ad = (GDTUnifiedNativeAdDataObject *)adData;
    // 横版素材
    if (ad.imageWidth > ad.imageHeight) {
      self.wrapperAdsView.hidden = NO;
      self.tipsLabel.hidden = NO;
      [self.wrapperAdsView addSubview:self.landscapeAdsView];
      self.landscapeAdsView.delegate = self;
      [self.landscapeAdsView configAdData:ad viewController:self];
    } else {
      // 竖版素材
      self.wrapperAdsView.hidden = YES;
      self.tipsLabel.hidden = YES;
      [self.view addSubview:self.portraitAdsView];
      self.portraitAdsView.delegate = self;
      [self.portraitAdsView configProtraitFeedAd:ad viewController:self];
    }
  } else {
    // 穿山甲广告
    self.tipsLabel.hidden = NO;
    [self.wrapperAdsView addSubview:self.budFeedAdsView];
    self.budFeedAdsView.delegate = self;
    [self.budFeedAdsView configBudFeedAd:adData viewController:self];
  }
}

- (void)setupUI{
  self.view.backgroundColor = [UIColor whiteBgReaderThemeColor];
  NSDictionary *userInfo = [[NSUserDefaults standardUserDefaults] objectForKey:@"USER_INFO"];
  [[NSUserDefaults standardUserDefaults] synchronize];
  if ([userInfo[@"token"] isEqual:@""] || (userInfo[@"token"] == nil)) {
    _nUserLoginButton.hidden = NO;
  } else {
    _nUserLoginButton.hidden = YES;
    return;
  }
}

- (IBAction)userLoginFromNative:(id)sender {
  [[NSNotificationCenter defaultCenter] postNotificationName:TReaderUserLoginNofication object:nil];
}

/**
 广告曝光回调

 @param unifiedNativeAdView GDTUnifiedNativeAdView 实例
 */
- (void)gdt_unifiedNativeAdViewWillExpose:(GDTUnifiedNativeAdView *)unifiedNativeAdView {
  if ([self.delegate respondsToSelector:@selector(refreshNativeAds)]) {
    [self.delegate refreshNativeAds];
  }
}

- (void)gdt_unifiedNativeAdViewDidClick:(GDTUnifiedNativeAdView *)unifiedNativeAdView {
  
}

// 刷新信息流广告
// MARK: - PageInternalFeedAdsViewDelegate
- (void)pageInternalFeedAdsWillExpose
{
  if ([self.delegate respondsToSelector:@selector(refreshNativeAds)]) {
    [self.delegate refreshNativeAds];
  }
}

// 刷新信息流广告
// MARK: - LandscapeFeedAdsViewDelegate
- (void)landscapeFeedAdsViewWillExpose
{
  if ([self.delegate respondsToSelector:@selector(refreshNativeAds)]) {
    [self.delegate refreshNativeAds];
  }
}

// 刷新信息流广告
// MARK: - PortraitFeedAdsViewDelegate
- (void)portraitFeedAdsWillExpose
{
  if ([self.delegate respondsToSelector:@selector(refreshNativeAds)]) {
    [self.delegate refreshNativeAds];
  }
}

// MARK: -
- (LandscapeFeedAdsView *)landscapeAdsView
{
  if (!_landscapeAdsView) {
    _landscapeAdsView = (LandscapeFeedAdsView *)[[[NSBundle mainBundle] loadNibNamed:@"LandscapeFeedAdsView" owner:self options:nil] firstObject];
    CGFloat width = self.view.frame.size.width;
    _landscapeAdsView.frame = CGRectMake(20, 0, width-40, 300);
    _landscapeAdsView.backgroundColor = [UIColor redColor];
  }
  return _landscapeAdsView;
}

- (PortraitFeedAdsView *)portraitAdsView
{
  if (!_portraitAdsView) {
    _portraitAdsView = [[PortraitFeedAdsView alloc] init];
  }
  return _portraitAdsView;
}

- (PageInternalFeedAdsView *)budFeedAdsView
{
  if (!_budFeedAdsView) {
    _budFeedAdsView = (PageInternalFeedAdsView *)[[[NSBundle mainBundle] loadNibNamed:@"PageInternalFeedAdsView" owner:self options:nil] firstObject];
    CGFloat width = self.view.frame.size.width;
    _budFeedAdsView.frame = CGRectMake(20, 0, width-40, 300);
  }
  return _budFeedAdsView;
}
- (IBAction)showVideoAction:(UIButton *)sender {
  if ([RandomAdsGenerate canShowAds]) {
     if ([RandomAdsGenerate isGDTAds]) {
       [self.manager loadRewardVideo:RewardVideoGDT];
     } else {
       [self.manager loadRewardVideo:RewardVideoBUD];
     }
   }
}

// MARK: - RewardVideoManagerDelegate
// 广告加载成功
- (void)rewardVideoAdDidLoadFinish:(id _Nonnull )ad
                              type:(RewardVideoType)adType
{
  if (adType == RewardVideoBUD) {
    BURewardedVideoAd *adData = (BURewardedVideoAd *)ad;
    [adData showAdFromRootViewController:self];
  } else {
    GDTRewardVideoAd *adData = (GDTRewardVideoAd *)ad;
    [adData showAdFromRootViewController:self];
  }
}

// 广告加载失败
- (void)rewardVideoAdDidLoadFailed:(NSError *_Nullable)error
                              type:(RewardVideoType)adType
{
  [MBProgressHUD showMessage:error.localizedDescription];
}

// 广告关闭
- (void)rewardVideoAdDidClose:(RewardVideoType)adType
{

}

// 广告播放完成
- (void)rewardVideoAdDidPlayFinish:(RewardVideoType)adType
{
  // 存入时间戳
  NSTimeInterval timeInterval;
  #ifdef DEBUG
    timeInterval = 60;
  #else
    timeInterval = 900;
  #endif
  NSInteger timestamp = [TimeUtil timestampSinceNow:timeInterval];
  NSLog(@"ad time ==== %ld", (long)timestamp);
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  [userDefault setInteger:timestamp forKey:AD_TIMESTAMP];
  [userDefault synchronize];
  
  if ([self.delegate respondsToSelector:@selector(rewardVideoPlayFinish)]) {
    [self.delegate rewardVideoPlayFinish];
  }
}


// MARK: -
- (RewardVideoManager *)manager
{
  if (!_manager) {
    _manager = [RewardVideoManager manager];
    _manager.delegate = self;
  }
  return _manager;
}

@end
