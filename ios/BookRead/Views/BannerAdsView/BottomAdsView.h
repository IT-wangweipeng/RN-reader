//
//  BottomAdsView.h
//  reader
//
//  Created by JY on 2019/5/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol BottomAdsViewDelegate <NSObject>
@optional
- (void)dislikeButtonClicked;

@end



@class BUNativeAd;
@interface BottomAdsView : UIView

@property (nonatomic, weak) id<BottomAdsViewDelegate> delegate;

- (void)updateTextColor:(UIColor *)color;

- (void)configBannerAds:(id)ads
         viewController:(UIViewController * _Nullable)vc;

@end

NS_ASSUME_NONNULL_END
