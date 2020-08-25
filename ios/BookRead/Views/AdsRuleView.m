//
//  AdsRuleView.m
//  reader
//
//  Created by JY on 2019/5/15.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AdsRuleView.h"
#import "QWAlertView.h"

@interface AdsRuleView ()
@property (weak, nonatomic) IBOutlet UIButton *button;
@end

@implementation AdsRuleView

- (void)awakeFromNib {
  [super awakeFromNib];
  
  self.layer.masksToBounds = YES;
  self.layer.cornerRadius = 5;
  
  self.button.layer.cornerRadius = 5;
}

- (IBAction)donwButtonclicked:(UIButton *)sender {
  [[QWAlertView sharedMask] dismiss];
}

@end
