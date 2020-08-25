//
//  BottomAdsView.m
//  reader
//
//  Created by JY on 2019/5/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BottomAdsView.h"
#import "UIImageView+AFNetworking.h"
#import <BUAdSDK/BUNativeAdsManager.h>
#import "GDTUnifiedNativeAdDataObject.h"
#import "GDTUnifiedNativeAdView.h"
#import "ADAnalysis.h"

@interface BottomAdsView ()
<
GDTUnifiedNativeAdViewDelegate,
BUNativeAdDelegate
>

@property (weak, nonatomic) IBOutlet UIImageView *adImageView;
@property (weak, nonatomic) IBOutlet UILabel *adTitleLabel;
@property (weak, nonatomic) IBOutlet UILabel *adDescLabel;
@property (weak, nonatomic) IBOutlet UILabel *adInfoLabel;
@property (weak, nonatomic) IBOutlet GDTUnifiedNativeAdView *adView;

@end

@implementation BottomAdsView

- (void)awakeFromNib {
  [super awakeFromNib];
  
  self.adInfoLabel.layer.cornerRadius = 13;
  self.adInfoLabel.layer.masksToBounds = YES;
}

- (void)configBannerAds:(id)ad viewController:(UIViewController * _Nullable)vc
{
  if (!ad) {
    return;
  }
  
  if ([ad isMemberOfClass:[GDTUnifiedNativeAdDataObject class]]) {
    GDTUnifiedNativeAdDataObject *data = (GDTUnifiedNativeAdDataObject *)ad;
    [self.adView registerDataObject:data clickableViews:@[self]];
    self.adView.delegate = self;
    self.adView.viewController = vc;
    [self configGDTBanner:data];
  } else {
    BUNativeAd *data = (BUNativeAd *)ad;
    data.rootViewController = vc;
    data.delegate = self;
    [data registerContainer:self withClickableViews:nil];
    [self configBUDBanner:data];
  }
}

// 广点通
- (void)configGDTBanner:(GDTUnifiedNativeAdDataObject *)ad
{
  self.adDescLabel.text = ad.desc;
  self.adTitleLabel.text = ad.title;
  self.adInfoLabel.text = ad.callToAction ?: @"立即查看";
  [self.adImageView setImageWithURL:[NSURL URLWithString:ad.iconUrl]];
}

// 穿山甲
- (void)configBUDBanner:(BUNativeAd *)ad
{
  self.adTitleLabel.text = ad.data.AdTitle;
  self.adDescLabel.text = ad.data.AdDescription;
  self.adInfoLabel.text = ad.data.buttonText;
  [self.adImageView setImageWithURL:[NSURL URLWithString:ad.data.icon.imageURL]];
}


- (void)updateTextColor:(UIColor *)color {
  self.adTitleLabel.textColor = color;
}

- (IBAction)dislikeButtonClicked:(UIButton *)sender {
  if ([self.delegate respondsToSelector:@selector(dislikeButtonClicked)]) {
    [self.delegate dislikeButtonClicked];
  }
}

// MARK: - BUNativeAdDelegate
- (void)nativeAdDidBecomeVisible:(BUNativeAd *)nativeAd {
  [ADAnalysis bannerAdsShowReport];
}

- (void)nativeAdDidClick:(BUNativeAd *)nativeAd withView:(UIView *_Nullable)view {
  [ADAnalysis bannerAdsClickedReport];
}

- (void)nativeAdDidLoad:(BUNativeAd *)nativeAd {
  
}

- (void)nativeAd:(BUNativeAd *)nativeAd didFailWithError:(NSError *_Nullable)error {
  
}




@end
