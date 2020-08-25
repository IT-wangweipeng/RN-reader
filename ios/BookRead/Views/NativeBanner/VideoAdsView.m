//
//  VideoAdsView.m
//  reader
//
//  Created by JY on 2019/5/14.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "VideoAdsView.h"
#import <BUAdSDK/BUNativeAd.h>
#import <BUAdSDK/BUNativeAdRelatedView.h>
#import <BUAdSDK/BURewardedVideoAd.h>
#import <BUAdSDK/BURewardedVideoModel.h>
#import "UIImageView+AFNetworking.h"
#import "BUDAdManager.h"
#import "BUDBannerModel.h"
#import "NetworkManager.h"
#import "AppDelegate.h"
#import "ADAnalysis.h"
#import "MBProgressHUD+Message.h"
#import "TimeUtil.h"
#import "UserDefaults.h"
#import "RewardVideoManager.h"
#import "GDTRewardVideoAd.h"
#import "RandomAdsGenerate.h"


@interface VideoAdsView ()
<
BUNativeAdDelegate,
RewardVideoManagerDelegate
>

@property (weak, nonatomic) IBOutlet UIImageView *adImageView;
@property (weak, nonatomic) IBOutlet UILabel *descLabel;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UILabel *moreInfoLabel;

@property (nonatomic, strong) BUNativeAd *nativeAd_load;
@property (nonatomic, strong) BUDBannerModel *bannerModel;
@property (nonatomic, strong) RewardVideoManager *manager;

@end



@implementation VideoAdsView

- (void)awakeFromNib {
  [super awakeFromNib];

}

- (void)layoutSubviews {
  [super layoutSubviews];
  
  self.frame = CGRectMake(0, self.frame.origin.y, [UIScreen mainScreen].bounds.size.width-30, 100);
}

// MAKR: - Actions
// 点击激励视频广告
- (IBAction)adsVideoButtonClicked:(UIButton *)sender {
  if ([RandomAdsGenerate canShowAds]) {
    if ([RandomAdsGenerate isGDTAds]) {
      [self.manager loadRewardVideo:RewardVideoGDT];
    } else {
      [self.manager loadRewardVideo:RewardVideoBUD];
    }
  } else {
    [MBProgressHUD showMessage:@"暂时无广告"];
  }
}

- (IBAction)moreInfoButtonClicked:(UIButton *)sender {
  if ([self.delegate respondsToSelector:@selector(moreInfoButtonClicked:)]) {
    [self.delegate moreInfoButtonClicked:sender];
  }
}

// MARK: - RewardVideoManagerDelegate
// 广告加载成功
- (void)rewardVideoAdDidLoadFinish:(id _Nonnull )ad
                              type:(RewardVideoType)adType
{
  if (adType == RewardVideoBUD) {
    BURewardedVideoAd *adData = (BURewardedVideoAd *)ad;
    [adData showAdFromRootViewController:[AppDelegate rootViewController]];
  } else {
    GDTRewardVideoAd *adData = (GDTRewardVideoAd *)ad;
    [adData showAdFromRootViewController:[AppDelegate rootViewController]];
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
  
  if (self.videoPlayFinish) {
    self.videoPlayFinish();
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
