//
//  UserDefaults.m
//  reader
//
//  Created by Droi on 2019/8/27.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "UserDefaults.h"

@implementation UserDefaults

+ (NSUserDefaults *)userDefault {
  NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
  return ud;
}

+ (void)setBool:(BOOL)value forKey:(NSString *)key {
  NSUserDefaults *ud = [self userDefault];
  [ud setBool:value forKey:key];
  [ud synchronize];
}

+ (BOOL)boolForKey:(NSString *)key {
  return [[self userDefault] boolForKey:key];
}

+ (void)setObject:(id)value forKey:(NSString *)key {
  NSUserDefaults *ud = [self userDefault];
  [ud setObject:value forKey:key];
  [ud synchronize];
}

+ (id)objectForKey:(NSString *)key {
  return [[self userDefault] objectForKey:key];
}

@end
