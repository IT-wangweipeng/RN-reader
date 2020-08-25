//
//  ReaderHeader.h
//  reader
//
//  Created by JY on 2019/4/22.
//  Copyright © 2019 Facebook. All rights reserved.
//

#ifndef ReaderHeader_h
#define ReaderHeader_h

//-------------- weakSelf  && strongSelf --------------
#define WS(weakSelf)  __weak __typeof(self) weakSelf = self;
#define SS(weakSelf) __strong __typeof(self) strongSelf = weakSelf;

//-------------- 机型相关宏 --------------
#define IS_IPHONE_4 [UIScreen instancesRespondToSelector:@selector(currentMode)] ? \
CGSizeEqualToSize(CGSizeMake(640, 960), [[UIScreen mainScreen] currentMode].size) : \
NO

#define IS_IPHONE_5 [UIScreen instancesRespondToSelector:@selector(currentMode)] ? \
CGSizeEqualToSize(CGSizeMake(640, 1136), [[UIScreen mainScreen] currentMode].size) : \
NO

#define IS_IPHONE_6 [UIScreen instancesRespondToSelector:@selector(currentMode)] ? \
CGSizeEqualToSize(CGSizeMake(750, 1334), [[UIScreen mainScreen] currentMode].size) : \
NO

#define IS_IPHONE_6p [UIScreen instancesRespondToSelector:@selector(currentMode)] ? \
CGSizeEqualToSize(CGSizeMake(1080, 1920), [[UIScreen mainScreen] currentMode].size) : \
NO

#define IS_IPHONE_X [UIScreen instancesRespondToSelector:@selector(currentMode)] ? \
CGSizeEqualToSize(CGSizeMake(1125, 2436), [[UIScreen mainScreen] currentMode].size) : \
NO

#define IS_IPHONE_XR [UIScreen instancesRespondToSelector:@selector(currentMode)] ? \
CGSizeEqualToSize(CGSizeMake(828, 1792), [[UIScreen mainScreen] currentMode].size) : \
NO

#define IS_IPHONE_XMAX [UIScreen instancesRespondToSelector:@selector(currentMode)] ? \
CGSizeEqualToSize(CGSizeMake(1242, 2688), [[UIScreen mainScreen] currentMode].size) : \
NO

//-------------- 系统相关宏 --------------
#define IOS [[[UIDevice currentDevice] systemVersion] floatValue]//获取系统版本
#define IOS_8_OR_LATER [[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0 ? (YES) : (NO)//8及以上
#define IOS_9_OR_LATER [[[UIDevice currentDevice] systemVersion] floatValue] >= 9.0 ? (YES) : (NO)//9及以上
#define IOS_10_OR_LATER [[[UIDevice currentDevice] systemVersion] floatValue] >= 10.0 ? (YES) : (NO)//10及以上
#define IOS_11_OR_LATER [[[UIDevice currentDevice] systemVersion] floatValue] >= 11.0 ? (YES) : (NO)//11及以上
#define IOS_12_OR_LATER [[[UIDevice currentDevice] systemVersion] floatValue] >= 12.0 ? (YES) : (NO)//12及以上

//-------------- 是否全面屏(刘海屏)机型 ---------------
#define XSeriesPhone \
({BOOL isXSeriesPhone = NO;\
if (@available(iOS 11.0, *)) {\
isXSeriesPhone = [[UIApplication sharedApplication] delegate].window.safeAreaInsets.bottom > 0.0;\
}\
(isXSeriesPhone);})

//-------------- 适配相关宏 --------------
// 屏幕适配
#define Screen_bounds [[UIScreen mainScreen] bounds]
#define Screen_Height [UIScreen mainScreen].bounds.size.height
#define Screen_Width [UIScreen mainScreen].bounds.size.width

// 状态栏高度
#define StateBarHeight (XSeriesPhone ? 44.0 : 20.0)
// 导航栏高度
#define NavigationBarHeight (StateBarHeight + 44.0)
// 底部tabbar高度
#define TabBarHeight (isFullScreen ? (49.0+34.0) : 49.0)

//-------------- NSLog在release下不输出 ---------------
#ifdef DEBUG
#define NSLog(...) printf("myAppInfo %s\n %s\n",__func__, [[NSString stringWithFormat:__VA_ARGS__]UTF8String]);
#else
#define NSLog(format, ...)
#endif


//-------------- 全局可用文件 ---------------
#import "RAtrributeManager.h"

// 测试地址
#define TEST_SERVICE @"http://10.20.70.219/read/4/6"
// 正式地址
#define PRODUCTION_SERVICE @"http://read.mjpet.net/4/6"


#define READ_TIME_API @"/user/today/read/ts"
#define READ_HOTBEANS_API @"/user/read/hotbeans/info"

#endif /* ReaderHeader_h */
