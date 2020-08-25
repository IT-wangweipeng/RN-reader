//
//  BookChapterModel.m
//  reader
//
//  Created by JY on 2019/4/13.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BookChapterModel.h"

@implementation BookChapterModel
+ (JSONKeyMapper *)keyMapper {
  return [[JSONKeyMapper alloc] initWithModelToJSONDictionary:@{
                                                                @"chapter_id": @"id",
                                                                }];
}


@end


@implementation BookChapterContentModel

@end
