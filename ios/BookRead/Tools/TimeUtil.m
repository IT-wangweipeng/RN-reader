//
//  TimeUtil.m
//  reader
//
//  Created by JY on 2019/5/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "TimeUtil.h"

@implementation TimeUtil
+ (NSInteger)timestampSinceNow:(NSTimeInterval)timeInterval {
  NSDate *date = [NSDate dateWithTimeIntervalSinceNow:timeInterval];
  NSTimeInterval time = [date timeIntervalSince1970];
  NSString *timeString = [NSString stringWithFormat:@"%.0f", time];
  return [timeString integerValue];
}

+ (NSString *)timeString:(NSString *)format {
  NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
  formatter.dateFormat = format;
  NSString *time = [formatter stringFromDate:[NSDate date]];
  return time;
}


+ (NSString *)timestampFromString:(NSString *)timeString {
  NSDateFormatter *ft = [[NSDateFormatter alloc] init];
  [ft setDateStyle:NSDateFormatterMediumStyle];
  [ft setTimeStyle:NSDateFormatterShortStyle];
  [ft setDateFormat:@"YYYY-MM-dd HH:mm:ss"];
  NSDate *date = [ft dateFromString:timeString];
  NSString *time = [NSString stringWithFormat:@"%f", [date timeIntervalSince1970]];
  return time;
}

@end
