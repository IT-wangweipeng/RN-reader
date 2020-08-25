//
//  EBookCatalogController.m
//  reader
//
//  Created by yu on 2019/4/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "EBookCatalogController.h"
#import "BookChapterModel.h"
#import "UIColor+TReaderTheme.h"
#import "CatalogHeaderView.h"
#import "BookCatalogCell.h"
#import "UserUtil.h"
#import "UserDefaults.h"



@interface EBookCatalogController () <UITableViewDelegate, UITableViewDataSource, CatalogHeaderViewDelegate>
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, assign) BOOL ascending;
@property (nonatomic, strong) UIView *muskView;
@property (nonatomic, assign) BOOL userIsVip;
@end

@implementation EBookCatalogController

static NSString *const CELL_ID = @"CatalogCell";

- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.ascending = YES;
  self.userIsVip = [UserUtil isVip];
  if ([UserDefaults boolForKey:IS_REVIEW_VERSION]) {
    self.userIsVip = YES;
  }
  
  self.view.backgroundColor = [UIColor whiteColor];
  UIImageView *imgView = [[UIImageView alloc] initWithFrame:self.view.frame];
  imgView.image = self.bgImage;
  [self.view addSubview:imgView];
  // musk view
  UIView *muskView = [[UIView alloc] initWithFrame:self.view.frame];
  muskView.backgroundColor = [UIColor RGB_R:0 g:0 b:0 alp:0.3];
  [imgView addSubview:muskView];
  self.muskView = muskView;
  UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapMuskView:)];
  imgView.userInteractionEnabled = YES;
  [imgView addGestureRecognizer:tap];
  
  
  UITableView *tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width-34, self.view.bounds.size.height) style:UITableViewStylePlain];
  tableView.delegate = self;
  tableView.dataSource = self;
  tableView.tableFooterView = [[UIView alloc] init];
  [self.view addSubview:tableView];
  _tableView = tableView;
  [tableView registerNib:[UINib nibWithNibName:@"BookCatalogCell" bundle:[NSBundle mainBundle]] forCellReuseIdentifier:CELL_ID];
  tableView.separatorStyle = UITableViewCellSelectionStyleNone;
  
  NSLog(@"self.currentChapterIndex ===== %ld", self.currentChapterIndex);
  [self.tableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.currentChapterIndex inSection:0] atScrollPosition:UITableViewScrollPositionTop animated:YES];

  
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
   [self.navigationController setNavigationBarHidden:YES animated:YES];
  
  if (@available(iOS 11.0, *)) {
    self.tableView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
  } else {
    self.automaticallyAdjustsScrollViewInsets = NO;
  }
}

- (void)tapMuskView:(UITapGestureRecognizer *)tap {
  [self.navigationController popViewControllerAnimated:NO];
}

// MARK: - UITableViewDataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
  return self.chapters.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
  BookCatalogCell *cell = (BookCatalogCell *)[tableView dequeueReusableCellWithIdentifier:CELL_ID forIndexPath:indexPath];
  BookChapterModel *model = self.chapters[indexPath.row];

  if (indexPath.row == self.currentChapterIndex) {
    cell.nameLabel.textColor = [UIColor RGB:248 g:88 b:54];
  } else {
    if (self.userIsVip || !model.isvip) {
      cell.nameLabel.textColor = [UIColor RGB:84 g:92 b:103];
    } else {
      cell.nameLabel.textColor = [UIColor RGB:210 g:210 b:210];
    }
  }
  
  [cell configCellWithModel:model];
  
  return cell;
}

// MARK: - UITableViewDelegate
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
  BookChapterModel *chapter = _chapters[indexPath.row];
  if ([self.delegate respondsToSelector:@selector(selectedChapter:index:)]) {
    NSInteger index = chapter.sort - 1;
    [self.delegate selectedChapter:chapter index:index];
    [self.navigationController popViewControllerAnimated:NO];
  }
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section {
  CatalogHeaderView *view = (CatalogHeaderView *)[[[NSBundle mainBundle] loadNibNamed:@"CatalogHeaderView" owner:self options:nil] firstObject];
  view.delegate = self;
  view.titleLabel.text = [NSString stringWithFormat:@"共%lu章", (unsigned long)self.chapters.count];
  [view.sortButton setTitle:self.ascending ? @"倒序" : @"正序" forState:UIControlStateNormal];
  return view;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section {
  return 80;
}

// MARK: - EBookCatalogControllerDelegate
- (void)reverseOrderButtonClicked {
  self.ascending = !self.ascending;
  if (self.chapters.count > 0) {
    NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:@"_sort" ascending:self.ascending];
    NSArray *sortArray = [self.chapters sortedArrayUsingDescriptors:[NSArray arrayWithObject:sortDescriptor]];
    
    [NSSortDescriptor sortDescriptorWithKey:@"_sort" ascending:self.ascending];
    self.currentChapterIndex = sortArray.count - (self.currentChapterIndex + 1);
    self.chapters = sortArray;
    [self.tableView reloadData];
  }
}

@end
