//
//  BookChapterModel.h
//  reader
//
//  Created by JY on 2019/4/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JSONModel/JSONModel.h>

@protocol BookChapterModel
@end

@interface BookChapterModel : JSONModel

@property (nonatomic, assign) NSInteger book_id;
@property (nonatomic, strong) NSString *create_time;
@property (nonatomic, assign) NSInteger chapter_id;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, assign) BOOL isvip;
@property (nonatomic, assign) NSInteger sort;
@property (nonatomic, assign) NSInteger word_count;


//"book_id" = 10644;
//"create_time" = "2017-01-21 00:56:29";
//id = 163712;
//isvip = 0;
//sort = 1;
//title = "\U7b2c001\U7ae0\Uff1a\U6768\U94c1";
//"word_count" = 2897;
@end



@interface BookChapterContentModel : JSONModel

@property (nonatomic, assign) NSInteger book_id;
@property (nonatomic, assign) NSInteger chapter_id;
@property (nonatomic, strong) NSString *create_time;
@property (nonatomic, strong) NSString *content;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, assign) BOOL isvip;
@property (nonatomic, assign) NSInteger word_count;

@end

