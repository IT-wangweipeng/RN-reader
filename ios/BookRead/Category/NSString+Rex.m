//
//  NSString+Rex.m
//  reader
//
//  Created by JY on 2019/4/21.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NSString+Rex.h"
#import "RegexKitlite.h"

@implementation NSString (Rex)
+ (NSString *)replaceBookContent:(NSString *)content {
  NSString *str = [content stringByReplacingOccurrencesOfRegex:@"\\s+" withString:@"\n\t"];
  return str;
}
@end
