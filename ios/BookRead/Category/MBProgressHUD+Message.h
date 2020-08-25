//
//  MBProgressHUD+Message.h
//  reader
//
//  Created by JY on 2019/4/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <MBProgressHUD/MBProgressHUD.h>


@interface MBProgressHUD (Message)
+ (MBProgressHUD *)showMessage:(NSString *)message;
+ (MBProgressHUD *)showHudToView:(UIView *)view;
+ (BOOL)hidenHudToView:(UIView *)view;
@end

