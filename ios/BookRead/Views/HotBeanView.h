//
//  HotBeanView.h
//  reader
//
//  Created by JY on 2020/2/29.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RDProgressView.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^TapViewAction)(void);

@interface HotBeanView : UIView

@property (weak, nonatomic) IBOutlet RDProgressView *progressView;

@property (nonatomic, copy) TapViewAction tapView;

@end

NS_ASSUME_NONNULL_END
