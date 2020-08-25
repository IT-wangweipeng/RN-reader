//
//  BookCatalogCell.h
//  reader
//
//  Created by Droi on 2019/9/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class BookChapterModel;

@interface BookCatalogCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UIImageView *imgView;

- (void)configCellWithModel:(BookChapterModel *)model;

@end

NS_ASSUME_NONNULL_END
