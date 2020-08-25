/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <CodePush/CodePush.h>
#import <BUAdSDK/BUAdSDKManager.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <UMAnalytics/MobClick.h>
#import <UMCommon/UMCommon.h>
#import <UMCommonLog/UMCommonLogHeaders.h>
#import "DBManager.h"
#import "BUDAdManager.h"
#import "BUAdSDK/BUSplashAdView.h"
#import "RNSplashScreen.h"
#import "NetworkManager.h"
#import "ADAnalysis.h"
#import <AFNetworking/AFNetworking.h>
#import "ReactRootViewManager.h"
#import "BrightnessManager.h"
#import "CheckUpdateManager.h"
#import <objc/runtime.h>
#import <AVFoundation/AVFoundation.h>
#import "UIColor+TReaderTheme.h"
#import "MaskView.h"
#import "UserDefaults.h"
#import "PrivacyController.h"
#import "BookEventEmitter.h"
#import "GDTSDKConfig.h"
#import "TXAdsManager.h"
#import "GDTSplashAd.h"
#import "RandomAdsGenerate.h"


@interface AppDelegate ()
<
BUSplashAdDelegate,
UNUserNotificationCenterDelegate,
JPUSHRegisterDelegate,
GDTSplashAdDelegate
>

@property (nonatomic, assign) CFTimeInterval startTime;
@property (strong, nonatomic) GDTSplashAd *splash;
@end


@implementation AppDelegate
{
  BOOL GDT_SPLASH_FAILED;
  BOOL BUD_SPLASH_FAILED;
}

NSString *swizzled_preferredContentSizeCategory(id self, SEL _cmd) {
  return UIContentSizeCategoryLarge;
}

- (void)loadJavaScriptWithOptions:(NSDictionary *)launchOptions rootView:(UIView *)rootView
{
  UIViewController *rootVC = [UIViewController new];
  UINavigationController *navi = [[UINavigationController alloc] init];
  navi.navigationBar.hidden = YES;
  [navi addChildViewController:rootVC];
  rootVC.view = rootView;
  self.window.rootViewController = navi;
  [self.window makeKeyAndVisible];
}
 
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  NSURL *jsCodeLocation;
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"reader"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor whiteColor];
  [ReactRootViewManager manager].bridge = rootView.bridge;
 
//  BOOL result = [UserDefaults boolForKey:PRIVACY_GUIDELINES];
//  if (!result) {
//    PrivacyController *vc = [[PrivacyController alloc] init];
//    WS(weakSelf)
//    vc.agreePrivacy = ^{
//      [weakSelf loadJavaScriptWithOptions:launchOptions rootView:rootView];
//      [UserDefaults setBool:YES forKey:PRIVACY_GUIDELINES];
//    };
//    self.window.rootViewController = vc;
//    [self.window makeKeyAndVisible];
//  } else {
//    [self loadJavaScriptWithOptions:launchOptions rootView:rootView];
//  }
  
  [self loadJavaScriptWithOptions:launchOptions rootView:rootView];
  
  // 极光推送
  BOOL isProduction = YES;
#ifdef DEBUG
  isProduction = NO;
#endif
  [JPUSHService setupWithOption:launchOptions appKey:@"f9d389672f50237b4bfde0b4"
                        channel:nil apsForProduction:isProduction];
  
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    
#endif
  } else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                      UIUserNotificationTypeSound |
                                                      UIUserNotificationTypeAlert)
                                          categories:nil];
  } else {
    [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                      UIRemoteNotificationTypeSound |
                                                      UIRemoteNotificationTypeAlert)
                                          categories:nil];
  }
  
  
  // 友盟统计
  BOOL isLogEnabled = NO;
#ifdef DEBUG
  isLogEnabled = YES;
