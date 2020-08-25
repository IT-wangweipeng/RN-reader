//
//  RAtrributeManager.m
//  reader
//
//  Created by Apple on 2019/6/3.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RAtrributeManager.h"

@implementation RAtrributeManager


+ (NSAttributedString *)getAttributeWith:(id)sender
                                  string:(NSString *)string
                               orginFont:(CGFloat)orginFont
                              orginColor:(UIColor *)orginColor
                           attributeFont:(CGFloat)attributeFont
                          attributeColor:(UIColor *)attributeColor
{
  __block  NSMutableAttributedString *totalStr = [[NSMutableAttributedString alloc] initWithString:string];
  [totalStr addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:orginFont] range:NSMakeRange(0, string.length)];
  [totalStr addAttribute:NSForegroundColorAttributeName value:orginColor range:NSMakeRange(0, string.length)];
  NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
  [paragraphStyle setLineSpacing:5.0f]; //设置行间距
  [paragraphStyle setLineBreakMode:NSLineBreakByTruncatingTail];
  [paragraphStyle setAlignment:NSTextAlignmentCenter];
  [paragraphStyle setLineBreakMode:NSLineBreakByClipping];
  [totalStr addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [totalStr length])];
  
  if ([sender isKindOfClass:[NSArray class]]) {
    
    __block NSString *oringinStr = string;
    __weak typeof(self) weakSelf = self;
    
    [sender enumerateObjectsUsingBlock:^(NSString *  _Nonnull str, NSUInteger idx, BOOL * _Nonnull stop) {
      
      NSRange range = [oringinStr rangeOfString:str];
      [totalStr addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:attributeFont] range:range];
      [totalStr addAttribute:NSForegroundColorAttributeName value:attributeColor range:range];
      [totalStr addAttribute:NSUnderlineStyleAttributeName value:[NSNumber numberWithInteger:NSUnderlineStyleSingle] range:range];
      oringinStr = [oringinStr stringByReplacingCharactersInRange:range withString:[weakSelf     getStringWithRange:range]];
    }];
    
  }else if ([sender isKindOfClass:[NSString class]]) {
    
    NSRange range = [string rangeOfString:sender];
    
    [totalStr addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:attributeFont] range:range];
    [totalStr addAttribute:NSForegroundColorAttributeName value:attributeColor range:range];
    [totalStr addAttribute:NSUnderlineStyleAttributeName value:[NSNumber numberWithInteger:NSUnderlineStyleSingle] range:range];
  }
  return totalStr;
}

+ (NSString *)getStringWithRange:(NSRange)range
{
  NSMutableString *string = [NSMutableString string];
  for (int i = 0; i < range.length ; i++) {
    [string appendString:@" "];
  }
  return string;
}


@end
