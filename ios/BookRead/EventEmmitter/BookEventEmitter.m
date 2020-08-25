//
//  BookEventEmitter.m
//  reader
//
//  Created by JY on 2019/4/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BookEventEmitter.h"


@implementation BookEventEmitter

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onSyncBookRecord", @"onSyncBookToShelf", @"onSyncFinishReadBook", @"onSyncReadTime",@"onSyncUserLogin", @"onCommentAction", @"onVipCenterAction", @"onSplashAdsClose"];
}

- (void)startObserving {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(syncBookNotification:)
                                               name:SyncBookRecordNotification
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(syncBookToShelfNotification:)
                                               name:SyncBookToShelfNotification
                                             object:nil];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(syncFinishReadBookNotification:)
                                               name:SyncReadFinishNotification
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(syncReadTime:)
                                               name:SyncReadTimeNotification
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(userLoginMethod:)
                                               name:SyncUserLoginNotification
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(commentAction:)
                                               name:ClickCommentActionNotification
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(vipCenterAction:)
                                               name:ClickVipButtonActionNotification
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(splashAdsCloseAction:)
                                               name:SplashAdsCloseActionNotification
                                             object:nil];
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)vipCenterAction:(NSNotification *)notification {
  [self sendEventWithName:@"onVipCenterAction"
                     body:notification.userInfo];
}

- (void)commentAction:(NSNotification *)notification {
  [self sendEventWithName:@"onCommentAction"
                     body:notification.userInfo];
}

- (void)syncBookNotification:(NSNotification *)notification {
  [self sendEventWithName:@"onSyncBookRecord"
                     body:notification.userInfo];
  
}

- (void)syncBookToShelfNotification:(NSNotification *)notification {
  [self sendEventWithName:@"onSyncBookToShelf"
                     body:notification.userInfo];
  
}

- (void)syncFinishReadBookNotification:(NSNotification *)notification {
  [self sendEventWithName:@"onSyncFinishReadBook"
                     body:notification.userInfo];
}

- (void)syncReadTime:(NSNotification *)notification {
  [self sendEventWithName:@"onSyncReadTime"
                     body:notification.userInfo];
}


- (void)userLoginMethod:(NSNotification *)notification{
  [self sendEventWithName:@"onSyncUserLogin"
                     body:notification.userInfo];
}

- (void)splashAdsCloseAction:(NSNotification *)notification {
  [self sendEventWithName:@"onSplashAdsClose"
                     body:notification.userInfo];
}

@end
