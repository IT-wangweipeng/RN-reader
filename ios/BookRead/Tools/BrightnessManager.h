//
//  BrightnessManager.h
//  reader
//
//  Created by Droi on 2019/7/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface BrightnessManager : NSObject

+ (BOOL)isNightMode;
+ (void)saveNightModeEnable:(BOOL)enable;

@end

NS_ASSUME_NONNULL_END
