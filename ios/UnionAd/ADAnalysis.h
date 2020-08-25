//
//  ADAnalysis.h
//  reader
//
//  Created by JY on 2019/5/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ADAnalysis : NSObject

// ads event report
+ (void)bannerAdsShowReport;
+ (void)bannerAdsClickedReport;
+ (void)bannerAdsLoadReport:(BOOL)success;

+ (void)splashAdsShowReport;
+ (void)splashClickedReport;
+ (void)splashAdsLoadReport:(BOOL)success;

+ (void)videoAdsShowReport;
+ (void)videoAdsClickedReport;
+ (void)videoAdsLoadReport:(BOOL)success;

@end
