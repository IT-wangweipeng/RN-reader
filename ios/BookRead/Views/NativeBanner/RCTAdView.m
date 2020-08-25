//
//  RCTAdView.m
//  reader
//
//  Created by JY on 2019/4/24.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTAdView.h"

#define SCREEN_WIDTH ([[UIScreen mainScreen] bounds].size.width)


@interface RCTAdView ()
@property (weak, nonatomic) IBOutlet UILabel *adLabel;

@end

@implementation RCTAdView

- (void)awakeFromNib {
  [super awakeFromNib];
  
  _adLabel.layer.cornerRadius = 8;
  _adLabel.layer.masksToBounds = YES;
  _moreInfoLabel.layer.cornerRadius = 8;
  _moreInfoLabel.layer.masksToBounds = YES;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  

//  self.frame = CGRectMake(self.frame.origin.x, self.frame.origin.y, SCREEN_WIDTH, 120);
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end
