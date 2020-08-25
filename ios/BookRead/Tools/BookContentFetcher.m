//
//  BookContentFetcher.m
//  reader
//
//  Created by JY on 2019/4/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BookContentFetcher.h"
#import "NetworkManager.h"
#import "BookChapterModel.h"
#import "MBProgressHUD+Message.h"


@implementation BookContentFetcher

+ (NSDictionary *)token {
  NSDictionary *userInfo = [[NSUserDefaults standardUserDefaults] objectForKey:@"USER_INFO"];
  NSDictionary *token =  @{
                          @"token" : [userInfo objectForKey:@"token"] ?: @"",
                          };
  
  return token;
}

+ (void)fetchBookContentWithBookID:(NSInteger)bookId
                           chapter:(NSInteger)chapterId
                         completed:(CompletedBlock)completed {
  NSString *url = [NSString stringWithFormat:@"/book/chapter/content/%ld/%ld", (long)bookId, (long)chapterId];
//  [MBProgressHUD showHudToView:nil];
  [[NetworkManager shareInstance] request:RequestTypeGet
                                urlString:url
                                parameter:[self token]
                              resultBlock:^(NSDictionary *response, NSError * _Nonnull error) {
//                                [MBProgressHUD hidenHudToView:nil];
                                if (error) {
                                  NSLog(@"error: %@", error);
                                  NSString *errorMsg = [NSString stringWithFormat:@"error: %ld", (long)error.code];
                                  [MBProgressHUD showMessage:errorMsg];
                                  if (completed) {
                                    completed(nil);
                                  }
                                  return;
                                }
                                int status = [response[@"status"] intValue];
                                if (status != 200) {
                                  // todo: 错误提示
                                  NSString *msg = [NSString stringWithFormat:@"%@", response[@"message"]];
                                  [MBProgressHUD showMessage:msg];
                                  if (completed) {
                                    completed(nil);
                                  }
                                  return;
                                }
                                
                                NSDictionary *dict = response[@"data"];
                                if (completed) {
                                  completed(dict);
                                }
                              }];
}


@end