#endif
  [UMCommonLogManager setUpUMCommonLogManager];
  [UMConfigure setLogEnabled:isLogEnabled];//设置打开日志
  [MobClick setScenarioType:E_UM_NORMAL];
  [UMConfigure initWithAppkey:@"5cdcbdb4570df300ec000725" channel:@"App Store"];

  [[DBManager shareInstance] createDatabase:[DBManager dbPath]];
  
  [self registerAds];
  [self showSplashAds];
  [RNSplashScreen show];

  [self checkNotificationAuthor];
  [[CheckUpdateManager new] checkUpdate];
  
  Method method = class_getInstanceMethod([UIApplication class], @selector(preferredContentSizeCategory));
  method_setImplementation(method, (IMP)swizzled_preferredContentSizeCategory);
  if ([BrightnessManager isNightMode]) {
    [[UIScreen mainScreen] setBrightness:0.2];
  }
  
  return YES;
}

- (void)registerAds
{
  // 注册穿山甲广告
  [BUAdSDKManager setAppID:[BUDAdManager appKey]];
  [BUAdSDKManager setIsPaidApp:NO];
#if DEBUG
  [BUAdSDKManager setLoglevel:BUAdSDKLogLevelDebug];
#endif
  // 注册腾讯广告
  BOOL result = [GDTSDKConfig registerAppId:[TXAdsManager appKey]];
  [GDTSDKConfig enableGPS:YES];
  [GDTSDKConfig setChannel:14];
  if (result) {
    NSLog(@"腾讯广告注册成功");
  } else {
    NSLog(@"腾讯广告注册失败");
  }
}

- (void)showSplashAds
{
  if ([RandomAdsGenerate canShowAds]) {
    if ([RandomAdsGenerate isGDTAds]) {
      [self loadGDTplash];
    } else {
      [self loadBUSplash];
    }
  }
}

- (void)loadGDTplash
{
  // 展示腾讯广告
   GDTSplashAd *splash = [[GDTSplashAd alloc] initWithPlacementId:[TXAdsManager splashKey]];
   self.splash = splash;
   splash.delegate = self;
   //根据iPhone设备不同设置不同背景图
   if ([[UIScreen mainScreen] bounds].size.height >= 568.0f) {
    splash.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"LaunchImage-568h"]];
   } else {
    splash.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"LaunchImage"]];
   }
  splash.fetchDelay = 5.0;
   [splash loadAd];
}

- (void)loadBUSplash
{
  // 开屏广告
  CGRect frame = [UIScreen mainScreen].bounds;
  BUSplashAdView *splashView = [[BUSplashAdView alloc]
                                initWithSlotID:[BUDAdManager splashSlotID]
                                frame:frame];
  splashView.tolerateTimeout = 5;
  splashView.delegate = self;
  UIWindow *keyWindow = self.window;
  self.startTime = CACurrentMediaTime();
  [splashView loadAdData];
  [keyWindow.rootViewController.view addSubview:splashView];
  splashView.rootViewController = keyWindow.rootViewController;
}

- (void)checkNotificationAuthor {
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
    UNUserNotificationCenter *nc = [UNUserNotificationCenter currentNotificationCenter];
    nc.delegate = self;
    [nc getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
      UNAuthorizationStatus status = settings.authorizationStatus;
      NSLog(@"通知授权状态 ============= %ld", status);
      if (status == UNAuthorizationStatusNotDetermined) {
        // 未作出选择
        [nc requestAuthorizationWithOptions:UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAlertStyleAlert completionHandler:^(BOOL granted, NSError * _Nullable error) {
          if (granted) {
            NSLog(@"已授权");
          } else {
            NSLog(@"未授权");
          }
        }];
      } else if (status == UNAuthorizationStatusDenied) {
        //用户不同意授权时，弹出提示（最好只弹一次),注意此 block 在iOS 13是async执行，在操作UI的时候要注意
        dispatch_async(dispatch_get_main_queue(), ^{
          NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
          BOOL ret = [ud boolForKey:@"KEY_NOTIFICATION"];
          if (!ret) {
            UIAlertController *ac = [UIAlertController alertControllerWithTitle:@"通知已关闭" message:@"打开通知，精彩内容我们第一时间告诉你~" preferredStyle:UIAlertControllerStyleAlert];
            [ac addAction:[UIAlertAction actionWithTitle:@"忽略" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
              
            }]];
            [ac addAction:[UIAlertAction actionWithTitle:@"去开启" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
              NSURL *appSettingsUrl = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
              if ([[UIApplication sharedApplication] canOpenURL:appSettingsUrl]) {
                [[UIApplication sharedApplication] openURL:appSettingsUrl options:@{} completionHandler:nil];
              }
            }]];
            [self.window.rootViewController presentViewController:ac animated:YES completion:nil];
            [ud setBool:YES forKey:@"KEY_NOTIFICATION"];
            [ud synchronize];
          }
        });
      } else {
        NSLog(@"已授权通知");
      }
    }];
