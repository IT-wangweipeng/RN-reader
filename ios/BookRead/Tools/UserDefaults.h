//
//  UserDefaults.h
//  reader
//
//  Created by Droi on 2019/8/27.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UserDefaults.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const TOGGLE_MUSIC_BUTTON = @"TOGGLE_MUSIC_BUTTON";
static NSString *const NETWORK_PROMISE_STATE = @"NETWORK_PROMISE_STATE";
static NSString *const PLAY_ORDER_SETTING = @"PLAY_ORDER_SETTING";
static NSString *const CYCLE_PLAY = @"CYCLE_PLAY";
static NSString *const ORDER_PLAY = @"ORDER_PLAY";
static NSString *const USER_INFO = @"USER_INFO";
static NSString *const SHOW_MUSIC_PAGE = @"SHOW_MUSIC_PAGE";
static NSString *const SHOW_MUSIC_TIPS = @"SHOW_MUSIC_TIPS";
static NSString *const IS_FREE_CHAPTER = @"IS_FREE_CHAPTER";
static NSString *const IS_REVIEW_VERSION = @"IS_REVIEW_VERSION";
static NSString *const MUSIC_PLAY_BUTTON_ENABLE = @"MUSIC_PLAY_BUTTON_ENABLE";
static NSString *const PRIVACY_GUIDELINES = @"PRIVACY_GUIDELINES";
static NSString *const IS_GDT_ADS = @"IS_GDT_ADS";
static NSString *const AD_TYPE = @"AD_TYPE";


@interface UserDefaults : NSObject

+ (void)setBool:(BOOL)value forKey:(NSString *)key;
+ (BOOL)boolForKey:(NSString *)key;

+ (void)setObject:(id)value forKey:(NSString *)key;
+ (id)objectForKey:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
