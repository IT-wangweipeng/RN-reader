//
//  VipView.m
//  reader
//
//  Created by Droi on 2019/9/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "VipView.h"
#import "UserUtil.h"
#import "RootViewController.h"

@interface VipView ()
@property (weak, nonatomic) IBOutlet UILabel *tipLabel;
@property (weak, nonatomic) IBOutlet UIButton *vipButton;

@end


@implementation VipView


- (void)awakeFromNib {
  [super awakeFromNib];
  
  BOOL hasLogin = [UserUtil hasLogin];
  if (!hasLogin) {
    [_vipButton setTitle:@"登录后，开通VIP免广告" forState:UIControlStateNormal];
    _tipLabel.hidden = NO;
  } else {
    _tipLabel.hidden = YES;
    [_vipButton setTitle:@"开通VIP，免广告" forState:UIControlStateNormal];
  }
}


- (IBAction)vipButtonAction:(UIButton *)sender {
  if (self.buttonAction) {
    self.buttonAction();
  }
}

@end
