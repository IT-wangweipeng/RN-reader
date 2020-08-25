//
//  BookReadManager.m
//  reader
//
//  Created by yu on 2019/3/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BookReadManager.h"
#import "AppDelegate.h"
#import "NetworkManager.h"
#import "BookChapterModel.h"
#import "MBProgressHUD+Message.h"
#import "BookContentFetcher.h"
#import "BookContentModel.h"
#import "FileManagerUtil+Book.h"
#import "DBManager.h"
#import <BUAdSDK/BURewardedVideoAd.h>
#import <BUAdSDK/BURewardedVideoModel.h>
#import "BUDAdManager.h"
#import "ADAnalysis.h"
#import "BrightnessManager.h"
#import "TReaderManager.h"
#import "UserDefaults.h"
#import "RootViewController.h"
#import "UIColor+TReaderTheme.h"
#import "MaskView.h"
#import "GDTRewardVideoAd.h"
#import "TXAdsManager.h"
#import "RandomAdsGenerate.h"
#import "RewardVideoManager.h"



typedef void(^PlayRewardeVideoSuccess)(void);
typedef void(^PlayRewardeVideoFailed)(void);

@interface BookReadManager()
<
RewardVideoManagerDelegate
>

@property (nonatomic, assign) BOOL isCollected;
@property (nonatomic, assign) int transitionType;
@property (nonatomic, strong) NSString *chapterContent;
@property (nonatomic, assign) NSInteger bookId;
@property (nonatomic, assign) NSInteger chapterId;
@property (nonatomic, assign) NSInteger chapterIndex;
@property (nonatomic, strong) NSDictionary *bookInfo;
@property (nonatomic, strong) MaskView *maskView;
@property (nonatomic, strong) RewardVideoManager *manager;

@property (nonatomic, copy) RCTPromiseResolveBlock rewardedVideoAdResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock rewardedVideoAdReject;

@end


@implementation BookReadManager

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

// 注意：chapterIndex 是从 0 开始
RCT_EXPORT_METHOD(openBookWithInfo:(NSDictionary *)info
                  user:(NSDictionary *)user
                  transitionType:(int)type
                  isCollected:(BOOL)collected
                  chapter:(NSInteger)chapterIndex
                  isReviewVersion:(BOOL)isReview) {
  [self showHUD];
  _isCollected = collected;
  _transitionType = type;
  _chapterIndex = chapterIndex;
  [UserDefaults setObject:user forKey:USER_INFO];
  [UserDefaults setBool:isReview forKey:IS_REVIEW_VERSION];
  [[DBManager shareInstance] createDatabase:[DBManager dbPath]];
  
  NSString *bookId = [info objectForKey:@"id"];
  NSString *url = [NSString stringWithFormat:@"/book/chapter/list/%@/1", bookId];
  // 获取书籍章节
  [[NetworkManager shareInstance] request:RequestTypeGet
                                urlString:url
                                parameter:nil
                              resultBlock:^(id res, NSError *error) {
                                
                                [self hiddenHUD];
                                if (error) {
                                  [MBProgressHUD showMessage:@"获取章节失败"];
                                  return;
                                }
                                
                                NSInteger status = [[res objectForKey:@"status"] integerValue];
                                NSString *msg = [res objectForKey:@"message"];
                                NSArray *data = [res objectForKey:@"data"];
                                if (200 == status) {
                                  NSMutableDictionary *mutiDict = [info mutableCopy];
                                  [mutiDict setObject:data forKey:@"chapters"];
                                  self.bookInfo = [mutiDict copy];
                                  [self showReaderPageViewController];
                                } else {
                                  [MBProgressHUD showMessage:msg];
                                }
                              }];
}

- (void)showReaderPageViewController {
  NSError *error = nil;
  BookContentModel *bookModel = [[BookContentModel alloc]
                                 initWithDictionary:self.bookInfo
                                 error:&error];
  if (error) {
    NSString *msg = [NSString stringWithFormat:@"ERROR: %ld", (long)error.code];
    [MBProgressHUD showMessage:msg];
    return;
  }

  if (0 == bookModel.chapters.count) {
    [MBProgressHUD showMessage:@"无章节"];
  } else {
    [[DBManager shareInstance] addBook:bookModel];
    dispatch_async(dispatch_get_main_queue(), ^{
      if ([BrightnessManager isNightMode]) {
        AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
        [app removeMaskView];
      }

      RootViewController *rootVC = [[RootViewController alloc] init];
      rootVC.chapterIndex = self.chapterIndex;
      rootVC.isCollected = self.isCollected;
      rootVC.bookModel = bookModel;
      [(UINavigationController *)AppDelegate.rootViewController pushViewController:rootVC animated:YES];
    });
  }
}


