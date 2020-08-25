//
//  EMaskView.m
//  reader
//
//  Created by Apple on 2019/6/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "EMaskView.h"

@implementation EMaskView

//不影响用户操作
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event{
  UIView *hitView = [super hitTest:point withEvent:event];
  if (hitView == self) {
    return nil;
    
  } else {
    return hitView;
  }
}


@end
