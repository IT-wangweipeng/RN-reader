//
//  FeedAdsRequestManager.m
//  reader
//
//  Created by Droi on 2020/6/12.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "FeedAdsRequestManager.h"
#import "GDTUnifiedNativeAd.h"


@interface FeedAdsRequestManager ()
<
GDTUnifiedNativeAdDelegate
>

@property (nonatomic, strong) GDTUnifiedNativeAd *unifiedNativeAd;

@end



@implementation FeedAdsRequestManager

+ (instancetype)manager {
  return [[[self class] alloc] init];
}

- (void)loadAdsWithAdsID:(NSString *)adsId
                      adCount:(NSInteger)count
{
#ifdef DEBUG
  NSAssert(adsId.length != 0, @"no ads id");
#endif
  
  self.unifiedNativeAd = [[GDTUnifiedNativeAd alloc] initWithPlacementId:adsId];
  self.unifiedNativeAd.delegate = self;
  [self.unifiedNativeAd loadAdWithAdCount:count];
}

// MARK: - GDTUnifiedNativeAdDelegate
- (void)gdt_unifiedNativeAdLoaded:(NSArray<GDTUnifiedNativeAdDataObject *> *)unifiedNativeAdDataObjects
                            error:(NSError *)error
{
  if (!error && unifiedNativeAdDataObjects.count > 0) {
    NSLog(@"成功请求到广告数据");
    if (self.delegate && [self.delegate respondsToSelector:@selector(feedAdsLoadSuccess:)]) {
      [self.delegate feedAdsLoadSuccess:unifiedNativeAdDataObjects];
    }
    return;
  }
  
  if (error.code == 5004) {
      NSLog(@"没匹配的广告，禁止重试，否则影响流量变现效果");
  } else if (error.code == 5005) {
      NSLog(@"流量控制导致没有广告，超过日限额，请明天再尝试");
  } else if (error.code == 5009) {
      NSLog(@"流量控制导致没有广告，超过小时限额");
  } else if (error.code == 5006) {
      NSLog(@"包名错误");
  } else if (error.code == 5010) {
      NSLog(@"广告样式校验失败");
  } else if (error.code == 3001) {
      NSLog(@"网络错误");
  } else if (error.code == 5013) {
      NSLog(@"请求太频繁，请稍后再试");
  } else if (error) {
      NSLog(@"ERROR: %@", error);
  }
  if (self.delegate && [self.delegate respondsToSelector:@selector(feedAdsLoadFailed:)]) {
    [self.delegate feedAdsLoadFailed:error];
  }
}

@end
