//
//  ReaderChapter.h
//  reader
//
//  Created by Droi on 2019/10/30.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class ReaderPage;
@class BookChapterContentModel;

@interface ReaderChapter : NSObject
// 章节内容模型
@property (nonatomic, strong, readonly) BookChapterContentModel *contentModel;
// 总页数
@property (nonatomic, assign, readonly) NSUInteger totalPage;
// 章节内容
@property (nonatomic, strong) NSString *content;
// 章节标题
@property (nonatomic, strong, readonly) NSString *title;

// 显示的所有区域
@property (nonatomic, strong, readonly) NSArray *pageRanges;
// 当前页
//@property (nonatomic, strong, readonly) ReaderPage *currentPage;
// 渲染区域大小
@property (nonatomic, assign, readonly) CGSize renderSize;


// 根据显示的区域解析文本
- (void)parseModel:(BookChapterContentModel *)model
        renderSize:(CGSize)size;
// 获取当前页面内容
- (ReaderPage *)pageWithIndex:(NSUInteger)index;

// 获取页面index
- (NSInteger)pageIndexWithChapterOffset:(NSInteger)offset;

// 获取某页面的绘制区域
- (NSRange)pageRangeWithIndex:(NSUInteger)index;

+ (BOOL)canFreeRead;

@end

NS_ASSUME_NONNULL_END
