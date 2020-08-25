//
//  BookContentFetcher.h
//  reader
//
//  Created by JY on 2019/4/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>


@class BookChapter;
typedef void(^CompletedBlock)(NSDictionary *info);
@interface BookContentFetcher : NSObject

+ (void)fetchBookContentWithBookID:(NSInteger)bookId
                           chapter:(NSInteger)chapterId
                         completed:(CompletedBlock)completed;

@end
