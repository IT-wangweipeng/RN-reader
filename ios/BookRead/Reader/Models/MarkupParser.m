//
//  MarkupParser.m
//  reader
//
//  Created by Droi on 2019/10/21.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MarkupParser.h"


@interface MarkupParser ()

@end



@implementation MarkupParser

+ (NSArray *)buildAttrString:(NSAttributedString *)attrString
                      inRect:(CGRect)rect
{
  NSUInteger textPos = 0;
  CTFramesetterRef framesetterRef = CTFramesetterCreateWithAttributedString((CFAttributedStringRef)attrString);
  NSMutableArray *ranges = [NSMutableArray array];
  while (textPos < attrString.length) {
    CGMutablePathRef path = CGPathCreateMutable();
    CGPathAddRect(path, NULL, rect);
    CTFrameRef ctFrame = CTFramesetterCreateFrame(framesetterRef, CFRangeMake(textPos, 0), path, nil);
    CFRange ctFrameRange = CTFrameGetVisibleStringRange(ctFrame);
    
    NSRange r = NSMakeRange(textPos, ctFrameRange.length);
    if (r.length > 0) {
      [ranges addObject:[NSValue valueWithRange:r]];
    }
    textPos += ctFrameRange.length;
    
    CFRelease(ctFrame);
  }
  
  NSArray *array = [ranges copy];
  
  CFRelease(framesetterRef);
  return array;
}

@end
