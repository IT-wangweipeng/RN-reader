//
//  CatalogHeaderView.h
//  reader
//
//  Created by JY on 2019/4/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>


@protocol CatalogHeaderViewDelegate <NSObject>
- (void)reverseOrderButtonClicked;
@end

NS_ASSUME_NONNULL_BEGIN

@interface CatalogHeaderView : UIView

@property (nonatomic, weak) id<CatalogHeaderViewDelegate> delegate;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UIButton *sortButton;

@end

NS_ASSUME_NONNULL_END
