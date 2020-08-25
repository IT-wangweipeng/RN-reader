//
//  TimeUtil.h
//  reader
//
//  Created by JY on 2019/5/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TimeUtil : NSObject
+ (NSInteger)timestampSinceNow:(NSTimeInterval)timeInterval;
+ (NSString *)timeString:(NSString *)format;
+ (NSString *)timestampFromString:(NSString *)timeString;
@end
