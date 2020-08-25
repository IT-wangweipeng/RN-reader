//
//  ShareViewController.h
//  reader
//
//  Created by JY on 2019/5/5.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>


NS_ASSUME_NONNULL_BEGIN

@class BookContentModel;


@interface ShareViewController : UIViewController

@property (nonatomic, strong) BookContentModel *bookModel;

@end

NS_ASSUME_NONNULL_END
