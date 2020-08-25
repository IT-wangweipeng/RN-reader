//
//  PartformUtil.m
//  reader
//
//  Created by JY on 2019/5/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PartformUtil.h"
#import <UIKit/UIKit.h>

@implementation PartformUtil
+ (BOOL)isIPhoneXSupport {
  if (@available(iOS 11.0, *)) {
    UIWindow *keyWindow = [[[UIApplication sharedApplication] delegate] window];
    return keyWindow.safeAreaInsets.bottom > 0;
  } else {
    return NO;
  }
}
@end
