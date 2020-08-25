//
//  MusicPanelViewController.h
//  reader
//
//  Created by Droi on 2019/8/27.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^UpdateCallback)(void);
@class MusicModel;


@interface MusicPanelViewController : UIViewController

@property (nonatomic, assign) NSInteger musicIndex;
@property (nonatomic, strong) NSArray<MusicModel *> *musicModes;
@property (nonatomic, copy) UpdateCallback updateCallback;

@end

NS_ASSUME_NONNULL_END
