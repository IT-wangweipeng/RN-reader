//
//  VipView.h
//  reader
//
//  Created by Droi on 2019/9/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^VipButtonAction)(void);

NS_ASSUME_NONNULL_BEGIN

@interface VipView : UIView

@property (nonatomic, copy) VipButtonAction buttonAction;

@end

NS_ASSUME_NONNULL_END
