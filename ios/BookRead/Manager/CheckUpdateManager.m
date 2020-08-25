//
//  CheckUpdateManager.m
//  reader
//
//  Created by Droi on 2019/7/24.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "CheckUpdateManager.h"
#import <AFNetworking/AFNetworking.h>
#import "AppDelegate.h"
#import <React/RCTBridgeModule.h>

@interface CheckUpdateManager ()

@property (nonatomic, copy) RCTResponseSenderBlock senderCallback;

@end


@implementation CheckUpdateManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(checkNewVersion:(RCTResponseSenderBlock)callback) {
  self.senderCallback = callback;
  [self checkUpdate];
}

- (void)checkUpdate {
  NSDictionary *infoDic = [[NSBundle mainBundle] infoDictionary];
  NSString *currentVersion = [infoDic objectForKey:@"CFBundleShortVersionString"];
  NSString *urlStr = @"https://itunes.apple.com/cn/lookup?id=1461699619";
  // 获取App Store中当前APP的版本号
  WS(weakSelf)
  AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  [manager POST:urlStr parameters:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    
    NSArray *results = responseObject[@"results"];
    NSDictionary *dict = [results lastObject];
    NSString *lineVersion = dict[@"version"];
    NSString *trackViewUrl = dict[@"trackViewUrl"];
    
    if ([lineVersion compare:currentVersion options:NSNumericSearch] == NSOrderedDescending) {
      UIAlertController *alercConteoller = [UIAlertController alertControllerWithTitle:@"Wow，发现了新版本~" message:[NSString stringWithFormat:@"新版本(%@)增加了很多新特性，建议更新哟~", lineVersion] preferredStyle:UIAlertControllerStyleAlert];
      UIAlertAction *updateAction = [UIAlertAction actionWithTitle:@"立即更新" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:trackViewUrl] options:@{} completionHandler:nil];
      }];
      UIAlertAction *negativeAction = [UIAlertAction actionWithTitle:@"暂不" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        
      }];
      [alercConteoller addAction:updateAction];
      [alercConteoller addAction:negativeAction];
      [[AppDelegate rootViewController] presentViewController:alercConteoller animated:YES completion:nil];
    } else {
      NSLog(@"当前版本:%@ 更高", currentVersion);
      if (weakSelf.senderCallback) {
        weakSelf.senderCallback(@[@{
                                    @"result" : @"已经是最新版本啦~"
                                    }]);
      }
    }
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    NSLog(@"错误  ： %@",error);
    if (weakSelf.senderCallback) {
      weakSelf.senderCallback(@[@{
                                  @"result" : @"检查更新失败"
                                  }]);
    }
  }];
}

@end
