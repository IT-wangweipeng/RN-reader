//
//  EReaderFontBar.m
//  Examda
//
//  Created by tanyang on 16/1/25.
//  Copyright © 2016年 tanyang. All rights reserved.
//

#import "EReaderFontBar.h"
#import "TReaderManager.h"
#import "ImageTitleButton.h"
#import "UIColor+TReaderTheme.h"
#import "BrightnessManager.h"

@interface EReaderFontBar ()
@property (nonatomic, weak) UIButton *selectedBtn;
@property (weak, nonatomic) IBOutlet UIButton *normalBtn;
@property (weak, nonatomic) IBOutlet UIButton *eyeBtn;
@property (weak, nonatomic) IBOutlet ImageTitleButton *nightBtn;
@property (weak, nonatomic) IBOutlet UIButton *beigeBtn;

@property (weak, nonatomic) IBOutlet UIButton *decreseFontBtn;
@property (weak, nonatomic) IBOutlet UIButton *increaseFontBtn;

@property (weak, nonatomic) IBOutlet UIButton *catalogBtn;
@property (weak, nonatomic) IBOutlet UIButton *preChapterBtn;
@property (weak, nonatomic) IBOutlet UIButton *nextChapterBtn;
@property (weak, nonatomic) IBOutlet UILabel *lightLabel;
@property (weak, nonatomic) IBOutlet UILabel *fontSizeLabel;
@property (weak, nonatomic) IBOutlet UILabel *fontLabel;
@property (weak, nonatomic) IBOutlet UILabel *commentLabel;
@property (weak, nonatomic) IBOutlet UIImageView *commentImageView;
@property (weak, nonatomic) IBOutlet UIButton *messageButton;
@property (weak, nonatomic) IBOutlet UIButton *commentButton;
@property (weak, nonatomic) IBOutlet UILabel *bgLabel;
@property (weak, nonatomic) IBOutlet UIView *viewWrapper;

@end

@implementation EReaderFontBar

- (void)awakeFromNib {
  [super awakeFromNib];
   [self setupUI];
  [self updateFontSizeBtnState];
  [self selectDefaultThemeBtn];
}

- (void)setupUI {
  self.commentButton.layer.cornerRadius = 22;
  self.messageButton.layer.cornerRadius = 22;
  self.decreseFontBtn.layer.cornerRadius = 16;
  self.increaseFontBtn.layer.cornerRadius = 16;
  self.decreseFontBtn.layer.borderWidth = 1;
  self.increaseFontBtn.layer.borderWidth = 1;
  self.decreseFontBtn.layer.borderColor = [UIColor colorWithRed:148/255.0 green:155/255.0 blue:165/255.0 alpha:1].CGColor;
   self.increaseFontBtn.layer.borderColor = [UIColor colorWithRed:148/255.0 green:155/255.0 blue:165/255.0 alpha:1].CGColor;
  [self.nightBtn setImage:[UIImage imageNamed:@"image_night"] forState:UIControlStateSelected];
}
- (IBAction)tapFontPanner:(UITapGestureRecognizer *)sender {
}

- (void)selectDefaultThemeBtn {
  TReaderTheme theme = [TReaderManager readerTheme];
  switch (theme) {
    case TReaderThemeNight:
      self.nightBtn.selected = YES;
      self.selectedBtn = self.nightBtn;
      break;
    case TReaderThemeBeige:
      self.beigeBtn.selected = YES;
      self.selectedBtn = self.beigeBtn;
      break;
    case TReaderThemeEyeshield:
      self.eyeBtn.selected = YES;
      self.selectedBtn = self.eyeBtn;
      break;
    default:
      self.normalBtn.selected = YES;
      self.selectedBtn = self.normalBtn;
      break;
  }
  
 
  
  self.selectedBtn.layer.borderColor = [UIColor RGB_R:248 g:88 b:54 alp:1].CGColor;
  self.selectedBtn.layer.borderWidth = 2;
  [self updateFontViewTheme:theme];
}

