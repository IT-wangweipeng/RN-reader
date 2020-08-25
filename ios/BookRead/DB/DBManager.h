//
//  DBManager.h
//  reader
//
//  Created by yu on 2019/4/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>


@class BookContentModel;
@class BookChapterModel;
@class BookChapterContentModel;
@interface DBManager : NSObject

+ (DBManager *)shareInstance;


+ (NSString *)dbPath;
- (void)createDatabase:(NSString *)dbPath;
- (void)deleteDatabase:(NSString *)dbPath;



// Book
- (void)addBook:(BookContentModel *)aBook;
- (BookContentModel *)queryBook:(NSInteger)aBook;
- (void)removeBook:(BookContentModel *)aBook;
- (void)updateBook:(BookContentModel *)aBook;

- (void)updateBook:(BookChapterModel *)aBook readPage:(NSInteger)page;

// Chapter
- (void)addChapter:(BookChapterContentModel *)aChater toBook:(NSInteger)chapterId;
// 查询章节内容
- (BookChapterContentModel *)queryChapterWithId:(NSInteger)chapterId;
@end
