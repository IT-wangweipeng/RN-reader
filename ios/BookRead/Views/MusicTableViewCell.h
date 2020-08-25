//
//  MusicTableViewCell.h
//  reader
//
//  Created by Droi on 2019/8/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^RefreshMusicAction)(NSUInteger tag);

@interface MusicTableViewCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UIImageView *hornImageView;
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UIButton *refreshMusicButton;

@property (nonatomic, copy) RefreshMusicAction refreshMusicAction;

- (void)updateLayoutConstraint;
- (void)resetLayoutConstraint;

@end

NS_ASSUME_NONNULL_END
