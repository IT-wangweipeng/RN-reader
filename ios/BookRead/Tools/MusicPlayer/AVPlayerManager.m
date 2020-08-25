//
//  AVPlayerManager.m
//  reader
//
//  Created by Droi on 2019/8/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AVPlayerManager.h"
#import "UserDefaults.h"

@interface AVPlayerManager ()

@property (nonatomic, strong) NSArray<AVPlayerItem *> *musicItems;
@property (nonatomic, assign) NSInteger musicIndex;
@property (nonatomic, assign) PlayerStatus status;
@property (nonatomic, assign) BOOL isPlay;

@end


@implementation AVPlayerManager

+ (instancetype)shareInstance {
  static AVPlayerManager *manager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    manager = [AVPlayerManager new];
  });
  return manager;
}


// MARK: - Notification
- (void)playFinished:(NSNotification *)noti {
  
  self.isPlay = NO;
  [self removePlayerObserver];
  
  if (self.playMode == AVPlayerCycleMode) {
    // 单曲循环
    _player = nil;
    _musicItems = nil;
    [self playeSingleMusic:self.musicIndex];
  } else if (self.playMode == AVPlayerNomalMode) {
    // 列表循环
    NSInteger nextIndex = (self.musicIndex + 1) % self.musicItems.count;
    if (nextIndex == 0) {
      [self clearPlayer];
    }
    [self playMusicList:nextIndex];
  }
}

// 顺序播放
- (void)playMusicList:(NSInteger)index {
  if (self.musicIndex == index && self.isPlay) {
    return;
  }
  [self replaceCurrentItem:index];
  if (self.updateMusicIndexCallback) {
    self.updateMusicIndexCallback(self.musicIndex);
  }
}

// 单曲循环
- (void)playeSingleMusic:(NSInteger)index {
  if (self.musicIndex == index && self.isPlay) {
    return;
  }
  [self replaceCurrentItem:index];
}

- (void)replaceCurrentItem:(NSInteger)index {
  self.musicIndex = index;
  AVPlayerItem *item = [self playerItemWithIndex:index];
  [self.player replaceCurrentItemWithPlayerItem:item];
  [self addPlayerObserver];
  [self playMusic];
}


// MARK: - Helper
- (AVPlayer *)player {
  if (!_player) {
    _player = [AVPlayer new];
  }
  return _player;
}

- (void)clearPlayer {
  [self removePlayerObserver];
  _player = nil;
  _musicItems = nil;
  self.isPlay = NO;
}

- (NSArray<AVPlayerItem *> *)musicItems {
  if (!_musicItems) {
    NSMutableArray *items = [NSMutableArray array];
    for (MusicModel *model in self.musicList) {
      AVPlayerItem *item = [[AVPlayerItem alloc] initWithURL:[NSURL URLWithString:model.url]];
      [items addObject:item];
    }
    _musicItems = [items copy];
  }
  return _musicItems;
}

- (AVPlayerItem *)playerItemWithIndex:(NSInteger)index {
  return [self.musicItems objectAtIndex:index];
}

- (NSUInteger)indexOfItem:(AVPlayerItem *)item {
  return [self.musicItems indexOfObject:item];
}

+ (AVPlayerItem *)currentItem {
  return [AVPlayerManager shareInstance].player.currentItem;
}

// MARK: - KVO
- (void)addPlayerObserver {
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(playFinished:) name:AVPlayerItemDidPlayToEndTimeNotification object:self.player.currentItem];
  [self.player.currentItem addObserver:self forKeyPath:@"status" options:NSKeyValueObservingOptionNew context:nil];
}

- (void)removePlayerObserver {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [self.player.currentItem removeObserver:self forKeyPath:@"status"];
}


- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
  
  AVPlayerStatus status = self.player.status;
  if ([keyPath isEqualToString:@"status"]) {
    switch (status) {
      case AVPlayerStatusUnknown: {
        NSLog(@"未知转态");
      }
        break;
      case AVPlayerStatusReadyToPlay: {
        NSLog(@"准备播放");
        self.isPlay = YES;
      }
        break;
      case AVPlayerStatusFailed: {
        NSLog(@"加载失败");
      }
        break;
        
      default:
        break;
    }
    
  }
}

// MARK: - 播放状态控制
- (void)playMusic {
  [self.player play];
  _status = Play;
  if (self.statusChange) {
    self.statusChange(_status);
  }
}

- (void)pauseMusic {
  [self.player pause];
  _status = Pause;
  if (self.statusChange) {
    self.statusChange(_status);
  }
}



@end
