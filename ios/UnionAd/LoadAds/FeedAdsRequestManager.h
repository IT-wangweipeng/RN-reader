//
//  FeedAdsRequestManager.h
//  reader
//
//  Created by Droi on 2020/6/12.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GDTUnifiedNativeAdDataObject.h"

NS_ASSUME_NONNULL_BEGIN


@protocol LoadFeedAdsDelegate <NSObject>

- (void)feedAdsLoadSuccess:(NSArray<GDTUnifiedNativeAdDataObject *> *)ads;
- (void)feedAdsLoadFailed:(NSError *)error;

@end


@interface FeedAdsRequestManager : NSObject

@property (nonatomic, weak) id<LoadFeedAdsDelegate> delegate;

+ (instancetype)manager;

- (void)loadAdsWithAdsID:(NSString *)adsId
                 adCount:(NSInteger)count;

@end

NS_ASSUME_NONNULL_END
