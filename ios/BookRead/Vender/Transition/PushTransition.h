//
//  PushTransition.h
//  reader
//
//  Created by JY on 2019/4/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface PushTransition : NSObject

@property(nonatomic,strong) id<UIViewControllerContextTransitioning>transitionContext;

@end

