//
//  BUDAdManager.m
//  BUDemo
//
//  Created by carlliu on 2017/7/27.
//  Copyright © 2017年 chenren. All rights reserved.
//

#import "BUDAdManager.h"
#import <BUAdSDK/BUNativeAdsManager.h>
#import "NetworkManager.h"
#import "TimeUtil.h"
#import "ADAnalysis.h"
#import "UserUtil.h"

@interface BUDAdManager ()
<
BUNativeAdsManagerDelegate
>

@property (nonatomic, strong) BUNativeAdsManager *pageInternalAds;
@property (nonatomic, strong) BUNativeAdsManager *bootomAds;
@property (nonatomic, copy) BottomAdsLoadSuccessBlock loadBottomAdsSuccess;
@property (nonatomic, copy) BottomAdsLoadFailedBlock loadBottomAdsFailed;
@property (nonatomic, copy) BottomAdsLoadSuccessBlock loadPageInternalAdsSuccess;
@property (nonatomic, copy) BottomAdsLoadFailedBlock loadPageInternalAdsFailed;
@end


/**
 https://wiki.bytedance.net/pages/viewpage.action?pageId=146011735
 */
@implementation BUDAdManager

+ (NSString *)appKey {
  return @"5016924";
}

+ (NSString *)splashSlotID {
  return @"816924753";
}

+ (NSString *)nativeBannerSlotID {
  return @"916924985";
}

+ (NSString *)rewardVideo {
  return @"916924583";
}


+ (BUDAdManager *)shareInstance {
  static dispatch_once_t onceToken;
  static BUDAdManager *manager = nil;
  dispatch_once(&onceToken, ^{
    manager = [[BUDAdManager alloc] init];
  });
  return manager;
}

+ (NSDictionary *)userInfo {
  NSDictionary *userInfo = [[NSUserDefaults standardUserDefaults] objectForKey:@"USER_INFO"];
  NSDictionary *info = [userInfo objectForKey:@"info"];
  return info;
}

+ (BOOL)isAdsEnable {
  BOOL isVip = [UserUtil isVip];
  if (isVip) {
    return NO;
  }
  
  NSInteger now = [TimeUtil timestampSinceNow:0];
  NSInteger adTimestamp = [[NSUserDefaults standardUserDefaults] integerForKey:AD_TIMESTAMP];
  NSInteger threeDay_adTimestamp = [[NSUserDefaults standardUserDefaults] integerForKey:AD_THREEDAYTIMESTAMP];
  NSLog(@" show ads ======= %ld %ld", (long)now, (long)adTimestamp);
  if (threeDay_adTimestamp > now) {
    return NO;
  }
  if (adTimestamp > now) {
    return NO;
  }
  
  NSDictionary *data = [self userInfo];
  NSInteger freeAdExpirets = [[data objectForKey:@"free_ad_expirets"] integerValue];
  if (freeAdExpirets > now) {
    return NO;
  }
  
  NSString *start = [BUDAdManager shareInstance].start_ad_ts;
  NSString *end = [BUDAdManager shareInstance].end_ad_ts;
  NSInteger startTimestamp = [[TimeUtil timestampFromString:start] integerValue];
  NSInteger endTimestamp = [[TimeUtil timestampFromString:end] integerValue];
  
  if (now > startTimestamp && now < endTimestamp) {
    return NO;
  }

  return YES;
}

- (void)loadPageInternalAdsWithCount:(NSInteger)count imageSize:(BUSize *)size success:(PageInternalAdsLoadSuccessBlock)success failed:(PageInternalAdsLoadFailedBlock)failed {
  if (size == nil) {
    size = [[BUSize alloc] init];
    size.width = 102;
    size.height = 88;
  }
  
  self.loadPageInternalAdsSuccess = success;
  self.loadPageInternalAdsFailed = failed;
  
  BUNativeAdsManager *nad = [BUNativeAdsManager new];
  BUAdSlot *slot = [[BUAdSlot alloc] init];
  slot.ID = [BUDAdManager nativeBannerSlotID];
  slot.AdType = BUAdSlotAdTypeBanner;
  slot.position = BUAdSlotPositionBottom;
  slot.imgSize = size;
  slot.isSupportDeepLink = YES;
  slot.isOriginAd = YES;
  
  slot.isSupportDeepLink = YES;
  nad.adslot = slot;
  nad.delegate = self;
  self.pageInternalAds = nad;
  
  [nad loadAdDataWithCount:count];
}

- (void)loadNativeAdsWithCount:(NSInteger)count
                    imageSize:(BUSize *)size
                      success:(BottomAdsLoadSuccessBlock)success
                       failed:(BottomAdsLoadFailedBlock)failed {
  if (size == nil) {
    size = [[BUSize alloc] init];
    size.width = 102;
    size.height = 88;
  }
  
  self.loadBottomAdsSuccess = success;
  self.loadBottomAdsFailed = failed;
  
  BUNativeAdsManager *nad = [BUNativeAdsManager new];
  BUAdSlot *slot = [[BUAdSlot alloc] init];
  slot.ID = [BUDAdManager nativeBannerSlotID];
  slot.AdType = BUAdSlotAdTypeBanner;
  slot.position = BUAdSlotPositionBottom;
  slot.imgSize = size;
  slot.isSupportDeepLink = YES;
  slot.isOriginAd = YES;
  
  slot.isSupportDeepLink = YES;
  nad.adslot = slot;
  nad.delegate = self;
  self.bootomAds = nad;
  
  [nad loadAdDataWithCount:count];
}

// MARK: - BUNativeAdsManagerDelegate
- (void)nativeAdsManagerSuccessToLoad:(BUNativeAdsManager *)adsManager nativeAds:(NSArray<BUNativeAd *> *_Nullable)nativeAdDataArray {
  for (__unused BUNativeAd *ad in nativeAdDataArray) {
    [ADAnalysis bannerAdsLoadReport:YES];
  }
  
  if (nativeAdDataArray.count > 0 && (self.loadBottomAdsSuccess || self.loadPageInternalAdsSuccess)) {
    if (adsManager == self.bootomAds) {
      self.loadBottomAdsSuccess(nativeAdDataArray);
    } else {
      self.loadPageInternalAdsSuccess(nativeAdDataArray);
    }
  }
}

- (void)nativeAdsManager:(BUNativeAdsManager *)adsManager didFailWithError:(NSError *_Nullable)error {
  [ADAnalysis bannerAdsLoadReport:NO];
  NSLog(@"banner datas load fail: %ld", error.code);
  if (self.loadBottomAdsFailed || self.loadPageInternalAdsFailed) {
    if (adsManager == self.bootomAds) {
      self.loadBottomAdsFailed(error);
    } else {
      self.loadPageInternalAdsFailed(error);
    }
  }
}

@end
