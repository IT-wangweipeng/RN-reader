//
//  MusicModel.h
//  reader
//
//  Created by Droi on 2019/8/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JSONModel/JSONModel.h>

NS_ASSUME_NONNULL_BEGIN

@interface MusicModel : JSONModel

@property (nonatomic, strong) NSString *url;
@property (nonatomic, strong) NSString *name;

@end

NS_ASSUME_NONNULL_END
