//
//  RewardVideoManager.m
//  reader
//
//  Created by Droi on 2020/6/24.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RewardVideoManager.h"
#import <BUAdSDK/BURewardedVideoAd.h>
#import <BUAdSDK/BURewardedVideoModel.h>
#import "BUDAdManager.h"
#import "ADAnalysis.h"
#import "GDTRewardVideoAd.h"
#import "TXAdsManager.h"


@interface RewardVideoManager ()
<
BURewardedVideoAdDelegate,
GDTRewardedVideoAdDelegate
>

@property (nonatomic, strong) BURewardedVideoAd *rewardedVideoAd;
@property (nonatomic, strong) GDTRewardVideoAd *gdtRewardVideoAd;

@end



@implementation RewardVideoManager

+ (instancetype)manager
{
  return [[[self class] alloc] init];
}

- (void)loadRewardVideo:(RewardVideoType)videoType
{
  // 穿山甲
  if (videoType == RewardVideoBUD) {
    [self loadBUDRewardedVideo];
  } else {
    // 广点通
    [self loadGDTRewardVideo];
  }
}

// MARK: - 广点通
- (void)loadGDTRewardVideo
{
  GDTRewardVideoAd *gdtRewardVideoAd = [[GDTRewardVideoAd alloc] initWithPlacementId:[TXAdsManager rewardVideoKey]];
  self.gdtRewardVideoAd = gdtRewardVideoAd;
  self.gdtRewardVideoAd.videoMuted = NO;
  self.gdtRewardVideoAd.delegate = self;
  [self.gdtRewardVideoAd loadAd];
}

/**
 广告数据加载成功回调
 */
- (void)gdt_rewardVideoAdDidLoad:(GDTRewardVideoAd *)rewardedVideoAd
{
  if ([self.delegate respondsToSelector:@selector(rewardVideoAdDidLoadFinish:type:)]) {
    [self.delegate rewardVideoAdDidLoadFinish:rewardedVideoAd type:RewardVideoGDT];
  }
}

/**
 视频播放页关闭回调
 */
- (void)gdt_rewardVideoAdDidClose:(GDTRewardVideoAd *)rewardedVideoAd
{
  self.gdtRewardVideoAd = nil;
  if ([self.delegate respondsToSelector:@selector(rewardVideoAdDidClose:)]) {
    [self.delegate rewardVideoAdDidClose:RewardVideoGDT];
  }
}

/**
 视频广告各种错误信息回调
 */
- (void)gdt_rewardVideoAd:(GDTRewardVideoAd *)rewardedVideoAd didFailWithError:(NSError *)error
{
  NSLog(@"%s",__FUNCTION__);
  NSLog(@"腾讯激励视频播放失败：%@", error.localizedDescription)
  if ([self.delegate respondsToSelector:@selector(rewardVideoAdDidLoadFailed:type:)]) {
    [self.delegate rewardVideoAdDidLoadFailed:error type:RewardVideoGDT];
  }
}

/**
 视频广告视频播放完成
 */
- (void)gdt_rewardVideoAdDidPlayFinish:(GDTRewardVideoAd *)rewardedVideoAd
{
  if ([self.delegate respondsToSelector:@selector(rewardVideoAdDidPlayFinish:)]) {
    [self.delegate rewardVideoAdDidPlayFinish:RewardVideoGDT];
  }
}


// MARK: - 穿山甲
- (void)loadBUDRewardedVideo {
  BURewardedVideoModel *model = [[BURewardedVideoModel alloc] init];
  BURewardedVideoAd *rewardedVideoAd = [[BURewardedVideoAd alloc] initWithSlotID:[BUDAdManager rewardVideo] rewardedVideoModel:model];
  self.rewardedVideoAd = rewardedVideoAd;
  rewardedVideoAd.delegate = self;
  [rewardedVideoAd loadAdData];
}

- (void)rewardedVideoAdDidLoad:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd data load success");
  if ([self.delegate respondsToSelector:@selector(rewardVideoAdDidLoadFinish:type:)]) {
    [self.delegate rewardVideoAdDidLoadFinish:rewardedVideoAd type:RewardVideoBUD];
  }
  [ADAnalysis videoAdsLoadReport:YES];
}

- (void)rewardedVideoAdWillVisible:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd video will visible");
  [ADAnalysis videoAdsShowReport];
}

// 穿山甲广告关闭
- (void)rewardedVideoAdDidClose:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd video did close");
  if ([self.delegate respondsToSelector:@selector(rewardVideoAdDidClose:)]) {
    [self.delegate rewardVideoAdDidClose:RewardVideoBUD];
  }
}
// 点击穿山甲激励视频
- (void)rewardedVideoAdDidClick:(BURewardedVideoAd *)rewardedVideoAd {
  NSLog(@"rewardedVideoAd video did click");
  [ADAnalysis videoAdsClickedReport];
}

// 穿山甲加载失败
- (void)rewardedVideoAd:(BURewardedVideoAd *)rewardedVideoAd
       didFailWithError:(NSError *)error {
  NSLog(@"rewardedVideoAd data load fail");
  [ADAnalysis videoAdsLoadReport:NO];
  if ([self.delegate respondsToSelector:@selector(rewardVideoAdDidLoadFailed:type:)]) {
    [self.delegate rewardVideoAdDidLoadFailed:error type:RewardVideoBUD];
  }
}

// 穿山甲激励视频播放完毕
- (void)rewardedVideoAdDidPlayFinish:(BURewardedVideoAd *)rewardedVideoAd
                    didFailWithError:(NSError *)error {
  if (error) {
    NSLog(@"rewardedVideoAd play error");
  } else {
    NSLog(@"rewardedVideoAd play finish");
    if ([self.delegate respondsToSelector:@selector(rewardVideoAdDidPlayFinish:)]) {
      [self.delegate rewardVideoAdDidPlayFinish:RewardVideoBUD];
    }
  }
}


@end
