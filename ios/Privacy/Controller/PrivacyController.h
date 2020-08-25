//
//  PrivacyController.h
//  reader
//
//  Created by Droi on 2020/4/15.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^AgreePrivacyBlock)(void);

@interface PrivacyController : UIViewController

@property (nonatomic, copy) AgreePrivacyBlock agreePrivacy;

@end

NS_ASSUME_NONNULL_END
