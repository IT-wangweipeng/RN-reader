package com.droi.reader.ui.activity;

import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.ContentObserver;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.PowerManager;
import android.provider.Settings;
import android.support.design.widget.AppBarLayout;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.CheckBox;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;
import android.text.TextUtils;

import com.app.hubert.guide.NewbieGuide;
import com.app.hubert.guide.core.Controller;
import com.app.hubert.guide.listener.OnLayoutInflatedListener;
import com.app.hubert.guide.model.GuidePage;
import com.droi.reader.R;
import com.droi.reader.model.bean.BookChapterBean;
import com.droi.reader.model.bean.CollBookBean;
import com.droi.reader.model.local.BookRepository;
import com.droi.reader.model.local.ReadSettingManager;
import com.droi.reader.presenter.ReadPresenter;
import com.droi.reader.presenter.contract.ReadContract;
import com.droi.reader.ui.adapter.CategoryAdapter;
import com.droi.reader.ui.adapter.PageStyleAdapter;
import com.droi.reader.ui.base.BaseMVPActivity;
import com.droi.reader.ui.dialog.AddBookShelfDialog;
import com.droi.reader.ui.dialog.ShareDialog;
import com.droi.reader.utils.BrightnessUtils;
import com.droi.reader.utils.Constant;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.NetworkUtils;
import com.droi.reader.utils.RxUtils;
import com.droi.reader.utils.ScreenUtils;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.utils.StringUtils;
import com.droi.reader.utils.SystemBarUtils;
import com.droi.reader.utils.Util;
import com.droi.reader.widget.page.PageLoader;
import com.droi.reader.widget.page.PageStyle;
import com.droi.reader.widget.page.PageView;
import com.droi.reader.widget.page.TxtChapter;
import com.droi.reader.MainApplication;
import com.droi.reader.MainActivity;

import com.umeng.analytics.MobclickAgent;

import java.util.Arrays;
import java.util.List;
import java.util.HashMap;

import butterknife.BindView;
import io.reactivex.disposables.Disposable;

import static android.support.v4.view.ViewCompat.LAYER_TYPE_SOFTWARE;
import static android.view.View.GONE;
import static android.view.View.VISIBLE;

