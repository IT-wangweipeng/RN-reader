//
//  DBManager.m
//  reader
//
//  Created by yu on 2019/4/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "DBManager.h"
#import "FMDB.h"
#import "BookContentModel.h"
#import "BookChapterModel.h"
#import "NSString+Rex.h"


@interface DBManager ()
@property (nonatomic, strong) FMDatabase *db;
@end


@implementation DBManager
+ (DBManager *)shareInstance {
  static dispatch_once_t onceToken;
  static DBManager *manager = nil;
  dispatch_once(&onceToken, ^{
    manager = [[DBManager alloc] init];
  });
  return manager;
}

+ (NSString *)dbPath {
  NSString *documentPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
  NSString *path = [documentPath stringByAppendingPathComponent:@"book.db"];
  NSLog(@"sqlpath ==== %@", path);
  return path;
}

- (void)createDatabase:(NSString *)dbPath {
  FMDatabase *db = [FMDatabase databaseWithPath:dbPath];
  if (![db open]) {
    NSLog(@"db open  failed");
    db = nil;
    return;
  }
  
  self.db = db;
  NSString *sql =
  @"CREATE TABLE IF NOT EXISTS t_book (id integer PRIMARY KEY AUTOINCREMENT, author text, cover text, book_id integer UNIQUE, name text, create_time text, chapter integer, chapter_id integer, chapter_sort integer, brief text, page integer);"
  "CREATE TABLE IF NOT EXISTS t_chapter (book_id integer NOT NULL, chapter_id integer PRIMARY KEY  UNIQUE, content text, create_time text, isvip bool, title text, word_count integer);";
//  "CREATE TABLE IF NOT EXISTS t_chapter (id integer PRIMARY KEY AUTOINCREMENT, book_id integer NOT NULL, chapter_id integer UNIQUE, content text, create_time text, isvip bool, title text, word_count integer);";
  BOOL result = [db executeStatements:sql];
  if (result) {
    NSLog(@"创建表成功");
  } else {
    NSLog(@"创建表失败");
  }
  [db close];
}

- (void)deleteDatabase:(NSString *)dbPath {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *error = nil;
  [fileManager removeItemAtPath:dbPath error:&error];
  if (error) {
    NSLog(@"Remove db failed: %@", dbPath);
  }
}



// Book
- (void)addBook:(BookContentModel *)aBook {
  [_db open];
  BOOL result = [_db executeUpdate:@"INSERT OR IGNORE INTO t_book (author, brief, chapter_id, chapter_sort, create_time, cover, book_id, name) VALUES (?,?,?,?,?,?,?,?)", aBook.author, aBook.brief, aBook.chapter_id, aBook.chapter_sort, aBook.create_time, aBook.cover, @(aBook.book_id), aBook.name];
  if (!result) {
    NSLog(@"add book error: %@", [_db lastErrorMessage]);
  }
  [_db close];
}

- (void)removeBook:(BookContentModel *)aBook {
//  [_db executeUpdate:@"DELETE FROM person WHERE person_id = ?",person.ID];
  [_db open];
  BOOL result = [_db executeUpdate:@"DELETE FROM t_book WHERE book_id = ?", @(aBook.book_id)];
  if (!result) {
    NSLog(@"remove book error: %@", [_db lastErrorMessage]);
  }
  [_db close];
}

- (void)updateBook:(BookContentModel *)aBook {
  [_db open];
  [_db executeUpdate:@"UPDATE t_book SET chapter_id = ? WHERE book_id = ?", aBook.chapter_id, @(aBook.book_id)];
  [_db close];
}

- (void)updateBook:(BookChapterModel *)aBook readPage:(NSInteger)page {
  NSLog(@"chapter_id ==== %ld %ld %ld", aBook.chapter_id, aBook.chapter_id, aBook.book_id);
  [_db open];
  NSInteger chapterSort = aBook.sort - 1;
  if (chapterSort == -1) {
    chapterSort = 0;
  }
  
  
  [_db executeUpdate:@"UPDATE t_book SET page = ? WHERE book_id = ?", @(page), @(aBook.book_id)];
  [_db executeUpdate:@"UPDATE t_book SET chapter_id = ? WHERE book_id = ?", @(aBook.chapter_id), @(aBook.book_id)];
  [_db executeUpdate:@"UPDATE t_book SET chapter_sort = ? WHERE book_id = ?", @(chapterSort), @(aBook.book_id)];
  [_db close];
}

- (BookContentModel *)queryBook:(NSInteger)bookID {
  [_db open];
  FMResultSet *res = [_db executeQuery:@"SELECT * FROM t_book WHERE book_id = ?", @(bookID)];
  while ([res next]) {
    BookContentModel *model = [[BookContentModel alloc] init];
    model.book_id = [[res stringForColumn:@"book_id"] integerValue];
    model.author = [res stringForColumn:@"author"];
    model.cover = [res stringForColumn:@"cover"];
    model.book_id = [[res stringForColumn:@"book_id"] integerValue];
    model.name = [res stringForColumn:@"name"];
    model.create_time = [res stringForColumn:@"create_time"];
    model.chapter_sort = @([res intForColumn:@"chapter_sort"]);
    model.chapter_id = @([res intForColumn:@"chapter_id"]);
    model.brief = [res stringForColumn:@"brief"];
    model.page = @([res intForColumn:@"page"]);
    model.chapter_sort = @([res intForColumn:@"chapter_sort"]);
  
    return model;
  }
  
  [_db close];
  return nil;
}

// Chapter
- (void)addChapter:(BookChapterContentModel *)aChater toBook:(NSInteger)chapterId {
  [_db open];
  FMResultSet *res = [_db executeQuery:@"SELECT * FROM t_chapter WHERE chapter_id = ?", @(chapterId)];
  while ([res next]) {
    NSLog(@"already has chapter !");
    return;
  }
  
//  NSString *content = [aChater.content stringByReplacingOccurrencesOfRegex:@"\r\n" withString:@"\n"];
  BOOL ret = [_db executeUpdate:@"INSERT INTO t_chapter(book_id, chapter_id, create_time, title, isvip, content, word_count) VALUES(?,?,?,?,?,?,?)", @(aChater.book_id), @(aChater.chapter_id), aChater.create_time, aChater.title, @(aChater.isvip), aChater.content, @(aChater.word_count)];
  NSLog(@"insert ============ %d", ret);
  NSAssert(ret, @"failed to insert db");
  
  [_db close];
}

- (BookChapterContentModel *)queryChapterWithId:(NSInteger)chapterId {
  [_db open];
  FMResultSet *res = [_db executeQuery:@"SELECT * FROM t_chapter WHERE chapter_id = ?", @(chapterId)];
  while ([res next]) {
    BookChapterContentModel *model = [[BookChapterContentModel alloc] init];
    model.book_id = [[res stringForColumn:@"book_id"] integerValue];
    model.chapter_id = [[res stringForColumn:@"chapter_id"] integerValue];
    model.create_time = [res stringForColumn:@"create_time"];
    model.content = [res stringForColumn:@"content"];
    model.title = [res stringForColumn:@"title"];
    model.word_count = [[res stringForColumn:@"word_count"] integerValue];
    model.isvip = [[res stringForColumn:@"isvip"] boolValue];
    return model;
  }
  [_db close];
  return nil;
}


@end
