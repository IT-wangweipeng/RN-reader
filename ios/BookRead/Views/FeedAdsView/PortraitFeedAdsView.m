//
//  PortraitFeedAdsView.m
//  reader
//
//  Created by Droi on 2020/6/18.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "PortraitFeedAdsView.h"
#import "GDTUnifiedNativeAdDataObject.h"
#import "GDTUnifiedNativeAdView.h"
#import "UIImageView+AFNetworking.h"
#import "PortraitAdsInfoView.h"

@interface PortraitFeedAdsView ()
<
GDTUnifiedNativeAdViewDelegate
>

@property (strong, nonatomic) GDTUnifiedNativeAdView *adView;
@property (strong, nonatomic) PortraitAdsInfoView *infoView;

@end

@implementation PortraitFeedAdsView


- (instancetype)init
{
  self = [super init];
  if (self) {
    [self addSubview:self.adView];
  }
  return self;
}

- (void)configProtraitFeedAd:(GDTUnifiedNativeAdDataObject *)ad
              viewController:(UIViewController *)vc
{
  _adView.viewController = vc;
  _adView.delegate = self;
  
  _adView.layer.masksToBounds = YES;
  _adView.layer.cornerRadius = 4.0;
  
  if (ad.isVideoAd) {
    ad.videoConfig.autoPlayPolicy = GDTVideoAutoPlayPolicyWIFI;
  }
  
  CGFloat imageRate = 16 / 9.0;
  if (ad.imageHeight > 0) {
    imageRate = ad.imageWidth / (CGFloat)ad.imageHeight;
  }
  
  CGSize screenSize = [UIScreen mainScreen].bounds.size;
  
  CGFloat topMargin = 74;
  CGFloat bottomMargin = 80;
  CGFloat h = screenSize.height - topMargin - bottomMargin - 38;
  CGFloat adWidth = imageRate * h;
  CGFloat xPos = (screenSize.width - adWidth) / 2;
  
  self.frame = CGRectMake(xPos, topMargin, adWidth, h);
  self.adView.frame = CGRectMake(0, 0, adWidth, h);
  
  NSLog(@"h ================ %@", NSStringFromCGRect([UIScreen mainScreen].bounds));
  
  if ([UIScreen mainScreen].bounds.size.height > 667) {
    self.adView.transform = CGAffineTransformMakeScale(0.93, 0.93);
  }
  

  [self.adView addSubview:self.infoView];
  self.infoView.frame = CGRectMake(0, self.frame.size.height - 100, self.frame.size.width, 100);
  [self.infoView configAdsInfo:ad];
  
  [_adView registerDataObject:ad clickableViews:@[self.infoView]];
}

// MARK: - GDTUnifiedNativeAdViewDelegate
- (void)gdt_unifiedNativeAdViewWillExpose:(GDTUnifiedNativeAdView *)unifiedNativeAdView {
  NSLog(@"广告曝光");
  NSLog(@"gdt_unifiedNativeAdDetailViewWillPresentScreen");
  [UIView animateWithDuration:1.0 animations:^{
    self.infoView.alpha = 1;
    [self.adView bringSubviewToFront:self.infoView];
  }];
  
  if ([self.delegate respondsToSelector:@selector(portraitFeedAdsWillExpose)]) {
    [self.delegate portraitFeedAdsWillExpose];
  }
}

- (void)gdt_unifiedNativeAdViewDidClick:(GDTUnifiedNativeAdView *)unifiedNativeAdView {
  NSLog(@"信息流广告被点击");
}


- (GDTUnifiedNativeAdView *)adView
{
  if (!_adView) {
    _adView = [[GDTUnifiedNativeAdView alloc] init];
    _adView.frame = self.bounds;
  }
  return _adView;
}

- (PortraitAdsInfoView *)infoView
{
  if (!_infoView) {
    _infoView = (PortraitAdsInfoView *)[[[NSBundle mainBundle] loadNibNamed:@"PortraitAdsInfoView" owner:self options:nil] firstObject];
    _infoView.alpha = 0;
  }
  
  return _infoView;
}

@end
