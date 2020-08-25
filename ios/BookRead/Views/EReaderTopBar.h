//
//  EReaderTopBar.h
//  Examda
//
//  Created by tanyang on 16/1/25.
//  Copyright © 2016年 长沙二三三网络科技有限公司. All rights reserved.
//

#import <UIKit/UIKit.h>

@class EReaderTopBar;

typedef NS_ENUM(NSUInteger, EReaderTopBarAction) {
  EReaderTopBarActionBack,
  EReaderTopBarActionBuy,
  EReaderTopBarActionConsult,
  EReaderTopBarActionBookshelf,
  EReaderTopBarActionShare,
};

@protocol EReaderTopBarDelegate  <NSObject>

- (void)readerTopBar:(EReaderTopBar *)readerTopBar didClickedAction:(EReaderTopBarAction)action;

@end

@interface EReaderTopBar : UIView

@property (weak, nonatomic) IBOutlet UIButton *bookshelfBtn;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UIButton *shareButton;
@property (weak, nonatomic) IBOutlet UILabel *bookshelfLable;
@property (weak, nonatomic) IBOutlet UILabel *shareLabel;

@property (nonatomic, weak) id<EReaderTopBarDelegate> delegate;

@end
