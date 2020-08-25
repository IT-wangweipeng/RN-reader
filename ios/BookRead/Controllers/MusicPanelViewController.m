//
//  MusicPanelViewController.m
//  reader
//
//  Created by Droi on 2019/8/27.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MusicPanelViewController.h"
#import "MusicTableViewCell.h"
#import <AVFoundation/AVFoundation.h>
#import "UserDefaults.h"
#import "AVPlayerManager.h"
#import <JSONModel/JSONModel.h>
#import <UMAnalytics/MobClick.h>
#import "MusicModel.h"
#import "UserUtil.h"
#import "UIColor+TReaderTheme.h"
#import "TReaderManager.h"


static NSString *const MUSIC_CELL_IDENTIFIER = @"MUSIC_CELL_IDENTIFIER";

@interface MusicPanelViewController ()
<
UITableViewDelegate,
UITableViewDataSource
>

@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (weak, nonatomic) IBOutlet UIButton *orderPlayButton;
@property (weak, nonatomic) IBOutlet UIButton *refreshButton;
@property (weak, nonatomic) IBOutlet UIButton *playMusicButton;
@property (weak, nonatomic) IBOutlet UIView *bottomView;

@property (nonatomic, strong) NSDictionary *musicInfo;
@property (nonatomic, strong) NSArray<MusicModel *> *musics;
@property (nonatomic, assign) BOOL isNightMode;

@end

@implementation MusicPanelViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.isNightMode = [TReaderManager readerTheme] == TReaderThemeNight;
  self.musicIndex = 0;
  [self.orderPlayButton setImageEdgeInsets:UIEdgeInsetsMake(0, -10, 0, 0)];
  [self.refreshButton setImageEdgeInsets:UIEdgeInsetsMake(0, -10, 0, 0)];
  [self.tableView registerNib:[UINib nibWithNibName:@"MusicTableViewCell" bundle:[NSBundle mainBundle]] forCellReuseIdentifier:MUSIC_CELL_IDENTIFIER];
  
  [AVPlayerManager shareInstance].musicList = self.musics;
  [self setupPlayControlUI];
  WS(weakSelf);
  [AVPlayerManager shareInstance].statusChange = ^(PlayerStatus status) {
    [weakSelf updateUI];
  };
  [AVPlayerManager shareInstance].updateMusicIndexCallback = ^(NSInteger index) {
    weakSelf.musicIndex = index;
    [weakSelf.tableView reloadData];
  };
  
  if (self.isNightMode) {
    self.tableView.backgroundColor = [UIColor RGB:66 g:66 b:66];
  } else {
    self.tableView.backgroundColor = [UIColor whiteColor];
  }
  
  [self updateUI];
}

- (NSArray<MusicModel *> *)musics {
  if (!_musics) {
    if (self.musicModes.count >= 3) {
      _musics = [self.musicModes subarrayWithRange:NSMakeRange(0, 3)];
    } else {
      _musics = self.musicModes;
    }
  }
  return _musics;
}



// MARK: - UITableViewDataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
  if (self.musics.count <= 3) {
    return self.musics.count;
  }
  return 3;
}

