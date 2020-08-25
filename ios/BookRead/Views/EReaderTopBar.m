//
//  EReaderTopBar.m
//  Examda
//
//  Created by tanyang on 16/1/25.
//  Copyright © 2016年 tanyang. All rights reserved.
//

#import "EReaderTopBar.h"
#import "UIColor+TReaderTheme.h"
#import "TReaderManager.h"

@interface EReaderTopBar ()
@property (weak, nonatomic) IBOutlet UIButton *backButton;
@end

@implementation EReaderTopBar

- (void)awakeFromNib {
  [super awakeFromNib];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(changeTopBarTheme) name:TReaderThemeChangeNofication object:nil];
  [self changeTopBarTheme];
  
  if (@available(iOS 11.0, *)) {
    if (UIApplication.sharedApplication.keyWindow.safeAreaInsets.bottom > 0.0) {
      self.frame = CGRectMake(0, 0, self.frame.size.width, 88);
    }
  }
}


- (IBAction)bookshelfAction:(UIButton *)sender {
    if ([_delegate respondsToSelector:@selector(readerTopBar:didClickedAction:)]) {
        [_delegate readerTopBar:self didClickedAction:EReaderTopBarActionBookshelf];
        sender.selected = !sender.isSelected;
    }
}

- (IBAction)shareAction:(UIButton *)sender {
  if ([_delegate respondsToSelector:@selector(readerTopBar:didClickedAction:)]) {
    [_delegate readerTopBar:self didClickedAction:EReaderTopBarActionShare];
  }
}


- (IBAction)navBackAction:(id)sender {
    if ([_delegate respondsToSelector:@selector(readerTopBar:didClickedAction:)]) {
        [_delegate readerTopBar:self didClickedAction:EReaderTopBarActionBack];
    }
}
- (IBAction)touchTopBar:(UITapGestureRecognizer *)sender {
}

// MARK: - Notification
- (void)changeTopBarTheme {
  TReaderTheme theme = [TReaderManager readerTheme];
  if (theme == TReaderThemeNight) {
    self.backgroundColor = [UIColor RGB:66 g:66 b:66];
    [self.backButton setImage:[UIImage imageNamed:@"button_back_white"] forState:UIControlStateNormal];
    [self.bookshelfBtn setImage:[UIImage imageNamed:@"button_add_bookshelf_white"] forState:UIControlStateNormal];
    [self.shareButton setImage:[UIImage imageNamed:@"image_share_white"] forState:UIControlStateNormal];
    self.bookshelfLable.textColor = [UIColor RGB:143 g:143 b:143];
    self.shareLabel.textColor = [UIColor RGB:143 g:143 b:143];
  } else {
    self.backgroundColor = [UIColor whiteColor];
    [self.backButton setImage:[UIImage imageNamed:@"button_back_black"] forState:UIControlStateNormal];
    [self.bookshelfBtn setImage:[UIImage imageNamed:@"button_add_bookshelf_black"] forState:UIControlStateNormal];
    [self.shareButton setImage:[UIImage imageNamed:@"image_share_black"] forState:UIControlStateNormal];
    self.bookshelfLable.textColor = [UIColor RGB:53 g:53 b:53];
    self.shareLabel.textColor = [UIColor RGB:53 g:53 b:53];
  }
}

@end
