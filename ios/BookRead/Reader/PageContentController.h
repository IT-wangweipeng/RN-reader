//
//  PageContentController.h
//  reader
//
//  Created by Droi on 2019/10/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TYAttributedLabel.h"


NS_ASSUME_NONNULL_BEGIN

@class ReaderPage;
@class ReaderChapter;

@protocol PageContentControllerDelegate <NSObject>
- (void)vipButtonClicked;
- (void)removeAds;
@end

@interface PageContentController : UIViewController

@property (weak, nonatomic) IBOutlet TYAttributedLabel *label;

@property (nonatomic, weak) id<PageContentControllerDelegate> delegate;
@property (nonatomic, strong) ReaderPage *currentPage;
@property (nonatomic, assign) NSUInteger itemIndex;

- (void)updatePageContent:(ReaderPage *)page;

@end

NS_ASSUME_NONNULL_END