#endif
  }
}


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [JPUSHService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  
}


- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object: notification.userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler
{
  NSDictionary * userInfo = notification.request.content.userInfo;
  if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  }
  
  completionHandler(UNNotificationPresentationOptionAlert);
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if ([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }
  
  completionHandler();
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RCTLinkingManager application:app openURL:url options:options];
}



// MARK: - Helper
- (MaskView *)maskView {
  if (!_maskView) {
    _maskView = [[MaskView alloc] initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    _maskView.backgroundColor = [UIColor RGB_R:0 g:0 b:0 alp:0.4];
    [[UIApplication sharedApplication].keyWindow addSubview:_maskView];
  }
  return _maskView;
}

- (void)removeMaskView {
  [self.maskView removeFromSuperview];
  _maskView = nil;
}

+ (UIViewController *)rootViewController {
  return [UIApplication sharedApplication].keyWindow.rootViewController;
}

- (void)applicationWillTerminate:(UIApplication *)application {
  [[NSNotificationCenter defaultCenter] postNotificationName:UIApplicationWillTerminateNotification object:self];
}

// MARK: - 腾讯广告
/**
 *  开屏广告展示失败
 */
- (void)splashAdFailToPresent:(GDTSplashAd *)splashAd withError:(NSError *)error
{
  NSLog(@"%s",__FUNCTION__);
  NSLog(@"腾讯开屏广告加载失败 === %ld %@", (long)error.code, error.localizedDescription);
  GDT_SPLASH_FAILED = YES;
  if (GDT_SPLASH_FAILED && !BUD_SPLASH_FAILED) {
    [self loadBUSplash];
  }
}

/**
 *  开屏广告成功展示
 */
- (void)splashAdSuccessPresentScreen:(GDTSplashAd *)splashAd
{
  GDT_SPLASH_FAILED = NO;
}


-(void)splashAdClosed:(GDTSplashAd *)splashAd
{
    NSLog(@"%s",__FUNCTION__);
    self.splash = nil;
  [[NSNotificationCenter defaultCenter] postNotificationName:SplashAdsCloseActionNotification
                                                       object:self
                                                     userInfo:nil];
}

// MARK: - 穿山甲开屏广告
- (void)splashAdDidLoad:(BUSplashAdView *)splashAd {
  if ([splashAd isMemberOfClass:[GDTSplashAd class]]) {
    [self.splash showAdInWindow:self.window withBottomView:nil skipView:nil];
  } else {
    [ADAnalysis splashAdsLoadReport:YES];
  }
}

- (void)splashAdDidClose:(BUSplashAdView *)splashAd {
  [splashAd removeFromSuperview];
  CFTimeInterval endTime = CACurrentMediaTime();
  NSLog(@"Total Runtime: %g s", endTime - self.startTime);
  
  [[NSNotificationCenter defaultCenter] postNotificationName:SplashAdsCloseActionNotification
                                                       object:self
                                                     userInfo:nil];
}

- (void)splashAdDidClick:(BUSplashAdView *)splashAd {
  [ADAnalysis splashClickedReport];
}

- (void)splashAdWillVisible:(BUSplashAdView *)splashAd {
  [ADAnalysis splashAdsShowReport];
}

- (void)splashAd:(BUSplashAdView *)splashAd didFailWithError:(NSError *)error {
  [splashAd removeFromSuperview];
  CFTimeInterval endTime = CACurrentMediaTime();
  NSLog(@"Error: Total Runtime: %g s error=%@", endTime - self.startTime, error);
  [ADAnalysis splashAdsLoadReport:NO];
  BUD_SPLASH_FAILED = YES;
  if (BUD_SPLASH_FAILED && !GDT_SPLASH_FAILED) {
    [self loadGDTplash];
  }
}



@end
