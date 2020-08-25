//
//  NSObject+JSONTool.h
//  RCTBaasAnalyticsModule
//
//  Created by 赵鹤 on 2018/2/24.
//  Copyright © 2018年 yu. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSObject (JSONTool)
+ (NSDictionary*)getObjectData:(id)obj;

+ (id)getObjectInternal:(id)obj;



@end
