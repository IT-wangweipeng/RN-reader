//
//  RDProgressView.m
//  reader
//
//  Created by Apple on 2020/2/17.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RDProgressView.h"

#define RDProgressBorderWidth 0.1f
#define RDProgressPadding 1.0f
#define RDProgressColor [UIColor colorWithRed:24/255.0 green:135/255.0 blue:251/255.0 alpha:1]


@interface RDProgressView ()

@property (nonatomic,strong) UIView *tView;

@end

@implementation RDProgressView


- (void)awakeFromNib {
  [super awakeFromNib];
  
  //边框
  UIView *borderView = [[UIView alloc] initWithFrame:self.bounds];
  borderView.layer.cornerRadius = self.bounds.size.height * 0.5;
  borderView.layer.masksToBounds = YES;
  borderView.backgroundColor = [UIColor colorWithRed:211/255.0 green:233/255.0 blue:255/255.0 alpha:1.0];
//    borderView.layer.borderColor = [RDProgressColor CGColor];
  borderView.layer.borderColor = [RDProgressColor CGColor];
  borderView.layer.borderWidth = RDProgressBorderWidth;
  [self addSubview:borderView];
  
  //进度
  UIView *tView = [[UIView alloc] init];
  tView.backgroundColor = RDProgressColor;
  tView.layer.cornerRadius = (self.bounds.size.height - (RDProgressBorderWidth + RDProgressPadding) * 2) * 0.5;
  tView.layer.masksToBounds = YES;
  [self addSubview:tView];
  self.tView = tView;
  
}

- (void)setProgress:(CGFloat)progress
{
  _progress = progress;
  
  CGFloat margin = RDProgressBorderWidth + RDProgressPadding;
  CGFloat maxWidth = self.bounds.size.width - margin * 2;
  CGFloat heigth = self.bounds.size.height - margin * 2;
  
  _tView.frame = CGRectMake(margin, margin, maxWidth * progress, heigth);
}



@end
