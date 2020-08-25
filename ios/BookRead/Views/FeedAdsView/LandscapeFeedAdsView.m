//
//  LandscapeFeedAdsView.m
//  reader
//
//  Created by Droi on 2020/6/12.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "LandscapeFeedAdsView.h"
#import "UIImageView+AFNetworking.h"

@interface LandscapeFeedAdsView ()
<
GDTUnifiedNativeAdViewDelegate
>

@end



@implementation LandscapeFeedAdsView


- (void)configAdData:(GDTUnifiedNativeAdDataObject *)ad viewController:(UIViewController *)vc {
  self.nativeAdView.delegate = self;
  self.nativeAdView.viewController = vc;
  
  if (ad.isVideoAd) {
    self.coverImageView.hidden = YES;
    ad.videoConfig.coverImageEnable = NO;
    ad.videoConfig.autoPlayPolicy = GDTVideoAutoPlayPolicyWIFI;
  } else {
    self.coverImageView.hidden = NO;
  }
  NSLog(@"adData ==== %d", ad.videoConfig.coverImageEnable);
  self.titleLabel.text = ad.title;
  self.descLabel.text = ad.desc;
  self.infoLabel.text = ad.callToAction ?: @"立即查看";
//  self.coverImageView.contentMode = UIViewContentModeScaleToFill;
  [self.coverImageView setImageWithURL:[NSURL URLWithString:ad.imageUrl]];
  [self.iconImageView setImageWithURL:[NSURL URLWithString:ad.iconUrl]];
  
  [self.nativeAdView registerDataObject:ad clickableViews:@[self.infoLabel, self.titleLabel, self.descLabel]];
  NSLog(@"腾讯广点通iamge ==== %@", ad.imageUrl);
}

- (void)dealloc {
  NSLog(@"FeedAdsView === 释放了");
}


// MARK: - GDTUnifiedNativeAdViewDelegate 广告展现代理
/**
 广告曝光回调
 */
- (void)gdt_unifiedNativeAdViewWillExpose:(GDTUnifiedNativeAdView *)unifiedNativeAdView {
  if ([self.delegate respondsToSelector:@selector(landscapeFeedAdsViewWillExpose)]) {
    [self.delegate landscapeFeedAdsViewWillExpose];
  }
}

- (void)gdt_unifiedNativeAdViewDidClick:(GDTUnifiedNativeAdView *)unifiedNativeAdView {
  NSLog(@"信息流广告被点击");
}


@end
