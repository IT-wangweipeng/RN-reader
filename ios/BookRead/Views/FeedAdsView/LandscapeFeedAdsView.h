//
//  LandscapeFeedAdsView.h
//  reader
//
//  Created by Droi on 2020/6/12.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "GDTUnifiedNativeAdView.h"

NS_ASSUME_NONNULL_BEGIN

@protocol LandscapeFeedAdsViewDelegate <NSObject>

- (void)landscapeFeedAdsViewWillExpose;

@end


@interface LandscapeFeedAdsView : UIView

@property (weak, nonatomic) IBOutlet GDTUnifiedNativeAdView *nativeAdView;
@property (weak, nonatomic) IBOutlet UIImageView *coverImageView;
@property (weak, nonatomic) IBOutlet UIImageView *iconImageView;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UILabel *descLabel;
@property (weak, nonatomic) IBOutlet UILabel *infoLabel;


@property (nonatomic, weak) id<LandscapeFeedAdsViewDelegate> delegate;

- (void)configAdData:(GDTUnifiedNativeAdDataObject *)ad viewController:(UIViewController *)vc;

@end

NS_ASSUME_NONNULL_END
