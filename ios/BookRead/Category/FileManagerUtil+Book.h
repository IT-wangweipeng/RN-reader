//
//  FileManagerUtil+Book.h
//  reader
//
//  Created by JY on 2019/4/15.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "FileManagerUtil.h"

@class BookContent;
@interface FileManagerUtil (Book)
// 创建book隐藏目录
+ (NSString *)bookCacheDirectory;
// 每本书的Book id对应一个单独的目录
+ (NSString *)bookDirectory:(NSInteger)bookID;
// 返回chapter id路径
+ (NSString *)bookChapterDirectoryWithBookId:(NSInteger)bookId chapter:(NSInteger)chapterId;

+ (BOOL)isBookChapterExistWithBookId:(NSInteger)bookId chapter:(NSInteger)chapterId;
@end
