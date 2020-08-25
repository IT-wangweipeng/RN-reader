//
//  EReaderFontBar.h
//  Examda
//
//  Created by tanyang on 16/1/25.
//  Copyright © 2016年 tanyang. All rights reserved.
//

#import <UIKit/UIKit.h>

@class EReaderFontBar;

@protocol EReaderFontBarDelegate <NSObject>

- (void)readerFontBar:(EReaderFontBar *)readerFontBar changeReaderFont:(BOOL)increaseSize;
- (void)readerFontBar:(EReaderFontBar *)readerFontBar changeReaderTheme:(NSInteger)readerTheme;


// 上一章
- (void)loadPreChapter;
// 下一章
- (void)loadNextChapter;
// 选择目录
- (void)selectedCatalog;
// 点击评论
- (void)clickCommentAction:(NSInteger)tag;

@end

@interface EReaderFontBar : UIView

@property (nonatomic, weak) id<EReaderFontBarDelegate> delegate;
- (void)enablePreChapterBtn:(BOOL)isEnable;
- (void)enableNextChapterBtn:(BOOL)isEnable;
@end
