//
//  BookContentModel.m
//  reader
//
//  Created by JY on 2019/4/14.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BookContentModel.h"

@implementation BookContentModel
+ (JSONKeyMapper *)keyMapper {
  return [[JSONKeyMapper alloc] initWithModelToJSONDictionary:@{
                                                                @"book_id": @"id",
                                                                }];
}

@end
