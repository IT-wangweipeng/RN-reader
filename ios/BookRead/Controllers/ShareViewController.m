//
//  ShareViewController.m
//  reader
//
//  Created by JY on 2019/5/5.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "ShareViewController.h"
#import "RCTWeChat.h"
#import "BookContentModel.h"
#import "NetworkManager.h"
#import "TReaderManager.h"
#import "UIColor+TReaderTheme.h"
#import "ShareEventEmitter.h"
#import "WXApi.h"
#import "UserDefaults.h"
#import <TencentOpenAPI/TencentOAuth.h>


@interface ShareViewController ()

@property (strong, nonatomic) IBOutlet UIView *bgView;
@property (weak, nonatomic) IBOutlet UIView *wrapperView;
@property (weak, nonatomic) IBOutlet UILabel *tipsLable;
@property (weak, nonatomic) IBOutlet UIStackView *wechatView;
@property (weak, nonatomic) IBOutlet UIStackView *timelineView;
@property (weak, nonatomic) IBOutlet UIStackView *qqView;
@property (weak, nonatomic) IBOutlet UIStackView *qqZoneView;
@property (weak, nonatomic) IBOutlet UIButton *qqButton;
@property (weak, nonatomic) IBOutlet UIButton *qqZoneButton;

@end


@implementation ShareViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  
  [self shareInfo];
  
  if ([TReaderManager readerTheme] == TReaderThemeNight) {
    self.wrapperView.backgroundColor = [UIColor RGB:66 g:66 b:66];
    self.tipsLable.textColor = [UIColor RGB:121 g:130 b:156];
  }
  
  
  self.wechatView.hidden = !WXApi.isWXAppInstalled;
  self.timelineView.hidden = !WXApi.isWXAppInstalled;
  
  
  BOOL enable = [TencentOAuth iphoneQQInstalled];
  self.qqButton.userInteractionEnabled = enable;
  self.qqZoneButton.userInteractionEnabled = enable;
  if (!enable) {
    self.qqButton.alpha = 0.5;
    self.qqZoneButton.alpha = 0.5;
  }
  
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  UITouch *touch = touches.allObjects[0];
  if ([touch.view isEqual:self.bgView]) {
    [self dismissViewControllerAnimated:YES completion:nil];
  }
}

- (NSDictionary *)shareInfo {
  NSDictionary *userInfo = [[NSUserDefaults standardUserDefaults] objectForKey:@"USER_INFO"];
  NSDictionary *dict = [userInfo objectForKey:@"info"];
  NSInteger sex = [[dict objectForKey:@"sex"] integerValue];
  if (sex == 0) {
    sex = 3; // 默认
  }
  NSString *prefix = [NSString stringWithFormat:@"%@", [UserDefaults objectForKey:@"HOST_PREFIX"]];
  NSInteger bookId = self.bookModel.book_id;
  NSString *webPageURL = nil;
  if ([NetworkManager isTestMode]) {
    webPageURL = [NSString stringWithFormat:@"%@/webread/share/detail.html?custom=6&sex=%ld&id=%ld", prefix, (long)sex, (long)bookId];
  } else {
    webPageURL = [NSString stringWithFormat:@"%@/share/detail.html?custom=6&sex=%ld&id=%ld", prefix, (long)sex, (long)bookId];
  }
  
  NSString *desc;
  if (self.bookModel.brief.length >= 100) {
    desc = [self.bookModel.brief substringWithRange:NSMakeRange(0, 50)];
  } else {
    desc = self.bookModel.brief;
  }
  
  NSDictionary *info = @{
                         @"title": self.bookModel.name ?: @"",
                         @"description": desc ?: @"",
                         @"thumbImage": self.bookModel.cover ?: @"",
                         @"type": @"news",
                         @"webpageUrl": webPageURL,
                         };
  return info;
}

- (IBAction)shareToWeChatFriend:(UIButton *)sender {
  [[NSNotificationCenter defaultCenter] postNotificationName:ShareNotification object:[self shareWithType:@"wechat"]];
}

- (IBAction)shareToWeChatTimeline:(UIButton *)sender {
  [[NSNotificationCenter defaultCenter] postNotificationName:ShareNotification object:[self shareWithType:@"timeline"]];
}
  
- (IBAction)shareToQQ:(UIButton *)sender {
  [[NSNotificationCenter defaultCenter] postNotificationName:ShareNotification object:[self shareWithType:@"qq"]];
}
  
- (IBAction)shareToQQZone:(UIButton *)sender {
  [[NSNotificationCenter defaultCenter] postNotificationName:ShareNotification object:[self shareWithType:@"qqZone"]];
}

- (NSDictionary *)shareWithType:(NSString *)type {
  NSMutableDictionary *info = [[self shareInfo] mutableCopy];
  [info setValue:type forKey:@"shareType"];
  return info;
}
  

@end
