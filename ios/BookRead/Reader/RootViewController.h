//
//  RootViewController.h
//  Reader
//
//  Created by Droi on 2019/10/15.
//  Copyright © 2019 JY. All rights reserved.
//

#import <UIKit/UIKit.h>



@class BookContentModel;

NS_ASSUME_NONNULL_BEGIN

@interface RootViewController : UIViewController

// 是否已经加入过书架
@property (nonatomic, assign) BOOL isCollected;
@property (nonatomic, strong) BookContentModel *bookModel;
// 阅读当前 chapterIndex
@property (nonatomic, assign) NSInteger chapterIndex;

@end

NS_ASSUME_NONNULL_END
