//
//  TipsViewController.m
//  reader
//
//  Created by Droi on 2019/9/2.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "TipsViewController.h"
#import "UIColor+TReaderTheme.h"
#import "TReaderManager.h"

@interface TipsViewController ()

@property (weak, nonatomic) IBOutlet UIButton *disMissButton;
@property (weak, nonatomic) IBOutlet UIImageView *bubbleImageView;
@property (weak, nonatomic) IBOutlet UILabel *tipsLable;

@end

@implementation TipsViewController

- (void)awakeFromNib {
  [super awakeFromNib];
  

}

- (IBAction)dismissAction:(UIButton *)sender {
  [self dismissViewControllerAnimated:NO completion:nil];
  if (self.completed) {
    self.completed();
  }
}

- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.disMissButton.clipsToBounds = YES;
  self.disMissButton.layer.cornerRadius = 14;
  self.disMissButton.layer.borderWidth = 1;
  self.disMissButton.layer.borderColor = [UIColor RGB:248 g:88 b:54].CGColor;
  [self.disMissButton setTitleColor:[UIColor RGB:248 g:88 b:54] forState:UIControlStateNormal];
  self.disMissButton.titleLabel.font = [UIFont systemFontOfSize:15];
  
  if ([TReaderManager readerTheme] == TReaderThemeNight) {
    self.bubbleImageView.image = [UIImage imageNamed:@"image_bubble_night"];
    self.tipsLable.textColor = [UIColor RGB:143 g:143 b:143];
  }
}

@end
