//
//  UIColor+TReaderTheme.m
//  Examda
//
//  Created by tanyang on 16/1/25.
//  Copyright © 2016年 tanyang. All rights reserved.
//

#import "UIColor+TReaderTheme.h"
#import "TReaderManager.h"

#define RGB(r,g,b,a) [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:a]
#define kNightLightBgColor  RGB(18, 18, 18, 1)
#define kEyeshieldLightBgColor RGB(225, 240, 230, 1)
#define kGrayBgColor RGB(224, 224, 224, 1)
#define kDefaultBgColor RGB(236, 224, 200, 1)

#define kNightDarkTextColor  RGB(121,130,156,1)
#define kDarkTextColor      RGB(61, 61, 61, 1)

@implementation UIColor (TReaderTheme)

+ (UIColor *)whiteBgReaderThemeColor {
  switch ([TReaderManager readerTheme]) {
    case TReaderThemeNight:
      return kNightLightBgColor;
    case TReaderThemeBeige:
      return kGrayBgColor;
    case TReaderThemeEyeshield:
      return kEyeshieldLightBgColor;
    default:
      return kDefaultBgColor;
  }
}

+ (UIColor *)darkTextReaderThemeColor
{
    if ([TReaderManager readerTheme] == TReaderThemeNight) {
      return kNightDarkTextColor;
    }
    return kDarkTextColor;
}

+ (UIColor *)RGB:(CGFloat)r g:(CGFloat)g b:(CGFloat)b {
  return [self RGB_R:r g:g b:b alp:1];
}

+ (UIColor *)RGB_R:(CGFloat)r g:(CGFloat)g b:(CGFloat)b alp:(CGFloat)alp {
  return [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:alp];
}

@end
