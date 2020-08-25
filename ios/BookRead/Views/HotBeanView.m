//
//  HotBeanView.m
//  reader
//
//  Created by JY on 2020/2/29.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "HotBeanView.h"

@implementation HotBeanView

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  if (self.tapView) {
    self.tapView();
  }
}

@end
