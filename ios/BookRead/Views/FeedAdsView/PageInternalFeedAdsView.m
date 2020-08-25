//
//  PageInternalFeedAdsView.m
//  reader
//
//  Created by Droi on 2020/6/22.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "PageInternalFeedAdsView.h"
#import "UIImageView+AFNetworking.h"
#import "ADAnalysis.h"

@interface PageInternalFeedAdsView ()
<
BUNativeAdDelegate
>

@property (weak, nonatomic) IBOutlet UIImageView *coverImageView;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UILabel *infoLabel;
@property (weak, nonatomic) IBOutlet UILabel *descLabel;
@property (weak, nonatomic) IBOutlet UIImageView *iconImageView;

@end



@implementation PageInternalFeedAdsView

- (void)configBudFeedAd:(BUNativeAd *)ad viewController:(UIViewController *)vc
{
  ad.delegate = self;
  ad.rootViewController = vc;
  [ad registerContainer:self withClickableViews:nil];
  if (!ad.data) { return; }
  BUMaterialMeta *meta = ad.data;
  self.titleLabel.text = meta.AdTitle;
  self.descLabel.text = meta.AdDescription;
  self.infoLabel.text = meta.buttonText;
  NSString *adImageURL;
  if (meta.imageAry.count > 0) {
    BUImage *adImg = meta.imageAry[0];
    adImageURL = adImg.imageURL;
    NSLog(@"icon ==========1 %@", adImageURL);
  } else {
    adImageURL = meta.icon.imageURL;
    NSLog(@"icon ==========2 %@", adImageURL);
  }
  [self.coverImageView setImageWithURL:[NSURL URLWithString:adImageURL]];
  [self.iconImageView setImageWithURL:[NSURL URLWithString:meta.icon.imageURL]];
}


// MARK: - BUNativeAdDelegate
- (void)nativeAd:(BUNativeAd *)nativeAd didFailWithError:(NSError *_Nullable)error {
  NSLog(@"fail load native ads: %ld", error.code);
}

- (void)nativeAdDidClick:(BUNativeAd *)nativeAd withView:(UIView *)view {
  [ADAnalysis bannerAdsClickedReport];
}

- (void)nativeAdDidBecomeVisible:(BUNativeAd *)nativeAd {
  [ADAnalysis bannerAdsShowReport];
  if ([self.delegate respondsToSelector:@selector(pageInternalFeedAdsWillExpose)]) {
    [self.delegate pageInternalFeedAdsWillExpose];
  }
}



@end
