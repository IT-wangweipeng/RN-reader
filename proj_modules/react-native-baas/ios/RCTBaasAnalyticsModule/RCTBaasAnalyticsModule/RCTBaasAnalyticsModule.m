//
//  RCTBaasAnalyticsModule.m
//  RCTBaasAnalyticsModule
//
//  Created by yu on 09/01/2018.
//  Copyright © 2018 yu. All rights reserved.
//

#import "RCTBaasAnalyticsModule.h"
#import "NSObject+JSONTool.h"
#import <objc/runtime.h>



@implementation RCTBaasAnalyticsModule
RCT_EXPORT_MODULE(BaasModule);

RCT_EXPORT_METHOD(cloudParam:(NSString *)param
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  [[DroiPreference instance] refreshInBackground:^(BOOL isReady, DroiError *error) {
    if (error.code != DROICODE_OK) {
      NSString *errorCode = [NSString stringWithFormat:@"%d", error.code];
      reject(errorCode, error.message, nil);
    } else {
      id cloudValue = [[DroiPreference instance] valueForKey:param];
      resolve(cloudValue);
    }
  }];
}

RCT_EXPORT_METHOD(cloudParamForward:(NSString *)param
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if([[DroiPreference instance] isReady]){
     id cloudValue = [[DroiPreference instance] valueForKey:param];
          resolve(cloudValue);
    }else{
     reject(@"10086", @"Preference is not isReady", nil);
    }

}

RCT_EXPORT_METHOD(searchClassName:(NSString *)className
                       Conditions:(NSArray *)conditions
                           Option:(NSDictionary *)option
//                         callBack:(RCTResponseSenderBlock)callBack
                  callBack:(RCTPromiseResolveBlock)callBack
                  rejecter:(RCTPromiseRejectBlock)reject
                         ) {
    // 创建一个查询对象
    DroiQuery* query = [[DroiQuery create] queryByName:className];// 由相应数据表格查询
    query = [query whereStatement:[self queryConditionWithConditions:conditions]];// 加入查询条件
    query = [self queryWithOptions:option query:query];


    [query runQueryInBackground:^(NSArray *result, DroiError *err) {
        if (err.code == 0) {
            // 成功!
            NSLog(@"成功,数据=%@", result);
            NSLog(@"转化后的数据:%@", [self jsonStrArrWithResult:result]);
            callBack([self jsonStrArrWithResult:result]);
        } else {
            NSString *errCode = [NSString stringWithFormat:@"%d", err.code];
            NSError *error;
            reject(errCode, err.message, error);
        }
    }];



}

- (NSString *)jsonStrArrWithResult:(NSArray *)result
{
    NSString *jsonResultStr;
    for (NSInteger i = 0; i < result.count; i++) {
        NSDictionary *dic = [NSDictionary getObjectData:result[i]];
        if ([NSJSONSerialization isValidJSONObject:dic]) {
            NSError *error;
            ///将JSON数据写为NSData数据
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:&error];
            NSString *json =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            NSLog(@"json data:%@",json);
            if (i == 0) {
                jsonResultStr = [json stringByAppendingString:@","];
            } else if (i == result.count - 1) {
                jsonResultStr = [NSString stringWithFormat:@"[%@]", [jsonResultStr stringByAppendingString:json]];
            } else {
                jsonResultStr = [[jsonResultStr stringByAppendingString:json] stringByAppendingString:@","];
            }
        }
    }
    return jsonResultStr;
}


- (DroiCondition *)queryConditionWithConditions:(NSArray *)conditions
{
    // 创建一个查询条件(price = 70)
    DroiCondition *cond;
    for (NSInteger i = 0; i < conditions.count; i++) {
        NSArray *conditionArrI = conditions[i];
        DroiCondition *condI;
        for (NSInteger j = 0; j < conditionArrI.count; j++) {
            NSDictionary *conditionDic = conditionArrI[j];
            NSString *conditionLink = conditionDic[@"conditionLink"]; // 传递条件符号&&与  ||或
            NSString *key = conditionDic[@"key"]; // 选择条件price
            NSString *value = conditionDic[@"value"]; // 选择条件对应的值 70
            NSString *type = conditionDic[@"type"]; // 选择天剑对应的条件 EQ NEQ
            if (j == 0) {
                condI = [DroiCondition cond:key andType:type andArg2:conditionDic[@"value"]];
            } else {
                if ([conditionLink isEqualToString:@"&&"]) {
                    condI = [[DroiCondition cond:key andType:type andArg2:conditionDic[@"value"]] and:condI];
                } else {
                    condI = [[DroiCondition cond:key andType:type andArg2:conditionDic[@"value"]] or:condI];
                }
            }
        }

        if (i == 0) {
            cond = condI;
        } else {
            NSArray *conditionArrI = conditions[i];
            NSDictionary *conditionDic = conditionArrI.firstObject;
            NSString *conditionLink = conditionDic[@"conditionLink"];
            if ([conditionLink isEqualToString:@"&&"]) {
                cond = [cond and:condI];
            } else {
                cond = [cond or:condI];
            }
        }
    }
    return cond;
}

- (DroiQuery *)queryWithOptions:(NSDictionary *)options
                          query:(DroiQuery *)query
{
    NSDictionary *optionDic = options;
    if (options) {
        NSString *offset = optionDic[@"offset"] ? optionDic[@"offset"] : 0;
        NSString *limit = optionDic[@"limit"] ? optionDic[@"limit"] : 0;
        NSString *orderBy = optionDic[@"orderBy"] ? optionDic[@"orderBy"] : 0;
        query = [query offset:(int)offset.integerValue]; // 跳过指定数量的结果，可搭配limit使用，分次完成大量查询
        query = [query limit:(int)limit.integerValue]; // 限定回传结果数量，DroiBaaS 单次查询最多返回 1000 条数据，默认是200
        NSArray *orders = [orderBy componentsSeparatedByString:@","];
        for (NSInteger i = 0; i < orders.count; i++) {
            NSString *by = [orders[i] substringToIndex:1];
            if ([by isEqualToString:@"+"]) {
                NSString *order = [orders[i] substringFromIndex:1];
                query = [query orderBy:order ascending:YES]; // 加入排序結果. 按照price排序
            } else {
                NSString *order = [orders[i] substringFromIndex:1];
                query = [query orderBy:order ascending:NO]; // 加入排序結果. 按照price排序
            }
        }
    }
    return query;
}

RCT_REMAP_METHOD(getDroiApiID, resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *droiAppID = nil;
    droiAppID = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"DROI_APP_ID"];

    if (droiAppID) {
      resolve(droiAppID);
    } else {
      NSError *err = [NSError errorWithDomain:@"react-native-application"
                                         code:1
                                     userInfo:@{
                                                NSLocalizedDescriptionKey:@"droi app id not found"
                                                }];
      reject(@"react-native-application", @"droi app id not found", err);
    }
}


RCT_EXPORT_METHOD(getMetaData:(NSString *)key
   resolver: (RCTPromiseResolveBlock)resolve
   rejecter: (RCTPromiseRejectBlock) reject) {
    NSString* value = nil;
    value = [[NSBundle mainBundle] objectForInfoDictionaryKey: key];
    if (value) {
        resolve(value);
    } else {
        NSError *err = [NSError errorWithDomain:@"RNAppMetadata"
                                           code:1
                                       userInfo:@{
                      NSLocalizedDescriptionKey:@"There is no such key"
                                       }];
        reject(@"key_not_found", @"There is no such key", err);
    }
}

@end
