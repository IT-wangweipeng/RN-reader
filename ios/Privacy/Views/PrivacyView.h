//
//  PrivacyView.h
//  reader
//
//  Created by Droi on 2020/4/14.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>


typedef void(^AgreeButtonAction)(void);
typedef void(^DisagreeButtonAction)(void);

NS_ASSUME_NONNULL_BEGIN

@interface PrivacyView : UIView

@property (nonatomic, copy) AgreeButtonAction agreeAction;
@property (nonatomic, copy) DisagreeButtonAction disagreeAction;

@end

NS_ASSUME_NONNULL_END
