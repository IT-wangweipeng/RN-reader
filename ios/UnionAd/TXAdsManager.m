//
//  TXAdsManager.m
//  reader
//
//  Created by Droi on 2020/6/4.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "TXAdsManager.h"
#import "UserDefaults.h"

@implementation TXAdsManager

+ (BOOL)isGDTAds {
  BOOL ret = [UserDefaults boolForKey:IS_GDT_ADS];
  return ret;
}

+ (NSString *)appKey {
  return @"1110576416";
}

// 开屏
+ (NSString *)splashKey {
  return @"9021210553940680";
}

// banner自渲染
+ (NSString *)bannerKey {
  return @"1091114754045244";
}

// 激励视频
+ (NSString *)rewardVideoKey {
  return @"5081114503741918";
}


// 阅读页动态信息流(16:9 图片/视频、9:16 视频)
+ (NSString *)feedKey {
  return @"4071117672718823";
//  return @"7071716566634255";
  // 竖版素材（图片/视频）
//  return @"7000593393992138";
}
@end
