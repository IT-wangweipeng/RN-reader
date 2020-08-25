//
//  ADAnalysis.m
//  reader
//
//  Created by JY on 2019/5/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "ADAnalysis.h"
#import "NetworkManager.h"

@implementation ADAnalysis

+ (NSString *)splashClickURL {
  return @"http://ads.adroi.com.cn/track.shtml?c=QHRvrHbLnjRdnL39faPYTh7WpdqYXgK-5RPniRPQFhNvuy4Ygv-b5yqdI7wzmyPoFhd-uA-95HRsnHm4nWfhTvkEIjLM6lLh-GM-_cOCoewxpyq1gSyt6rykWdtsPNtsr7tknHCYnafb&track=CLICK&media=5016924&pkg=packagename&isreturnad=is_return_sub&rUrl=";
}

+ (NSString *)splashShowURL {
  return @"http://ads.adroi.com.cn/track.shtml?c=nHfsPjmvP1cYPZ39faPYTh7WpdqYXgK-5NuFwNThugu-UMwxpyfqULNYNZF9mv_hUyNbpyDqPH0kPWbzPau1UAqY5XXjoXpyhXysWSBEV7qGULPx4Uz04UA5g10dg103g1DkrWfs&track=VIEW&media=5016924&pkg=packagename&isreturnad=is_return_sub&rUrl=";
}

+ (NSString *)splashAdFeedback:(BOOL)success {
  NSString *url = [NSString stringWithFormat:@"http://ads.adroi.com.cn/track.shtml?c=nH61rHbkP1n4PM39faPYTh7WpdqYXgK-5R7DRbNwFhNvuy4Ygv-b5yqdI7wzmyPoFhd-uA-95HRsnHm4nWfhTvkEIjLM6lLh-GM-_cOCoewxpyq1gSyt6rykWdtsPNtsr7tknHCYnafb&track=ADREQ&media=5016924&pkg=packagename&isreturnad=%d&rUrl=", success];
  return url;
}



+ (NSString *)bannerClickURL {
  return @"http://ads.adroi.com.cn/track.shtml?c=QHDdnHDdPHcsnH-ScR0WIZF9mvVxIZ-suHdjHD-jizu-IhN8I7qGujdEIgwRTh7WpzuVuywGmHYdnjDvrHcYFMP_ULfq43rV4Gpu4Ua5l2SYgv-ETdqamy48ugFxnjNxnj9xnHDln16b&track=CLICK&media=5016924&pkg=packagename&isreturnad=is_return_sub&rUrl=";
}
+ (NSString *)bannerShowURL {
  return @"http://ads.adroi.com.cn/track.shtml?c=PWDLnWb1n1bYxB70cLwzmyPogLw4TARqNb-7Nzu-IhN8I7qGujdEIgwRTh7WpzuVuywGmHYdnjDvrHcYFMP_ULfq43rV4Gpu4Ua5l2SYgv-ETdqamy48ugFxnjNxnj9xnHDln16b&track=VIEW&media=5016924&pkg=packagename&isreturnad=is_return_sub&rUrl=";
}

+ (NSString *)bannerAdFeedback:(BOOL)success {
  NSString *url = [NSString stringWithFormat:@"http://ads.adroi.com.cn/track.shtml?c=nHRLrjmdn1cYnM39faPYTh7WpdqYXgK-5R7DRbNwFhNvuy4Ygv-b5yqdI7wzmyPoFhd-uA-95HRsnHm4nWfhTvkEIjLM6lLh-GM-_cOCoewxpyq1gYF9Uh4-T-tsPNtsr7tknHC1rafb&track=ADREQ&media=5016924&pkg=packagename&isreturnad=%d&rUrl=", success];
  return url;
}


+ (NSString *)rewardedVideoClickURL {
  return @"http://ads.adroi.com.cn/track.shtml?c=nWDYnWDsnWfYrg39faPYTh7WpdqYXgK-5RPniRPQFhNvuy4Ygv-b5yqdI7wzmyPoFhd-uA-95HRsnHm4nWfhTvkEIjLM6lLh-GM-_cOCoewxpyq1gSpO6ry2_XBM98hBbNtsPNtsrNtkPWCdnBfb&track=CLICK&media=5016924&pkg=packagename&isreturnad=is_return_sub&rUrl=";
}

+ (NSString *)rewardedVideoShowURL {
  return @"http://ads.adroi.com.cn/track.shtml?c=nHn4n1f3njR1PZ39faPYTh7WpdqYXgK-5NuFwNThugu-UMwxpyfqULNYNZF9mv_hUyNbpyDqPH0kPWbzPau1UAqY5XXjoXpyhXysWSBEV7qGULPx4oS04mJkl2XAlp2wg10dg104g1DvrWRz&track=VIEW&media=5016924&pkg=packagename&isreturnad=is_return_sub&rUrl=";
}

+ (NSString *)rewardedVideoAdFeedback:(BOOL)success {
  NSString *url = [NSString stringWithFormat:@"http://ads.adroi.com.cn/track.shtml?c=QHDzn1T4nH6YnjFScR0WIZF9mvVxIZ-suHdKw7F7Riu-IhN8I7qGujdEIgwRTh7WpzuVuywGmHYdnjDvrHcYFMP_ULfq43rV4Gpu4Ua5l2SYgv-ETdOhE3j-BoZCG3UGCG7xnjNxnj-xnHmlPHcb&track=ADREQ&media=5016924&pkg=packagename&isreturnad=%d&rUrl=", success];
  return url;
}

+ (void)bannerAdsClickedReport {
  //  banner点击统计
  NSString *url = [self bannerClickURL];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];
}

+ (void)bannerAdsShowReport {
  NSString *url = [self bannerShowURL];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];
}

+ (void)bannerAdsLoadReport:(BOOL)success {
  NSString *url = [self bannerAdFeedback:success];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];
}

+ (void)splashAdsLoadReport:(BOOL)success {
  NSString *url = [self splashAdFeedback:success];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];

}

+ (void)splashAdsShowReport {
  NSString *url = [self splashShowURL];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];

}

+ (void)splashClickedReport {
  NSString *url = [self splashClickURL];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];
}

+ (void)videoAdsLoadReport:(BOOL)success {
  NSString *url = [self rewardedVideoAdFeedback:success];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];
}

+ (void)videoAdsShowReport {
  NSString *url = [self rewardedVideoShowURL];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];
}

+ (void)videoAdsClickedReport {
  NSString *url = [self rewardedVideoClickURL];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                      url:url
                                parameter:nil
                                 response:^(id response, NSError *error) {
                                   
                                 }];
}

@end
