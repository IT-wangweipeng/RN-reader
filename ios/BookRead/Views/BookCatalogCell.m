//
//  BookCatalogCell.m
//  reader
//
//  Created by Droi on 2019/9/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BookCatalogCell.h"
#import "BookChapterModel.h"
#import "UserUtil.h"
#import "UserDefaults.h"


@interface BookCatalogCell ()
@property (nonatomic, assign) BOOL userIsVip;
@end


@implementation BookCatalogCell

- (void)awakeFromNib {
  [super awakeFromNib];
  
  self.userIsVip = [UserUtil isVip];
  BOOL isReview = [UserDefaults boolForKey:IS_REVIEW_VERSION];
  if (isReview) {
    self.userIsVip = YES;
  }
}

- (void)configCellWithModel:(BookChapterModel *)model {
  if (self.userIsVip || !model.isvip) {
    self.imgView.hidden = YES;
  } else {
    self.imgView.image = [UIImage imageNamed:@"image_lock"];
    self.imgView.hidden = NO;
  }
  
  self.nameLabel.font = [UIFont systemFontOfSize:13];
  self.nameLabel.text = [NSString stringWithFormat:@"%@", model.title];
}

@end
