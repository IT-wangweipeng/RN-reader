//
//  RewardVideoManager.h
//  reader
//
//  Created by Droi on 2020/6/24.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, RewardVideoType) {
  RewardVideoBUD,
  RewardVideoGDT,
};


@protocol RewardVideoManagerDelegate <NSObject>
@optional
// 广告加载成功
- (void)rewardVideoAdDidLoadFinish:(id _Nonnull )ad
                              type:(RewardVideoType)adType;

// 广告加载失败
- (void)rewardVideoAdDidLoadFailed:(NSError *_Nullable)error
                              type:(RewardVideoType)adType;

// 广告关闭
- (void)rewardVideoAdDidClose:(RewardVideoType)adType;

// 广告播放完成
- (void)rewardVideoAdDidPlayFinish:(RewardVideoType)adType;

@end

NS_ASSUME_NONNULL_BEGIN

@interface RewardVideoManager : NSObject


@property (nonatomic, weak) id<RewardVideoManagerDelegate> delegate;

+ (instancetype)manager;
- (void)loadRewardVideo:(RewardVideoType)videoType;

@end

NS_ASSUME_NONNULL_END
