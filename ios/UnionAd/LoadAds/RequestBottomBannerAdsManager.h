//
//  RequestBottomBannerAdsManager.h
//  reader
//
//  Created by Droi on 2020/6/22.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GDTUnifiedNativeAdDataObject.h"

@protocol RequestBottomBannerAdsManagerDelegate <NSObject>
@optional
- (void)bannerAdsLoadSuccess:(NSArray<GDTUnifiedNativeAdDataObject *> *_Nullable)ads;
- (void)bannerAdsLoadFailed:(NSError *_Nullable)error;

@end



NS_ASSUME_NONNULL_BEGIN

@interface RequestBottomBannerAdsManager : NSObject

@property (nonatomic, weak) id<RequestBottomBannerAdsManagerDelegate> delegate;

+ (instancetype)manager;

- (void)loadBannerAdsWithID:(NSString *)adsId
                    adCount:(NSInteger)count;


@end

NS_ASSUME_NONNULL_END
