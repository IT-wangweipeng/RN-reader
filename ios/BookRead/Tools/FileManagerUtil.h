//
//  FileManagerUtil.h
//  reader
//
//  Created by JY on 2019/4/14.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface FileManagerUtil : NSObject
+ (NSString *)cachePath;


// 创建文件夹
+ (BOOL)creatDirectory:(NSString *)path;
// 创建文件
+ (BOOL)creatFile:(NSString*)filePath;
// 写入数据
+ (BOOL)writeToFile:(NSString *)filePath contents:(NSData *)data;

+ (long long)getFileSize:(NSString *)path;
+ (BOOL)removeFile:(NSString *)filePath;
+ (NSDictionary*)getFileInfo:(NSString *)path;
@end
