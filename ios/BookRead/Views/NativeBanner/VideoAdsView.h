//
//  VideoAdsView.h
//  reader
//
//  Created by JY on 2019/5/14.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>



@protocol VideoAdsViewDelegate <NSObject>
@optional

- (void)moreInfoButtonClicked:(UIButton *)button;

@end

typedef void(^RewardVideoPlayFinished)(void);


@interface VideoAdsView : UIView

@property (nonatomic, weak) id<VideoAdsViewDelegate> delegate;
@property (nonatomic, copy) RewardVideoPlayFinished videoPlayFinish;

@end
