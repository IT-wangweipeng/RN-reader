//
//  ImageTitleButton.m
//  reader
//
//  Created by JY on 2019/5/27.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "ImageTitleButton.h"

@implementation ImageTitleButton

- (void)layoutSubviews {
  [super layoutSubviews];
  
  [self setTitleEdgeInsets:UIEdgeInsetsMake(10, 0, 0, 10)];
  [self setImageEdgeInsets:UIEdgeInsetsMake(-10, 14,0, 0)];
}


@end
