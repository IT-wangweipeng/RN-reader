//
//  MaskView.m
//  reader
//
//  Created by Droi on 2019/10/24.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MaskView.h"

@implementation MaskView

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
  UIView *hitView = [super hitTest:point withEvent:event];
  if (hitView == self) {
    return nil;
  }
  return hitView;
}

@end
