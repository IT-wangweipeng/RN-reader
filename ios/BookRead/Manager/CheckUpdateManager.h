//
//  CheckUpdateManager.h
//  reader
//
//  Created by Droi on 2019/7/24.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface CheckUpdateManager : NSObject <RCTBridgeModule>

- (void)checkUpdate;

@end

NS_ASSUME_NONNULL_END
