//
//  ReaderChapter.m
//  reader
//
//  Created by Droi on 2019/10/30.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "ReaderChapter.h"
#import "TYTextContainer.h"
#import "TReaderManager.h"
#import "MarkupParser.h"
#import "ReaderPage.h"
#import "BookChapterModel.h"
#import "UserDefaults.h"
#import "UserUtil.h"
#import "UIColor+TReaderTheme.h"

@interface ReaderChapter ()

@property (nonatomic, assign) CGSize renderSize;
@property (nonatomic, strong) NSAttributedString *attString;
@property (nonatomic, strong) NSArray *pageRanges;

@end



@implementation ReaderChapter

static BOOL chapterIsVip = NO;

- (void)parseModel:(BookChapterContentModel *)model
        renderSize:(CGSize)size
{
  _contentModel = model;
  _renderSize = size;
  _title = model.title;
  _content = model.content;
  chapterIsVip = model.isvip;
  
  [self parseContent];
}

- (void)parseContent
{
  NSMutableArray *mutiArr = [NSMutableArray array];

  TYTextContainer *textContainer = [[TYTextContainer alloc] init];
  textContainer.text = self.content;
  textContainer.font = [UIFont systemFontOfSize:[TReaderManager fontSize]];
  textContainer.textAlignment = NSTextAlignmentJustified;
//  textContainer.paragraphSpacing = 6;
//  textContainer.linesSpacing = 5;
//  textContainer.lineIndent = 2;
  textContainer.paragraphSpacing = 10;
  textContainer.linesSpacing = 10;

  
  // 解析标题
  TYTextStorage *textStorage = [[TYTextStorage alloc] init];
  [mutiArr addObject:textStorage];
  TYTextStorage *titleStorage = [[TYTextStorage alloc]init];
  titleStorage.font = [UIFont systemFontOfSize:[TReaderManager fontSize] weight:UIFontWeightBold];
  titleStorage.range = NSMakeRange(0, self.title.length+1);
  titleStorage.textColor = [UIColor RGB:61 g:61 b:61];
  [textContainer addTextStorage:titleStorage];


  // 解析内容添加到container
  [textContainer addTextStorageArray:mutiArr];
  _attString = [textContainer createAttributedString];
  CGRect rect = CGRectMake(0, 0, _renderSize.width, _renderSize.height);
  _pageRanges = [MarkupParser buildAttrString:_attString
                                       inRect:rect];
  
  NSLog(@"_pageRanges ==== %lu, %@", (unsigned long)_pageRanges.count, _pageRanges);
}

- (ReaderPage *)pageWithIndex:(NSUInteger)index
{
  NSInteger idx = index;
  if (![self.class canFreeRead]) {
    idx = 0;
  }
  NSRange range = [self pageRangeWithIndex:idx];
  if (range.location != NSNotFound) {
    ReaderPage *page = [[ReaderPage alloc]init];
    page.attString = [_attString attributedSubstringFromRange:range];
    page.range = range;
    page.index = idx;
    page.chapterTitle = _title;
    page.totalPage = self.totalPage;
//    _currentPage = page;
    
    return page;
  }
  return nil;
}

- (NSRange)pageRangeWithIndex:(NSUInteger)index
{
  if (index >= 0 && index < _pageRanges.count) {
    NSRange range = [_pageRanges[index] rangeValue];
    if (![self.class canFreeRead]) {
      NSRange r = NSMakeRange(range.location, range.length / 2);
      return r;
    }
    return range;
  }
  return NSMakeRange(NSNotFound, 0);
}

- (NSUInteger)totalPage
{
  if ([self.class canFreeRead]) {
    return _pageRanges.count;
  }
  return 1;
}

- (NSInteger)pageIndexWithChapterOffset:(NSInteger)offset
{
  NSInteger pageIndex = 0;
  for (NSValue *rangeValue in _pageRanges) {
    NSRange range = [rangeValue rangeValue];
    
    if (NSLocationInRange(offset, range)) {
      return pageIndex;
    }
    ++ pageIndex;
  }
  return NSNotFound;
}


+ (BOOL)canFreeRead {
  if ([UserUtil isVip]) {
    return YES;
  }
  BOOL isFree = [UserDefaults boolForKey:IS_FREE_CHAPTER];
  if (isFree) {
    return YES;
  }
  
  BOOL isReview = [UserDefaults boolForKey:IS_REVIEW_VERSION];
  if (isReview) {
    return YES;
  }
  // TODO: 判断本书是否是vip
  if (!chapterIsVip) {
    return YES;
  }
  
  return NO;
}



@end
