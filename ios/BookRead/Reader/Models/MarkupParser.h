//
//  MarkupParser.h
//  reader
//
//  Created by Droi on 2019/10/21.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>

NS_ASSUME_NONNULL_BEGIN

@interface MarkupParser : NSObject

+ (NSArray *)buildAttrString:(NSAttributedString *)attrString
                      inRect:(CGRect)rect;

@end

NS_ASSUME_NONNULL_END
