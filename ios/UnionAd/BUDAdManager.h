//
//  BUAdManager.h
//  BUDemo
//
//  Created by carlliu on 2017/7/27.
//  Copyright © 2017年 chenren. All rights reserved.
//

#import <Foundation/Foundation.h>

static NSString *const AD_TIMESTAMP = @"AD_TIMESTAMP";
static NSString *const AD_THREEDAYTIMESTAMP = @"AD_THREEDAYTIMESTAMP";

@protocol BUDAdManagerDelegate <NSObject>

@end


@class BUSize;
@class BUNativeAd;


typedef void (^BottomAdsLoadSuccessBlock)(NSArray<BUNativeAd *>  *ads);
typedef void (^BottomAdsLoadFailedBlock)(NSError *error);

typedef void (^PageInternalAdsLoadSuccessBlock)(NSArray<BUNativeAd *>  *ads);
typedef void (^PageInternalAdsLoadFailedBlock)(NSError *error);


@interface BUDAdManager : NSObject

// 限时免广告截止日期、开始日期
@property (nonatomic, strong) NSString *end_ad_ts;
@property (nonatomic, strong) NSString *start_ad_ts;

+ (BUDAdManager *)shareInstance;

+ (NSString *)appKey;
+ (NSString *)splashSlotID;
+ (NSString *)nativeBannerSlotID;
+ (NSString *)rewardVideo;

// 是否需要显示广告
+ (BOOL)isAdsEnable;

// 加载页面内部banner广告
- (void)loadPageInternalAdsWithCount:(NSInteger)count
                           imageSize:(BUSize *)size
                             success:(PageInternalAdsLoadSuccessBlock)success
                              failed:(PageInternalAdsLoadFailedBlock)failed;
// 加载底部banenr广告
- (void)loadNativeAdsWithCount:(NSInteger)count
                    imageSize:(BUSize *)size
                      success:(BottomAdsLoadSuccessBlock)success
                       failed:(BottomAdsLoadFailedBlock)failed;

@end
