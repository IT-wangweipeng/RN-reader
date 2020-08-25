//
//  ShareEventEmitter.m
//  reader
//
//  Created by Droi on 2019/7/24.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "ShareEventEmitter.h"
#import "MBProgressHUD+Message.h"

@implementation ShareEventEmitter

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()


- (NSArray<NSString *> *)supportedEvents {
  return @[@"onShare"];
}

RCT_EXPORT_METHOD(addShareListener) {
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(share:) name:ShareNotification object:nil];
}

RCT_EXPORT_METHOD(showMessage:(NSString *)msg) {
  [MBProgressHUD showMessage:msg];
}

- (void)share:(NSNotification *)notification {
  NSDictionary *event = notification.object;
  [self sendEventWithName:@"onShare" body:event];
}

@end
