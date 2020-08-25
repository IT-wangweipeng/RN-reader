//
//  NetworkManager.h
//  reader
//
//  Created by yu on 2019/4/11.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFNetworking.h"


typedef NS_ENUM(NSInteger, RequestType) {
  RequestTypeGet,
  RequestTypePost,
};

@interface NetworkManager : NSObject

+ (BOOL)isTestMode;
+ (NetworkManager *)shareInstance;

/**
 网络请求
 
 @param request 网络请求_类型
 @param urlString 网络请求_网址
 @param parameter 网络请求请求_参数
 @param resultBlock 网路请求到数据_结果
 */
- (void)request:(RequestType)request
      urlString:(NSString *)urlString
      parameter:(NSDictionary *)parameter
    resultBlock:(void(^)(id responseObject, NSError *error))resultBlock;


// 统计广告
- (void)request:(RequestType)type
            url:(NSString *)url
      parameter:(NSDictionary *)params
    response:(void(^)(id response, NSError *error))responseBlock;

- (void)networkReachability:(void (^)(AFNetworkReachabilityStatus status))callback;

@end
