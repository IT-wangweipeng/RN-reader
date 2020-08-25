//
//  PrivacyView.m
//  reader
//
//  Created by Droi on 2020/4/14.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "PrivacyView.h"
#import "TYAttributedLabel.h"
#import "UIColor+TReaderTheme.h"


@interface PrivacyView ()
<
UITextViewDelegate
>
@property (weak, nonatomic) IBOutlet UIView *bgView;
@property (weak, nonatomic) IBOutlet UITextView *textView;

@end

@implementation PrivacyView

- (void)awakeFromNib
{
  [super awakeFromNib];
  
  self.bgView.layer.masksToBounds = YES;
  self.bgView.layer.cornerRadius = 5.0;
  
  
  NSString *str1 = @"为了加强对您的个人信息的保护，请仔细阅读并确认";
  NSString *str2 = @"[用户协议]";
  NSString *str3 = @"和";
  NSString *str4 = @"[隐私政策]";
  NSString *str5 = @"。我们将严格按照政策内容使用和保护您的个人信息，为您提供更好的服务，感谢您的信任。";

  NSString *str = [NSString stringWithFormat:@"%@%@%@%@%@",str1,str2,str3,str4, str5];
  NSRange range1 = [str rangeOfString:str1];
  NSRange range2 = [str rangeOfString:str2];
  NSRange range3 = [str rangeOfString:str3];
  NSRange range4 = [str rangeOfString:str4];
  NSRange range5 = [str rangeOfString:str5];
  
  self.textView.editable = NO;
  self.textView.delegate = self;
  self.textView.linkTextAttributes = @{NSForegroundColorAttributeName: [UIColor RGB:248 g:88 b:54]};

  
  NSMutableAttributedString *mastring = [[NSMutableAttributedString alloc] initWithString:str attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.f]}];

  [mastring addAttribute:NSForegroundColorAttributeName value:[UIColor lightGrayColor] range:range1];
  [mastring addAttribute:NSForegroundColorAttributeName value:[UIColor lightGrayColor] range:range2];
  [mastring addAttribute:NSForegroundColorAttributeName value:[UIColor lightGrayColor] range:range3];
  [mastring addAttribute:NSForegroundColorAttributeName value:[UIColor lightGrayColor] range:range4];
  [mastring addAttribute:NSForegroundColorAttributeName value:[UIColor lightGrayColor] range:range5];
  [mastring addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:13] range:NSMakeRange(0, str.length - 1)];

  NSString *valueString1 = [[NSString stringWithFormat:@"agreement://%@",str2] stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLFragmentAllowedCharacterSet]];

  NSString *valueString3 = [[NSString stringWithFormat:@"privacy://%@",str4] stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLFragmentAllowedCharacterSet]];
  [mastring addAttribute:NSLinkAttributeName value:valueString1 range:range2];
  [mastring addAttribute:NSLinkAttributeName value:valueString3 range:range4];
  
  
  NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
   paragraphStyle.lineSpacing = 4;
  [mastring addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, str.length - 1)];
  
  self.textView.attributedText = mastring;
}


- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(nonnull NSURL *)URL inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction {
  if ([[URL scheme] isEqualToString:@"agreement"]) {
    [[UIApplication sharedApplication]
     openURL:[NSURL URLWithString:@"http://h5read.mjpet.net/html/service.html"]
     options:nil completionHandler:nil];
    return NO;
  } else if ([[URL scheme] isEqualToString:@"privacy"]) {
    [[UIApplication sharedApplication]
    openURL:[NSURL URLWithString:@"http://h5read.mjpet.net/html/privacy.html"]
    options:nil completionHandler:nil];
    return NO;
  }
  return YES;
}



- (void)clickLinkTitle:(NSString *)title {
  
}

                                       
                                       
- (IBAction)disagreeButtonAction:(UIButton *)sender {
  if (self.disagreeAction) {
    self.disagreeAction();
  }
}

- (IBAction)agreeButtonAction:(UIButton *)sender {
  if (self.agreeAction) {
    self.agreeAction();
  }
}

@end
