//
//  BookEventEmitter.h
//  reader
//
//  Created by JY on 2019/4/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

static NSString *const SyncReadTimeNotification = @"SyncReadTimeNotification";
static NSString *const SyncReadFinishNotification = @"SyncReadFinishNotification";
static NSString *const SyncBookToShelfNotification = @"SyncBookToShelfNotification";
static NSString *const SyncBookRecordNotification = @"SyncBookRecordNotification";
static NSString *const SyncUserLoginNotification = @"SyncUserLoginNotification";
static NSString *const ClickCommentActionNotification = @"ClickCommentActionNotification";
static NSString *const ClickVipButtonActionNotification = @"ClickVipButtonActionNotification";
static NSString *const SplashAdsCloseActionNotification = @"SplashAdsCloseActionNotification";

@interface BookEventEmitter : RCTEventEmitter <RCTBridgeModule>


@end

