//
//  PageInternalFeedAdsView.h
//  reader
//
//  Created by Droi on 2020/6/22.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <BUAdSDK/BUNativeAd.h>


@protocol PageInternalFeedAdsViewDelegate <NSObject>

- (void)pageInternalFeedAdsWillExpose;

@end


NS_ASSUME_NONNULL_BEGIN

@interface PageInternalFeedAdsView : UIView

@property (nonatomic, weak) id<PageInternalFeedAdsViewDelegate> delegate;

- (void)configBudFeedAd:(BUNativeAd *)ad viewController:(UIViewController *)vc;

@end

NS_ASSUME_NONNULL_END
