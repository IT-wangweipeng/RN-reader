//
//  RandomAdsGenerate.m
//  reader
//
//  Created by Droi on 2020/6/23.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RandomAdsGenerate.h"
#import "UserDefaults.h"

@interface RandomAdsGenerate ()

@end

@implementation RandomAdsGenerate

+ (NSArray *)allAds
{
  return [UserDefaults objectForKey:AD_TYPE];
}

+ (BOOL)canShowAds
{
  return [self allAds].count > 0;
}

+ (BOOL)isGDTAds
{
  NSArray *ads = [self allAds];
  if (ads.count > 0) {
    int random = (int)arc4random_uniform((int)ads.count-1);
    int adType = [ads[random] intValue];
    NSLog(@"random ==== %d %d", random, adType);
    if (adType == 10) {
      return YES;
    } else if (adType == 8) {
      return NO;
    }
  }
  return NO;
}

@end
