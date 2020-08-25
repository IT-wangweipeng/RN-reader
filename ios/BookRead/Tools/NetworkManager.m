//
//  NetworkManager.m
//  reader
//
//  Created by yu on 2019/4/11.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NetworkManager.h"
#import "AFNetworking.h"
#import "UserDefaults.h"


@interface NetworkManager ()
@property (nonatomic, strong) AFHTTPSessionManager *sessionManager;
@property (nonatomic, strong) NSString *apiPrefix;
@end

static BOOL isTestModel = NO;



@implementation NetworkManager

+ (BOOL)isTestMode{
  return isTestModel;
}

- (NSString *)apiPrefix {
  if (!_apiPrefix) {
    _apiPrefix = [UserDefaults objectForKey:@"HOST_ADDRESS"];
  }
  return _apiPrefix;
}

+ (NetworkManager *)shareInstance
{
  static dispatch_once_t pred = 0;
  __strong static id _sharedObject = nil;
  dispatch_once(&pred, ^{
    _sharedObject = [[NetworkManager alloc] init];
  });
  return _sharedObject;
}


- (AFHTTPSessionManager *)sessionManager
{
  if (!_sessionManager) {
    _sessionManager = [[AFHTTPSessionManager alloc] init];
    NSMutableSet *acceptSet = [_sessionManager.responseSerializer.acceptableContentTypes mutableCopy];
    [acceptSet addObject:@"text/plain"];
    [acceptSet addObject:@"text/html"];
    
    _sessionManager.requestSerializer = [AFJSONRequestSerializer serializer];
    _sessionManager.responseSerializer = [AFJSONResponseSerializer serializer];
    _sessionManager.requestSerializer.timeoutInterval = 15;
    _sessionManager.securityPolicy = [AFSecurityPolicy defaultPolicy];
    _sessionManager.requestSerializer.cachePolicy = NSURLRequestUseProtocolCachePolicy;
    _sessionManager.responseSerializer.acceptableContentTypes = [acceptSet copy];
    
  }
  return _sessionManager;
}

- (void)request:(RequestType)requestType urlString:(NSString *)urlString parameter:(NSDictionary *)parameter resultBlock:(void (^)(id, NSError *))resultBlock
{
  void(^successBlock)(NSURLSessionDataTask * _Nonnull task, id _Nonnull responseObject) =
  ^(NSURLSessionDataTask * _Nonnull task, id _Nullable responseObject) {
    resultBlock(responseObject, nil);
  };
  
  void(^failBlock)(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) =
  ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    resultBlock(nil, error);
  };
  
  NSString *apiPrefix = self.apiPrefix;
  
  NSString *URL = [NSString stringWithFormat:@"%@%@", apiPrefix, urlString];
  NSLog(@"URL ===== %@", URL);
  
  if (requestType == RequestTypeGet) {
    [self.sessionManager GET:URL parameters:parameter progress:nil success:successBlock failure:failBlock];
  } else {
    [self.sessionManager POST:URL parameters:parameter progress:nil success:successBlock failure:failBlock];
  }
}

- (void)request:(RequestType)type url:(NSString *)url parameter:(NSDictionary *)params response:(void (^)(id, NSError *))responseBlock
{
  void(^successCallback)(NSURLSessionDataTask * _Nonnull task, id _Nonnull responseObject) =
  ^(NSURLSessionDataTask * _Nonnull task, id _Nullable responseObject) {
    responseBlock(responseObject, nil);
  };

  void(^failedCallback)(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) =
  ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    responseBlock(nil, error);
  };

  if (type == RequestTypeGet) {
    [self.sessionManager GET:url parameters:params progress:nil success:successCallback failure:failedCallback];
  } else {
    [self.sessionManager POST:url parameters:params progress:nil success:successCallback failure:failedCallback];
  }
}

- (void)networkReachability:(void (^)(AFNetworkReachabilityStatus status))callback {
  AFNetworkReachabilityManager *manager = [AFNetworkReachabilityManager sharedManager];
  [manager startMonitoring];
  [manager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
    callback(status);
  }];
}

@end
