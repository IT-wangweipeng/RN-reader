//
//  VipBookManager.m
//  reader
//
//  Created by Droi on 2019/9/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "VipBookManager.h"
#import "TimeUtil.h"
#import "BookContentModel.h"
#import "UserDefaults.h"

@implementation VipBookManager

+ (BOOL)isFreeChapter:(BookContentModel *)model {
  NSString *vipStartTime = model.start_vip_ts;
  NSString *vipEndTime = model.end_vip_ts;
  NSInteger now = [TimeUtil timestampSinceNow:0];
  NSInteger start = [[TimeUtil timestampFromString:vipStartTime] integerValue];
  NSInteger end = [[TimeUtil timestampFromString:vipEndTime] integerValue];
  
  BOOL isReview = [UserDefaults boolForKey:IS_REVIEW_VERSION];
  if (isReview) {
    return YES;
  }
  
  // 限时免费vip书籍
  if (now > start && now < end) {
    [UserDefaults setBool:YES forKey:IS_FREE_CHAPTER];
    return YES;
  }
  [UserDefaults setBool:NO forKey:IS_FREE_CHAPTER];
  return NO;
}


@end
