//
//  UIColor+TReaderTheme.h
//  Examda
//
//  Created by tanyang on 16/1/25.
//  Copyright © 2016年 tanyang. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIColor (TReaderTheme)

// 背景颜色
+ (UIColor *)whiteBgReaderThemeColor;

// 文字颜色
+ (UIColor *)darkTextReaderThemeColor;

+ (UIColor *)RGB:(CGFloat)r g:(CGFloat)g b:(CGFloat)b;
+ (UIColor *)RGB_R:(CGFloat)r g:(CGFloat)g b:(CGFloat)b alp:(CGFloat)alp;

@end
