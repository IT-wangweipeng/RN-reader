//
//  PrivacyController.m
//  reader
//
//  Created by Droi on 2020/4/15.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "PrivacyController.h"
#import "PrivacyView.h"

@interface PrivacyController ()

@end

@implementation PrivacyController

- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.view.backgroundColor = [UIColor whiteColor];
  
  UIView *launchScreen = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] objectAtIndex:0];
  launchScreen.frame = self.view.frame;
  [self.view addSubview:launchScreen];
  
  PrivacyView *privacyView = (PrivacyView *)[[[NSBundle mainBundle] loadNibNamed:@"PrivacyView" owner:self options:nil] objectAtIndex:0];
  privacyView.frame = self.view.frame;
  [launchScreen addSubview:privacyView];
  WS(weakSelf)
  privacyView.agreeAction = ^() {
    if (weakSelf.agreePrivacy) {
      weakSelf.agreePrivacy();
    }
  };
  privacyView.disagreeAction = ^{
    exit(0);
  };
  
}




@end
