//
//  CatalogHeaderView.m
//  reader
//
//  Created by JY on 2019/4/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "CatalogHeaderView.h"

@interface CatalogHeaderView ()

@end

@implementation CatalogHeaderView

- (void)awakeFromNib {
  [super awakeFromNib];
  
}


- (IBAction)reverseOrderClicked:(UIButton *)sender {
  if ([self.delegate respondsToSelector:@selector(reverseOrderButtonClicked)]) {
    [self.delegate reverseOrderButtonClicked];
  }
}


@end