- (void)updateFontViewTheme:(TReaderTheme)theme {
  switch (theme) {
    case TReaderThemeNight:
      self.commentButton.backgroundColor =  [UIColor RGB:66 g:66 b:66];
      self.messageButton.backgroundColor = [UIColor RGB:66 g:66 b:66];
      self.viewWrapper.backgroundColor = [UIColor RGB:66 g:66 b:66];
      self.commentImageView.image = [UIImage imageNamed:@"image_edit_night"];
      [self updateColor:[UIColor RGB:143 g:143 b:143]];
      _commentLabel.textColor = [UIColor RGB:143 g:143 b:143];
      break;
    default:
      self.commentImageView.image = [UIImage imageNamed:@"image_edit_nomal"];
      self.commentButton.backgroundColor = [UIColor whiteColor];
      self.messageButton.backgroundColor = [UIColor whiteColor];
      self.viewWrapper.backgroundColor = [UIColor whiteColor];
      [self updateColor:[UIColor RGB:30 g:37 b:47]];
      _commentLabel.textColor = [UIColor RGB:177 g:187 b:212];
      break;
  }
}

- (void)updateColor:(UIColor *)color {
  _lightLabel.textColor = color;
  _fontLabel.textColor = color;
  _fontSizeLabel.textColor = color;
  _bgLabel.textColor = color;
  [_nextChapterBtn setTintColor:color];
  [_catalogBtn setTintColor:color];
  [_preChapterBtn setTintColor:color];
  [_decreseFontBtn setTintColor:color];
  [_increaseFontBtn setTintColor:color];
}

- (void)updateFontSizeBtnState
{
    self.decreseFontBtn.enabled = [TReaderManager canDecreaseFontSize];
    self.increaseFontBtn.enabled = [TReaderManager canIncreaseFontSize];
  self.fontSizeLabel.text = [NSString stringWithFormat:@"%lu", [TReaderManager fontSize]];
}


#pragma mark - action

- (IBAction)commentAction:(UIButton *)sender {
  if ([_delegate respondsToSelector:@selector(clickCommentAction:)]) {
    [_delegate clickCommentAction:sender.tag];
  }
}

- (IBAction)messageAction:(UIButton *)sender {
  if ([_delegate respondsToSelector:@selector(clickCommentAction:)]) {
    [_delegate clickCommentAction:sender.tag];
  }
}

- (IBAction)sliderValueChangeAction:(UISlider *)sender{
    [[UIScreen mainScreen] setBrightness:sender.value];
}

- (IBAction)decreaseFontAction:(id)sender{
    if ([_delegate respondsToSelector:@selector(readerFontBar:changeReaderFont:)]) {
        [_delegate readerFontBar:self changeReaderFont:NO];
    }
    [self updateFontSizeBtnState];
}

- (IBAction)increaseFontAction:(id)sender {
    if ([_delegate respondsToSelector:@selector(readerFontBar:changeReaderFont:)]) {
        [_delegate readerFontBar:self changeReaderFont:YES];
    }
    [self updateFontSizeBtnState];
}

- (IBAction)selectedThemeAction:(UIButton *)sender {
  sender.layer.borderColor = [UIColor RGB_R:248 g:88 b:54 alp:1].CGColor;
  sender.layer.borderWidth = 2;
  
  if (_selectedBtn != sender) {
    _selectedBtn.selected = NO;
    _selectedBtn.layer.borderColor = [UIColor clearColor].CGColor;
    _selectedBtn.layer.borderWidth = 0;
  }
  sender.selected = YES;
  _selectedBtn = sender;
  if ([_delegate respondsToSelector:@selector(readerFontBar:changeReaderTheme:)]) {
    [_delegate readerFontBar:self changeReaderTheme:sender.tag];
  }
  [self updateFontViewTheme:sender.tag];
}
- (IBAction)selectedPreChapterAction:(UIButton *)sender {
  if ([_delegate respondsToSelector:@selector(loadPreChapter)]) {
    [_delegate loadPreChapter];
  }
}

- (IBAction)sselectedCatalogAction:(UIButton *)sender {
  if ([_delegate respondsToSelector:@selector(selectedCatalog)]) {
    [_delegate selectedCatalog];
  }
}

- (IBAction)selectedNextChapter:(UIButton *)sender {
  if ([_delegate respondsToSelector:@selector(loadNextChapter)]) {
    [_delegate loadNextChapter];
  }
}

- (void)enablePreChapterBtn:(BOOL)isEnable {
  [self.preChapterBtn setEnabled:isEnable];
}
- (void)enableNextChapterBtn:(BOOL)isEnable {
  [self.nextChapterBtn setEnabled:isEnable];
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end
