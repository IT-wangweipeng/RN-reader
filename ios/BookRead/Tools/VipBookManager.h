//
//  VipBookManager.h
//  reader
//
//  Created by Droi on 2019/9/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@class BookContentModel;

NS_ASSUME_NONNULL_BEGIN

@interface VipBookManager : NSObject

+ (BOOL)isFreeChapter:(BookContentModel *)model;

@end

NS_ASSUME_NONNULL_END
