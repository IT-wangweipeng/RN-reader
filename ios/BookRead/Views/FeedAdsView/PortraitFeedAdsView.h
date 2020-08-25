//
//  PortraitFeedAdsView.h
//  reader
//
//  Created by Droi on 2020/6/18.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "GDTUnifiedNativeAdView.h"

NS_ASSUME_NONNULL_BEGIN

@protocol PortraitFeedAdsViewDelegate <NSObject>

- (void)portraitFeedAdsWillExpose;

@end


@class GDTUnifiedNativeAdDataObject;
@interface PortraitFeedAdsView : UIView

@property (nonatomic, weak) id<PortraitFeedAdsViewDelegate> delegate;

- (void)configProtraitFeedAd:(GDTUnifiedNativeAdDataObject *)ad
              viewController:(UIViewController *)vc;

@end

NS_ASSUME_NONNULL_END
