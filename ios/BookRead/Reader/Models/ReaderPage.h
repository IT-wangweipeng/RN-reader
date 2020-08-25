//
//  ReaderPage.h
//  reader
//
//  Created by Droi on 2019/10/30.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ReaderPage : NSObject

// 本页文本
@property (nonatomic, strong) NSAttributedString *attString;
// 本页范围
@property (nonatomic, assign) NSRange range;
// 本页下标
@property (nonatomic, assign) NSUInteger index;
// 总页数
@property (nonatomic, assign) NSUInteger totalPage;
// 本页的标题
@property (nonatomic, strong) NSString *chapterTitle;

@end

NS_ASSUME_NONNULL_END
