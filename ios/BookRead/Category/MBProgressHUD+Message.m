//
//  MBProgressHUD+Message.m
//  reader
//
//  Created by JY on 2019/4/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MBProgressHUD+Message.h"
#import "UIImage+GIF.h"
#import "UIColor+TReaderTheme.h"

@implementation MBProgressHUD (Message)
+ (MBProgressHUD *)showMessage:(NSString *)message {
  return [self showMessage:message toView:nil];
}

+ (MBProgressHUD *)showMessage:(NSString *)message toView:(UIView *)view {
  if (view == nil) {
    view = [[UIApplication sharedApplication].windows lastObject];
  }
  MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:view animated:YES];
  hud.label.text = message;
  hud.removeFromSuperViewOnHide = YES;
  hud.mode = MBProgressHUDModeText;
  [hud hideAnimated:YES afterDelay:1];
  return hud;
}

+ (MBProgressHUD *)showHudToView:(UIView *)view {
  if (view == nil) view = [[UIApplication sharedApplication].windows lastObject];
  MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:view animated:YES];
  UIImage *image = [UIImage sd_animatedGIFNamed:@"loading_animation"];
  UIImageView *imgView = [[UIImageView alloc] initWithImage:image];
  //设置hud模式
  hud.mode = MBProgressHUDModeCustomView;
  //设置在hud影藏时将其从SuperView上移除,自定义情况下默认为NO
//  hud.removeFromSuperViewOnHide = YES;
  //设置方框view为该模式后修改颜色才有效果
  hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
  //设置方框view背景色
  hud.bezelView.backgroundColor = [UIColor RGB_R:0 g:0 b:0 alp:0.2];
  //设置总背景view的背景色，并带有透明效果
  hud.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.3];
  hud.customView = imgView;
  hud.margin = -2;
  
  return hud;
}



+ (BOOL)hidenHudToView:(UIView *)view {
  if (view == nil) view = [[UIApplication sharedApplication].windows lastObject];
  BOOL ret = [MBProgressHUD hideHUDForView:view animated:YES];
  return ret;
}

@end
