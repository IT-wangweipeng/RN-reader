//
//  MusicModel+ModelTransform.h
//  reader
//
//  Created by Droi on 2019/9/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MusicModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface MusicModel (ModelTransform)

+ (NSArray<MusicModel *> *)modesWithData:(NSArray *)musicData;

@end

NS_ASSUME_NONNULL_END