- (nonnull UITableViewCell *)tableView:(nonnull UITableView *)tableView cellForRowAtIndexPath:(nonnull NSIndexPath *)indexPath {
  tableView.separatorStyle = UITableViewCellSelectionStyleNone;
  MusicTableViewCell *cell = (MusicTableViewCell *)[tableView dequeueReusableCellWithIdentifier:MUSIC_CELL_IDENTIFIER forIndexPath:indexPath];
  WS(weakSelf);
  cell.refreshMusicAction = ^(NSUInteger tag) {
    if (self.musicModes.count <= 3) {
      return;
    }
    if (![UserUtil hasLogin]) {
      [self showLoginPage];
      return;
    }
    NSMutableSet *all = [[NSSet setWithArray:weakSelf.musicModes] mutableCopy];
    NSMutableSet *target = [[NSSet setWithArray:weakSelf.musics] mutableCopy];
    [all minusSet:target];
    
    NSMutableArray *arr = [weakSelf.musics mutableCopy];
    [arr removeObjectAtIndex:tag];
    NSUInteger index = arc4random() % all.count;
    MusicModel *m = [[all allObjects] objectAtIndex:index];
    [arr insertObject:m atIndex:tag];
    weakSelf.musics = [arr copy];
    [self.tableView reloadData];
    self.musicIndex = tag;
    [[AVPlayerManager shareInstance] clearPlayer];
    [[AVPlayerManager shareInstance] replaceCurrentItem:tag];
  };
  if (self.musicModes.count <= 3) {
    NSString *imgName = self.isNightMode ? @"image_refresh_music_default_night" : @"image_refresh_music_default";
    [cell.refreshMusicButton setImage:[UIImage imageNamed:imgName] forState:UIControlStateNormal];
    [cell.refreshMusicButton setTitleColor:[UIColor RGB:187 g:190 b:194] forState:UIControlStateNormal];
  } else {
    NSString *imgName = self.isNightMode ? @"image_refresh_music_highlight_night" : @"image_refresh_music_highlight";
    [cell.refreshMusicButton setTitleColor:[UIColor RGB:84 g:92 b:103] forState:UIControlStateNormal];
    [cell.refreshMusicButton setImage:[UIImage imageNamed:imgName] forState:UIControlStateNormal];
  }
  MusicModel *model = self.musics[indexPath.row];
  cell.nameLabel.text = model.name;
  cell.refreshMusicButton.tag = indexPath.row;
  if (indexPath.row == self.musicIndex) {
    cell.hornImageView.hidden = NO;
    cell.hornImageView.image = [UIImage imageNamed:@"image_horn"];
    cell.nameLabel.textColor = [UIColor RGB:248 g:88 b:54];
    [cell updateLayoutConstraint];
  } else {
    cell.hornImageView.hidden = YES;
    cell.nameLabel.textColor = [UIColor RGB:84 g:92 b:103];
    [cell resetLayoutConstraint];
  }
  
  if (self.isNightMode) {
    cell.backgroundColor = [UIColor RGB:66 g:66 b:66];
    cell.nameLabel.textColor = [UIColor RGB:143 g:143 b:143];
    self.bottomView.backgroundColor = [UIColor RGB:77 g:77 b:77];
    [cell.refreshMusicButton setTitleColor:[UIColor RGB:143 g:143 b:143] forState:UIControlStateNormal];
    [self.orderPlayButton setTitleColor:[UIColor RGB:143 g:143 b:143] forState:UIControlStateNormal];
    [self.refreshButton setTitleColor:[UIColor RGB:143 g:143 b:143] forState:UIControlStateNormal];
  }
  
  return cell;
}

