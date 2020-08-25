//
//  UserUtil.m
//  reader
//
//  Created by Droi on 2019/9/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "UserUtil.h"
#import "UserDefaults.h"

@implementation UserUtil

+ (BOOL)hasLogin {
  NSString *token = [self token];
  if ([token isEqualToString:@""]) {
    return NO;
  }
  return YES;
}

+ (BOOL)isVip {
  NSDictionary *info = [[self userInfo] objectForKey:@"info"];
  BOOL ret = [[info objectForKey:@"is_vip"] boolValue];
  return ret;
}

+ (NSString *)token {
  NSDictionary *info = [self userInfo];
  NSString *token = [info objectForKey:@"token"];
  return token;
}

+ (NSDictionary *)userInfo {
  NSDictionary *info = [UserDefaults objectForKey:USER_INFO];
  return info;
}


@end
