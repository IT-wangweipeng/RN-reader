//
//  FileManagerUtil+Book.m
//  reader
//
//  Created by JY on 2019/4/15.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "FileManagerUtil+Book.h"
#import "BookContentModel.h"

@implementation FileManagerUtil (Book)
+ (NSString *)bookDirectory:(NSInteger)bookID {
  return [NSString stringWithFormat:@"%@/%ld", [self bookCacheDirectory],(long)bookID];
}

+ (NSString *)bookCacheDirectory {
  NSString *path = [NSString stringWithFormat:@"%@/.book", [self cachePath]];
  return path;
}

+ (NSString *)bookChapterDirectoryWithBookId:(NSInteger)bookId chapter:(NSInteger)chapterId{
  return [NSString stringWithFormat:@"%@/%ld.txt", [self bookDirectory:bookId], (long)chapterId];
}

+ (BOOL)isBookChapterExistWithBookId:(NSInteger)bookId chapter:(NSInteger)chapterId {
  NSString *path = [self bookChapterDirectoryWithBookId:bookId chapter:chapterId];
  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL result = [fileManager fileExistsAtPath:path];
  return result;
}

@end
