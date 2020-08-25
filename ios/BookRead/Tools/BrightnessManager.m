//
//  BrightnessManager.m
//  reader
//
//  Created by Droi on 2019/7/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BrightnessManager.h"

@implementation BrightnessManager

+ (void)saveNightModeEnable:(BOOL)enable {
  [[NSUserDefaults standardUserDefaults] setBool:enable forKey:@"NIGHT_MODE_KEY"];
  [[NSUserDefaults standardUserDefaults] synchronize];
}


+ (BOOL)isNightMode {
  BOOL nightMode = [[NSUserDefaults standardUserDefaults] boolForKey:@"NIGHT_MODE_KEY"];
  return nightMode;
}

@end
