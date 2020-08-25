//
//  BookContentModel.h
//  reader
//
//  Created by JY on 2019/4/14.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <JSONModel/JSONModel.h>
#import "BookChapterModel.h"

@interface BookContentModel : JSONModel

@property (nonatomic, strong) NSString *author;
@property (nonatomic, strong) NSString *brief;
@property (nonatomic, strong) NSNumber<Optional>* chapter_id;
@property (nonatomic, strong) NSNumber<Optional>* chapter_sort;
@property (nonatomic, strong) NSNumber<Optional>* page;
@property (nonatomic, strong) NSString<Optional>* end_ad_ts;
@property (nonatomic, strong) NSString<Optional>* start_ad_ts;
@property (nonatomic, strong) NSString<Optional>* start_vip_ts;
@property (nonatomic, strong) NSString<Optional>* end_vip_ts;
@property (nonatomic, strong) NSString *create_time;
@property (nonatomic, strong) NSString *cover;
@property (nonatomic, assign) NSInteger book_id;
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSNumber<Optional> *complete_status;
@property (nonatomic, strong) NSArray<BookChapterModel *><BookChapterModel> *chapters;



/*
 
 
 
 {
 author = "\U5361\U5361";
 brief = "\U8fd9\U662f\U7231";
 chapters =     (
 {
 "book_id" = 10830;
 "create_time" = "2013-09-06 17:01:48";
 id = 175365;
 isvip = 0;
 sort = 1;
 title = "\U91cd\U9022 \U4e0d\U66fe\U4e86\U89e3\U7684\U91cd\U9022";
 "word_count" = 824;
 },

 cover = "http://i.mixs.cn/upload/cover/7/7846/7846l.jpg";
 "create_time" = "2018-11-17 15:30:13";
 id = 10830;
 name = "\U5018\U82e5\U8bb0\U5fc6\U4e0d\U662f\U7834\U788e\U7684";
 select = 0;
 }

 
 
 */

@end