public class ReadActivity extends BaseMVPActivity<ReadContract.Presenter>
        implements ReadContract.View {
    private static final String TAG = "ReadActivity";
    public static final int REQUEST_MORE_SETTING = 1;
    public static final String EXTRA_COLL_BOOK = "extra_coll_book";
    public static final String EXTRA_IS_COLLECTED = "extra_is_collected";
    public static final String EXTRA_SEX = "extra_sex";
    public static final String EXTRA_TOKEN = "extra_token";
    public static final String EXTRA_USER_IS_VIP = "extra_user_is_vip";//用户是否是vip
    public static final String EXTRA_BOOK_FREE_AD_ENDTIME = "extra_book_free_ad_endtime";
    public static final String EXTRA_USER_FREE_AD_ENDTIME = "extra_user_free_ad_endtime";

    public static final int DEFAULT_SEX = 3;
    public static ReadActivity instance;

    // 注册 Brightness 的 uri
    private final Uri BRIGHTNESS_MODE_URI =
            Settings.System.getUriFor(Settings.System.SCREEN_BRIGHTNESS_MODE);
    private final Uri BRIGHTNESS_URI =
            Settings.System.getUriFor(Settings.System.SCREEN_BRIGHTNESS);
    private final Uri BRIGHTNESS_ADJ_URI =
            Settings.System.getUriFor("screen_auto_brightness_adj");

    private static final int WHAT_CATEGORY = 1;
    private static final int WHAT_CHAPTER = 2;


    @BindView(R.id.read_dl_slide)
    DrawerLayout mDlSlide;
    /*************top_menu_view*******************/
    @BindView(R.id.read_abl_top_menu)
    AppBarLayout mAblTopMenu;
    @BindView(R.id.read_top_menu_add_bookshelf)
    ImageView mAddBookshelf;
    @BindView(R.id.read_top_menu_share)
    ImageView mShare;
    @BindView(R.id.read_top_menu_add_bookshelf_layout)
    LinearLayout mAddBookshelfLayout;
    @BindView(R.id.read_top_menu_share_layout)
    LinearLayout mShareLayout;
    @BindView(R.id.read_top_menu_add_bookshelf_text)
    TextView mAddBookshelfText;
    @BindView(R.id.read_top_menu_share_text)
    TextView mShareText;

    /***************content_view******************/
    @BindView(R.id.read_pv_page)
    PageView mPvPage;
    @BindView(R.id.read_layout)
    RelativeLayout mReadLalyout;
    @BindView(R.id.no_net_layout)
    RelativeLayout mNoNetLayout;
    @BindView(R.id.back)
    TextView mNoNetBack;
    @BindView(R.id.retry)
    TextView mNoNetRetry;
    @BindView(R.id.read_loading)
    ImageView mReadLoading;
//    @BindView(R.id.bottom_ad_layout_bg)
//    FrameLayout mBottomAdLayoutBg;
    @BindView(R.id.night_mask)
    FrameLayout mNightMask;
    @BindView(R.id.chapter_ad_container)
    FrameLayout mChapterAdLayout;
    /***************bottom_menu_view***************************/
    @BindView(R.id.read_ll_bottom_menu)
    LinearLayout mLlBottomMenu;
    @BindView(R.id.read_ll_bottom_sub_menu)
    LinearLayout mLlBottomSubMenu;
    @BindView(R.id.read_comment_edit)
    LinearLayout mCommentEdit;
    @BindView(R.id.read_comment_message)
    LinearLayout mCommentMessage;
    @BindView(R.id.read_tv_pre_chapter)
    TextView mTvPreChapter;
    @BindView(R.id.read_tv_next_chapter)
    TextView mTvNextChapter;
    @BindView(R.id.read_tv_category)
    TextView mTvCategory;
    @BindView(R.id.read_setting_rv_bg)
    RecyclerView mRvBg;
    @BindView(R.id.read_setting_tv_font_minus)
    TextView mTvFontMinus;
    @BindView(R.id.read_setting_tv_font)
    TextView mTvFont;
    @BindView(R.id.read_setting_tv_font_plus)
    TextView mTvFontPlus;
    @BindView(R.id.read_setting_sb_brightness)
    SeekBar mSbBrightness;
    @BindView(R.id.read_setting_cb_brightness_auto)
    CheckBox mCbBrightnessAuto;
    @BindView(R.id.read_setting_brightness)
    TextView mTvBrightness;
    @BindView(R.id.read_setting_fontsize)
    TextView mTvFontSize;
    @BindView(R.id.read_setting_background)
    TextView mTvBackground;

    /*******************music layout*************************/
    @BindView(R.id.music_layout)
    RelativeLayout mMusicLayout;
    @BindView(R.id.music_recycler_view)
    RecyclerView mMusicRecyclerView;
    @BindView(R.id.music_change_all)
    LinearLayout mMusicChangeAll;
    @BindView(R.id.music_change_all_image)
    ImageView mMusicChangeAllImage;
    @BindView(R.id.music_change_all_text)
    TextView mMusicChangeAllText;
    @BindView(R.id.music_play_image)
    ImageView mMusicPlayImage;
    @BindView(R.id.music_play_sort)
    LinearLayout mMusicPlaySort;
    @BindView(R.id.music_play_sort_image)
    ImageView mMusicPlaySortImage;
    @BindView(R.id.music_play_sort_text)
    TextView mMusicPlaySortText;
    @BindView(R.id.music_control_layout)
    LinearLayout mMusicControlLayout;


    /***************left slide*******************************/
    @BindView(R.id.read_ll_slide)
    LinearLayout mLlSlide;
    @BindView(R.id.read_iv_category)
    ListView mLvCategory;
    @BindView(R.id.read_category_title)
    TextView mTvCategoryTitle;
    @BindView(R.id.read_category_content)
    TextView mTvCategoryContent;
    @BindView(R.id.read_category_order)
    TextView mTvCategoryOrder;
    /*****************view******************/
    private PageLoader mPageLoader;
    private Animation mTopInAnim;
    private Animation mTopOutAnim;
    private Animation mBottomInAnim;
    private Animation mBottomOutAnim;
    private CategoryAdapter mCategoryAdapter;
    public CollBookBean mCollBook;
    private PageStyleAdapter mPageStyleAdapter;
    private PageStyle mPageStyle;
    private ReadSettingManager mReadSettingManager;
    private int mTextSize;

    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);

            switch (msg.what) {
                case WHAT_CATEGORY:
                    mLvCategory.setSelection(mPageLoader.getChapterPos());
                    break;
                case WHAT_CHAPTER:
                    mPageLoader.openChapter();
                    break;
            }
        }
    };
    // 接收电池信息和时间更新的广播
    private BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
                int level = intent.getIntExtra("level", 0);
                mPageLoader.updateBattery(level);
            }
            // 监听分钟的变化
            else if (intent.getAction().equals(Intent.ACTION_TIME_TICK)) {
                mPageLoader.updateTime();
            }
        }
    };

    // 亮度调节监听
    // 由于亮度调节没有 Broadcast 而是直接修改 ContentProvider 的。所以需要创建一个 Observer 来监听 ContentProvider 的变化情况。
    private ContentObserver mBrightObserver = new ContentObserver(new Handler()) {
        @Override
        public void onChange(boolean selfChange) {
            onChange(selfChange, null);
        }

        @Override
        public void onChange(boolean selfChange, Uri uri) {
            super.onChange(selfChange);

            // 判断当前是否跟随屏幕亮度，如果不是则返回
            if (selfChange || !isBrightFollowSystem()) return;

            // 如果系统亮度改变，则修改当前 Activity 亮度
            if (BRIGHTNESS_MODE_URI.equals(uri)) {
                LogUtils.i(TAG, "亮度模式改变");
            } else if (BRIGHTNESS_URI.equals(uri) && !BrightnessUtils.isAutoBrightness(ReadActivity.this)) {
                LogUtils.i(TAG, "亮度模式为手动模式 值改变");
                BrightnessUtils.setBrightness(ReadActivity.this, BrightnessUtils.getScreenBrightness(ReadActivity.this));
            } else if (BRIGHTNESS_ADJ_URI.equals(uri) && BrightnessUtils.isAutoBrightness(ReadActivity.this)) {
                LogUtils.i(TAG, "亮度模式为自动模式 值改变");
                BrightnessUtils.setDefaultBrightness(ReadActivity.this);
            } else {
                LogUtils.i(TAG, "亮度调整 其他");
                BrightnessUtils.setDefaultBrightness(ReadActivity.this);
            }
        }
    };

    /***************params*****************/
    public boolean isCollected = false; // isFromSDCard
    public int sex = DEFAULT_SEX;
    public String token = null;
    public int isVip = 0;
    private boolean isNightMode = false;
    private boolean isFullScreen = false;
    private boolean isRegistered = false;

    private long mBookId;
    public int userFreeAdEndtime;

    @Override
    protected int getContentId() {
        return R.layout.activity_read;
    }

    @Override
    protected ReadContract.Presenter bindPresenter() {
        return new ReadPresenter();
    }

    @Override
    protected void initData(Bundle savedInstanceState) {
        super.initData(savedInstanceState);
        instance = this;
        mCollBook = getIntent().getParcelableExtra(EXTRA_COLL_BOOK);
        isCollected = getIntent().getBooleanExtra(EXTRA_IS_COLLECTED, false);
        sex = getIntent().getIntExtra(EXTRA_SEX, DEFAULT_SEX);
        token = getIntent().getStringExtra(EXTRA_TOKEN);
        isVip = getIntent().getIntExtra(EXTRA_USER_IS_VIP, 0);
        userFreeAdEndtime = getIntent().getIntExtra(EXTRA_USER_FREE_AD_ENDTIME, 0);


        mReadSettingManager = ReadSettingManager.getInstance();
        isNightMode = mReadSettingManager.isNightMode();
        isFullScreen = mReadSettingManager.isFullScreen();
        mPageStyle = mReadSettingManager.getPageStyle();
        mTextSize = mReadSettingManager.getTextSize();

        //初始化字体大小
        if (mTextSize == -1) {
            mTextSize = Constant.DEFAULT_TEXT_SIZE;//ScreenUtils.dpToPx(Constant.DEFAULT_TEXT_SIZE);
        }
        mReadSettingManager.setTextSize(mTextSize);

        //初始化背景图片
        mBookId = mCollBook.getId();
    }

    @Override
    protected void setUpToolbar(Toolbar toolbar) {
        super.setUpToolbar(toolbar);
        //设置标题(标题在此设置无效，移到resume中有效)
//        toolbar.setTitle(mCollBook.getName());
        //半透明化StatusBar
        SystemBarUtils.transparentStatusBar(this);
    }

    @Override
    protected void initWidget() {
        super.initWidget();
        // 如果 API < 18 取消硬件加速
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN_MR2
                && Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            mPvPage.setLayerType(LAYER_TYPE_SOFTWARE, null);
        }

