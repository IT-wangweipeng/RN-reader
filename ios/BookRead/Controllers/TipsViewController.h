//
//  TipsViewController.h
//  reader
//
//  Created by Droi on 2019/9/2.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^DismissViewControllerCompleted)(void);

NS_ASSUME_NONNULL_BEGIN

@interface TipsViewController : UIViewController

@property (nonatomic, copy) DismissViewControllerCompleted completed;

@end

NS_ASSUME_NONNULL_END
