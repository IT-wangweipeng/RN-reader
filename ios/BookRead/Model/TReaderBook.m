//
//  TReaderBook.m
//  TBookReader
//
//  Created by tanyang on 16/1/21.
//  Copyright © 2016年 Tany. All rights reserved.
//

#import "TReaderBook.h"


@interface TReaderBook ()

@end

@implementation TReaderBook

- (BOOL)haveNextChapter {
    return _totalChapter > _curChpaterIndex;
}

- (BOOL)havePreChapter {
    return _curChpaterIndex > 1;
}

- (void)resetChapter:(TReaderChapter *)chapter {
    _curChpaterIndex = chapter.chapterIndex;
}

//- (TReaderChapter *)openBookWithChapter:(NSInteger)chapter
- (TReaderChapter *)openBookWithChapter:(NSInteger)chapter model:(BookChapterContentModel *)model {
    TReaderChapter *readerChapter = [[TReaderChapter alloc]init];
    readerChapter.chapterIndex = chapter;
    _curChpaterIndex = chapter;
//  readerChapter.chapterContent = model.content;
  readerChapter.chaptertMode = model;
//  readerChapter.chapterTitle = model.title;

  
//    NSError *error = nil;
//    NSString *chapter_num = [NSString stringWithFormat:@"Chapter%d",(int)chapter];
//    NSString *path1 = [[NSBundle mainBundle] pathForResource:chapter_num ofType:@"txt"];
//    readerChapter.chapterContent = [NSString stringWithContentsOfFile:path1 encoding:NSUTF8StringEncoding error:&error];
  
  
//    if (error) {
//        NSLog(@"open book chapter error:%@",error);
//        return nil;
//    }
    return readerChapter;
}

//- (TReaderChapter *)openBookNextChapter {
//    return [self openBookWithChapter:_curChpaterIndex+1];
//}

- (TReaderChapter *)openBookNextChapterWithModel:(BookChapterContentModel *)model {
  return [self openBookWithChapter:_curChpaterIndex+1 model:model];
}

//- (TReaderChapter *)openBookPreChapter {
//  return [self openBookWithChapter:_curChpaterIndex-1];
//}

- (TReaderChapter *)openBookPreChapterWithModel:(BookChapterContentModel *)model {
  return [self openBookWithChapter:_curChpaterIndex-1 model:model];
}


@end