//        LinearLayout.LayoutParams bottomAdLayoutBgParams = (LinearLayout.LayoutParams)mBottomAdLayoutBg.getLayoutParams();
//        float width = Util.getScreenWidthDp(this);
//        int height = (int) (width/6.4);//广点通banner广告宽高比为6.4:1,通过宽度算出高度
//        bottomAdLayoutBgParams.height = ScreenUtils.dpToPx(height);
//        mBottomAdLayoutBg.setLayoutParams(bottomAdLayoutBgParams);

        mPvPage.setActivity(this);
        mPvPage.setLoadingView(mReadLoading);
//        mPvPage.setBottomAdLayoutBg(mBottomAdLayoutBg);
        mPvPage.setChapterAdLayout(mChapterAdLayout);
        mPvPage.setNightMask(mNightMask);
        mPvPage.setMusicLayout(mMusicLayout);
        mPvPage.setMusicRecyclerView(mMusicRecyclerView);
        mPvPage.setMusicChangeAll(mMusicChangeAll);
        mPvPage.setMusicChangeAllImage(mMusicChangeAllImage);
        mPvPage.setMusicChangeAllText(mMusicChangeAllText);
        mPvPage.setMusicPlayImage(mMusicPlayImage);
        mPvPage.setMusicPlaySort(mMusicPlaySort);
        mPvPage.setMusicPlaySortImage(mMusicPlaySortImage);
        mPvPage.setMusicPlaySortText(mMusicPlaySortText);

        mPvPage.setToken(token);
        mPvPage.setUserFreeAdEndtime(userFreeAdEndtime);
        mPvPage.setUserIsVip(isVip);

        //获取页面加载器
        mPageLoader = mPvPage.getPageLoader(mCollBook);
        //禁止滑动展示DrawerLayout
        mDlSlide.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
        //侧边打开后，返回键能够起作用
        mDlSlide.setFocusableInTouchMode(false);

        setUpAdapter();

        //注册广播
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_BATTERY_CHANGED);
        intentFilter.addAction(Intent.ACTION_TIME_TICK);
        registerReceiver(mReceiver, intentFilter);

        //设置当前Activity的Brightness
        if (ReadSettingManager.getInstance().isBrightnessAuto()) {
            BrightnessUtils.setDefaultBrightness(this);
        } else {
            BrightnessUtils.setBrightness(this, ReadSettingManager.getInstance().getBrightness());
        }

        //初始化屏幕常亮类
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);

        //初始化nightmode
        setNightMode(isNightMode);

        //初始化TopMenu
        initTopMenu();

        //初始化BottomMenu
        initBottomMenu();

        //初始化亮度，字体，背景
        mCbBrightnessAuto.setChecked(ReadSettingManager.getInstance().isBrightnessAuto());
        mSbBrightness.setProgress(ReadSettingManager.getInstance().getBrightness());
        mTvFont.setText((mTextSize - Constant.MIN_TEXT_SIZE) / Constant.TEXT_SIZE_STEP + 1 + "");
        //初始化bottom背景adapter
        initBgAdapter();
    }

    private void initBgAdapter() {
        Drawable[] drawables = {
                getDrawable(R.color.nb_read_bg_1)
                , getDrawable(R.color.nb_read_bg_2)
                , getDrawable(R.color.nb_read_bg_3)
                , getDrawable(R.drawable.ic_night)};

        mPageStyleAdapter = new PageStyleAdapter();
        mRvBg.setLayoutManager(new GridLayoutManager(this, 4));
        mRvBg.setAdapter(mPageStyleAdapter);
        mPageStyleAdapter.refreshItems(Arrays.asList(drawables));

        mPageStyleAdapter.setPageStyleChecked(mPageStyle);

    }

    private void initTopMenu() {
        if (Build.VERSION.SDK_INT >= 19) {
            mAblTopMenu.setPadding(0, /*ScreenUtils.getStatusBarHeight()*/ 0, 0, 0);
        }
    }

    private void initBottomMenu() {
        //判断是否全屏
        if (ReadSettingManager.getInstance().isFullScreen()) {
            //还需要设置mBottomMenu的底部高度
            ViewGroup.MarginLayoutParams params = (ViewGroup.MarginLayoutParams) mLlBottomMenu.getLayoutParams();
            params.bottomMargin = ScreenUtils.getNavigationBarHeight();
            mLlBottomMenu.setLayoutParams(params);
        } else {
            //设置mBottomMenu的底部距离
            ViewGroup.MarginLayoutParams params = (ViewGroup.MarginLayoutParams) mLlBottomMenu.getLayoutParams();
            params.bottomMargin = 0;
            mLlBottomMenu.setLayoutParams(params);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        LogUtils.i(TAG, "onWindowFocusChanged: " + mAblTopMenu.getMeasuredHeight());
    }

    private void setUpAdapter() {
        mCategoryAdapter = new CategoryAdapter();
        mCategoryAdapter.setUserIsVip(isVip);
        mLvCategory.setAdapter(mCategoryAdapter);
        mLvCategory.setFastScrollEnabled(true);
    }

    // 注册亮度观察者
    private void registerBrightObserver() {
        try {
            if (mBrightObserver != null) {
                if (!isRegistered) {
                    final ContentResolver cr = getContentResolver();
                    cr.unregisterContentObserver(mBrightObserver);
                    cr.registerContentObserver(BRIGHTNESS_MODE_URI, false, mBrightObserver);
                    cr.registerContentObserver(BRIGHTNESS_URI, false, mBrightObserver);
                    cr.registerContentObserver(BRIGHTNESS_ADJ_URI, false, mBrightObserver);
                    isRegistered = true;
                }
            }
        } catch (Throwable throwable) {
            LogUtils.e(TAG, "register mBrightObserver error! " + throwable.toString());
        }
    }

    //解注册
    private void unregisterBrightObserver() {
        try {
            if (mBrightObserver != null) {
                if (isRegistered) {
                    getContentResolver().unregisterContentObserver(mBrightObserver);
                    isRegistered = false;
                }
            }
        } catch (Throwable throwable) {
            LogUtils.e(TAG, "unregister BrightnessObserver error! " + throwable.toString());
        }
    }

    @Override
    protected void initClick() {
        super.initClick();

        mPageLoader.setOnPageChangeListener(
                new PageLoader.OnPageChangeListener() {

                    @Override
                    public void onChapterChange(int pos) {
                        mCategoryAdapter.setChapter(pos);
                    }

                    @Override
                    public void requestChapters(List<TxtChapter> requestChapters) {
                        mPresenter.loadChapter(mBookId, requestChapters);
                        mHandler.sendEmptyMessage(WHAT_CATEGORY);
                    }

                    @Override
                    public void onCategoryFinish(List<TxtChapter> chapters) {
                        for (TxtChapter chapter : chapters) {
                            chapter.setTitle(StringUtils.convertCC(chapter.getTitle(), mPvPage.getContext()));
                        }
                        mCategoryAdapter.refreshItems(chapters);
                    }

                    @Override
                    public void onPageCountChange(int count) {

                    }

                    @Override
                    public void onPageChange(int pos) {

                    }
                }
        );

        mPvPage.setTouchListener(new PageView.TouchListener() {
            @Override
            public boolean onTouch() {
                return !hideReadMenu();
            }

            @Override
            public void center() {
                toggleMenu(true);
            }

            @Override
            public void prePage() {
            }

            @Override
            public void nextPage() {
            }

            @Override
            public void cancel() {
            }
        });

        mLvCategory.setOnItemClickListener(
                (parent, view, position, id) -> {
                    mDlSlide.closeDrawer(Gravity.START);
                    if (!mCategoryAdapter.orderFlag) {
                        position = mCategoryAdapter.getCount() - 1 - position;
                    }
                    mPageLoader.skipToChapter(position);
                }
        );

        mTvCategory.setOnClickListener(
                (v) -> {
                    //移动到指定位置
                    if (mCategoryAdapter.getCount() > 0) {
                        int position = mPageLoader.getChapterPos();
                        if (!mCategoryAdapter.orderFlag) {
                            position = mCategoryAdapter.getCount() - 1 - position;
                        }
                        mCategoryAdapter.setChapter(position);
                        mLvCategory.setSelection(position);
                    }
                    //切换菜单
                    toggleMenu(true);
                    //打开侧滑动栏
                    mDlSlide.openDrawer(Gravity.START);
                }
        );

        mTvPreChapter.setOnClickListener(
                (v) -> {
                    if (mPageLoader.skipPreChapter()) {
                        mCategoryAdapter.setChapter(mPageLoader.getChapterPos());
                        updateChapterButtonStatus();
                    }
                }
        );

        mTvNextChapter.setOnClickListener(
                (v) -> {
                    if (mPageLoader.skipNextChapter()) {
                        mCategoryAdapter.setChapter(mPageLoader.getChapterPos());
                        updateChapterButtonStatus();
                    }
                }
        );

        //亮度调节
        mSbBrightness.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {

            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
                int progress = seekBar.getProgress();
                if (mCbBrightnessAuto.isChecked()) {
                    mCbBrightnessAuto.setChecked(false);
                }
                //设置当前 Activity 的亮度
                BrightnessUtils.setBrightness(ReadActivity.this, progress);
                //存储亮度的进度条
                ReadSettingManager.getInstance().setBrightness(progress);
            }
        });

        //跟随系统亮度
        mCbBrightnessAuto.setOnCheckedChangeListener(
                (buttonView, isChecked) -> {
                    if (isChecked) {
                        //获取屏幕的亮度
                        BrightnessUtils.setBrightness(this, BrightnessUtils.getScreenBrightness(this));
                    } else {
                        //获取进度条的亮度
                        BrightnessUtils.setBrightness(this, mSbBrightness.getProgress());
                    }
                    ReadSettingManager.getInstance().setAutoBrightness(isChecked);
                }
        );

        //字体大小调节
        mTvFontMinus.setOnClickListener(
                (v) -> {
                    mTextSize -= Constant.TEXT_SIZE_STEP;
                    if (mTextSize < Constant.MIN_TEXT_SIZE) {
                        mTextSize = Constant.MIN_TEXT_SIZE;
                    }
                    mTvFont.setText((mTextSize - Constant.MIN_TEXT_SIZE) / Constant.TEXT_SIZE_STEP + 1 + "");
                    mPageLoader.setTextSize(mTextSize);
                    updateFontButtonStatus();
                }
        );

        mTvFontPlus.setOnClickListener(
                (v) -> {
                    mTextSize += Constant.TEXT_SIZE_STEP;
                    if (mTextSize > Constant.MAX_TEXT_SIZE) {
                        mTextSize = Constant.MAX_TEXT_SIZE;
                    }
                    mTvFont.setText((mTextSize - Constant.MIN_TEXT_SIZE) / Constant.TEXT_SIZE_STEP + 1 + "");
                    mPageLoader.setTextSize(mTextSize);
                    updateFontButtonStatus();
                }
        );

        //背景颜色切换
        mPageStyleAdapter.setOnItemClickListener(
                (view, pos) -> {
                    if (pos == 3) { //night mode
                        setNightMode(true);
                        mPageLoader.setNightMode(true);
                    } else {
                        setNightMode(false);
                        mPageLoader.setNightMode(false);
                        mPageLoader.setPageStyle(PageStyle.values()[pos]);
                    }
                }
        );

        //加入书架
        mAddBookshelfLayout.setOnClickListener(view -> {
            //*/ add umeng maidian
            HashMap<String,String> map = new HashMap<String,String>();
            map.put("book_id", "" + mBookId);
            MobclickAgent.onEvent(ReadActivity.this, "reader_page_add_book", map);
            //*/

            if (!isCollected && !mCollBook.getBookChapters().isEmpty()) {
                //设置为已收藏
                isCollected = true;
                TxtChapter curChapter = mPageLoader.getChapterCategory().get(mPageLoader.getChapterPos());
                String chapterTitle = curChapter.getTitle();
                long chapterId = curChapter.getId();
                int chapterSort = curChapter.getSort();
                LogUtils.i("yy", "exitWithBookShelf() chapterTitle=" + chapterTitle + ",chapterId=" + chapterId + ",chapterSort=" + chapterSort);
                MainApplication.getOpenNativePackage().openNativeModule.sendRecordEvent("updateBookShelf", mCollBook, chapterTitle, chapterId, chapterSort);
                Toast.makeText(ReadActivity.this, R.string.has_add_to_bookshelf, Toast.LENGTH_SHORT).show();
                mAddBookshelfLayout.setVisibility(View.GONE);
            }
        });

        //分享
        mShareLayout.setOnClickListener(view -> {
            //*/ add umeng maidian
            HashMap<String,String> map = new HashMap<String,String>();
            map.put("book_id", "" + mBookId);
            MobclickAgent.onEvent(ReadActivity.this, "reader_page_share", map);
            //*/

            String title = mCollBook.getName();
            String description = mCollBook.getBrief();
            String thumbImage = mCollBook.getCover();
            String webpageUrl = String.format(SharedPreUtils.getInstance().getWechatShareWebpageUrl(), sex, mCollBook.getId());
            LogUtils.i("yy", "webpageUrl=" + webpageUrl);
            ShareDialog shareDialog = new ShareDialog(ReadActivity.this, title, description, thumbImage, webpageUrl, token);
            shareDialog.show();
        });


        //Toolbar返回图标
        if (mToolbar != null) {
            mToolbar.setNavigationOnClickListener(view -> {
                exitWithBookShelf();
            });
        }

        //倒序/正序
        mTvCategoryOrder.setOnClickListener(view -> {
            mCategoryAdapter.reverseItems();
            if (mCategoryAdapter.orderFlag) {
                mTvCategoryOrder.setText(getString(R.string.nb_read_deorder));
            } else {
                mTvCategoryOrder.setText(getString(R.string.nb_read_order));
            }
        });

        //no net
        mNoNetBack.setOnClickListener(view -> {
            exit();
        });
        mNoNetRetry.setOnClickListener(view -> {
            processLogic();
        });

        //comment edit
        mCommentEdit.setOnClickListener(view -> {
            finish();
            MainApplication.getOpenNativePackage().openNativeModule.sendCommentEvent(1000,
                mCollBook,
                isCollected,
                mCollBook.getSpecialChapterPos(),
                sex,
                token,
                userFreeAdEndtime,
                isVip);

        });
        mCommentMessage.setOnClickListener(view -> {
                finish();
                MainApplication.getOpenNativePackage().openNativeModule.sendCommentEvent(1001,
                    mCollBook,
                    isCollected,
                    mCollBook.getSpecialChapterPos(),
                    sex,
                    token,
                    userFreeAdEndtime,
                    isVip);
        });

        //comment message
    }

    private void setToolbarIndicateColor(int color) {
        Drawable upArrow = ContextCompat.getDrawable(this, /*R.drawable.abc_ic_ab_back_material*/ R.drawable.ic_arrow_left);
        if (upArrow != null) {
            upArrow.setColorFilter(ContextCompat.getColor(this, color), PorterDuff.Mode.SRC_ATOP);
            if (getSupportActionBar() != null) {
                getSupportActionBar().setHomeAsUpIndicator(upArrow);
            }
        }
    }

    private void setNightMode(boolean nightMode) {
        isNightMode = nightMode;
        if (nightMode) {
            setToolbarIndicateColor(R.color.night_widget_font_color);
            mToolbar.setTitleTextColor(getResources().getColor(R.color.night_widget_font_color));
            mAblTopMenu.setBackground(getDrawable(R.color.night_bg));
            if (isCollected) {
                mAddBookshelfLayout.setVisibility(View.GONE);
            } else {
                mAddBookshelf.setImageResource(R.drawable.ic_read_night_add_bookshelf);
                mAddBookshelfText.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            }
            mShare.setImageResource(R.drawable.ic_read_night_share);
            mShareText.setTextColor(getResources().getColor(R.color.night_widget_font_color));
//            mLlBottomMenu.setBackground(getDrawable(R.color.night_bg));
            mLlBottomSubMenu.setBackground(getDrawable(R.color.night_bg));
            mCommentEdit.setBackground(getResources().getDrawable(R.drawable.shape_round_corner_reader_comment_night));
            mCommentMessage.setBackground(getResources().getDrawable(R.drawable.shape_round_corner_reader_comment_night));
            mTvBrightness.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvFont.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvFontSize.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvFontMinus.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvFontMinus.setBackground(getResources().getDrawable(R.drawable.shape_btn_read_setting_night_normal));
            mTvFontPlus.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvFontPlus.setBackground(getResources().getDrawable(R.drawable.shape_btn_read_setting_night_normal));
            mTvBackground.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvPreChapter.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvCategory.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvNextChapter.setTextColor(getResources().getColor(R.color.night_widget_font_color));

            mLlSlide.setBackground(getDrawable(R.color.night_bg));
            mTvCategoryTitle.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mTvCategoryContent.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            mCategoryAdapter.setNightMode(true);
            // music
            mMusicLayout.setBackground(getDrawable(R.color.night_bg));
            mMusicControlLayout.setBackground(getDrawable(R.color.music_control_bg_night));
        } else {
            setToolbarIndicateColor(R.color.black);
            mToolbar.setTitleTextColor(getResources().getColor(R.color.black));
            mAblTopMenu.setBackground(getDrawable(R.color.nb_read_menu_bg));
            if (isCollected) {
                mAddBookshelfLayout.setVisibility(View.GONE);
            } else {
                mAddBookshelf.setImageResource(R.drawable.ic_read_add_bookshelf);
                mAddBookshelfText.setTextColor(getResources().getColor(R.color.widget_font_color));
            }
            mShare.setImageResource(R.drawable.ic_read_share);
            mShareText.setTextColor(getResources().getColor(R.color.widget_font_color));
//            mLlBottomMenu.setBackground(getDrawable(R.color.nb_read_menu_bg));
            mLlBottomSubMenu.setBackground(getDrawable(R.color.nb_read_menu_bg));
            mCommentEdit.setBackground(getResources().getDrawable(R.drawable.shape_round_corner_reader_comment));
            mCommentMessage.setBackground(getResources().getDrawable(R.drawable.shape_round_corner_reader_comment));
            mTvBrightness.setTextColor(getResources().getColor(R.color.black));
            mTvFont.setTextColor(getResources().getColor(R.color.black));
            mTvFontSize.setTextColor(getResources().getColor(R.color.black));
            mTvFontMinus.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            mTvFontMinus.setBackground(getResources().getDrawable(R.drawable.shape_btn_read_setting_normal));
            mTvFontPlus.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            mTvFontPlus.setBackground(getResources().getDrawable(R.drawable.shape_btn_read_setting_normal));
            mTvBackground.setTextColor(getResources().getColor(R.color.black));
            mTvPreChapter.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            mTvCategory.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            mTvNextChapter.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            mLlSlide.setBackground(getDrawable(R.color.nb_read_menu_bg));
            mTvCategoryTitle.setTextColor(getResources().getColor(R.color.nb_text_default));
            mTvCategoryContent.setTextColor(getResources().getColor(R.color.nb_text_category_content));
            mCategoryAdapter.setNightMode(false);
            //music
            mMusicLayout.setBackground(getDrawable(R.color.nb_read_menu_bg));
            mMusicControlLayout.setBackground(getDrawable(R.color.music_control_bg));
        }
        updateChapterButtonStatus();
        updateFontButtonStatus();
        MainApplication.getOpenNativePackage().openNativeModule.sendNightModeEvent("nativeUpdateNightMode", nightMode);
    }

    /**
     * 隐藏阅读界面的菜单显示
     *
     * @return 是否隐藏成功
     */
    private boolean hideReadMenu() {
        hideSystemBar();
        if (mAblTopMenu.getVisibility() == VISIBLE) {
            toggleMenu(true);
            return true;
        } else if(mMusicLayout.getVisibility() == VISIBLE) {
            mMusicLayout.setVisibility(View.GONE);
            return true;
        }
        return false;
    }

    private void showSystemBar() {
        //显示
//        SystemBarUtils.showUnStableStatusBar(this);
//        if (isFullScreen) {
//            SystemBarUtils.showUnStableNavBar(this);
//        }
    }

    private void hideSystemBar() {
        //隐藏
        SystemBarUtils.hideStableStatusBar(this);
        if (isFullScreen) {
            SystemBarUtils.hideStableNavBar(this);
        }
    }

    /**
     * 切换菜单栏的可视状态
     * 默认是隐藏的
     */
    private void toggleMenu(boolean hideStatusBar) {
        initMenuAnim();
        if (mAblTopMenu.getVisibility() == View.VISIBLE) {
            //关闭
            mAblTopMenu.startAnimation(mTopOutAnim);
            mLlBottomMenu.startAnimation(mBottomOutAnim);
            mAblTopMenu.setVisibility(GONE);
            mLlBottomMenu.setVisibility(GONE);

            if (hideStatusBar) {
                hideSystemBar();
            }
        } else {
            updateChapterButtonStatus();
            updateFontButtonStatus();
            mAblTopMenu.setVisibility(View.VISIBLE);
            mLlBottomMenu.setVisibility(View.VISIBLE);
            mAblTopMenu.startAnimation(mTopInAnim);
            mLlBottomMenu.startAnimation(mBottomInAnim);

            showSystemBar();
        }
    }

    //初始化菜单动画
    private void initMenuAnim() {
        if (mTopInAnim != null) return;

        mTopInAnim = AnimationUtils.loadAnimation(this, R.anim.slide_top_in);
        mTopOutAnim = AnimationUtils.loadAnimation(this, R.anim.slide_top_out);
        mBottomInAnim = AnimationUtils.loadAnimation(this, R.anim.slide_bottom_in);
        mBottomOutAnim = AnimationUtils.loadAnimation(this, R.anim.slide_bottom_out);
        //退出的速度要快
        mTopOutAnim.setDuration(200);
        mBottomOutAnim.setDuration(200);
    }

    @Override
    protected void processLogic() {
        super.processLogic();

        if (NetworkUtils.isAvailable(ReadActivity.this)) {
            mReadLalyout.setVisibility(View.VISIBLE);
            mNoNetLayout.setVisibility(View.GONE);

            // 如果是已经收藏的，那么就从数据库中获取目录
            if (isCollected) {
                Disposable disposable = BookRepository.getInstance()
                        .getBookChaptersInRx(mBookId)
                        .compose(RxUtils::toSimpleSingle)
                        .subscribe(
                                (bookChapterBeen, throwable) -> {
                                    if (bookChapterBeen.size() > 0) {
                                        // 设置 CollBook
                                        mPageLoader.getCollBook().setBookChapters(bookChapterBeen);
                                        // 刷新章节列表
                                        mPageLoader.refreshChapterList();
                                    }
                                    // 如果是网络小说并被标记更新的，则从网络下载目录
                                    if (mCollBook.getIsUpdate()) {
                                        mPresenter.loadCategory(mBookId);
                                    }
                                }
                        );
                addDisposable(disposable);
            } else {
                // 从网络中获取目录
                mPresenter.loadCategory(mBookId);
            }
        } else {
            mReadLalyout.setVisibility(View.GONE);
            mNoNetLayout.setVisibility(View.VISIBLE);
        }


    }

    /***************************view************************************/
    @Override
    public void showError() {

    }

    @Override
    public void complete() {

    }

    @Override
    public void showCategory(List<BookChapterBean> bookChapters) {
        mPageLoader.getCollBook().setBookChapters(bookChapters);
        mPageLoader.refreshChapterList();
        mTvCategoryContent.setText(getString(R.string.nb_read_chapter_number, bookChapters.size()));

        // 如果是目录更新的情况，那么就需要存储更新数据
        if (mCollBook.getIsUpdate() && isCollected) {
            BookRepository.getInstance()
                    .saveBookChaptersWithAsync(bookChapters);
        }
    }

    @Override
    public void finishChapter() {
        if (mPageLoader.getPageStatus() == PageLoader.STATUS_LOADING) {
            mHandler.sendEmptyMessage(WHAT_CHAPTER);
            // 显示新人引导浮层
            if (SharedPreUtils.getInstance().getBoolean(Constant.KEY_IS_FIRST, true)) {
                SharedPreUtils.getInstance().putBoolean(Constant.KEY_IS_FIRST, false);
                LogUtils.i("yy", "is first");
                /*
                if(mPageLoader.mAllMusic.size() > 0) {
                    SharedPreUtils.getInstance().putBoolean(Constant.KEY_MUSIC_GUIDE_IS_FIRST, false);
                    if (isNightMode) {
                        NewbieGuide.with(this)
                                .alwaysShow(false)
                                .setLabel("guide")
                                .addGuidePage(GuidePage.newInstance().setLayoutRes(R.layout.view_guide).setBackgroundColor(getResources().getColor(R.color.transparent)))
                                .addGuidePage(GuidePage.newInstance()
                                        .setLayoutRes(R.layout.view_guide_music_night)
                                        .setEverywhereCancelable(false)
                                        .setOnLayoutInflatedListener(new OnLayoutInflatedListener() {
                                            @Override
                                            public void onLayoutInflated(View view, Controller controller) {
                                                view.findViewById(R.id.btn).setOnClickListener(new View.OnClickListener() {
                                                    @Override
                                                    public void onClick(View view) {
                                                        controller.remove();
                                                    }
                                                });
                                            }
                                        })
                                        .setBackgroundColor(getResources().getColor(R.color.transparent))
                                )
                                .show();
                    } else {
                        NewbieGuide.with(this)
                                .alwaysShow(false)
                                .setLabel("guide")
                                .addGuidePage(GuidePage.newInstance().setLayoutRes(R.layout.view_guide).setBackgroundColor(getResources().getColor(R.color.transparent)))
                                .addGuidePage(GuidePage.newInstance()
                                        .setLayoutRes(R.layout.view_guide_music)
                                        .setEverywhereCancelable(false)
                                        .setOnLayoutInflatedListener(new OnLayoutInflatedListener() {
                                            @Override
                                            public void onLayoutInflated(View view, Controller controller) {
                                                view.findViewById(R.id.btn).setOnClickListener(new View.OnClickListener() {
                                                    @Override
                                                    public void onClick(View view) {
                                                        controller.remove();
                                                    }
                                                });
                                            }
                                        })
                                        .setBackgroundColor(getResources().getColor(R.color.transparent))
                                )
                                .show();
                    }

                } else {
                */
                    SharedPreUtils.getInstance().putBoolean(Constant.KEY_MUSIC_GUIDE_IS_FIRST, true);
                    NewbieGuide.with(this)
                            .alwaysShow(false)
                            .setLabel("guide")
                            .addGuidePage(GuidePage.newInstance().setLayoutRes(R.layout.view_guide).setBackgroundColor(getResources().getColor(R.color.transparent)))
                            .show();
                //}
            }
            /*
            else if(SharedPreUtils.getInstance().getBoolean(Constant.KEY_MUSIC_GUIDE_IS_FIRST, true)) {
                if (mPageLoader.mAllMusic.size() > 0) {
                   SharedPreUtils.getInstance().putBoolean(Constant.KEY_MUSIC_GUIDE_IS_FIRST, false);
                   if (isNightMode) {
                       NewbieGuide.with(this)
                               .alwaysShow(false)
                               .setLabel("guide_music")
                               .addGuidePage(GuidePage.newInstance()
                                       .setLayoutRes(R.layout.view_guide_music_night)
                                       .setEverywhereCancelable(false)
                                       .setOnLayoutInflatedListener(new OnLayoutInflatedListener() {
                                           @Override
                                           public void onLayoutInflated(View view, Controller controller) {
                                               view.findViewById(R.id.btn).setOnClickListener(new View.OnClickListener() {
                                                   @Override
                                                   public void onClick(View view) {
                                                       controller.remove();
                                                   }
                                               });
                                           }
                                       })
                                       .setBackgroundColor(getResources().getColor(R.color.transparent))
                               )
                               .show();
                   } else {
                       NewbieGuide.with(this)
                               .alwaysShow(false)
                               .setLabel("guide_music")
                               .addGuidePage(GuidePage.newInstance()
                                       .setLayoutRes(R.layout.view_guide_music)
                                       .setEverywhereCancelable(false)
                                       .setOnLayoutInflatedListener(new OnLayoutInflatedListener() {
                                           @Override
                                           public void onLayoutInflated(View view, Controller controller) {
                                               view.findViewById(R.id.btn).setOnClickListener(new View.OnClickListener() {
                                                   @Override
                                                   public void onClick(View view) {
                                                       controller.remove();
                                                   }
                                               });
                                           }
                                       })
                                       .setBackgroundColor(getResources().getColor(R.color.transparent))
                               )
                               .show();
                   }

                }
            }*/
        }
        // 当完成章节的时候，刷新列表
        mCategoryAdapter.notifyDataSetChanged();
    }

    @Override
    public void errorChapter() {
        if (mPageLoader.getPageStatus() == PageLoader.STATUS_LOADING) {
            mPageLoader.chapterError();
        }
    }

    @Override
    public void onBackPressed() {
        if (mAblTopMenu.getVisibility() == View.VISIBLE) {
            // 非全屏下才收缩，全屏下直接退出
            if (!ReadSettingManager.getInstance().isFullScreen()) {
                toggleMenu(true);
                return;
            }
        } else if (mDlSlide.isDrawerOpen(Gravity.START)) {
            mDlSlide.closeDrawer(Gravity.START);
            return;
        }

        exitWithBookShelf();
    }

    // 退出
    private void exit() {
        // 返回给BookDetail。
//        Intent result = new Intent();
//        result.putExtra(BookDetailActivity.RESULT_IS_COLLECTED, isCollected);
//        setResult(Activity.RESULT_OK, result);
        // 退出
        super.onBackPressed();
    }

    @Override
    protected void onStart() {
        super.onStart();
        registerBrightObserver();
    }

    @Override
    protected void onResume() {
        super.onResume();
        LogUtils.i("yy","onResume()");
        mPageLoader.onResume();
        mPageLoader.setFront(true);
        if (mToolbar != null) {
            mToolbar.setTitle(mCollBook.getName());
        }
        //隐藏StatusBar
        mPvPage.post(() -> hideSystemBar());

        //MainApplication.getOpenNativePackage().openNativeModule.sendEvent("startTime");
    }

    @Override
    protected void onPause() {
        super.onPause();
        mPageLoader.onPause();
        mPageLoader.setFront(false);
        //if (isCollected) {
        mPageLoader.saveRecord();
        //}

        //MainApplication.getOpenNativePackage().openNativeModule.sendEvent("endTime");

        if (!mPageLoader.getChapterCategory().isEmpty()) {
            TxtChapter curChapter = mPageLoader.getChapterCategory().get(mPageLoader.getChapterPos());
            String chapterTitle = curChapter.getTitle();
            long chapterId = curChapter.getId();
            int chapterSort = curChapter.getSort();
            LogUtils.i("yy", "onPause() chapterTitle=" + chapterTitle + ",chapterId=" + chapterId + ",chapterSort=" + chapterSort);
            MainApplication.getOpenNativePackage().openNativeModule.sendRecordEvent("saveReadRecord", mCollBook, chapterTitle, chapterId, chapterSort);
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        unregisterBrightObserver();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(mReceiver);

        mHandler.removeMessages(WHAT_CATEGORY);
        mHandler.removeMessages(WHAT_CHAPTER);

        mPageLoader.closeBook();
        mPageLoader = null;
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        boolean isVolumeTurnPage = ReadSettingManager
                .getInstance().isVolumeTurnPage();
        switch (keyCode) {
            case KeyEvent.KEYCODE_VOLUME_UP:
                if (isVolumeTurnPage) {
                    return mPageLoader.skipToPrePage();
                }
                break;
            case KeyEvent.KEYCODE_VOLUME_DOWN:
                if (isVolumeTurnPage) {
                    return mPageLoader.skipToNextPage();
                }
                break;
        }
        return super.onKeyDown(keyCode, event);
    }

    private void updateChapterButtonStatus() {
        // 若跳转到第一章，置灰上一章Button
        if (mPageLoader.getChapterPos() == 0) {
            if (isNightMode) {
                mTvPreChapter.setTextColor(getResources().getColor(R.color.night_widget_font_disable_color));
            } else {
                mTvPreChapter.setTextColor(getResources().getColor(R.color.disable));
            }
        } else {
            if (isNightMode) {
                mTvPreChapter.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            } else {
                mTvPreChapter.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            }
        }

        // 若跳转到最后一章，置灰下一章Button
        if (mPageLoader.getChapterPos() == mPageLoader.getChapterCategory().size() - 1) {
            if (isNightMode) {
                mTvNextChapter.setTextColor(getResources().getColor(R.color.night_widget_font_disable_color));
            } else {
                mTvNextChapter.setTextColor(getResources().getColor(R.color.disable));
            }

        } else {
            if (isNightMode) {
                mTvNextChapter.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            } else {
                mTvNextChapter.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            }
        }
    }

    private void updateFontButtonStatus() {
        // 若字体已调到最小，MinusButton置灰
        if (mTextSize <= Constant.MIN_TEXT_SIZE) {
            if (isNightMode) {
                mTvFontMinus.setTextColor(getResources().getColor(R.color.night_widget_font_disable_color));
            } else {
                mTvFontMinus.setTextColor(getResources().getColor(R.color.disable));
            }

        } else {
            if (isNightMode) {
                mTvFontMinus.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            } else {
                mTvFontMinus.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            }
        }

        // 若字体已调到最大，PlusButton置灰
        if (mTextSize >= Constant.MAX_TEXT_SIZE) {
            if (isNightMode) {
                mTvFontPlus.setTextColor(getResources().getColor(R.color.night_widget_font_disable_color));
            } else {
                mTvFontPlus.setTextColor(getResources().getColor(R.color.disable));
            }
        } else {
            if (isNightMode) {
                mTvFontPlus.setTextColor(getResources().getColor(R.color.night_widget_font_color));
            } else {
                mTvFontPlus.setTextColor(getResources().getColor(R.color.nb_read_menu_text));
            }
        }
    }

    private void exitWithBookShelf() {
        if (!isCollected && mCollBook.getBookChapters() != null && !mCollBook.getBookChapters().isEmpty()) {
            AddBookShelfDialog addBookShelfDialog = new AddBookShelfDialog(ReadActivity.this);
            addBookShelfDialog.setOnClickListener(new AddBookShelfDialog.OnClickListener() {
                @Override
                public void onOkClick() {
                    //设置为已收藏
                    isCollected = true;
                    TxtChapter curChapter = mPageLoader.getChapterCategory().get(mPageLoader.getChapterPos());
                    String chapterTitle = curChapter.getTitle();
                    long chapterId = curChapter.getId();
                    int chapterSort = curChapter.getSort();
                    LogUtils.i("yy", "exitWithBookShelf() chapterTitle=" + chapterTitle + ",chapterId=" + chapterId + ",chapterSort=" + chapterSort);
                    MainApplication.getOpenNativePackage().openNativeModule.sendRecordEvent("updateBookShelf", mCollBook, chapterTitle, chapterId, chapterSort);

                    //设置阅读时间
                    mCollBook.setLastRead(StringUtils.dateConvert(System.currentTimeMillis(), Constant.FORMAT_BOOK_DATE));
                    BookRepository.getInstance().saveCollBookWithAsync(mCollBook);
                    addBookShelfDialog.dismiss();
                    exit();
                }

                @Override
                public void onCancelClick() {
                    addBookShelfDialog.dismiss();
                    exit();
                }
            });
            addBookShelfDialog.show();
        } else {
            exit();
        }
    }

    private void addBookShelf() {
        if (!isCollected && !mCollBook.getBookChapters().isEmpty()) {
            AddBookShelfDialog addBookShelfDialog = new AddBookShelfDialog(ReadActivity.this);
            addBookShelfDialog.setOnClickListener(new AddBookShelfDialog.OnClickListener() {
                @Override
                public void onOkClick() {
                    //设置为已收藏
                    isCollected = true;
                    TxtChapter curChapter = mPageLoader.getChapterCategory().get(mPageLoader.getChapterPos());
                    String chapterTitle = curChapter.getTitle();
                    long chapterId = curChapter.getId();
                    int chapterSort = curChapter.getSort();
                    LogUtils.i("yy", "exitWithBookShelf() chapterTitle=" + chapterTitle + ",chapterId=" + chapterId + ",chapterSort=" + chapterSort);
                    MainApplication.getOpenNativePackage().openNativeModule.sendRecordEvent("updateBookShelf", mCollBook, chapterTitle, chapterId, chapterSort);

                    addBookShelfDialog.dismiss();
                }

                @Override
                public void onCancelClick() {
                    addBookShelfDialog.dismiss();
                }
            });
            addBookShelfDialog.show();
        } else {
            Toast.makeText(ReadActivity.this, R.string.has_add_to_bookshelf, Toast.LENGTH_SHORT).show();
        }
    }

    private boolean isBrightFollowSystem() {
        if (mCbBrightnessAuto == null) {
            return false;
        }
        return mCbBrightnessAuto.isChecked();
    }
}
