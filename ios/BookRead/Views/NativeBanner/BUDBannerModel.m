//
//  BUDBannerModel.m
//  BUDemo
//
//  Created by iCuiCui on 2018/11/5.
//  Copyright © 2018年 bytedance. All rights reserved.
//

#import "BUDBannerModel.h"
#import <BUAdSDK/BUNativeAdRelatedView.h>
#import "UIView+Draw.h"


@implementation BUDBannerModel

- (instancetype)initWithNativeAd:(BUNativeAd *)nativeAd {
    self = [super init];
    if (self) {
        self.nativeAd = nativeAd;
        BUImage *adImage = nativeAd.data.imageAry.firstObject;
        CGFloat contentWidth = [UIScreen mainScreen].bounds.size.width;
        self.imgeViewHeight = contentWidth * adImage.height/ adImage.width;
    }
    return self;
}

@end
