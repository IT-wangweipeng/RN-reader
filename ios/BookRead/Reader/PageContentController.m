//
//  PageContentController.m
//  reader
//
//  Created by Droi on 2019/10/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PageContentController.h"
#import "TYAttributedLabel.h"
#import "UIColor+TReaderTheme.h"
#import "TimeUtil.h"
#import "ZZZBatteryView.h"
#import "ReaderPage.h"
#import "ReaderChapter.h"
#import "BookChapterModel.h"
#import "AdsRuleView.h"
#import "VideoAdsView.h"
#import "VipView.h"
#import "BUDAdManager.h"
#import "QWAlertView.h"
#import <BUAdSDK/BURewardedVideoAd.h>
#import <BUAdSDK/BURewardedVideoModel.h>
#import "UserDefaults.h"
#import "ADAnalysis.h"
#import "GDTRewardVideoAd.h"
#import "TXAdsManager.h"
#import "MBProgressHUD+Message.h"
#import "RandomAdsGenerate.h"


@interface PageContentController ()
<
VideoAdsViewDelegate,
BURewardedVideoAdDelegate,
GDTRewardedVideoAdDelegate
>

@property (weak, nonatomic) IBOutlet UILabel *pageIndicateLabel;
@property (weak, nonatomic) IBOutlet UILabel *timeLabel;
@property (weak, nonatomic) IBOutlet UIView *batteryView;
@property (weak, nonatomic) IBOutlet UILabel *chapterNameLabel;

@property (nonatomic, strong) VipView *vipView;
@property (nonatomic, strong) VideoAdsView *videoAdView;
@property (nonatomic, strong) AdsRuleView *adsRuleView;
@property (nonatomic, strong) BURewardedVideoAd *rewardedVideoAd;
@property (nonatomic, strong) GDTRewardVideoAd *rewardVideoAd;

@end


@implementation PageContentController


- (void)viewDidLoad
{
  [super viewDidLoad];
  
  [self setupUI];
}

- (void)setupUI
{
  UIWindow *keyWindow = [[[UIApplication sharedApplication] delegate] window];
  CGFloat safeAreaTop = 20;
  CGFloat safeAreaBottom = 0;
  if (@available(iOS 11.0, *)) {
    safeAreaTop = keyWindow.safeAreaInsets.top > 0 ? keyWindow.safeAreaInsets.top : 20;
    safeAreaBottom = keyWindow.safeAreaInsets.bottom > 0 ? keyWindow.safeAreaInsets.bottom : 0;
  }
  
  
  NSString *time = [TimeUtil timeString:@"HH:mm"];
  self.timeLabel.text = time;
  
  ZZZBatteryView *batteryView = [ZZZBatteryView batteryView];
  [self.batteryView addSubview:batteryView];
  
  [self updatePageContent:self.currentPage];
  
  UIColor *color = [UIColor whiteBgReaderThemeColor];
  self.view.backgroundColor = color;
  self.label.backgroundColor = color;
}

- (void)updatePageContent:(ReaderPage *)page
{
  if (!page) {
    return;
  }
  [self.label setAttributedText:page.attString];
  self.chapterNameLabel.text = page.chapterTitle;
  self.pageIndicateLabel.text = [NSString stringWithFormat:@"%ld/%ld", page.index + 1, page.totalPage];
  
  if (![ReaderChapter canFreeRead]) {
    // vip章节
    [self.label addSubview:self.vipView];
  } else {
    // 章节末尾广告
    if (page.totalPage > 0 && page.index == page.totalPage - 1) {
      NSLog(@"totalPage==== %ld %ld", page.index, page.totalPage);
      CGFloat labelWidth = CGRectGetWidth(self.label.frame);
      // 实际绘制文字内容的高度
      CGFloat contentHeight = [self.label.textContainer getHeightWithFramesetter:nil width:labelWidth];
      // 可绘制章节末广告区域
      CGFloat height = CGRectGetHeight(self.label.frame) - contentHeight;
      if ([BUDAdManager isAdsEnable] && height > 250) {
        self.videoAdView.frame = CGRectMake(0, contentHeight+30, CGRectGetWidth(self.label.frame), 200);
        __weak typeof(self) weakSelf = self;
        weakSelf.videoAdView.videoPlayFinish = ^{
          if ([weakSelf.delegate respondsToSelector:@selector(removeAds)]) {
            [weakSelf.delegate removeAds];
          }
        };
        [self.label addSubview:self.videoAdView];
      }
    }
  }
}

- (void)moreInfoButtonClicked:(UIButton *)button {
  [[QWAlertView sharedMask] show:self.adsRuleView withType:QWAlertViewStyleAlert];
}


- (void)dealloc
{
  NSLog(@"释放了 PageContentController");
}


// MARK: - Helper
- (AdsRuleView *)adsRuleView
{
  if (!_adsRuleView) {
    _adsRuleView = [[[NSBundle mainBundle] loadNibNamed:@"AdsRuleView" owner:nil options:nil] firstObject];
    _adsRuleView.frame = CGRectMake(0, 0, 300, 250);
  }
  return _adsRuleView;
}

- (UIView *)vipView
{
  if (!_vipView) {
    _vipView = (VipView *)[[[NSBundle mainBundle] loadNibNamed:@"VipView" owner:self options:nil] firstObject];
    _vipView.frame = CGRectMake(0, CGRectGetMaxY(self.label.frame) - 250, self.label.frame.size.width, 150);
    
    WS(weakSelf)
    _vipView.buttonAction = ^{
      if ([weakSelf.delegate respondsToSelector:@selector(vipButtonClicked)]) {
        [weakSelf.delegate vipButtonClicked];
      }
    };
//    _vipView.backgroundColor = [UIColor redColor];
  }
  return _vipView;
}

- (VideoAdsView *)videoAdView
{
  if (!_videoAdView) {
    VideoAdsView *videoAdView = (VideoAdsView *)[[[NSBundle mainBundle]
                                                  loadNibNamed:@"VideoAdsView"
                                                  owner:self
                                                  options:nil] firstObject];
    self.videoAdView = videoAdView;
    videoAdView.delegate = self;
  }
  return _videoAdView;
}

@end
