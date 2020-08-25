//
//  PortraitAdsInfoView.m
//  reader
//
//  Created by Droi on 2020/7/3.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "PortraitAdsInfoView.h"
#import "GDTUnifiedNativeAdDataObject.h"

@interface PortraitAdsInfoView ()
@property (weak, nonatomic) IBOutlet UILabel *descLabel;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UIButton *calloutButton;

@end

@implementation PortraitAdsInfoView

- (void)configAdsInfo:(GDTUnifiedNativeAdDataObject *)adInfo
{
  self.titleLabel.text = adInfo.title;
  self.descLabel.text = adInfo.desc;
  NSString *title = @"";
  if (adInfo.isAppAd) {
    title = @"立即下载";
  } else {
    title = adInfo.callToAction ?: @"立即查看";
  }

  [self.calloutButton setTitle:title forState:UIControlStateNormal];
}

@end
