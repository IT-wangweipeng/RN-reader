//
//  PortraitAdsInfoView.h
//  reader
//
//  Created by Droi on 2020/7/3.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class GDTUnifiedNativeAdDataObject;
@interface PortraitAdsInfoView : UIView

- (void)configAdsInfo:(GDTUnifiedNativeAdDataObject *)adInfo;

@end

NS_ASSUME_NONNULL_END
