//
//  UserUtil.h
//  reader
//
//  Created by Droi on 2019/9/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface UserUtil : NSObject

+ (BOOL)hasLogin;
+ (BOOL)isVip;
+ (NSString *)token;
+ (NSDictionary *)userInfo;

@end

NS_ASSUME_NONNULL_END
