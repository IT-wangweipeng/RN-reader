//
//  AVPlayerManager.h
//  reader
//
//  Created by Droi on 2019/8/29.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "MusicModel.h"


typedef NS_ENUM(NSUInteger, AVPlayerPlayMode) {
  AVPlayerNomalMode,
  AVPlayerCycleMode,
};

typedef NS_ENUM(NSUInteger, PlayerStatus) {
  Play,
  Pause,
  Finish,
};

typedef void(^PlayerStatusChange)(PlayerStatus status);
typedef void(^UpdateMusicIndex)(NSInteger index);


@interface AVPlayerManager : NSObject
// 音乐列表
@property (nonatomic,strong) NSArray<MusicModel *> *musicList;


@property (nonatomic, strong) AVPlayer *player;
@property (nonatomic, assign) AVPlayerPlayMode playMode;
@property (nonatomic, copy) PlayerStatusChange statusChange;
@property (nonatomic, copy) UpdateMusicIndex updateMusicIndexCallback;

+ (instancetype)shareInstance;

- (void)playMusic;
- (void)pauseMusic;

// 清除播放器
- (void)clearPlayer;

// 单曲循环某一首歌
- (void)playeSingleMusic:(NSInteger)index;
// 播放整个列表
- (void)playMusicList:(NSInteger)index;
// 替换当前播放歌曲
- (void)replaceCurrentItem:(NSInteger)index;

+ (AVPlayerItem *)currentItem;
- (NSUInteger)indexOfItem:(AVPlayerItem *)item;
- (AVPlayerItem *)playerItemWithIndex:(NSInteger)index;

@end

