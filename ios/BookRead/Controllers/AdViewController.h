//
//  AdViewController.h
//  reader
//
//  Created by JY on 2019/5/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

//@class BUNativeAd;
@class GDTUnifiedNativeAd;

@protocol AdViewControllerDelegate <NSObject>
- (void)refreshNativeAds;
- (void)rewardVideoPlayFinish;
@end




@interface AdViewController : UIViewController

@property (nonatomic, strong) GDTUnifiedNativeAd *unifiedAd;
@property (nonatomic, strong) NSArray *ads;
@property (nonatomic, assign) NSUInteger itemIndex;
@property (nonatomic, assign) BOOL goPre;
@property (nonatomic, assign) BOOL goNext;
@property (nonatomic, weak) id<AdViewControllerDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
