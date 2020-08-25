//
//  PushTransition.m
//  reader
//
//  Created by JY on 2019/4/25.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "PushTransition.h"

@interface PushTransition ()<CAAnimationDelegate>

@end

@implementation PushTransition

- (NSTimeInterval)transitionDuration:(nullable id <UIViewControllerContextTransitioning>)transitionContext {
  return 0.3f;
}
// This method can only  be a nop if the transition is interactive and not a percentDriven interactive transition.
- (void)animateTransition:(id <UIViewControllerContextTransitioning>)transitionContext
{
  self.transitionContext = transitionContext;
  
  UIViewController *fromVC = [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
  UIViewController *toVC = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
  //不添加的话，屏幕什么都没有
  UIView *containerView = [transitionContext containerView];
  [containerView addSubview:fromVC.view];
  [containerView addSubview:toVC.view];
  
  CABasicAnimation *maskAnimation = [CABasicAnimation animationWithKeyPath:@"position.x"];
  maskAnimation.fromValue = @(-toVC.view.frame.size.width/2.0);
  maskAnimation.toValue = @(toVC.view.frame.size.width/2.0);
  
  maskAnimation.duration = [self transitionDuration:transitionContext];
  maskAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
  maskAnimation.fillMode = kCAFillModeForwards;
  maskAnimation.removedOnCompletion = NO;
  maskAnimation.delegate = self;
  [toVC.view.layer addAnimation:maskAnimation forKey:@"position"];
}

- (void)animationDidStop:(CAAnimation *)anim finished:(BOOL)flag
{
  [self.transitionContext completeTransition:![self.transitionContext transitionWasCancelled]];
  //去除mask
  [self.transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey].view.layer.mask = nil;
  [self.transitionContext viewControllerForKey:UITransitionContextToViewControllerKey].view.layer.mask = nil;
}
@end
