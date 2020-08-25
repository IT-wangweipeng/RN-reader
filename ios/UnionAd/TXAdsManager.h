//
//  TXAdsManager.h
//  reader
//
//  Created by Droi on 2020/6/4.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface TXAdsManager : NSObject

+ (BOOL)isGDTAds;
+ (NSString *)appKey;
+ (NSString *)splashKey;
+ (NSString *)bannerKey;
+ (NSString *)rewardVideoKey;
+ (NSString *)feedKey;

@end

NS_ASSUME_NONNULL_END
