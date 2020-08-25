//
//  RCTAdView.h
//  reader
//
//  Created by JY on 2019/4/24.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import "GDTUnifiedNativeAdView.h"



@interface RCTAdView : UIView

@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UILabel *descLabel;
@property (weak, nonatomic) IBOutlet UIImageView *imgView;
@property (weak, nonatomic) IBOutlet UILabel *moreInfoLabel;
@property (weak, nonatomic) IBOutlet GDTUnifiedNativeAdView *nativeAdView;


@property (nonatomic, copy) RCTBubblingEventBlock onNativeAdDidLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onNativeAdDidBecomeVisible;
@property (nonatomic, copy) RCTBubblingEventBlock onDislikeWithReason;
@property (nonatomic, copy) RCTBubblingEventBlock onNativeAdDidClick;
@property (nonatomic, copy) RCTBubblingEventBlock onNativeAdLoadFailed;

@end