// MARK: - UITableViewDelegate
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
  self.musicIndex = indexPath.row;
  [self playMusic];
  [UserDefaults setBool:YES forKey:MUSIC_PLAY_BUTTON_ENABLE];
  [tableView reloadData];
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
  return 62;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section {
  return 0.1;
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section {
  return 0.1;
}


// MARK: - Actions
- (IBAction)playSettingAction:(UIButton *)sender {
  NSString *setting = [UserDefaults objectForKey:PLAY_ORDER_SETTING];
  if ([setting isEqualToString:ORDER_PLAY] || setting == nil) {
    [UserDefaults setObject:CYCLE_PLAY forKey:PLAY_ORDER_SETTING];
  } else {
    [UserDefaults setObject:ORDER_PLAY forKey:PLAY_ORDER_SETTING];
  }
  [self setupPlayControlUI];
}

- (IBAction)refreshAction:(UIButton *)sender {
  if ([UserUtil hasLogin]) {
    NSMutableSet *mutiSet = [NSMutableSet set];
    while (mutiSet.count < 3) {
      NSUInteger a = arc4random() % self.musicModes.count;
      MusicModel *model = [self.musicModes objectAtIndex:a];
      [mutiSet addObject:model];
    }
    self.musics = [mutiSet allObjects];
    [self.tableView reloadData];
  } else {
    [self showLoginPage];
  }
}

- (IBAction)playMusicAction:(UIButton *)sender {
  CGFloat rate = [AVPlayerManager shareInstance].player.rate;
  if (1 == rate) {
    NSLog(@"暂停");
    [[AVPlayerManager shareInstance] pauseMusic];
    [MobClick event:@"book_read_bgm_btn_pause_clicked"];
    [UserDefaults setBool:NO forKey:MUSIC_PLAY_BUTTON_ENABLE];
  } else if (0 == rate) {
    NSLog(@"播放");
    [UserDefaults setBool:YES forKey:MUSIC_PLAY_BUTTON_ENABLE];
    [[AVPlayerManager shareInstance] playMusic];
    [self playMusic];
  }
}

- (void)playMusic {
  AVPlayerItem *currentItem = [AVPlayerManager currentItem];
  AVPlayerItem *item = [[AVPlayerManager shareInstance] playerItemWithIndex:self.musicIndex];
  if (![currentItem isEqual:item]) {
    [[AVPlayerManager shareInstance] clearPlayer];
  } else {
    float rate = [AVPlayerManager shareInstance].player.rate;
    if (rate == 1) {
      return;
    }
  }

  if ([self isCyclePlay]) {
    [[AVPlayerManager shareInstance] playeSingleMusic:self.musicIndex];
  } else {
    [[AVPlayerManager shareInstance] playMusicList:self.musicIndex];
  }
}

- (void)showLoginPage {
  [UserDefaults setBool:YES forKey:SHOW_MUSIC_PAGE];
  [self dismissViewControllerAnimated:YES completion:^{
    [[NSNotificationCenter defaultCenter] postNotificationName:TReaderUserLoginNofication object:nil];
  }];
}

// MARK: - Helper
- (BOOL)isCyclePlay {
  NSString *ret = [UserDefaults objectForKey:PLAY_ORDER_SETTING];
  if ([ret isEqualToString:CYCLE_PLAY]) {
    return YES;
  }
  return NO;
}

- (NSDictionary *)musicInfo {
  if (_musicInfo == nil) {
    _musicInfo = [NSDictionary dictionary];
  }
  return _musicInfo;
}

- (void)updateUI {
  float rate = [AVPlayerManager shareInstance].player.rate;
  if (rate == 0) {
    [self.playMusicButton setBackgroundImage:[UIImage imageNamed:@"image_play_music"] forState:UIControlStateNormal];
  } else {
     [self.playMusicButton setBackgroundImage:[UIImage imageNamed:@"image_pause_music"] forState:UIControlStateNormal];
  }
}

- (void)setupPlayControlUI {
  NSString *setting = [UserDefaults objectForKey:PLAY_ORDER_SETTING];
  if ([setting isEqualToString:ORDER_PLAY] || setting == nil) {
    [AVPlayerManager shareInstance].playMode = AVPlayerNomalMode;
    NSString *imgName = self.isNightMode ? @"image_order_play_night" : @"image_order_play";
    [self.orderPlayButton setImage:[UIImage imageNamed:imgName] forState:UIControlStateNormal];
    [self.orderPlayButton setTitle:@"顺序循环" forState:UIControlStateNormal];
  } else if ([setting isEqualToString:CYCLE_PLAY]) {
    [AVPlayerManager shareInstance].playMode = AVPlayerCycleMode;
    NSString *imgName = self.isNightMode ? @"image_play_single_music_night" : @"image_play_single_music";
    [self.orderPlayButton setImage:[UIImage imageNamed:imgName] forState:UIControlStateNormal];
    [self.orderPlayButton setTitle:@"单曲循环" forState:UIControlStateNormal];
  }
  
  if (self.musicModes.count <= 3) {
    if (self.isNightMode) {
      [self.refreshButton setTitleColor:[UIColor RGB:195 g:203 b:208] forState:UIControlStateNormal];
    } else {
      [self.refreshButton setTitleColor:[UIColor RGB:195 g:203 b:208] forState:UIControlStateNormal];
    }
    NSString *imgName = self.isNightMode ? @"image_refresh_default_night" : @"image_refresh_default";
    [self.refreshButton setImage:[UIImage imageNamed:imgName] forState:UIControlStateNormal];
    self.refreshButton.enabled = NO;
  } else {
    if (self.isNightMode) {
      [self.refreshButton setTitleColor:[UIColor RGB:143 g:143 b:143] forState:UIControlStateNormal];
    } else {
      [self.refreshButton setTitleColor:[UIColor RGB:30 g:37 b:47] forState:UIControlStateNormal];
    }
    self.refreshButton.enabled = YES;
  }
  NSString *imgName = self.isNightMode ? @"image_refresh_highlight_night" : @"image_refresh_highlight";
  [self.refreshButton setImage:[UIImage imageNamed:imgName] forState:UIControlStateNormal];
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  UITouch *touch = [touches anyObject];
  UIView *view = touch.view;
  if ([view isEqual:self.view]) {
    [self dismissViewControllerAnimated:YES completion:nil];
    if (self.updateCallback) {
      self.updateCallback();
    }
  }
}
@end
