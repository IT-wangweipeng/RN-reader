//
//  MusicModel+ModelTransform.m
//  reader
//
//  Created by Droi on 2019/9/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MusicModel+ModelTransform.h"

@implementation MusicModel (ModelTransform)


+ (NSArray<MusicModel *> *)modesWithData:(NSArray *)musicData {
  NSMutableArray *modes = [NSMutableArray array];
  NSError *error = nil;
  for (NSDictionary *dict in musicData) {
    MusicModel *mode = [[MusicModel alloc] initWithDictionary:dict error:&error];
    if (error) {
      NSLog(@"to model failed = %@", error);
      return nil;
    }
    [modes addObject:mode];
  }
  return [modes copy];
}


@end
