//
//  MusicTableViewCell.m
//  reader
//
//  Created by Droi on 2019/8/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MusicTableViewCell.h"
#import "UIColor+TReaderTheme.h"
#import "TReaderManager.h"

@interface MusicTableViewCell ()
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *labelConstraint;

@end


@implementation MusicTableViewCell

- (void)awakeFromNib {
  [super awakeFromNib];
  
  [self.refreshMusicButton setImageEdgeInsets:UIEdgeInsetsMake(0, -10, 0, 0)];
}

- (void)updateLayoutConstraint {
  [UIView animateWithDuration:0.3 animations:^{
    self->_labelConstraint.constant = 16;
    [self.contentView layoutIfNeeded];
  }];
}

- (void)resetLayoutConstraint {
  [UIView animateWithDuration:0.3 animations:^{
    self->_labelConstraint.constant = 0;
    [self.contentView layoutIfNeeded];
  }];
}

- (IBAction)refreshMusicAction:(UIButton *)sender {
  if (self.refreshMusicAction) {
    self.refreshMusicAction(sender.tag);
  }
}

@end
