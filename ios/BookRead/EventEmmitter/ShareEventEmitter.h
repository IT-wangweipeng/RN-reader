//
//  ShareEventEmitter.h
//  reader
//
//  Created by Droi on 2019/7/24.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

static NSString *const ShareNotification = @"ShareNotification";

@interface ShareEventEmitter : RCTEventEmitter <RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