// MARK: - clean db
RCT_EXPORT_METHOD(cleanCache:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  NSString *dbPath = [DBManager dbPath];
  if ([[NSFileManager defaultManager] fileExistsAtPath:dbPath]) {
    BOOL ret = [FileManagerUtil removeFile:dbPath];
    if (ret) {
      resolve(@{@"result" : @(ret)});
    } else {
      reject(@"-1", @"remove db failed", nil);
    }
  } else {
    resolve(@{@"result" : @(YES)});
  }
}

RCT_EXPORT_METHOD(dbSize:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  NSString *dbPath = [DBManager dbPath];
  NSDictionary *info = [FileManagerUtil getFileInfo:dbPath];
  NSNumber *size = [info objectForKey:@"NSFileSize"];
  resolve(@{@"result" : size ?: @(0)});
}

RCT_EXPORT_METHOD(showHUD) {
  [MBProgressHUD showHudToView:nil];
}

RCT_EXPORT_METHOD(hiddenHUD) {
  [MBProgressHUD hidenHudToView:nil];
}


RCT_EXPORT_METHOD(musicButtonEnable:(BOOL)enable) {
  [UserDefaults setBool:enable forKey:MUSIC_PLAY_BUTTON_ENABLE];
}

RCT_EXPORT_METHOD(musicButtonStatus:(RCTResponseSenderBlock)callback) {
  BOOL ret = [UserDefaults boolForKey:MUSIC_PLAY_BUTTON_ENABLE];
  callback(@[@(ret)]);
}

// 设置页面模式
RCT_EXPORT_METHOD(nightModeEnable:(BOOL)enable) {
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [BrightnessManager saveNightModeEnable:enable];
  if ([BrightnessManager isNightMode]) {
    [TReaderManager saveReaderTheme:TReaderThemeNight];
    [app maskView];
  } else {
    [TReaderManager saveReaderTheme:TReaderThemeNormal];
    [app removeMaskView];
  }
}

RCT_EXPORT_METHOD(nightMode:(RCTResponseSenderBlock)callback) {
  BOOL nightMode = [BrightnessManager isNightMode];
  callback(@[@(nightMode)]);
}

RCT_EXPORT_METHOD(saveApi:(NSString *)api) {
  [UserDefaults setObject:api forKey:@"HOST_ADDRESS"];
}

RCT_EXPORT_METHOD(saveApiPrefix:(NSString *)apiPrefix) {
  [UserDefaults setObject:apiPrefix forKey:@"HOST_PREFIX"];
}

RCT_EXPORT_METHOD(saveAdsSource:(NSArray *)ads) {
  [UserDefaults setObject:ads forKey:AD_TYPE];
//  [UserDefaults setObject:@[] forKey:AD_TYPE];
}

RCT_EXPORT_METHOD(getAdsType:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  id ad = [UserDefaults objectForKey:AD_TYPE];
  resolve(@{@"adType" : ad ?: [NSNull class]});
}


// MARK: - 激励视频
RCT_EXPORT_METHOD(loadAndPlayRewardeVideo:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  self.rewardedVideoAdResolve = resolve;
  self.rewardedVideoAdReject = reject;
  
  if ([RandomAdsGenerate canShowAds]) {
    if ([RandomAdsGenerate isGDTAds]) {
      [self.manager loadRewardVideo:RewardVideoGDT];
    } else {
      [self.manager loadRewardVideo:RewardVideoBUD];
    }
  } else {
    [MBProgressHUD showMessage:@"暂时无广告"];
  }
}

// MARK: - RewardVideoManagerDelegate
// 广告加载成功
- (void)rewardVideoAdDidLoadFinish:(id _Nonnull )ad
                              type:(RewardVideoType)adType
{
  if (adType == RewardVideoBUD) {
    BURewardedVideoAd *adData = (BURewardedVideoAd *)ad;
    [adData showAdFromRootViewController:[AppDelegate rootViewController]];
  } else {
    GDTRewardVideoAd *adData = (GDTRewardVideoAd *)ad;
    [adData showAdFromRootViewController:[AppDelegate rootViewController]];
  }
}

// 广告加载失败
- (void)rewardVideoAdDidLoadFailed:(NSError *_Nullable)error
                              type:(RewardVideoType)adType
{
  [MBProgressHUD showMessage:error.localizedDescription];
  if (self.rewardedVideoAdReject) {
    NSString *code = [NSString stringWithFormat:@"%ld", (long)error.code];
    self.rewardedVideoAdReject(code, error.localizedDescription, error);
  }
}

// 广告关闭
- (void)rewardVideoAdDidClose:(RewardVideoType)adType
{

}

// 激励视频播放完成
- (void)rewardVideoAdDidPlayFinish:(RewardVideoType)adType
{
  if (self.rewardedVideoAdResolve) {
    self.rewardedVideoAdResolve(@{@"result" : @(YES)});
  }
}

// MARK: -
- (RewardVideoManager *)manager
{
  if (!_manager) {
    _manager = [RewardVideoManager manager];
    _manager.delegate = self;
  }
  return _manager;
}

@end
