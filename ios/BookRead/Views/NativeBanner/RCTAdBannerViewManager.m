//
//  RCTAdBannerViewManager.m
//  reader
//
//  Created by JY on 2019/4/24.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTAdBannerViewManager.h"
#import <UIKit/UIKit.h>
#import <BUAdSDK/BUNativeAd.h>
#import <BUAdSDK/BUNativeAdRelatedView.h>
#import "BUDAdManager.h"
#import "RCTAdView.h"
#import "BUDBannerModel.h"
#import "AppDelegate.h"
#import "UIImageView+AFNetworking.h"
#import "ADAnalysis.h"
#import "NetworkManager.h"
#import "UIColor+TReaderTheme.h"
#import "RandomAdsGenerate.h"
#import "RequestBottomBannerAdsManager.h"
#import "TXAdsManager.h"



@interface RCTAdBannerViewManager ()
<
BUNativeAdDelegate,
RequestBottomBannerAdsManagerDelegate,
GDTUnifiedNativeAdViewDelegate
>

@property (nonatomic, strong) BUNativeAd *nativeAd_load;
@property (nonatomic, strong) BUDBannerModel *bannerModel;
@property (nonatomic, strong) RCTAdView *bannerAdView;

@property (nonatomic, strong) RequestBottomBannerAdsManager *bannerAdManager;

@end

@implementation RCTAdBannerViewManager
RCT_EXPORT_MODULE(RCTAdView)
RCT_EXPORT_VIEW_PROPERTY(onNativeAdDidLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onNativeAdDidBecomeVisible, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDislikeWithReason, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onNativeAdDidClick, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onNativeAdLoadFailed, RCTBubblingEventBlock)


- (UIView *)view {
  UIView *view = [self loadAdView];
  return view;
}

- (UIView *)loadAdView
{
  
  if ([RandomAdsGenerate canShowAds]) {
    RCTAdView *view = (RCTAdView *)[[[NSBundle mainBundle] loadNibNamed:@"RCTAdView" owner:self options:nil] firstObject];
    self.bannerAdView = view;
    [self loadNativeAd];
    return view;
  }
  return [RCTAdView new];
}

// MARK: - 腾讯广点通 Banner Ads
- (RequestBottomBannerAdsManager *)bannerAdManager
{
  if (!_bannerAdManager) {
    _bannerAdManager = [RequestBottomBannerAdsManager manager];
    _bannerAdManager.delegate = self;
  }
  return _bannerAdManager;
}

- (void)loadNativeAd {
  if ([RandomAdsGenerate isGDTAds]) {
    [self loadGDTads];
  } else {
    [self loadBUAds];
  }
}

- (void)loadGDTads
{
  [self.bannerAdManager loadBannerAdsWithID:[TXAdsManager bannerKey] adCount:1];
}

- (void)loadBUAds
{
  __weak typeof(self) weakSelf = self;
  [[BUDAdManager shareInstance] loadNativeAdsWithCount:1 imageSize:nil success:^(NSArray<BUNativeAd *> *ads) {
    [weakSelf configBUAds:ads];
  } failed:^(NSError *error) {

    
  }];
}

// RequestBottomBannerAdsManagerDelegate
- (void)bannerAdsLoadSuccess:(NSArray<GDTUnifiedNativeAdDataObject *> *_Nullable)ads
{
  
  if (self.bannerAdView.onNativeAdDidLoad) {
    self.bannerAdView.onNativeAdDidLoad(nil);
  }
  
  id ad = ads.firstObject;
  if ([ad isMemberOfClass:[GDTUnifiedNativeAdDataObject class]]) {
    GDTUnifiedNativeAdDataObject *adData = (GDTUnifiedNativeAdDataObject *)ad;
    self.bannerAdView.nativeAdView.viewController = [AppDelegate rootViewController];
    self.bannerAdView.nativeAdView.delegate = self;
    self.bannerAdView.titleLabel.text = adData.title;
    self.bannerAdView.descLabel.text = adData.desc;
    self.bannerAdView.moreInfoLabel.text = adData.callToAction ?: @"立即查看";
    [self.bannerAdView.imgView setImageWithURL:[NSURL URLWithString:adData.iconUrl]];
    [self.bannerAdView.nativeAdView registerDataObject:adData clickableViews:@[self.bannerAdView]];
  }
}

- (void)bannerAdsLoadFailed:(NSError *_Nullable)error
{
  
}

- (void)configBUAds:(NSArray<BUNativeAd *> *)ads;
{
  if (self.bannerAdView.onNativeAdDidLoad) {
    self.bannerAdView.onNativeAdDidLoad(nil);
  }
  
  if (ads.count > 0) {
    BUNativeAd *adData = ads.firstObject;
    adData.rootViewController = [AppDelegate rootViewController];
    adData.delegate = self;
    [adData registerContainer:self.bannerAdView withClickableViews:nil];
    self.bannerAdView.titleLabel.text = adData.data.AdTitle;
    self.bannerAdView.descLabel.text = adData.data.AdDescription;
    self.bannerAdView.moreInfoLabel.text = adData.data.buttonText;
    [self.bannerAdView.imgView setImageWithURL:[NSURL URLWithString:adData.data.icon.imageURL]];
    [ADAnalysis bannerAdsLoadReport:YES];
  }
}

- (void)nativeAdDidClick:(BUNativeAd *)nativeAd withView:(UIView *)view {
  if (self.bannerAdView.onNativeAdDidClick) {
    self.bannerAdView.onNativeAdDidClick(nil);
  }
  [ADAnalysis bannerAdsClickedReport];
}

- (void)nativeAdDidBecomeVisible:(BUNativeAd *)nativeAd {
  if (self.bannerAdView.onNativeAdDidBecomeVisible) {
    self.bannerAdView.onNativeAdDidBecomeVisible(nil);
  }
  [ADAnalysis bannerAdsShowReport];
}

- (void)nativeAd:(BUNativeAd *)nativeAd didFailWithError:(NSError *_Nullable)error {
  if (self.bannerAdView.onNativeAdLoadFailed) {
    self.bannerAdView.onNativeAdLoadFailed(@{@"error": error});
  }
  [ADAnalysis bannerAdsLoadReport:NO];
}

@end
