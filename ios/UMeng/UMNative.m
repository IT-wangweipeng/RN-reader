//
//  UMNative.m
//  UMNative
//
//
//  Copyright (c) 2016年 tendcloud. All rights reserved.
//

#import <UMAnalytics/MobClick.h>
#import "UMNative.h"
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>

@implementation UMNative

RCT_EXPORT_MODULE();

//统计
//RCT_EXPORT_METHOD(onCCEvent:(NSArray *)eventArray value:(int)value eventLabel:(NSString *)eventLabel)
//{
//
//  if (eventLabel == nil && [eventLabel isKindOfClass:[NSNull class]]) {
//    eventLabel = nil;
//  }
//  [MobClick event:eventArray value:value label:eventLabel];
//}

RCT_EXPORT_METHOD(onEvent:(NSString *)eventId)
{
  [MobClick event:eventId];
}

RCT_EXPORT_METHOD(onEventWithLabel:(NSString *)eventId eventLabel:(NSString *)eventLabel)
{
  if ([eventLabel isKindOfClass:[NSNull class]]) {
    eventLabel = nil;
  }
  [MobClick event:eventId label:eventLabel];

}

RCT_EXPORT_METHOD(onEventWithParameters:(NSString *)eventId parameters:(NSDictionary *)parameters)
{

  if (parameters == nil && [parameters isKindOfClass:[NSNull class]]) {
    parameters = nil;
  }
  [MobClick event:eventId attributes:parameters];
}

RCT_EXPORT_METHOD(onEventWithCounter:(NSString *)eventId parameters:(NSDictionary *)parameters eventNum:(int)eventNum)
{
  if (parameters == nil && [parameters isKindOfClass:[NSNull class]]) {
    parameters = nil;
  }
  
  [MobClick event:eventId attributes:parameters counter:eventNum];
}

RCT_EXPORT_METHOD(onPageBegin:(NSString *)pageName)
{
  [MobClick beginLogPageView:pageName];
}

RCT_EXPORT_METHOD(onPageEnd:(NSString *)pageName)
{
  [MobClick endLogPageView:pageName];
}

@end
