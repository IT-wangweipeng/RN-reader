//
//  RDProgressView.h
//  reader
//
//  Created by Apple on 2020/2/17.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface RDProgressView : UIView

//进度值
@property (nonatomic, assign) CGFloat progress;
//业务值
@property (nonatomic, assign) NSInteger redouNum;

@end


