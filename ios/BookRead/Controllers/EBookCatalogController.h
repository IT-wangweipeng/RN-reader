//
//  EBookCatalogController.h
//  reader
//
//  Created by yu on 2019/4/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>


@class BookChapterModel;
@class BookContentModel;
@protocol EBookCatalogControllerDelegate <NSObject>

- (void)selectedChapter:(BookChapterModel *)chapter index:(NSInteger)index;

@end


@interface EBookCatalogController : UIViewController

// 章节model
@property (nonatomic, strong) NSArray<BookChapterModel *> *chapters;
@property (nonatomic, weak) id<EBookCatalogControllerDelegate> delegate;
@property (nonatomic, strong) UIImage *bgImage;
@property (nonatomic, assign) NSInteger currentChapterIndex;
@property (nonatomic, strong) BookContentModel *bookModel;

@end
