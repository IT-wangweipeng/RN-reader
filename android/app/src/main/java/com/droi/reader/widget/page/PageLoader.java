package com.droi.reader.widget.page;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.drawable.AnimationDrawable;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.TextPaint;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.FilterWord;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdDislike;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTNativeExpressAd;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;
import com.droi.reader.R;
import com.droi.reader.model.bean.BookRecordBean;
import com.droi.reader.model.bean.CollBookBean;
import com.droi.reader.model.bean.MusicBean;
import com.droi.reader.model.bean.ReadHotbeansInfoBean;
import com.droi.reader.model.bean.SignStatusBean;
import com.droi.reader.model.bean.TodayReadTsBean;
import com.droi.reader.model.bean.packages.FreeAdVertBean;
import com.droi.reader.model.local.BookRepository;
import com.droi.reader.model.local.ReadSettingManager;
import com.droi.reader.model.remote.RemoteRepository;
import com.droi.reader.ui.adapter.MusicAdapter;
import com.droi.reader.ui.dialog.AdRemoveDialog;
import com.droi.reader.ui.dialog.HotbeanGetDialog;
import com.droi.reader.ui.dialog.MusicNetworkChoiceDialog;
import com.droi.reader.utils.BitmapUtils;
import com.droi.reader.utils.CommonUtils;
import com.droi.reader.utils.Constant;
import com.droi.reader.utils.DislikeDialog;
import com.droi.reader.utils.IOUtils;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.NetworkUtils;
import com.droi.reader.utils.RxUtils;
import com.droi.reader.utils.ScreenUtils;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.utils.StringUtils;
import com.droi.reader.utils.TTAdManagerHolder;
import com.droi.reader.MainApplication;
import com.droi.reader.utils.Util;
import com.qq.e.ads.banner2.UnifiedBannerADListener;
import com.qq.e.ads.banner2.UnifiedBannerView;
import com.qq.e.ads.nativ.express2.AdEventListener;
import com.qq.e.ads.nativ.express2.MediaEventListener;
import com.qq.e.ads.nativ.express2.NativeExpressAD2;
import com.qq.e.ads.nativ.express2.NativeExpressADData2;
import com.qq.e.ads.nativ.express2.VideoOption2;
import com.qq.e.ads.rewardvideo.RewardVideoAD;
import com.qq.e.ads.rewardvideo.RewardVideoADListener;
import com.qq.e.comm.util.AdError;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ScheduledExecutorService;

import io.reactivex.Single;
import io.reactivex.SingleEmitter;
import io.reactivex.SingleObserver;
import io.reactivex.SingleOnSubscribe;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.RequestBody;

import java.util.HashMap;
import com.umeng.analytics.MobclickAgent;

public abstract class PageLoader {
    private static final String TAG = "yy";
    private static final int CHAPTER_LAST_AD_HEIGHT = ScreenUtils.dpToPx(109);
    private static final int CHAPTER_LAST_AD_EX1_WIDTH = ScreenUtils.dpToPx(180);
    private static final int CHAPTER_LAST_AD_EX1_HEIGHT = ScreenUtils.dpToPx(40);
    private static final int CHAPTER_AD_LOGIN_TIP_WIDTH = ScreenUtils.dpToPx(220);
    private static final int SIGN_IN_BG_WIDTH = ScreenUtils.dpToPx(45);
    private static final int SIGN_IN_BG_HEIGHT =ScreenUtils.dpToPx(21);
    private static final int SIGN_IN_BG_RADIUS = ScreenUtils.dpToPx(11);
    private static final int SIGN_IN_BG_MARGIN_END = ScreenUtils.dpToPx(17);
    private static final int SIGN_IN_BG_MARGIN_TOP = ScreenUtils.dpToPx(3);
    private static final int MUSIC_WIDTH = ScreenUtils.dpToPx(21);
    private static final int MUSIC_HEIGHT = ScreenUtils.dpToPx(21);
    private static final int MUSCI_MARGIN_END = ScreenUtils.dpToPx(17);
    private static final int VIP_LAYOUT_HEIGHT = ScreenUtils.dpToPx(200);
    private static final int VIP_LINE_WIDTH = ScreenUtils.dpToPx(60);
    private static final int VIP_LINE_MARGIN_TOP = ScreenUtils.dpToPx(18);
    private static final int VIP_STEP_WIDTH = ScreenUtils.dpToPx(300);
    private static final int BOTTOM_TIP_HEIGHT = 40;
    private static final int HOTBEAN_WIDTH = ScreenUtils.dpToPx(20);
    private static final int HOTBEAN_HEIGHT = ScreenUtils.dpToPx(20);
    private static final int HOTBEAN_MARGIN_END = ScreenUtils.dpToPx(17);
    private static final int HOTBEAN_MARGIN_TOP = ScreenUtils.dpToPx(3);


    // 当前页面的状态
    public static final int STATUS_LOADING = 1;         // 正在加载
    public static final int STATUS_FINISH = 2;          // 加载完成
    public static final int STATUS_ERROR = 3;           // 加载错误 (一般是网络加载情况)
    public static final int STATUS_EMPTY = 4;           // 空数据
    public static final int STATUS_PARING = 5;          // 正在解析 (装载本地数据)
    public static final int STATUS_PARSE_ERROR = 6;     // 本地文件解析错误(暂未被使用)
    public static final int STATUS_CATEGORY_EMPTY = 7;  // 获取到的目录为空
    // 默认的显示参数配置
    private static final int DEFAULT_MARGIN_HEIGHT = 33;
    private static final int DEFAULT_MARGIN_WIDTH = 15;
    private static final int DEFAULT_TIP_SIZE = 12;
    private static final int EXTRA_TITLE_SIZE = 4;

    // 当前章节列表
    protected List<TxtChapter> mChapterList;
    // 书本对象
    protected CollBookBean mCollBook;
    // 监听器
    protected OnPageChangeListener mPageChangeListener;

    private Context mContext;
    private Activity mActivity;
    // 页面显示类
    private PageView mPageView;
    // 当前显示的页
    private TxtPage mCurPage;
    // 上一章的页面列表缓存
    private List<TxtPage> mPrePageList;
    // 当前章节的页面列表
    private List<TxtPage> mCurPageList;
    // 下一章的页面列表缓存
    private List<TxtPage> mNextPageList;

    // 绘制电池的画笔
    private Paint mBatteryPaint;
    // 绘制提示的画笔
    private Paint mTipPaint;
    // 绘制标题的画笔
    private Paint mTitlePaint;
    // 绘制背景颜色的画笔(用来擦除需要重绘的部分)
    private Paint mBgPaint;
    // 绘制小说内容的画笔
    private TextPaint mTextPaint;
    // 阅读器的配置选项
    private ReadSettingManager mSettingManager;
    // 被遮盖的页，或者认为被取消显示的页
    private TxtPage mCancelPage;
    // 存储阅读记录类
    private BookRecordBean mBookRecord;

    private Disposable mPreLoadDisp;

    // 绘制签到画笔
    private Paint mSignInBgPaint;
    private RectF mSignInRect;
    private boolean mSignStatus = false;

    // 绘制音乐画笔
    private RectF mMusicRect;

    //绘制热豆画笔
    private RectF mHotbeanRect;

    // 绘制VIP提示画笔
    private TextPaint mVipTip3Paint;

    // 绘制广告背景的画笔
    private Paint mAdBgPaint;
    private Paint mAdTipPaint;
    private Paint mAdEx3TipPanint;
    private int mFontHeight;
    private SharedPreUtils mSharedPreUtils;

    // loading anim
    private ImageView mLoadingView;
    private AnimationDrawable mLoadingAnimationDrawable;

    // bottom ad
    private static final int MSG_MUSIC_PLAY = 1002;
    private static final int BOTTOM_AD_PEROID = 30 * 1000;
    private static final int BOTTOM_AD_HEIGHT = ScreenUtils.dpToPx(60);
//    private FrameLayout mBottomAdLayoutBg;
//    private FrameLayout mBottomAdLayout;
//    private ImageView mBottomAdPlaceView;
    private RecyclerView mMusicRecyclerView;
    private LinearLayout mMusicChangeAll;
    private ImageView mMusicChangeAllImage;
    private TextView mMusicChangeAllText;
    private ImageView mMusicPlayImage;
    private LinearLayout mMusicPlaySort;
    private ImageView mMusicPlaySortImage;
    private TextView mMusicPlaySortText;


    private ScheduledExecutorService mScheduled;
    private Handler mHander = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case MSG_MUSIC_PLAY:
                    playMusic(mSubMusic.get(0).getUrl());
                    break;
            }
        }
    };
    // night mask
    private FrameLayout mNightMask;
    // token
    private String mToken;
    private boolean isFront;
    // userFreeAdEndtime
    private int mUserFreeEndtime;
    // isVip
    private int isVip;
    // 是vip限免书籍，在限免时间段内可以读上锁章节，但不会干扰广告
    private boolean isVipFreeBook;
    /*****************params**************************/
    // 当前的状态
    protected int mStatus = STATUS_LOADING;
    // 判断章节列表是否加载完成
    protected boolean isChapterListPrepare;

    // 是否打开过章节
    private boolean isChapterOpen;
    private boolean isFirstOpen = true;
    private boolean isClose;
    // 页面的翻页效果模式
    private PageMode mPageMode;
    // 加载器的颜色主题
    private PageStyle mPageStyle;
    //当前是否是夜间模式
    private boolean isNightMode;
    //书籍绘制区域的宽高
    private int mVisibleWidth;
    private int mVisibleHeight;
    //应用的宽高
    private int mDisplayWidth;
    private int mDisplayHeight;
    //间距
    private int mMarginWidth;
    private int mMarginHeight;
    //字体的颜色
    private int mTextColor;
    //标题的大小
    private int mTitleSize;
    //字体的大小
    private int mTextSize;
    //行间距
    private int mTextInterval;
    //标题的行间距
    private int mTitleInterval;
    //段落距离(基于行间距的额外距离)
    private int mTextPara;
    private int mTitlePara;
    //电池的百分比
    private int mBatteryLevel;
    //当前页面的背景
    private int mBgColor;

    // 当前章
    protected int mCurChapterPos = 0;
    //上一章的记录
    private int mLastChapterPos = 0;

    //显示广告的章节
    public int mShowAdChapterPos = 0;
    //显示广告的页
    public int mShowAdPage = 0;
    //请求到广告的时间
    public long mAdGetTimestamp = 0;
    public long mAdShowTimestamp = 0;

    /*****************************init params*******************************/
    public PageLoader(PageView pageView, CollBookBean collBook) {
        mPageView = pageView;
        mContext = pageView.getContext();
        mActivity = pageView.getActivity();
        mCollBook = collBook;
        mChapterList = new ArrayList<>(1);
        mSharedPreUtils = SharedPreUtils.getInstance();


        //loading anim
        mLoadingView = mPageView.getLoadingView();

        //bottom ad layout
//        mBottomAdLayoutBg = mPageView.getBottomAdLayoutBg();
//        mBottomAdLayout = mBottomAdLayoutBg.findViewById(R.id.bottom_ad_layout);
        //chapter ad layout
        mChapterAdLayout = mPageView.getChapterAdLayout();

        //night mask
        mNightMask = mPageView.getNightMask();
        //token
        mToken = mPageView.getToken();
        //isVip
        isVip = mPageView.getUserIsVip();

        // userFreeEndtime
        mUserFreeEndtime = mPageView.getUserFreeAdEndtime();

        // music
        mMusicRecyclerView = mPageView.getMusicRecyclerView();
        mMusicChangeAll = mPageView.getMusicChangeAll();
        mMusicChangeAllImage = mPageView.getMusicChangeAllImage();
        mMusicChangeAllText = mPageView.getMusicChangeAllText();
        mMusicPlayImage = mPageView.getMusicPlayImage();
        mMusicPlaySort = mPageView.getMusicPlaySort();
        mMusicPlaySortImage = mPageView.getMusicPlaySortImage();
        mMusicPlaySortText = mPageView.getMusicPlaySortText();

        // VIP限免书籍
        checkBookFreeVip();

        // 初始化广告
        initAd();
        // 初始化签到相关
        initSign();
        // 初始化音乐相关
        initMusic();
        // 初始化广告相关
        checkBookShowAd();
        // 初始化数据
        initData();
        // 初始化画笔
        initPaint();
        // 初始化PageView
        initPageView();
        // 初始化书籍
        prepareBook();
    }

    private void initSign() {
        if (!TextUtils.isEmpty(mToken)) {
            if (NetworkUtils.isAvailable(mContext)) {
                JSONObject root = new JSONObject();
                try {
                    root.put("token", mToken);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                LogUtils.i("yy", "initSign() getTodaySign root=" + root);
                RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), root.toString());
                RemoteRepository.getInstance().getTodaySign(requestBody)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(new SingleObserver<SignStatusBean>() {
                            Disposable disposable;

                            @Override
                            public void onSubscribe(Disposable d) {
                                disposable = d;
                            }

                            @Override
                            public void onSuccess(SignStatusBean value) {
                                mSignStatus = value.getToday_is_sign();
                                disposable.dispose();
                            }

                            @Override
                            public void onError(Throwable e) {
                                LogUtils.i("yy", "initSign() getTodaySign onError e=" + e.toString());
                                disposable.dispose();
                            }
                        });
            }
        }
    }

    /////////////////////////////////////////////////////
    private static final int PLAY_SORT_ORDER = 1;
    private static final int PLAY_SORT_SINGLE_LOOP = 2;
    private int mPlaySort = PLAY_SORT_ORDER;
    public List<MusicBean.ListBean> mAllMusic = new ArrayList<>();
    private List<MusicBean.ListBean> mSubMusic = new ArrayList<>();
    private MusicAdapter mMusicAdapter;
    private MediaPlayer mMediaPlayer;
    private AudioManager mAudioManager;
    private MyOnAudioFocusChangeListener mAudioFocusListener;
    private boolean isAutoPauseMusic = false; //音乐正在播放时，按home键切到后台，值变为true；下次从后台切进来时，直接判断此标志，直接恢复播放
    private boolean isManualPauseMusic = false; //判断是否是用户点击暂停按钮暂停音乐
    private void initMusic() {
        // 单曲循环/顺序播放
        mMusicPlaySort.setOnClickListener(view->{
            if (mPlaySort == PLAY_SORT_ORDER) {
               mPlaySort = PLAY_SORT_SINGLE_LOOP;
               refreshPlaySort();
            } else {
                mPlaySort = PLAY_SORT_ORDER;
                refreshPlaySort();
            }
        });

        // 播放/暂停
        mMusicPlayImage.setOnClickListener(view->{
            if (mMediaPlayer.isPlaying()) {
                //*/ add umeng maidian
                HashMap<String,String> map = new HashMap<String,String>();
                map.put("book_id", "" + mCollBook.getId());
                MobclickAgent.onEvent(mContext, "book_read_bgm_btn_pause_clicked", map);
                //*/
                isManualPauseMusic = true;
                mMediaPlayer.pause();
                mMusicPlayImage.setBackground(mContext.getDrawable(R.drawable.ic_music_btn_play));
                SharedPreUtils.getInstance().setMusicPlayFeature(false);
            } else{
                int result = mAudioManager.requestAudioFocus(mAudioFocusListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
                LogUtils.i("yy","requestAudioFocus result="+result);
                if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
                    //若是用户手动点击暂停按钮暂停音乐，则点击播放后继续播放之前暂停的音乐；否则从头开始播放这首音乐
                    if (isManualPauseMusic) {
                        mMediaPlayer.start();
                    } else {
                        int select = mMusicAdapter.getSelect();
                        playMusic(mSubMusic.get(select).getUrl());
                    }

                    mMusicPlayImage.setBackground(mContext.getDrawable(R.drawable.ic_music_btn_pause));
                    SharedPreUtils.getInstance().setMusicPlayFeature(true);
                }

            }
            updateTime();
        });

        // 换一批
        mMusicChangeAll.setOnClickListener(view->{
            changeAllMusic();
        });

        LinearLayoutManager manager = new LinearLayoutManager(mContext);
        mMusicRecyclerView.setLayoutManager(manager);
        mMusicAdapter = new MusicAdapter(mContext, mSubMusic);
        mMusicAdapter.setOnItemClickLitener(new MusicAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position) {
                mMusicAdapter.setSelect(position);
                mMusicAdapter.notifyDataSetChanged();
                playMusic(mSubMusic.get(position).getUrl());
                SharedPreUtils.getInstance().setMusicPlayFeature(true);
            }

            @Override
            public void onItemChangeOneClick(View view, int position) {
                changeOneMusic(position);
            }
        });
        mMusicRecyclerView.setAdapter(mMusicAdapter);
        getAllMusicData();
        initMediaPlayer();
    }

    public void onResume() {
        LogUtils.i("yy","pageLoader-->onResume()");
        if (isAutoPauseMusic) {
            isAutoPauseMusic = false;
            mMediaPlayer.start();
            mMusicPlayImage.setBackground(mContext.getDrawable(R.drawable.ic_music_btn_pause));
            updateTime();
        }

        //获取当前用户阅读时长
        getTodayReadTs();

        //切换到前台开始阅读时长计时
        curPageReadTime = 0;
        totalReadTime = 0;
        mTodayReadTs = 0;
        mHander.postDelayed(mCurPageReadTimeRunnable, 1000);
        LogUtils.i("yy","onResume curPageReadTime="+curPageReadTime+",totalReadTime="+totalReadTime);
    }

    public void onPause() {
    LogUtils.i("yy","pageLoader-->onPause()");
        if(mMediaPlayer.isPlaying()) {
            isAutoPauseMusic = true;
            mMediaPlayer.pause();
            mMusicPlayImage.setBackground(mContext.getDrawable(R.drawable.ic_music_btn_play));
            updateTime();
        }
        //不在前台暂停阅读时长计时
        totalReadTime += curPageReadTime;
        mHander.removeCallbacks(mCurPageReadTimeRunnable);
        LogUtils.i("yy","onPause curPageReadTime="+curPageReadTime+",totalReadTime="+totalReadTime);
        MainApplication.getOpenNativePackage().openNativeModule.sendReadTimeEvent(totalReadTime);
    }

    private void initMediaPlayer() {
        mAudioManager = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
        mAudioFocusListener = new MyOnAudioFocusChangeListener();
        mMediaPlayer = new MediaPlayer();
        mMediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
            @Override
            public void onCompletion(MediaPlayer mediaPlayer) {
                LogUtils.i("yy","onCompletion");
                mMusicPlayImage.setBackground(mContext.getDrawable(R.drawable.ic_music_btn_play));
                updateTime();
                if (mPlaySort == PLAY_SORT_SINGLE_LOOP) {
                    int select = mMusicAdapter.getSelect();
                    playMusic(mSubMusic.get(select).getUrl());
                } else {
                    int originSelect = mMusicAdapter.getSelect();
                    int newSelect = (originSelect + 1) % mSubMusic.size();
                    mMusicAdapter.setSelect(newSelect);
                    mMusicAdapter.notifyDataSetChanged();
                    playMusic(mSubMusic.get(newSelect).getUrl());

                }
            }
        });
        mMediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener() {
            @Override
            public boolean onError(MediaPlayer mediaPlayer, int i, int i1) {
                LogUtils.i("yy","onError i="+i+",i1="+i1);
                return false;
            }
        });
    }

    private void changeAllMusic(){
        mSubMusic = CommonUtils.getRandomList(mAllMusic, 3);
        mMusicAdapter.setData(mSubMusic);
        mMusicAdapter.notifyDataSetChanged();
        refreshChangeAllStatus();

        int pos = mMusicAdapter.getSelect();
        if(mMediaPlayer.isPlaying()) {
            playMusic(mSubMusic.get(pos).getUrl());
        } else {
            prepareMusic(mSubMusic.get(pos).getUrl());
        }

    }

    private void changeOneMusic(int position) {
        List<MusicBean.ListBean> newMusic = CommonUtils.getRandomListFilter(mAllMusic, mSubMusic, 1);
        mSubMusic.set(position, newMusic.get(0));
        mMusicAdapter.setData(mSubMusic);
        mMusicAdapter.notifyDataSetChanged();
        refreshChangeAllStatus();

        if(mMusicAdapter.getSelect() == position) {
            if(mMediaPlayer.isPlaying()) {
                playMusic(mSubMusic.get(position).getUrl());
            } else {
                prepareMusic(mSubMusic.get(position).getUrl());
            }

        }
    }

    private void prepareMusic(String url) {
        try {
            mMediaPlayer.reset();
            mMediaPlayer.setDataSource(url);
            mMediaPlayer.prepare();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void playMusic(String url) {
        int result = mAudioManager.requestAudioFocus(mAudioFocusListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
        LogUtils.i("yy","playMusic requestAudioFocus result="+result);
        if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
            try {
                if(mMediaPlayer != null) {
                    mMediaPlayer.reset();
                    mMediaPlayer.setDataSource(url);
                    mMediaPlayer.prepare();
                    mMediaPlayer.start();
                    mMusicPlayImage.setBackground(mContext.getDrawable(R.drawable.ic_music_btn_pause));
                    updateTime();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void prepareMusicFirstPlay() {
        if(!mAudioManager.isMusicActive() && SharedPreUtils.getInstance().getMusicPlayFeature()) {
            mHander.sendEmptyMessageDelayed(MSG_MUSIC_PLAY, 1000);
        }
    }

    private void getAllMusicData(){
        if (NetworkUtils.isAvailable(mContext)) {
            JSONObject root = new JSONObject();
            try {
                root.put("book_id", mCollBook.getId());
                root.put("last_sort", 0);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            LogUtils.i("yy", "initMusic() getBgm root=" + root);
            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), root.toString());
            RemoteRepository.getInstance().getBgm(0, 0, requestBody)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(new SingleObserver<MusicBean>() {
                        Disposable disposable;

                        @Override
                        public void onSubscribe(Disposable d) {
                            disposable = d;
                        }

                        @Override
                        public void onSuccess(MusicBean value) {
                            mAllMusic = value.getList();
                            disposable.dispose();
                            LogUtils.i("yy","initMusic() mAllMusic.size()="+mAllMusic.size());
                            if (mAllMusic.size() > 0) {
                                mMusicAdapter.setHasMore(mAllMusic.size() > 3);
                                mSubMusic = CommonUtils.getRandomList(mAllMusic, 3);
                                mMusicAdapter.setData(mSubMusic);
                                refreshChangeAllStatus();
                                mMusicAdapter.setSelect(0);
                                mMusicAdapter.notifyDataSetChanged();
                                if(SharedPreUtils.getInstance().getBoolean(Constant.KEY_MUSIC_NETWORK_IS_FIRST, true)) {
                                    SharedPreUtils.getInstance().putBoolean(Constant.KEY_MUSIC_NETWORK_IS_FIRST, false);

                                    /*
                                    MusicNetworkChoiceDialog musicNetworkChoiceDialog = new MusicNetworkChoiceDialog(mContext);
                                    musicNetworkChoiceDialog.setOnClickListener(new MusicNetworkChoiceDialog.OnClickListener() {
                                        @Override
                                        public void onOkClick() {
                                            //wifi及无线数据
                                            SharedPreUtils.getInstance().putInt(Constant.KEY_MUSIC_NETWORK_CHOICE, Constant.MUSIC_NETWORK_CHOICE_WIFI_AND_MOBILE);
                                            musicNetworkChoiceDialog.dismiss();
                                            if (NetworkUtils.getNetworkType(mContext) == NetworkUtils.NETWORK_WIFI
                                                    || NetworkUtils.getNetworkType(mContext) == NetworkUtils.NETWORK_MOBILE) {
                                                prepareMusicFirstPlay();
                                            }
                                        }

                                        @Override
                                        public void onCancelClick() {
                                            //仅wifi
                                            SharedPreUtils.getInstance().putInt(Constant.KEY_MUSIC_NETWORK_CHOICE, Constant.MUSIC_NETWORK_CHOICE_WIFI);
                                            musicNetworkChoiceDialog.dismiss();
                                            if (NetworkUtils.getNetworkType(mContext) == NetworkUtils.NETWORK_WIFI) {
                                               prepareMusicFirstPlay();
                                            }
                                        }
                                    });
                                    musicNetworkChoiceDialog.show();
                                    */

                                    //默认wifi及无线数据
                                    SharedPreUtils.getInstance().putInt(Constant.KEY_MUSIC_NETWORK_CHOICE, Constant.MUSIC_NETWORK_CHOICE_WIFI_AND_MOBILE);
                                    if (NetworkUtils.getNetworkType(mContext) == NetworkUtils.NETWORK_WIFI
                                            || NetworkUtils.getNetworkType(mContext) == NetworkUtils.NETWORK_MOBILE) {
                                        prepareMusicFirstPlay();
                                    }

                                } else {
                                    int choice = SharedPreUtils.getInstance().getInt(Constant.KEY_MUSIC_NETWORK_CHOICE, Constant.MUSIC_NETWORK_CHOICE_WIFI);
                                    switch(choice) {
                                        case Constant.MUSIC_NETWORK_CHOICE_WIFI://仅wifi
                                            if (NetworkUtils.getNetworkType(mContext) == NetworkUtils.NETWORK_WIFI) {
                                                prepareMusicFirstPlay();
                                            }
                                            break;
                                        case Constant.MUSIC_NETWORK_CHOICE_WIFI_AND_MOBILE://wifi及无线数据
                                            if (NetworkUtils.getNetworkType(mContext) == NetworkUtils.NETWORK_WIFI
                                                || NetworkUtils.getNetworkType(mContext) == NetworkUtils.NETWORK_MOBILE) {
                                                prepareMusicFirstPlay();
                                            }
                                            break;
                                    }
                                    prepareMusicFirstPlay();

                                }

                            }

                        }

                        @Override
                        public void onError(Throwable e) {
                            LogUtils.i("yy", "initMusic() getTodaySign onError e=" + e.toString());
                            disposable.dispose();
                        }
                    });
        }
    }

    private class MyOnAudioFocusChangeListener implements AudioManager.OnAudioFocusChangeListener {
        @Override
        public void onAudioFocusChange(int focusChange) {
            LogUtils.i(TAG, "focusChange=" + focusChange);
        }
    }

    private void initData() {
        // 获取配置管理器
        mSettingManager = ReadSettingManager.getInstance();
        // 获取配置参数
        mPageMode = mSettingManager.getPageMode();
        mPageStyle = mSettingManager.getPageStyle();
        // 初始化参数
        mMarginWidth = ScreenUtils.dpToPx(DEFAULT_MARGIN_WIDTH);
        mMarginHeight = ScreenUtils.dpToPx(DEFAULT_MARGIN_HEIGHT);
        // 配置文字有关的参数
        setUpTextParams(mSettingManager.getTextSize());
    }

    /**
     * 作用：设置与文字相关的参数
     *
     * @param textSize
     */
    private void setUpTextParams(int textSize) {
        // 文字大小
        mTextSize = textSize;
        mTitleSize = mTextSize + ScreenUtils.spToPx(EXTRA_TITLE_SIZE);
        // 行间距(大小为字体的一半)
        mTextInterval = mTextSize / 2 + ScreenUtils.dpToPx(2);
        mTitleInterval = mTitleSize / 2;
        // 段落间距(大小为字体的高度)
        mTextPara = mTextSize;
        mTitlePara = mTitleSize;
    }

    private void initPaint() {
        // 绘制提示的画笔
        mTipPaint = new Paint();
        mTipPaint.setColor(ContextCompat.getColor(mContext, R.color.reader_tip));
        mTipPaint.setTextAlign(Paint.Align.LEFT); // 绘制的起始点
        mTipPaint.setTextSize(ScreenUtils.dpToPx(DEFAULT_TIP_SIZE)); // Tip默认的字体大小
        mTipPaint.setAntiAlias(true);
        mTipPaint.setSubpixelText(true);

        // 绘制页面内容的画笔
        mTextPaint = new TextPaint();
        mTextPaint.setColor(mTextColor);
        mTextPaint.setTextSize(mTextSize);
        mTextPaint.setAntiAlias(true);

        // 绘制标题的画笔
        mTitlePaint = new TextPaint();
        mTitlePaint.setColor(mTextColor);
        mTitlePaint.setTextSize(mTitleSize);
        mTitlePaint.setStyle(Paint.Style.FILL_AND_STROKE);
        mTitlePaint.setTypeface(Typeface.DEFAULT_BOLD);
        mTitlePaint.setAntiAlias(true);

        // 绘制背景的画笔
        mBgPaint = new Paint();
        mBgPaint.setColor(mBgColor);

        // 绘制电池的画笔
        mBatteryPaint = new Paint();
        mBatteryPaint.setAntiAlias(true);
        mBatteryPaint.setDither(true);

        //绘制VIP提示画笔
        mVipTip3Paint = new TextPaint();
        mVipTip3Paint.setColor(ContextCompat.getColor(mContext, R.color.vip_tip3));
        mVipTip3Paint.setTextSize(ScreenUtils.dpToPx(13));
        mVipTip3Paint.setAntiAlias(true);

        // 绘制签到背景的画笔
        mSignInBgPaint = new Paint();
        mSignInBgPaint.setStyle(Paint.Style.STROKE);
        mSignInBgPaint.setColor(ContextCompat.getColor(mContext,R.color.reader_tip));

        // 绘制广告背景的画笔
        mAdBgPaint = new Paint();
        mAdBgPaint.setTextSize(ScreenUtils.spToPx(16));
        mAdBgPaint.setColor(ContextCompat.getColor(mContext, R.color.white));
        // 绘制章节中广告tip的画笔
        mAdTipPaint = new Paint();
        mAdTipPaint.setTextSize(ScreenUtils.spToPx(13));
        mAdTipPaint.setTypeface(Typeface.DEFAULT_BOLD);
        //绘制章节中广告下方"看视频免15分钟广告>"画笔
        mAdEx3TipPanint = new Paint();
        mAdEx3TipPanint.setTextSize(ScreenUtils.spToPx(15));
        mAdEx3TipPanint.setAntiAlias(true);
        mAdEx3TipPanint.setColor(ContextCompat.getColor(mContext, R.color.ex_tip3));


        // 获取字体高度
        Paint.FontMetrics fontMetrics = mTextPaint.getFontMetrics();
        mFontHeight = (int) (fontMetrics.bottom - fontMetrics.top);

        // 初始化页面样式
        setNightMode(mSettingManager.isNightMode());
    }

    private void initPageView() {
        //配置参数
        mPageView.setPageMode(mPageMode);
        mPageView.setBgColor(mBgColor);
    }

    /****************************** public method***************************/
    /**
     * 跳转到上一章
     *
     * @return
     */
    public boolean skipPreChapter() {
        if (!hasPrevChapter()) {
            return false;
        }

        // 载入上一章。
        if (parsePrevChapter()) {
            mCurPage = getCurPage(0);
        } else {
            mCurPage = new TxtPage();
        }
        mPageView.drawCurPage(false);
        return true;
    }

    /**
     * 跳转到下一章
     *
     * @return
     */
    public boolean skipNextChapter() {
        if (!hasNextChapter()) {
            return false;
        }

        //判断是否达到章节的终止点
        if (parseNextChapter()) {
            mCurPage = getCurPage(0);
        } else {
            mCurPage = new TxtPage();
        }
        mPageView.drawCurPage(false);
        return true;
    }

    /**
     * 跳转到指定章节
     *
     * @param pos:从 0 开始。
     */
    public void skipToChapter(int pos) {
        // 设置参数
        mCurChapterPos = pos;

        // 将上一章的缓存设置为null
        mPrePageList = null;
        // 如果当前下一章缓存正在执行，则取消
        if (mPreLoadDisp != null) {
            mPreLoadDisp.dispose();
        }
        // 将下一章缓存设置为null
        mNextPageList = null;

        // 打开指定章节
        openChapter();
    }

    /**
     * 跳转到指定的页
     *
     * @param pos
     */
    public boolean skipToPage(int pos) {
        if (!isChapterListPrepare) {
            return false;
        }
        mCurPage = getCurPage(pos);
        mPageView.drawCurPage(false);
        return true;
    }

    /**
     * 翻到上一页
     *
     * @return
     */
    public boolean skipToPrePage() {
        return mPageView.autoPrevPage();
    }

    /**
     * 翻到下一页
     *
     * @return
     */
    public boolean skipToNextPage() {
        return mPageView.autoNextPage();
    }

    /**
     * 更新时间
     */
    public void updateTime() {
        if (!mPageView.isRunning()) {
            mPageView.drawCurPage(true);
        }
    }

    /**
     * 更新电量
     *
     * @param level
     */
    public void updateBattery(int level) {
        mBatteryLevel = level;

        if (!mPageView.isRunning()) {
            mPageView.drawCurPage(true);
        }
    }

    /**
     * 设置提示的文字大小
     *
     * @param textSize:单位为 px。
     */
    public void setTipTextSize(int textSize) {
        mTipPaint.setTextSize(textSize);

        // 如果屏幕大小加载完成
        mPageView.drawCurPage(false);
    }

    /**
     * 设置文字相关参数
     *
     * @param textSize
     */
    public void setTextSize(int textSize) {
        // 设置文字相关参数
        setUpTextParams(textSize);

        // 设置画笔的字体大小
        mTextPaint.setTextSize(mTextSize);
        // 设置标题的字体大小
        mTitlePaint.setTextSize(mTitleSize);
        // 存储文字大小
        mSettingManager.setTextSize(mTextSize);
        // 取消缓存
        mPrePageList = null;
        mNextPageList = null;

        // 获取字体高度
        Paint.FontMetrics fontMetrics = mTextPaint.getFontMetrics();
        mFontHeight = (int) (fontMetrics.bottom - fontMetrics.top);

        // 如果当前已经显示数据
        if (isChapterListPrepare && mStatus == STATUS_FINISH) {
            // 重新计算当前页面
            dealLoadPageList(mCurChapterPos);

            // 防止在最后一页，通过修改字体，以至于页面数减少导致崩溃的问题
            if (mCurPage.position >= mCurPageList.size()) {
                mCurPage.position = mCurPageList.size() - 1;
            }

            // 重新获取指定页面
            mCurPage = mCurPageList.get(mCurPage.position);
        }

        mPageView.drawCurPage(false);
    }

    /**
     * 设置夜间模式
     *
     * @param nightMode
     */
    public void setNightMode(boolean nightMode) {
        mSettingManager.setNightMode(nightMode);
        isNightMode = nightMode;

        if (isNightMode) {
            mAdTipPaint.setColor(ContextCompat.getColor(mContext, R.color.ad_tip_night));
            mBatteryPaint.setColor(Color.WHITE);
            setPageStyle(PageStyle.NIGHT);
            // night mask
            mNightMask.setVisibility(View.VISIBLE);
            // loading anim
            mLoadingView.setBackground(mContext.getResources().getDrawable(R.drawable.loading_night));

        } else {
            mAdTipPaint.setColor(ContextCompat.getColor(mContext, R.color.ad_tip));
            mBatteryPaint.setColor(Color.BLACK);
            setPageStyle(mPageStyle);
            // night mask
            mNightMask.setVisibility(View.GONE);
            // loading anim
            mLoadingView.setBackground(mContext.getResources().getDrawable(R.drawable.loading));
        }
        // music
        mMusicAdapter.setNightMode(isNightMode);
        refreshPlaySort();
        refreshChangeAllStatus();

        // loading anim
        mLoadingAnimationDrawable = (AnimationDrawable) mLoadingView.getBackground();
    }

    /**
     * 设置页面样式
     *
     * @param pageStyle:页面样式
     */
    public void setPageStyle(PageStyle pageStyle) {
//        if (pageStyle != PageStyle.NIGHT) {
//            mPageStyle = pageStyle;
//            mSettingManager.setPageStyle(pageStyle);
//        }

        if (pageStyle != PageStyle.NIGHT) {
            mSettingManager.setLastPageStyle(pageStyle);
        }
        mPageStyle = pageStyle;
        mSettingManager.setPageStyle(pageStyle);

        if (isNightMode && pageStyle != PageStyle.NIGHT) {
            return;
        }

        // 设置当前颜色样式
        mTextColor = ContextCompat.getColor(mContext, pageStyle.getFontColor());
        mBgColor = ContextCompat.getColor(mContext, pageStyle.getBgColor());

        mTitlePaint.setColor(mTextColor);
        mTextPaint.setColor(mTextColor);

        mBgPaint.setColor(mBgColor);

        // bottom ad
//        if (mSharedPreUtils.getAdStatus()) {
//            mBottomAdLayoutBg.setBackgroundColor(mBgColor);
//        } else {
//            changeBottomAdBgColor();
//        }


        mPageView.drawCurPage(false);
    }

    /**
     * 翻页动画
     *
     * @param pageMode:翻页模式
     * @see PageMode
     */
    public void setPageMode(PageMode pageMode) {
        mPageMode = pageMode;

        mPageView.setPageMode(mPageMode);
        mSettingManager.setPageMode(mPageMode);

        // 重新绘制当前页
        mPageView.drawCurPage(false);
    }

    /**
     * 设置内容与屏幕的间距
     *
     * @param marginWidth  :单位为 px
     * @param marginHeight :单位为 px
     */
    public void setMargin(int marginWidth, int marginHeight) {
        mMarginWidth = marginWidth;
        mMarginHeight = marginHeight;

        // 如果是滑动动画，则需要重新创建了
        if (mPageMode == PageMode.SCROLL) {
            mPageView.setPageMode(PageMode.SCROLL);
        }

        mPageView.drawCurPage(false);
    }

    /**
     * 设置页面切换监听
     *
     * @param listener
     */
    public void setOnPageChangeListener(OnPageChangeListener listener) {
        mPageChangeListener = listener;

        // 如果目录加载完之后才设置监听器，那么会默认回调
        if (isChapterListPrepare) {
            mPageChangeListener.onCategoryFinish(mChapterList);
        }
    }

    /**
     * 获取当前页的状态
     *
     * @return
     */
    public int getPageStatus() {
        return mStatus;
    }

    /**
     * 获取书籍信息
     *
     * @return
     */
    public CollBookBean getCollBook() {
        return mCollBook;
    }

    /**
     * 获取章节目录。
     *
     * @return
     */
    public List<TxtChapter> getChapterCategory() {
        return mChapterList;
    }

    /**
     * 获取当前页的页码
     *
     * @return
     */
    public int getPagePos() {
        return mCurPage.position;
    }

    /**
     * 获取当前页
     */
    public TxtPage getCurPage() {
        return mCurPage;
    }

    /**
     * 获取当前章节的章节位置
     *
     * @return
     */
    public int getChapterPos() {
        return mCurChapterPos;
    }

    /**
     * 获取距离屏幕的高度
     *
     * @return
     */
    public int getMarginHeight() {
        return mMarginHeight;
    }

    /**
     * 保存阅读记录
     */
    public void saveRecord() {

        if (mChapterList.isEmpty()) {
            return;
        }

        mBookRecord.setBookId(mCollBook.getId());
        mBookRecord.setChapter(mCurChapterPos);

        if (mCurPage != null) {
            mBookRecord.setPagePos(mCurPage.position);
        } else {
            mBookRecord.setPagePos(0);
        }

        //存储到数据库
        BookRepository.getInstance()
                .saveBookRecord(mBookRecord);
    }

    /**
     * 初始化书籍
     */
    private void prepareBook() {
        mBookRecord = BookRepository.getInstance()
                .getBookRecord(mCollBook.getId());

        if (mBookRecord == null) {
            mBookRecord = new BookRecordBean();
        }

        if (mCollBook.getSpecialChapterPos() == -1) {
            mCurChapterPos = mBookRecord.getChapter();
        } else {
            mCurChapterPos = mCollBook.getSpecialChapterPos();
        }

        mLastChapterPos = mCurChapterPos;
    }

    /**
     * 打开指定章节
     */
    public void openChapter() {
        isFirstOpen = false;

        if (!mPageView.isPrepare()) {
            return;
        }

        // 如果章节目录没有准备好
        if (!isChapterListPrepare) {
            mStatus = STATUS_LOADING;
            mPageView.drawCurPage(false);
            return;
        }

        // 如果获取到的章节目录为空
        if (mChapterList.isEmpty()) {
            mStatus = STATUS_CATEGORY_EMPTY;
            mPageView.drawCurPage(false);
            return;
        }

        if (parseCurChapter()) {
            // 如果章节从未打开
            if (!isChapterOpen) {
                int position = mBookRecord.getPagePos();
                if (mCollBook.getSpecialChapterPos() != -1) {
                    position = 0;
                }

                // 防止记录页的页号，大于当前最大页号
                if (position >= mCurPageList.size()) {
                    position = mCurPageList.size() - 1;
                }

                mCurPage = getCurPage(position);
                mCancelPage = mCurPage;
                // 切换状态
                isChapterOpen = true;
            } else {
                mCurPage = getCurPage(0);
            }
        } else {
            mCurPage = new TxtPage();
        }

        mPageView.drawCurPage(false);
    }

    public void chapterError() {
        //加载错误
        mStatus = STATUS_ERROR;
        mPageView.drawCurPage(false);
    }

    /**
     * 关闭书本
     */
    public void closeBook() {
        LogUtils.i("yy", "closeBook()");
        isChapterListPrepare = false;
        isClose = true;

        if (mScheduled != null) {
            mScheduled.shutdown();
            mScheduled = null;
        }

        if (mPreLoadDisp != null) {
            mPreLoadDisp.dispose();
        }

        clearList(mChapterList);
        clearList(mCurPageList);
        clearList(mNextPageList);

        if (mPageView != null) {
            mPageView.removeCallbacks(mResetAdRunnable);
            mPageView.removeCallbacks(mResetShowAdRunnable);
        }

        mChapterList = null;
        mCurPageList = null;
        mNextPageList = null;
        mPageView = null;
        mCurPage = null;

        // music
        if(mMediaPlayer != null) {
            mMediaPlayer.stop();
            mMediaPlayer.release();
        }
        mAudioManager.abandonAudioFocus(mAudioFocusListener);
        mHander.removeCallbacksAndMessages(null);

        //tt ad sdk
        if(mTTInfoAd != null){
            mTTInfoAd.destroy();
        }
        if(mTTBannerAd != null){
            mTTBannerAd.destroy();
        }


        //gdt ad
        destroyAd();
//        if (bv != null) {
//            bv.destroy();
//        }

    }

    private void clearList(List list) {
        if (list != null) {
            list.clear();
        }
    }

    public boolean isClose() {
        return isClose;
    }

    public boolean isChapterOpen() {
        return isChapterOpen;
    }

    /**
     * 加载页面列表
     *
     * @param chapterPos:章节序号
     * @return
     */
    private List<TxtPage> loadPageList(int chapterPos) throws Exception {
        // 获取章节
        TxtChapter chapter = mChapterList.get(chapterPos);
        // 判断章节是否存在
        if (!hasChapterData(chapter)) {
            return null;
        }
        // 获取章节的文本流
        BufferedReader reader = getChapterReader(chapter);
        List<TxtPage> chapters;
        if(!isVipFreeBook && chapter.getIsvip() == 1 && isVip == 0) {// 若当前章节是vip章节，且用户没有开通vip
            chapters = loadVipPages(chapter, reader);
        } else {
            chapters = loadPages(chapter, reader);
        }
        return chapters;
    }

    /*******************************abstract method***************************************/

    /**
     * 刷新章节列表
     */
    public abstract void refreshChapterList();

    /**
     * 获取章节的文本流
     *
     * @param chapter
     * @return
     */
    protected abstract BufferedReader getChapterReader(TxtChapter chapter) throws Exception;

    /**
     * 章节数据是否存在
     *
     * @return
     */
    protected abstract boolean hasChapterData(TxtChapter chapter);

    /***********************************default method***********************************************/

    void drawPage(Bitmap bitmap, boolean isUpdate) {
        drawBackground(mPageView.getBgBitmap(), isUpdate);
        if (!isUpdate) {
            drawContent(bitmap);
        }
        //更新绘制
        mPageView.invalidate();
    }

    private void drawBackground(Bitmap bitmap, boolean isUpdate) {
        Canvas canvas = new Canvas(bitmap);
        int tipMarginHeight = ScreenUtils.dpToPx(11);
        if (!isUpdate) {
            /****绘制背景****/
            canvas.drawColor(mBgColor);

            if (!mChapterList.isEmpty()) {
                /*****初始化标题的参数********/
                //需要注意的是:绘制text的y的起始点是text的基准线的位置，而不是从text的头部的位置
                float tipTop = tipMarginHeight - mTipPaint.getFontMetrics().top;
                //根据状态不一样，数据不一样
                if (mStatus != STATUS_FINISH) {
                    if (isChapterListPrepare) {
                        canvas.drawText(mChapterList.get(mCurChapterPos).getTitle()
                                , mMarginWidth, tipTop, mTipPaint);
                    }
                } else {
                    canvas.drawText(mCurPage.title, mMarginWidth, tipTop, mTipPaint);
                }

                /******绘制页码********/
                // 底部的字显示的位置Y
                float y = mDisplayHeight - mTipPaint.getFontMetrics().bottom - tipMarginHeight;
                // 只有finish的时候采用页码
                if (mStatus == STATUS_FINISH) {
                    String percent = (mCurPage.position + 1) + "/" + mCurPageList.size();
                    canvas.drawText(percent, mMarginWidth, y, mTipPaint);
                }
            }
        } else {
            //擦除区域
            mBgPaint.setColor(mBgColor);
            canvas.drawRect(mDisplayWidth / 2, mDisplayHeight - mMarginHeight + ScreenUtils.dpToPx(2), mDisplayWidth, mDisplayHeight, mBgPaint);
        }

        /******绘制签到******/
//        LogUtils.i("yy","drawBackground() mToken="+mToken+",mSignStatus="+mSignStatus);
//        int ovalLeft = mDisplayWidth - SIGN_IN_BG_WIDTH - SIGN_IN_BG_MARGIN_END;
//        int ovalTop = ScreenUtils.dpToPx(6);
//        int ovalRight = ovalLeft + SIGN_IN_BG_WIDTH;
//        int ovalBottom = ovalTop + SIGN_IN_BG_HEIGHT;
//        mSignInRect = new RectF(ovalLeft, ovalTop, ovalRight, ovalBottom);
//        //擦除区域
//        mBgPaint.setColor(mBgColor);
//        canvas.drawRect(mSignInRect.left, mSignInRect.top,mSignInRect.right,mSignInRect.bottom + 1, mBgPaint);//bottom + 1为了移除底部残余
//
//        if(TextUtils.isEmpty(mToken) || mSignStatus == false) {
//            canvas.drawRoundRect(mSignInRect, SIGN_IN_BG_RADIUS, SIGN_IN_BG_RADIUS, mSignInBgPaint);
//            float textLeft = mDisplayWidth - SIGN_IN_BG_WIDTH -SIGN_IN_BG_MARGIN_END + SIGN_IN_BG_RADIUS;
//            float textTop = ovalTop - mTipPaint.getFontMetrics().top + SIGN_IN_BG_MARGIN_TOP;
//            canvas.drawText("签到", textLeft, textTop, mTipPaint);
//        } else {
//            canvas.drawRoundRect(mSignInRect, SIGN_IN_BG_RADIUS, SIGN_IN_BG_RADIUS, mSignInBgPaint);
//            float textLeft = mDisplayWidth - SIGN_IN_BG_WIDTH -SIGN_IN_BG_MARGIN_END + SIGN_IN_BG_RADIUS;
//            float textTop = ovalTop - mTipPaint.getFontMetrics().top + SIGN_IN_BG_MARGIN_TOP;
//            canvas.drawText("已签", textLeft, textTop, mTipPaint);
//        }

        /******绘制热豆******/
        int hotbeanLeft = mDisplayWidth - HOTBEAN_WIDTH - HOTBEAN_MARGIN_END;
        int hotbeanTop = ScreenUtils.dpToPx(6);
        int hotbeanRight = hotbeanLeft + HOTBEAN_WIDTH;
        int hotbeanBottom = hotbeanTop + HOTBEAN_HEIGHT;
        mHotbeanRect = new RectF(hotbeanLeft, hotbeanTop, hotbeanRight, hotbeanBottom);
        //擦除区域
        mBgPaint.setColor(mBgColor);
        canvas.drawRect(mHotbeanRect.left, mHotbeanRect.top,mHotbeanRect.right,mHotbeanRect.bottom + 1, mBgPaint);//bottom + 1为了移除底部残余

        Bitmap hotbeanBitmap = BitmapFactory.decodeResource(mContext.getResources(), R.drawable.hotbean);
        canvas.drawBitmap(hotbeanBitmap, null, mHotbeanRect, mBgPaint);

        /******绘制音乐******/
        int musicLeft = mDisplayWidth - SIGN_IN_BG_WIDTH - SIGN_IN_BG_MARGIN_END - MUSIC_WIDTH - MUSCI_MARGIN_END;
        int musicTop = ScreenUtils.dpToPx(6);
        int musicRight = musicLeft + MUSIC_WIDTH;
        int musicBottom = musicTop + MUSIC_HEIGHT;
        mMusicRect = new RectF(musicLeft, musicTop, musicRight, musicBottom);
        //擦除区域
        mBgPaint.setColor(mBgColor);
        canvas.drawRect(mMusicRect.left, mMusicRect.top,mMusicRect.right,mMusicRect.bottom + 1, mBgPaint);//bottom + 1为了移除底部残余

        if (mAllMusic.size() > 0) {
            Bitmap musicBitmap;
            if(mMediaPlayer.isPlaying()) {
                musicBitmap = BitmapFactory.decodeResource(mContext.getResources(), R.drawable.ic_music_play);
            } else {
                musicBitmap = BitmapFactory.decodeResource(mContext.getResources(), R.drawable.ic_music_pause);
            }

            canvas.drawBitmap(musicBitmap, null, mMusicRect, mBgPaint);
        }

        /******绘制电池********/

        int visibleRight = mDisplayWidth - mMarginWidth;
        int visibleBottom = mDisplayHeight - tipMarginHeight;

        int outFrameWidth = (int) mTipPaint.measureText("xxx");
        int outFrameHeight = (int) mTipPaint.getTextSize();

        int polarHeight = ScreenUtils.dpToPx(6);
        int polarWidth = ScreenUtils.dpToPx(2);
        int border = 1;
        int innerMargin = 1;

        //电极的制作
        int polarLeft = visibleRight - polarWidth;
        int polarTop = visibleBottom - (outFrameHeight + polarHeight) / 2;
        Rect polar = new Rect(polarLeft, polarTop, visibleRight,
                polarTop + polarHeight - ScreenUtils.dpToPx(2));

        mBatteryPaint.setStyle(Paint.Style.FILL);
        canvas.drawRect(polar, mBatteryPaint);

        //外框的制作
        int outFrameLeft = polarLeft - outFrameWidth;
        int outFrameTop = visibleBottom - outFrameHeight;
        int outFrameBottom = visibleBottom - ScreenUtils.dpToPx(2);
        Rect outFrame = new Rect(outFrameLeft, outFrameTop, polarLeft, outFrameBottom);

        mBatteryPaint.setStyle(Paint.Style.STROKE);
        mBatteryPaint.setStrokeWidth(border);
        canvas.drawRect(outFrame, mBatteryPaint);

        //内框的制作
        float innerWidth = (outFrame.width() - innerMargin * 2 - border) * (mBatteryLevel / 100.0f);
        RectF innerFrame = new RectF(outFrameLeft + border + innerMargin, outFrameTop + border + innerMargin,
                outFrameLeft + border + innerMargin + innerWidth, outFrameBottom - border - innerMargin);

        mBatteryPaint.setStyle(Paint.Style.FILL);
        canvas.drawRect(innerFrame, mBatteryPaint);

        /******绘制当前时间********/
        //底部的字显示的位置Y
        float y = mDisplayHeight - mTipPaint.getFontMetrics().bottom - tipMarginHeight;
        String time = StringUtils.dateConvert(System.currentTimeMillis(), Constant.FORMAT_TIME);
        float x = outFrameLeft - mTipPaint.measureText(time) - ScreenUtils.dpToPx(4);
        canvas.drawText(time, x, y, mTipPaint);
    }

    private void drawContent(Bitmap bitmap) {
        Canvas canvas = new Canvas(bitmap);

        if (mPageMode == PageMode.SCROLL) {
            canvas.drawColor(mBgColor);
        }
        /******绘制内容****/

        if (mStatus != STATUS_FINISH) {
            //绘制字体
            String tip = "";
            switch (mStatus) {
                case STATUS_LOADING:
//                    tip = "正在拼命加载中...";
                    showLoading();
                    break;
                case STATUS_ERROR:
                    tip = "加载失败(点击边缘重试)";
                    hideLoading();
                    break;
                case STATUS_EMPTY:
                    tip = "文章内容为空";
                    hideLoading();
                    break;
                case STATUS_PARING:
                    tip = "正在排版请等待...";
                    hideLoading();
                    break;
                case STATUS_PARSE_ERROR:
                    tip = "文件解析错误";
                    hideLoading();
                    break;
                case STATUS_CATEGORY_EMPTY:
                    tip = "目录列表为空";
                    hideLoading();
                    break;
            }

            //将提示语句放到正中间
            Paint.FontMetrics fontMetrics = mTextPaint.getFontMetrics();
            float textHeight = fontMetrics.top - fontMetrics.bottom;
            float textWidth = mTextPaint.measureText(tip);
            float pivotX = (mDisplayWidth - textWidth) / 2;
            float pivotY = (mDisplayHeight - textHeight) / 2;
            canvas.drawText(tip, pivotX, pivotY, mTextPaint);
        } else {
            totalReadTime += curPageReadTime;
            mHander.removeCallbacks(mCurPageReadTimeRunnable);
//            LogUtils.i("yy","drawContent curPageReadTime="+curPageReadTime+",totalReadTime="+totalReadTime);
            curPageReadTime = 0;
            //重新开始计时
            mHander.postDelayed(mCurPageReadTimeRunnable, 1000);

            float top;
            hideLoading();
            if (mPageMode == PageMode.SCROLL) {
                top = -mTextPaint.getFontMetrics().top;
            } else {
                top = mMarginHeight - mTextPaint.getFontMetrics().top;
            }

            //设置总距离
            int interval = mTextInterval + (int) mTextPaint.getTextSize();
            int para = mTextPara + (int) mTextPaint.getTextSize();
            int titleInterval = mTitleInterval + (int) mTitlePaint.getTextSize();
            int titlePara = mTitlePara + (int) mTextPaint.getTextSize();
            String str = null;

            //对标题进行绘制
            for (int i = 0; i < mCurPage.titleLines; ++i) {
                str = mCurPage.lines.get(i);

                //设置顶部间距
                if (i == 0) {
                    top += mTitlePara;
                }

                //计算文字显示的起始点
                int start = mMarginWidth;//(int) (mDisplayWidth - mTitlePaint.measureText(str)) / 2;
                //进行绘制
                canvas.drawText(str, start, top, mTitlePaint);

                //设置尾部间距
                if (i == mCurPage.titleLines - 1) {
                    top += titlePara;
                } else {
                    //行间距
                    top += titleInterval;
                }
            }

            //对内容进行绘制
            for (int i = mCurPage.titleLines; i < mCurPage.lines.size(); ++i) {
                str = mCurPage.lines.get(i);

                canvas.drawText(str, mMarginWidth, top, mTextPaint);
                if (str.endsWith("\n")) {
                    top += para;
                } else {
                    top += interval;
                }
            }

            //对VIP进行绘制
            if(mCurPage.isVip) {
                drawVipContent(canvas);
            }

//            mChapterAdLayout.setVisibility(View.INVISIBLE);
            //对广告进行绘制
            if (mSharedPreUtils.getAdStatus()) {
                if (mCurPage.hasChapterLastAd) { // 对章节末广告进行绘制

                    //看视频免30分钟广告区域
                    mCurPage.adEx1Left = (mDisplayWidth - CHAPTER_LAST_AD_EX1_WIDTH) / 2;
                    mCurPage.adEx1Top = top + ScreenUtils.dpToPx(12);
                    mCurPage.adEx1Right = mCurPage.adEx1Left + CHAPTER_LAST_AD_EX1_WIDTH;
                    mCurPage.adEx1Bottom = mCurPage.adEx1Top + CHAPTER_LAST_AD_EX1_HEIGHT;
                    Bitmap ex1ViewBitmap = BitmapUtils.getViewBitmap(getAdEx1View());
                    if (ex1ViewBitmap != null) {
                        canvas.drawBitmap(ex1ViewBitmap, mCurPage.adEx1Left, mCurPage.adEx1Top, mAdBgPaint);
                    }

                    //规则说明区域
                    String ex2Tip = mContext.getResources().getString(R.string.ad_ex2_tip);
                    Paint.FontMetrics fontMetrics = mTextPaint.getFontMetrics();
                    float textHeight = fontMetrics.bottom - fontMetrics.top;
                    float textWidth = mTextPaint.measureText(ex2Tip);
                    float pivotX = (mDisplayWidth - textWidth) / 2;
                    mCurPage.adEx2Left = pivotX;
                    mCurPage.adEx2Top = mCurPage.adEx1Bottom + ScreenUtils.dpToPx(12);
                    mCurPage.adEx2Right = mCurPage.adEx2Left + textWidth;
                    mCurPage.adEx2Bottom = mCurPage.adEx2Top + textHeight;
                    canvas.drawText(ex2Tip, mCurPage.adEx2Left, mCurPage.adEx2Top - fontMetrics.top, mTextPaint);

                } else if (mCurPage.hasChapterAd) {// 对章节中广告进行绘制
                    mShowAdChapterPos = mCurChapterPos;
                    mShowAdPage = mCurPage.position;
                    mAdShowTimestamp = mAdGetTimestamp;
                    mCurPage.adView = mChapterAdLayout;
                    if (mChapterAdLayout.getChildCount() > 0) {
                        //广点通的广告背景色为透明，增加白色背景色
                        mChapterAdLayout.getChildAt(0).setBackgroundColor(Color.parseColor("#ffffff"));
                        Bitmap viewBitmap = BitmapUtils.getViewBitmap(mChapterAdLayout.getChildAt(0));
//                        LogUtils.i(TAG,"drawContent-->viewBitmap="+viewBitmap+",childCount="+mChapterAdLayout.getChildCount()+",position="+mCurPage.position);
                        if(viewBitmap != null){
                            int chapterAdWidth = viewBitmap.getWidth();
                            int chapterAdHeight = viewBitmap.getHeight();
                            LogUtils.i(TAG,"drawContent-->chapterAdHeight="+chapterAdHeight+",chapterAdWidth="+chapterAdWidth);

                            if(chapterAdHeight < chapterAdWidth){//若是横屏广告
                                if(chapterAdWidth < mDisplayWidth/2){//修复广点通广告获取宽高太小的问题
                                    chapterAdWidth = ScreenUtils.dpToPx(chapterAdWidth);
                                    chapterAdHeight = ScreenUtils.dpToPx(chapterAdHeight);
                                    mHander.postDelayed(()->{
                                        if(mPageView!= null){
                                            LogUtils.i(TAG,"广点通广告尺寸异常，30ms后重绘");
                                            mPageView.drawCurPage(false);
                                        }
                                    },30);
                                    LogUtils.i(TAG,"==================>校准广点通广告宽高 chapterAdWidth="+chapterAdWidth+",chapterAdHeight="+chapterAdHeight);
                                }
                            }

                            mChapterAdMarginTop = (mDisplayHeight - chapterAdHeight - ScreenUtils.dpToPx(60)) / 2; //60dp是底部的tip预留高度，兼容长屏手机
                            mCurPage.adLeft = (mDisplayWidth - chapterAdWidth) / 2;
                            mCurPage.adTop = mChapterAdMarginTop;
                            mCurPage.adRight = mCurPage.adLeft + chapterAdWidth;
                            mCurPage.adBottom = mCurPage.adTop + chapterAdHeight;
                            canvas.drawBitmap(viewBitmap, mCurPage.adLeft, mCurPage.adTop, mAdBgPaint);
//                            LogUtils.i(TAG,"drawContent-->adLeft="+mCurPage.adLeft+",adTop="+mCurPage.adTop);

                            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams)mChapterAdLayout.getLayoutParams();
                            params.topMargin = (int)mCurPage.adTop;
                            params.leftMargin = (int)mCurPage.adLeft;
                            mChapterAdLayout.setLayoutParams(params);


                            //login tip
                            if (TextUtils.isEmpty(mToken)) {
                                Bitmap adLoginViewBitmap = BitmapUtils.getViewBitmap(getAdLoginView());
                                if (adLoginViewBitmap != null) {
                                    int adLoginTipHeight = adLoginViewBitmap.getHeight();
                                    mCurPage.adLoginTipLeft = (mDisplayWidth - CHAPTER_AD_LOGIN_TIP_WIDTH) / 2;
                                    mCurPage.adLoginTipTop = mCurPage.adBottom + ScreenUtils.dpToPx(12);
                                    mCurPage.adLoginTipRight = mCurPage.adLoginTipLeft + CHAPTER_AD_LOGIN_TIP_WIDTH;
                                    mCurPage.adLoginTipBottom = mCurPage.adLoginTipTop + adLoginTipHeight;
                                    canvas.drawBitmap(adLoginViewBitmap, mCurPage.adLoginTipLeft, mCurPage.adLoginTipTop, mAdBgPaint);
                                }
                            }else{
                                //看视频免15分钟广告
                                String ex2Tip = mContext.getResources().getString(R.string.ad_ex3_tip);
                                Paint.FontMetrics fontMetrics = mAdEx3TipPanint.getFontMetrics();
                                float textHeight = fontMetrics.bottom - fontMetrics.top;
                                float textWidth = mAdEx3TipPanint.measureText(ex2Tip);
                                float pivotX = (mDisplayWidth - textWidth) / 2;
                                mCurPage.adEx1Left = pivotX;
                                mCurPage.adEx1Top = mCurPage.adBottom + ScreenUtils.dpToPx(12);
                                mCurPage.adEx1Right = mCurPage.adEx1Left + textWidth;
                                mCurPage.adEx1Bottom = mCurPage.adEx1Top + textHeight;
                                canvas.drawText(ex2Tip, mCurPage.adEx1Left, mCurPage.adEx1Top - fontMetrics.top, mAdEx3TipPanint);
                            }
                        }else{
                            LogUtils.i(TAG,"drawContent()-->viewBitmap= null");
                        }
                    }
                    //top
//                    String adTip = mContext.getResources().getString(R.string.ad_tip);
//                    Paint.FontMetrics fontMetrics = mTextPaint.getFontMetrics();
//                    float textHeight = fontMetrics.bottom - fontMetrics.top;
//                    float textWidth = mTextPaint.measureText(adTip);
//                    float pivotX = ScreenUtils.dpToPx(21);
//                    mCurPage.adTipLeft = pivotX;
//                    mCurPage.adTipTop = mCurPage.adTop - ScreenUtils.dpToPx(12) - textHeight;
//                    mCurPage.adTipRight = mCurPage.adTipLeft + textWidth;
//                    mCurPage.adTipBottom = mCurPage.adTipTop + textHeight;
//                    canvas.drawText(adTip, mCurPage.adTipLeft, mCurPage.adTipTop - fontMetrics.top, mAdTipPaint);
                }
            }

        }
    }

    void prepareDisplay(int w, int h) {
        // 获取PageView的宽高
        mDisplayWidth = w;
        mDisplayHeight = h;

        // 获取内容显示位置的大小
        mVisibleWidth = mDisplayWidth - mMarginWidth * 2;
        mVisibleHeight = mDisplayHeight - mMarginHeight * 2;
        // 重置 PageMode
        mPageView.setPageMode(mPageMode);

        if (!isChapterOpen) {
            // 展示加载界面
            mPageView.drawCurPage(false);
            // 如果在 display 之前调用过 openChapter 肯定是无法打开的。
            // 所以需要通过 display 再重新调用一次。
            if (!isFirstOpen) {
                // 打开书籍
                openChapter();
            }
        } else {
            // 如果章节已显示，那么就重新计算页面
            if (mStatus == STATUS_FINISH) {
                dealLoadPageList(mCurChapterPos);
                // 重新设置文章指针的位置
                // 防止在最后一页，因调整正文区域高度，以至于页面数减少导致崩溃的问题
                if (mCurPage.position >= mCurPageList.size()) {
                    mCurPage.position = mCurPageList.size() - 1;
                }
                mCurPage = getCurPage(mCurPage.position);
            }
            mPageView.drawCurPage(false);
        }
    }

    /**
     * 翻阅上一页
     *
     * @return
     */
    boolean prev() {
        // 以下情况禁止翻页
        if (!canTurnPage()) {
            return false;
        }

        if (mStatus == STATUS_FINISH) {
            // 先查看是否存在上一页
            TxtPage prevPage = getPrevPage();
            if (prevPage != null) {
                mCancelPage = mCurPage;
                mCurPage = prevPage;
                mPageView.drawNextPage();
                return true;
            }
        }

        if (!hasPrevChapter()) {
            LogUtils.i("yy","prev");
            if(!CommonUtils.isFastClick()) {
                Toast.makeText(mContext, R.string.tip_first_page, Toast.LENGTH_SHORT).show();
            }
            return false;
        }

        mCancelPage = mCurPage;
        if (parsePrevChapter()) {
            mCurPage = getPrevLastPage();
        } else {
            mCurPage = new TxtPage();
        }
        mPageView.drawNextPage();
        return true;
    }

    /**
     * 解析上一章数据
     *
     * @return:数据是否解析成功
     */
    boolean parsePrevChapter() {
        // 加载上一章数据
        int prevChapter = mCurChapterPos - 1;

        mLastChapterPos = mCurChapterPos;
        mCurChapterPos = prevChapter;

        // 当前章缓存为下一章
        mNextPageList = mCurPageList;

        // 判断是否具有上一章缓存
        if (mPrePageList != null) {
            mCurPageList = mPrePageList;
            mPrePageList = null;

            // 回调
            chapterChangeCallback();
        } else {
            dealLoadPageList(prevChapter);
        }
        return mCurPageList != null ? true : false;
    }

    private boolean hasPrevChapter() {
        //判断是否上一章节为空
        if (mCurChapterPos - 1 < 0) {
            return false;
        }
        return true;
    }

    /**
     * 翻到下一页
     *
     * @return:是否允许翻页
     */
    boolean next() {
        // 以下情况禁止翻页
        if (!canTurnPage()) {
            return false;
        }

        if (mStatus == STATUS_FINISH) {
            // 先查看是否存在下一页
            TxtPage nextPage = getNextPage();
            if (nextPage != null) {
                mCancelPage = mCurPage;
                mCurPage = nextPage;
                mPageView.drawNextPage();

//                LogUtils.i(TAG,"next()-----------> 00 mCancelPage.hasChapterAd="+mCancelPage.hasChapterAd+",count="+mChapterAdLayout.getChildCount());
                if(mChapterAdLayout.getChildCount() == 0){
//                    LogUtils.i(TAG,"next()-----------> 11");
                    loadChapterAd();
                }else{
                    if(mCurChapterPos == mShowAdChapterPos){//若在同一章节，判断position
//                        LogUtils.i(TAG,"next()-----------> 33 mCurPageList.size()="+mCurPageList.size()+",mShowAdPage+5="+(mShowAdPage + 5)+",mCurPage.position="+mCurPage.position+",mShowAdPage+2="+(mShowAdPage + 2));
                        if((mCurPageList.size() >= mShowAdPage + 5)&&(mCurPage.position == mShowAdPage + 2)){
                            LogUtils.i(TAG,"next()----------->同一章节加载广告");
                            loadChapterAd();
                        }
                    }

                }
                return true;
            }
        }

        if (!hasNextChapter()) {
            if(!CommonUtils.isFastClick()) {
                Toast.makeText(mContext, R.string.tip_last_page, Toast.LENGTH_SHORT).show();
                MainApplication.getOpenNativePackage().openNativeModule.sendSyncFinishReadBookEvent("onSyncFinishReadBook", mCollBook.getId());
            }

            return false;
        }

        mCancelPage = mCurPage;
//        LogUtils.i(TAG,"next()-----------> 22");
        // 解析下一章数据
        if (parseNextChapter()) {
            mCurPage = mCurPageList.get(0);
        } else {
            mCurPage = new TxtPage();
        }
        mPageView.drawNextPage();

//        LogUtils.i(TAG,"next()-----------> 222 mCurChapterPos="+mCurChapterPos+",mShowAdChapterPos="+mShowAdChapterPos);
        if(mCurChapterPos > mShowAdChapterPos){//若在下一章节，在下一章节第一页请求广告
//            LogUtils.i(TAG,"next()------------>2222 mAdShowTimestamp="+mAdShowTimestamp+",mAdGetTimestamp="+mAdGetTimestamp);
            if(mCurPage.position == 0 && mAdShowTimestamp == mAdGetTimestamp){
                LogUtils.i(TAG,"next()-->新章节第一页加载广告");
                loadChapterAd();
            }
        }


        return true;
    }

    private boolean hasNextChapter() {
        // 判断是否到达目录最后一章
        if (mCurChapterPos + 1 >= mChapterList.size()) {
            return false;
        }
        return true;
    }

    boolean parseCurChapter() {
        // 解析数据
        dealLoadPageList(mCurChapterPos);
        // 预加载下一页面
//        preLoadNextChapter();
        return mCurPageList != null ? true : false;
    }

    /**
     * 解析下一章数据
     *
     * @return:返回解析成功还是失败
     */
    boolean parseNextChapter() {
        int nextChapter = mCurChapterPos + 1;

        mLastChapterPos = mCurChapterPos;
        mCurChapterPos = nextChapter;

        // 将当前章的页面列表，作为上一章缓存
        mPrePageList = mCurPageList;

        // 是否下一章数据已经预加载了
        if (mNextPageList != null) {
            mCurPageList = mNextPageList;
            mNextPageList = null;
            // 回调
            chapterChangeCallback();
        } else {
            // 处理页面解析
            dealLoadPageList(nextChapter);
        }
        // 预加载下一页面
        preLoadNextChapter();
        return mCurPageList != null ? true : false;
    }

    private void dealLoadPageList(int chapterPos) {
        try {
            mCurPageList = loadPageList(chapterPos);
            if (mCurPageList != null) {
                if (mCurPageList.isEmpty()) {
                    mStatus = STATUS_EMPTY;

                    // 添加一个空数据
                    TxtPage page = new TxtPage();
                    page.lines = new ArrayList<>(1);
                    mCurPageList.add(page);
                } else {
                    mStatus = STATUS_FINISH;
                }
            } else {
                mStatus = STATUS_LOADING;
            }
        } catch (Exception e) {
            e.printStackTrace();

            mCurPageList = null;
            mStatus = STATUS_ERROR;
        }

        // 回调
        chapterChangeCallback();
    }

    private void chapterChangeCallback() {
        if (mPageChangeListener != null) {
            mPageChangeListener.onChapterChange(mCurChapterPos);
            mPageChangeListener.onPageCountChange(mCurPageList != null ? mCurPageList.size() : 0);
        }
    }

    // 预加载下一章
    private void preLoadNextChapter() {
        int nextChapter = mCurChapterPos + 1;

        // 如果不存在下一章，且下一章没有数据，则不进行加载。
        if (!hasNextChapter()
                || !hasChapterData(mChapterList.get(nextChapter))) {
            return;
        }

        //如果之前正在加载则取消
        if (mPreLoadDisp != null) {
            mPreLoadDisp.dispose();
        }

        //调用异步进行预加载加载
        Single.create(new SingleOnSubscribe<List<TxtPage>>() {
            @Override
            public void subscribe(SingleEmitter<List<TxtPage>> e) throws Exception {
                e.onSuccess(loadPageList(nextChapter));
            }
        }).compose(RxUtils::toSimpleSingle)
                .subscribe(new SingleObserver<List<TxtPage>>() {
                    @Override
                    public void onSubscribe(Disposable d) {
                        mPreLoadDisp = d;
                    }

                    @Override
                    public void onSuccess(List<TxtPage> pages) {
                        mNextPageList = pages;
                    }

                    @Override
                    public void onError(Throwable e) {
                        //无视错误
                    }
                });
    }

    // 取消翻页
    void pageCancel() {
        if (mCurPage.position == 0 && mCurChapterPos > mLastChapterPos) { // 加载到下一章取消了
            if (mPrePageList != null) {
                cancelNextChapter();
            } else {
                if (parsePrevChapter()) {
                    mCurPage = getPrevLastPage();
                } else {
                    mCurPage = new TxtPage();
                }
            }
        } else if (mCurPageList == null
                || (mCurPage.position == mCurPageList.size() - 1
                && mCurChapterPos < mLastChapterPos)) {  // 加载上一章取消了

            if (mNextPageList != null) {
                cancelPreChapter();
            } else {
                if (parseNextChapter()) {
                    mCurPage = mCurPageList.get(0);
                } else {
                    mCurPage = new TxtPage();
                }
            }
        } else {
            // 假设加载到下一页，又取消了。那么需要重新装载。
            mCurPage = mCancelPage;
        }
    }

    private void cancelNextChapter() {
        int temp = mLastChapterPos;
        mLastChapterPos = mCurChapterPos;
        mCurChapterPos = temp;

        mNextPageList = mCurPageList;
        mCurPageList = mPrePageList;
        mPrePageList = null;

        chapterChangeCallback();

        mCurPage = getPrevLastPage();
        mCancelPage = null;
    }

    private void cancelPreChapter() {
        // 重置位置点
        int temp = mLastChapterPos;
        mLastChapterPos = mCurChapterPos;
        mCurChapterPos = temp;
        // 重置页面列表
        mPrePageList = mCurPageList;
        mCurPageList = mNextPageList;
        mNextPageList = null;

        chapterChangeCallback();

        mCurPage = getCurPage(0);
        mCancelPage = null;
    }

    /**************************************private method********************************************/
    /**
     * 将章节数据，解析成页面列表
     *
     * @param chapter：章节信息
     * @param br：章节的文本流
     * @return
     */
    private List<TxtPage> loadPages(TxtChapter chapter, BufferedReader br) {
        //生成的页面
        List<TxtPage> pages = new ArrayList<>();
        //使用流的方式加载
        List<String> lines = new ArrayList<>();
        int rHeight = mVisibleHeight;
        int titleLinesCount = 0;
        boolean showTitle = true; // 是否展示标题
        String paragraph = chapter.getTitle();//默认展示标题
        int curPage = 0;
        try {
            while (showTitle || (paragraph = br.readLine()) != null) {
                paragraph = StringUtils.convertCC(paragraph, mContext);
                // 重置段落
                if (!showTitle) {
                    paragraph = paragraph.replaceAll("\\s", "");
                    // 如果只有换行符，那么就不执行
                    if (paragraph.equals("")) continue;
                    paragraph = StringUtils.halfToFull("  " + paragraph + "\n");
                } else {
                    //设置 title 的顶部间距
                    rHeight -= mTitlePara;
                }
                int wordCount = 0;
                String subStr = null;
                while (paragraph.length() > 0) {
                    //当前空间，是否容得下一行文字
                    if (showTitle) {
                        rHeight -= mTitlePaint.getTextSize();
                    } else {
                        rHeight -= mTextPaint.getTextSize();
                    }
                    // 一页已经填充满了，创建 TextPage
                    if (rHeight <= 0) {
                        // 创建Page
                        TxtPage page = new TxtPage();
                        page.position = pages.size();
                        page.title = StringUtils.convertCC(chapter.getTitle(), mContext);
                        page.lines = new ArrayList<>(lines);
                        page.titleLines = titleLinesCount;
                        pages.add(page);
                        // 重置Lines
                        lines.clear();
                        rHeight = mVisibleHeight;
                        titleLinesCount = 0;

                        //添加章节中广告
                        if (mSharedPreUtils.getAdStatus() && mChapterAdLayout.getChildCount() > 0 && pages.size() == curPage + 5) {
                            TxtPage adPage = new TxtPage();
                            adPage.position = pages.size();
                            adPage.title = StringUtils.convertCC(chapter.getTitle(), mContext);
                            adPage.lines = new ArrayList<>();
                            adPage.titleLines = titleLinesCount;
                            adPage.hasChapterAd = true;
                            LogUtils.i(TAG, "loadPages-->adPage title="+adPage.title+",position="+adPage.position);
                            pages.add(adPage);
                            curPage = pages.size();
                        }
                        continue;
                    }

                    //测量一行占用的字节数
                    if (showTitle) {
                        wordCount = mTitlePaint.breakText(paragraph,
                                true, mVisibleWidth, null);
                    } else {
                        wordCount = mTextPaint.breakText(paragraph,
                                true, mVisibleWidth, null);
                    }

                    subStr = paragraph.substring(0, wordCount);
                    if (!subStr.equals("\n")) {
                        //将一行字节，存储到lines中
                        lines.add(subStr);

                        //设置段落间距
                        if (showTitle) {
                            titleLinesCount += 1;
                            rHeight -= mTitleInterval;
                        } else {
                            rHeight -= mTextInterval;
                        }
                    }
                    //裁剪
                    paragraph = paragraph.substring(wordCount);
                }

                //增加段落的间距
                if (!showTitle && lines.size() != 0) {
                    rHeight = rHeight - mTextPara + mTextInterval;
                }

                if (showTitle) {
                    rHeight = rHeight - mTitlePara + mTitleInterval;
                    showTitle = false;
                }
            }

            if (lines.size() != 0) {
                int lastAdHeight = /*CHAPTER_LAST_AD_HEIGHT +*/ BOTTOM_TIP_HEIGHT + ScreenUtils.dpToPx(12) * 2 + CHAPTER_LAST_AD_EX1_HEIGHT + mFontHeight;
                if (mSharedPreUtils.getAdStatus() && mShowAd && rHeight > lastAdHeight) {
                    //创建Page
                    TxtPage page = new TxtPage();
                    page.position = pages.size();
                    page.title = StringUtils.convertCC(chapter.getTitle(), mContext);
                    page.lines = new ArrayList<>(lines);
                    page.titleLines = titleLinesCount;
                    page.hasChapterLastAd = true;
                    pages.add(page);
                } else {
                    //创建Page
                    TxtPage page = new TxtPage();
                    page.position = pages.size();
                    page.title = StringUtils.convertCC(chapter.getTitle(), mContext);
                    page.lines = new ArrayList<>(lines);
                    page.titleLines = titleLinesCount;
                    pages.add(page);
                }

                //重置Lines
                lines.clear();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            IOUtils.close(br);
        }
        return pages;
    }

    private List<TxtPage> loadVipPages(TxtChapter chapter, BufferedReader br) {
        //生成的页面
        List<TxtPage> pages = new ArrayList<>();
        //使用流的方式加载
        List<String> lines = new ArrayList<>();
        int rHeight = mVisibleHeight;
        int titleLinesCount = 0;
        boolean showTitle = true; // 是否展示标题
        String paragraph = chapter.getTitle();//默认展示标题
        int curPage = 0;
        try {
            while (showTitle || (paragraph = br.readLine()) != null && pages.size() < 1) {
                paragraph = StringUtils.convertCC(paragraph, mContext);
                // 重置段落
                if (!showTitle) {
                    paragraph = paragraph.replaceAll("\\s", "");
                    // 如果只有换行符，那么就不执行
                    if (paragraph.equals("")) continue;
                    paragraph = StringUtils.halfToFull("  " + paragraph + "\n");
                } else {
                    //设置 title 的顶部间距
                    rHeight -= mTitlePara;
                }
                int wordCount = 0;
                String subStr = null;
                while (paragraph.length() > 0) {
                    //当前空间，是否容得下一行文字
                    if (showTitle) {
                        rHeight -= mTitlePaint.getTextSize();
                    } else {
                        rHeight -= mTextPaint.getTextSize();
                    }
                    // 一页已经填充满了，创建 TextPage
                    if (rHeight <= VIP_LAYOUT_HEIGHT) {
                        // 创建Page
                        TxtPage page = new TxtPage();
                        page.position = pages.size();
                        page.title = StringUtils.convertCC(chapter.getTitle(), mContext);
                        page.lines = new ArrayList<>(lines);
                        page.titleLines = titleLinesCount;
                        page.isVip = true;
                        pages.add(page);
                        // 重置Lines
                        lines.clear();
                        rHeight = mVisibleHeight;
                        titleLinesCount = 0;
                        break;
                    }

                    //测量一行占用的字节数
                    if (showTitle) {
                        wordCount = mTitlePaint.breakText(paragraph,
                                true, mVisibleWidth, null);
                    } else {
                        wordCount = mTextPaint.breakText(paragraph,
                                true, mVisibleWidth, null);
                    }

                    subStr = paragraph.substring(0, wordCount);
                    if (!subStr.equals("\n")) {
                        //将一行字节，存储到lines中
                        lines.add(subStr);

                        //设置段落间距
                        if (showTitle) {
                            titleLinesCount += 1;
                            rHeight -= mTitleInterval;
                        } else {
                            rHeight -= mTextInterval;
                        }
                    }
                    //裁剪
                    paragraph = paragraph.substring(wordCount);
                }

                //增加段落的间距
                if (!showTitle && lines.size() != 0) {
                    rHeight = rHeight - mTextPara + mTextInterval;
                }

                if (showTitle) {
                    rHeight = rHeight - mTitlePara + mTitleInterval;
                    showTitle = false;
                }
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            IOUtils.close(br);
        }
        return pages;
    }


    /**
     * @return:获取初始显示的页面
     */
    private TxtPage getCurPage(int pos) {
        if (mPageChangeListener != null) {
            mPageChangeListener.onPageChange(pos);
        }
        return mCurPageList.get(pos);
    }

    /**
     * @return:获取上一个页面
     */
    private TxtPage getPrevPage() {
        int pos = mCurPage.position - 1;
        if (pos < 0) {
            return null;
        }
        if (mPageChangeListener != null) {
            mPageChangeListener.onPageChange(pos);
        }
        return mCurPageList.get(pos);
    }

    /**
     * @return:获取下一的页面
     */
    private TxtPage getNextPage() {
        int pos = mCurPage.position + 1;
        if (pos >= mCurPageList.size()) {
            return null;
        }
        if (mPageChangeListener != null) {
            mPageChangeListener.onPageChange(pos);
        }
        return mCurPageList.get(pos);
    }

    /**
     * @return:获取上一个章节的最后一页
     */
    private TxtPage getPrevLastPage() {
        int pos = mCurPageList.size() - 1;

        if (mPageChangeListener != null) {
            mPageChangeListener.onPageChange(pos);
        }

        return mCurPageList.get(pos);
    }

    /**
     * 根据当前状态，决定是否能够翻页
     *
     * @return
     */
    private boolean canTurnPage() {

        if (!isChapterListPrepare) {
            return false;
        }

        if (mStatus == STATUS_PARSE_ERROR
                || mStatus == STATUS_PARING) {
            return false;
        } else if (mStatus == STATUS_ERROR) {
            mStatus = STATUS_LOADING;
        }
        return true;
    }

    /*****************************************interface*****************************************/

    public interface OnPageChangeListener {
        /**
         * 作用：章节切换的时候进行回调
         *
         * @param pos:切换章节的序号
         */
        void onChapterChange(int pos);

        /**
         * 作用：请求加载章节内容
         *
         * @param requestChapters:需要下载的章节列表
         */
        void requestChapters(List<TxtChapter> requestChapters);

        /**
         * 作用：章节目录加载完成时候回调
         *
         * @param chapters：返回章节目录
         */
        void onCategoryFinish(List<TxtChapter> chapters);

        /**
         * 作用：章节页码数量改变之后的回调。==> 字体大小的调整，或者是否关闭虚拟按钮功能都会改变页面的数量。
         *
         * @param count:页面的数量
         */
        void onPageCountChange(int count);

        /**
         * 作用：当页面改变的时候回调
         *
         * @param pos:当前的页面的序号
         */
        void onPageChange(int pos);
    }


    //加载所有广告
    private void loadAllAd(){
        loadChapterAd();
        loadRewardVideoAd();
//        mHander.post(mFetchBottomAdRunnable);
    }


    //加载章节中信息流模板广告
    private boolean requestChapterAding = false;
    private void loadChapterAd() {
        LogUtils.i(TAG,"loadChapterAd-->000");
        if(mShowAd && mSharedPreUtils.getAdStatus()){
            if(requestChapterAding){//当前正在请求广告的话，暂停后续请求
                LogUtils.i(TAG,"loadChapterAd-->requestChapterAding = true, stop request ad");
                return;
            }

            int adType = CommonUtils.getRandomAdType();
            LogUtils.i(TAG,"loadChapterAd adType="+adType);
            switch(adType){
                case Constant.AD_TYPE_TT:
                    if(CommonUtils.randVerticalAd()){
                        loadTTExpressInfoAd(CommonUtils.getTTAdInfo3SlotId(), true);//竖屏视频
                    }else{
                        loadTTExpressInfoAd(CommonUtils.getTTAdInfo1SlotId(), false);//上图下文
                    }

                    break;
                case Constant.AD_TYPE_GDT:
                    loadGDTExpressInfoAd(CommonUtils.getGDTAdInfo1SlotId());
                    break;
            }
        }
    }
    //加载底部banner广告
//    private void loadBottomAd(){
//        if(mShowAd && mSharedPreUtils.getAdStatus()){
//            int adType = CommonUtils.getRandomAdType();
//            LogUtils.i(TAG,"loadChapterAd adType="+adType);
//            switch(adType){
//                case Constant.AD_TYPE_TT:
//                    loadTTExpressBannerAd(Constant.TT_AD_BANNER_SLOT_ID);
//                    break;
//                case Constant.AD_TYPE_GDT:
//                    loadGDTExpressBannerAd(Constant.GDT_AD_BANNER_SLOT_ID);
//                    break;
//            }
//        }
//    }
//    private Runnable mFetchBottomAdRunnable = new Runnable() {
//        @Override
//        public void run() {
//            loadBottomAd();
//            mHander.postDelayed(mFetchBottomAdRunnable, 30*1000);
//        }
//    };


    //加载激励视频广告
    private int curLoadRewardVideoType = 0;
    private void loadRewardVideoAd(){
        if(mShowAd && mSharedPreUtils.getAdStatus()){
            int adType = CommonUtils.getRandomAdType();
            LogUtils.i(TAG,"loadChapterAd adType="+adType);
            curLoadRewardVideoType = adType;
            switch(adType){
                case Constant.AD_TYPE_TT:
                    loadTTRewardVideoAd(CommonUtils.getTTAdRewardSlotId());
                    break;
                case Constant.AD_TYPE_GDT:
                    loadGDTRewardVideoAd(CommonUtils.getGDTAdRewardSlotId());
                    break;
            }
        }
    }
    //显示激励视频广告
    public void showRewardVideo(){
        switch(curLoadRewardVideoType){
            case Constant.AD_TYPE_TT:
                showTTRewardVideoAd();
                break;
            case Constant.AD_TYPE_GDT:
                showGDTRewardVideoAd();
                break;
            default:
                Toast.makeText(mContext, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
                break;
        }
    }


    //广点通信息流模板广告2.0
    private NativeExpressAD2 mNativeExpressAD2;
    private NativeExpressADData2 mNativeExpressADData2;
    private List<NativeExpressADData2> mNativeExpressADDatasList = new ArrayList<>();
    private void loadGDTExpressInfoAd(String codeId) {
        LogUtils.i(TAG,"loadGDTExpressInfoAd-->codeId="+codeId);
        requestChapterAding = true;
//        mChapterAdLayout.removeAllViews();
        mNativeExpressAD2 = new NativeExpressAD2(mContext, codeId, new NativeExpressAD2.AdLoadListener() {
            @Override
            public void onNoAD(AdError error) {
                String errorMsg = String
                        .format("onNoAD, error code: %d, error msg: %s", error.getErrorCode(), error.getErrorMsg());
                LogUtils.i(TAG, "onNoAD: " + errorMsg);
//                mChapterAdLayout.removeAllViews();
                requestChapterAding = false;
            }

            @Override
            public void onLoadSuccess(List<NativeExpressADData2> adDataList) {
                LogUtils.i(TAG,"onLoadSuccess adDataList.size="+adDataList.size());
                renderAd(adDataList);
            }
        });
        int expressViewWidth = (int)Util.getScreenWidthDp(mContext);//600;
        int expressViewHeight = 0;
        LogUtils.i(TAG,"loadGDTExpressInfoAd expressViewWidth="+expressViewWidth);
        mNativeExpressAD2.setAdSize(expressViewWidth, expressViewHeight); // 单位dp

        // 如果您在平台上新建原生模板广告位时，选择了支持视频，那么可以进行个性化设置（可选）
        VideoOption2.Builder builder = new VideoOption2.Builder();
        /**
         * 如果广告位支持视频广告，强烈建议在调用loadData请求广告前设置setAutoPlayPolicy，有助于提高视频广告的eCPM值 <br/>
         * 如果广告位仅支持图文广告，则无需调用
         */
        builder.setAutoPlayPolicy(getValueFromInt(VideoOption2.AutoPlayPolicy.WIFI.getPolicy())) // WIFI 环境下可以自动播放视频
                .setAutoPlayMuted(true) // 自动播放时为静音
                .setDetailPageMuted(false)  // 视频详情页播放时不静音
                .setMaxVideoDuration(0) // 设置返回视频广告的最大视频时长（闭区间，可单独设置），单位:秒，默认为 0 代表无限制，合法输入为：5<=maxVideoDuration<=60. 此设置会影响广告填充，请谨慎设置
                .setMinVideoDuration(0); // 设置返回视频广告的最小视频时长（闭区间，可单独设置），单位:秒，默认为 0 代表无限制， 此设置会影响广告填充，请谨慎设置
        mNativeExpressAD2.setVideoOption2(builder.build());
        mNativeExpressAD2.loadAd(1);
    }

    public static VideoOption2.AutoPlayPolicy getValueFromInt(int value) {
        VideoOption2.AutoPlayPolicy[] enums = VideoOption2.AutoPlayPolicy.values();
        for (VideoOption2.AutoPlayPolicy policy : enums) {
            if (value == policy.getPolicy()) {
                return policy;
            }
        }
        return VideoOption2.AutoPlayPolicy.WIFI;
    }

    /**
     * 渲染广告
     * @param adDataList
     */
    private void renderAd(List<NativeExpressADData2> adDataList) {
        if (adDataList.size() > 0) {
            mNativeExpressADData2 = adDataList.get(0);
            LogUtils.i(TAG, "renderAd: " + "  eCPM level = " +
                    mNativeExpressADData2.getECPMLevel() + "  Video duration: " + mNativeExpressADData2.getVideoDuration());
            mNativeExpressADData2.setAdEventListener(new AdEventListener() {
                @Override
                public void onClick() {
                    LogUtils.i(TAG, "onClick: " + mNativeExpressADData2);
                }

                @Override
                public void onExposed() {
                    LogUtils.i(TAG,"===========================>广点通广告展示上报");
                    mPageView.drawCurPage(false);
//                    mHander.postDelayed(()->{
//                        if(mPageView != null){
//                            mPageView.drawCurPage(false);
//                        }
//                    },1000);
                }

                @Override
                public void onRenderSuccess() {
                    LogUtils.i(TAG, "onRenderSuccess: " + mNativeExpressADData2);
                    mNativeExpressADDatasList.add(mNativeExpressADData2);
                    if(mNativeExpressADDatasList.size() >= 2){
                        LogUtils.i(TAG,"==========================>remove first gdt ad");
                        NativeExpressADData2 first = mNativeExpressADDatasList.get(0);
                        mNativeExpressADDatasList.remove(0);
                        if(first != null){
                            first.destroy();
                        }
                    }

                    mChapterAdLayout.removeAllViews();
                    if (mNativeExpressADData2.getAdView() != null) {
                        LogUtils.i(TAG,"===========================>广点通广告渲染成功");
                        mChapterAdLayout.addView(mNativeExpressADData2.getAdView());
                        mAdGetTimestamp = System.currentTimeMillis();
                    }
                    requestChapterAding = false;
                }

                @Override
                public void onRenderFail() {
                    LogUtils.i(TAG,"===========================>广点通广告渲染失败");
                    requestChapterAding = false;
                }

                @Override
                public void onAdClosed() {
                    LogUtils.i(TAG, "onAdClosed: " + mNativeExpressADData2);
//                    mChapterAdLayout.removeAllViews();
//                    mNativeExpressADData2.destroy();
//                    mPageView.drawCurPage(false);
                }
            });

            mNativeExpressADData2.setMediaListener(new MediaEventListener() {
                @Override
                public void onVideoCache() {
                    LogUtils.i(TAG, "onVideoCache: " + mNativeExpressADData2);
                }

                @Override
                public void onVideoStart() {
                    LogUtils.i(TAG, "onVideoStart: " + mNativeExpressADData2);
                }

                @Override
                public void onVideoResume() {
                    LogUtils.i(TAG, "onVideoResume: " + mNativeExpressADData2);
                }

                @Override
                public void onVideoPause() {
                    LogUtils.i(TAG, "onVideoPause: " + mNativeExpressADData2);
                }

                @Override
                public void onVideoComplete() {
                    LogUtils.i(TAG, "onVideoComplete: " + mNativeExpressADData2);
                }

                @Override
                public void onVideoError() {
                    LogUtils.i(TAG, "onVideoError: " + mNativeExpressADData2);
                }
            });

            mNativeExpressADData2.render();
        }
    }

    /**
     *  释放前一个 NativeExpressAD2Data 的资源
     */
    private void destroyAd() {
        if (mNativeExpressADData2 != null) {
            LogUtils.d(TAG, "destroyAD");
            mNativeExpressADData2.destroy();
        }
    }

    //广点通banner模板广告
//    private UnifiedBannerView bv;
//    private void loadGDTExpressBannerAd(String codeId){
//        if(bv != null){
//            mBottomAdLayout.removeView(bv);
//            bv.destroy();
//        }
//        bv = new UnifiedBannerView(mActivity, codeId, new UnifiedBannerADListener() {
//            @Override
//            public void onNoAD(AdError adError) {
//                String msg = String.format(Locale.getDefault(), "onNoAD, error code: %d, error msg: %s",
//                        adError.getErrorCode(), adError.getErrorMsg());
//                LogUtils.i(TAG,"loadGDTExpressBannerAd-->onNoAD msg="+msg);
//            }
//
//            @Override
//            public void onADReceive() {
//                LogUtils.i(TAG,"loadGDTExpressBannerAd-->onADReceive");
//            }
//
//            @Override
//            public void onADExposure() {
//                LogUtils.i(TAG,"loadGDTExpressBannerAd-->onADExposure height="+bv.getHeight());
//            }
//
//            @Override
//            public void onADClosed() {
//                LogUtils.i(TAG,"loadGDTExpressBannerAd-->onADClosed");
//                if(bv != null){
//                    mBottomAdLayout.removeView(bv);
//                    bv.destroy();
//                    mHander.removeCallbacks(mFetchBottomAdRunnable);
//                    mHander.postDelayed(mFetchBottomAdRunnable,60*1000);
//                }
//            }
//
//            @Override
//            public void onADClicked() {
//                LogUtils.i(TAG,"loadGDTExpressBannerAd-->onADClicked");
//            }
//
//            @Override
//            public void onADLeftApplication() {
//                LogUtils.i(TAG,"loadGDTExpressBannerAd-->onADLeftApplication");
//            }
//
//            @Override
//            public void onADOpenOverlay() {
//                LogUtils.i(TAG,"loadGDTExpressBannerAd-->onADOpenOverlay");
//            }
//
//            @Override
//            public void onADCloseOverlay() {
//                LogUtils.i(TAG,"loadGDTExpressBannerAd-->onADCloseOverlay");
//            }
//        });
//        bv.setRefresh(0);//0:不自动轮播
//        mBottomAdLayout.removeAllViews();
//        mBottomAdLayout.addView(bv, getUnifiedBannerLayoutParams());
//        bv.loadAD();
//    }
//
//    /**
//     * banner2.0规定banner宽高比应该为6.4:1 , 开发者可自行设置符合规定宽高比的具体宽度和高度值
//     *
//     * @return
//     */
//    private FrameLayout.LayoutParams getUnifiedBannerLayoutParams() {
//        Point screenSize = new Point();
//        mActivity.getWindowManager().getDefaultDisplay().getSize(screenSize);
//        return new FrameLayout.LayoutParams(screenSize.x,  Math.round(screenSize.x / 6.4F));
//    }

    //广点通激励视频广告
    private RewardVideoAD rewardVideoAD;
    private boolean adLoaded;//广告加载成功标志
    private void loadGDTRewardVideoAd(String codeId){
        boolean volumeOn = false;
        rewardVideoAD = new RewardVideoAD(mActivity, codeId, new RewardVideoADListener() {
            @Override
            public void onADLoad() {
                adLoaded = true;
                String msg = "load ad success ! expireTime = " + new Date(System.currentTimeMillis() +
                        rewardVideoAD.getExpireTimestamp() - SystemClock.elapsedRealtime());
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onADLoad msg="+msg);
            }

            @Override
            public void onVideoCached() {
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onVideoCached");

            }

            @Override
            public void onADShow() {
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onADShow");
            }

            @Override
            public void onADExpose() {
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onADExpose");
            }

            @Override
            public void onReward() {
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onReward");
            }

            @Override
            public void onADClick() {
                Map<String, String> map = rewardVideoAD.getExts();
                String clickUrl = map.get("clickUrl");
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onADClick clickUrl="+clickUrl);
            }

            @Override
            public void onVideoComplete() {
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onVideoComplete");
                dealRewardVerify();
            }

            @Override
            public void onADClose() {
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onADClose");
            }

            @Override
            public void onError(AdError adError) {
                String msg = String.format(Locale.getDefault(), "onError, error code: %d, error msg: %s",
                        adError.getErrorCode(), adError.getErrorMsg());
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onError msg="+msg);
            }
        }, volumeOn);
        adLoaded = false;
        // 2. 加载激励视频广告
        rewardVideoAD.loadAD();
    }

    private void showGDTRewardVideoAd(){
        if (adLoaded && rewardVideoAD != null) {
            //广告展示检查1：广告成功加载，此处也可以使用videoCached来实现视频预加载完成后再展示激励视频广告的逻辑
            if (!rewardVideoAD.hasShown()) {//广告展示检查2：当前广告数据还没有展示过
                long delta = 1000;//建议给广告过期时间加个buffer，单位ms，这里demo采用1000ms的buffer
                //广告展示检查3：展示广告前判断广告数据未过期
                if (SystemClock.elapsedRealtime() < (rewardVideoAD.getExpireTimestamp() - delta)) {
                    rewardVideoAD.showAD(mActivity);
                } else {
                    LogUtils.i(TAG,"showGDTRewardVideoAd-->激励视频广告已过期，请再次请求广告后进行广告展示！");
                    Toast.makeText(mContext, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
//                    Toast.makeText(mContext, "激励视频广告已过期，请再次请求广告后进行广告展示！", Toast.LENGTH_LONG).show();
                }
            } else {
                LogUtils.i(TAG,"showGDTRewardVideoAd-->此条广告已经展示过，请再次请求广告后进行广告展示！");
                Toast.makeText(mContext, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
//                Toast.makeText(mContext, "此条广告已经展示过，请再次请求广告后进行广告展示！", Toast.LENGTH_LONG).show();
            }
        } else {
            LogUtils.i(TAG,"showGDTRewardVideoAd-->成功加载广告后再进行广告展示！");
            Toast.makeText(mContext, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
//            Toast.makeText(mContext, "成功加载广告后再进行广告展示！", Toast.LENGTH_LONG).show();
        }
    }


    //穿山甲广告
    private TTAdNative mTTAdNative;
    private TTNativeExpressAd mTTInfoAd;//信息流模板广告
    private TTNativeExpressAd mTTBannerAd;//banner模板广告
    public FrameLayout mChapterAdLayout;
    public int mChapterAdMarginTop = 0;

    private void initAd(){
        LogUtils.i(TAG,"initAd");
        //穿山甲广告
        //step2:创建TTAdNative对象，createAdNative(Context context) banner广告context需要传入Activity对象
        mTTAdNative = TTAdManagerHolder.get().createAdNative(mContext.getApplicationContext());
        //step3:(可选，强烈建议在合适的时机调用):申请部分权限，如read_phone_state,防止获取不了imei时候，下载类广告没有填充的问题。
        TTAdManagerHolder.get().requestPermissionIfNecessary(mContext);
    }



    //穿山甲信息流广告
    private void loadTTExpressInfoAd(String codeId, boolean isVertical) {
        LogUtils.i(TAG,"loadExpressInfoAd codeId="+codeId);
        requestChapterAding = true;
//        mChapterAdLayout.removeAllViews();
        float expressViewWidth = Util.getScreenWidthDp(mContext);
        if(isVertical){
            expressViewWidth = (expressViewWidth*3)/4;
        }


        LogUtils.i(TAG,"loadTTExpressInfoAd expressViewWidth="+expressViewWidth);
        float expressViewHeight = 0;
        //step4:创建广告请求参数AdSlot,具体参数含义参考文档
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(codeId) //广告位id
                .setSupportDeepLink(true)
                .setAdCount(1) //请求广告数量为1到3条
                .setExpressViewAcceptedSize(expressViewWidth,expressViewHeight) //期望模板广告view的size,单位dp
                .build();
        //step5:请求广告，对请求回调的广告作渲染处理
        mTTAdNative.loadNativeExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
            @Override
            public void onError(int code, String message) {
//                mChapterAdLayout.removeAllViews();
                requestChapterAding = false;
            }

            @Override
            public void onNativeExpressAdLoad(List<TTNativeExpressAd> ads) {
                LogUtils.i(TAG,"onNativeExpressInfoAdLoad 00 size="+ads.size());
                if (ads == null || ads.size() == 0){
                    return;
                }
                LogUtils.i(TAG,"onNativeExpressInfoAdLoad size="+ads.size());
                mTTInfoAd = ads.get(0);
                bindInfoAdListener(mTTInfoAd);
                startTime = System.currentTimeMillis();
                mTTInfoAd.render();
            }
        });
    }
    private long startTime = 0;

    private void bindInfoAdListener(TTNativeExpressAd ad) {
        ad.setExpressInteractionListener(new TTNativeExpressAd.ExpressAdInteractionListener() {
            @Override
            public void onAdClicked(View view, int type) {
                LogUtils.i(TAG,"onAdClicked");
            }

            @Override
            public void onAdShow(View view, int type) {
                LogUtils.i(TAG,"==========================>穿山甲广告展现上报");
                mPageView.drawCurPage(false);
            }

            @Override
            public void onRenderFail(View view, String msg, int code) {
                LogUtils.i(TAG,"=====================>穿山甲广告渲染失败");
                requestChapterAding = false;
            }

            @Override
            public void onRenderSuccess(View view, float width, float height) {
                LogUtils.i(TAG,"=====================>穿山甲广告渲染成功");
                //返回view的宽高 单位 dp
                mChapterAdLayout.removeAllViews();
                mChapterAdLayout.addView(view);
                mAdGetTimestamp = System.currentTimeMillis();
                requestChapterAding = false;
            }
        });
        //dislike设置
//        bindDislikeInfoAd(ad, true);
        if (ad.getInteractionType() != TTAdConstant.INTERACTION_TYPE_DOWNLOAD){
            return;
        }
        ad.setDownloadListener(new TTAppDownloadListener() {
            @Override
            public void onIdle() {
            }

            @Override
            public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
            }

            @Override
            public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
            }

            @Override
            public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
            }

            @Override
            public void onInstalled(String fileName, String appName) {
            }

            @Override
            public void onDownloadFinished(long totalBytes, String fileName, String appName) {
            }
        });
    }

    /**
     * 设置广告的不喜欢，注意：强烈建议设置该逻辑，如果不设置dislike处理逻辑，则模板广告中的 dislike区域不响应dislike事件。
     * @param ad
     * @param customStyle 是否自定义样式，true:样式自定义
     */
    private void bindDislikeInfoAd(TTNativeExpressAd ad, boolean customStyle) {
        if (customStyle) {
            //使用自定义样式
            List<FilterWord> words = ad.getFilterWords();
            if (words == null || words.isEmpty()) {
                return;
            }

            final DislikeDialog dislikeDialog = new DislikeDialog(mContext, words);
            dislikeDialog.setOnDislikeItemClick(new DislikeDialog.OnDislikeItemClick() {
                @Override
                public void onItemClick(FilterWord filterWord) {
                    //用户选择不喜欢原因后，移除广告展示
//                    ad.destroy();
//                    mChapterAdLayout.removeAllViews();
//                    mPageView.drawCurPage(false);
                }
            });
            ad.setDislikeDialog(dislikeDialog);
            return;
        }
        //使用默认模板中默认dislike弹出样式
        ad.setDislikeCallback((Activity) mContext, new TTAdDislike.DislikeInteractionCallback() {
            @Override
            public void onSelected(int position, String value) {
//                ad.destroy();
//                mChapterAdLayout.removeAllViews();
//                mPageView.drawCurPage(false);
            }

            @Override
            public void onCancel() {
            }

            @Override
            public void onRefuse() {

            }
        });
    }

    //穿山甲模板banner广告
//    private void loadTTExpressBannerAd(String codeId) {
//        int expressViewWidth = (int)Util.getScreenWidthDp(mContext);
//
//        int expressViewHeight = (int) (expressViewWidth/6.4);//广点通banner广告宽高比为6.4:1,通过宽度算出高度
//        LogUtils.i(TAG,"loadExpressBannerAd expressViewHeight="+expressViewHeight);
//        mBottomAdLayout.removeAllViews();
//        if(mTTBannerAd != null){
//            mTTBannerAd.destroy();
//        }
//        //step4:创建广告请求参数AdSlot,具体参数含义参考文档
//        AdSlot adSlot = new AdSlot.Builder()
//                .setCodeId(codeId) //广告位id
//                .setSupportDeepLink(true)
//                .setAdCount(1) //请求广告数量为1到3条
//                .setExpressViewAcceptedSize(expressViewWidth, expressViewHeight) //期望模板广告view的size,单位dp
//                .build();
//        //step5:请求广告，对请求回调的广告作渲染处理
//        mTTAdNative.loadBannerExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
//            @Override
//            public void onError(int code, String message) {
//                LogUtils.i(TAG,"loadExpressBannerAd onError code="+code+",message="+message);
//                mBottomAdLayout.removeAllViews();
//            }
//
//            @Override
//            public void onNativeExpressAdLoad(List<TTNativeExpressAd> ads) {
//                if (ads == null || ads.size() == 0) {
//                    return;
//                }
//                mTTBannerAd = ads.get(0);
////                mTTBannerAd.setSlideIntervalTime(30 * 1000);//设置轮播间隔 ms,不调用则不进行轮播展示
//                bindBannerAdListener(mTTBannerAd);
//                startTime = System.currentTimeMillis();
//                mTTBannerAd.render();
//            }
//        });
//    }
//
//
//    private void bindBannerAdListener(TTNativeExpressAd ad) {
//        ad.setExpressInteractionListener(new TTNativeExpressAd.ExpressAdInteractionListener() {
//            @Override
//            public void onAdClicked(View view, int type) {
//                LogUtils.i(TAG,"bindBannerAdListener-->onAdClicked ad="+ad);
//            }
//
//            @Override
//            public void onAdShow(View view, int type) {
//                LogUtils.i(TAG,"bindBannerAdListener-->onAdShow ad="+ad);
//            }
//
//            @Override
//            public void onRenderFail(View view, String msg, int code) {
//                LogUtils.i(TAG, "bindBannerAdListener-->onRenderFail" + (System.currentTimeMillis() - startTime)+",code="+code+",msg="+msg);
//            }
//
//            @Override
//            public void onRenderSuccess(View view, float width, float height) {
//                LogUtils.i(TAG, "bindBannerAdListener-->onRenderSuccess:" + (System.currentTimeMillis() - startTime)+",width="+width+",height="+height);
//                //返回view的宽高 单位 dp
//                mBottomAdLayout.removeAllViews();
//                mBottomAdLayout.addView(view);
//            }
//        });
//        //dislike设置
//        bindDislikeBannerAd(ad, true);
//        if (ad.getInteractionType() != TTAdConstant.INTERACTION_TYPE_DOWNLOAD) {
//            return;
//        }
//        ad.setDownloadListener(new TTAppDownloadListener() {
//            @Override
//            public void onIdle() {
//                LogUtils.i(TAG, "bindBannerAdListener-->onIdle");
//            }
//
//            @Override
//            public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
//                LogUtils.i(TAG, "bindBannerAdListener-->onDownloadActive");
//            }
//
//            @Override
//            public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
//                LogUtils.i(TAG, "bindBannerAdListener-->onDownloadPaused");
//            }
//
//            @Override
//            public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
//                LogUtils.i(TAG, "bindBannerAdListener-->onDownloadFailed");
//            }
//
//            @Override
//            public void onInstalled(String fileName, String appName) {
//                LogUtils.i(TAG, "bindBannerAdListener-->onInstalled");
//            }
//
//            @Override
//            public void onDownloadFinished(long totalBytes, String fileName, String appName) {
//                LogUtils.i(TAG, "bindBannerAdListener-->onDownloadFinished");
//            }
//        });
//    }
//
//    /**
//     * 设置广告的不喜欢, 注意：强烈建议设置该逻辑，如果不设置dislike处理逻辑，则模板广告中的 dislike区域不响应dislike事件。
//     *
//     * @param ad
//     * @param customStyle 是否自定义样式，true:样式自定义
//     */
//    private void bindDislikeBannerAd(TTNativeExpressAd ad, boolean customStyle) {
//        if (customStyle) {
//            //使用自定义样式
//            List<FilterWord> words = ad.getFilterWords();
//            if (words == null || words.isEmpty()) {
//                return;
//            }
//
//            final DislikeDialog dislikeDialog = new DislikeDialog(mContext, words);
//            dislikeDialog.setOnDislikeItemClick(new DislikeDialog.OnDislikeItemClick() {
//                @Override
//                public void onItemClick(FilterWord filterWord) {
//                    //用户选择不喜欢原因后，移除广告展示
//                    ad.destroy();
//                    LogUtils.i(TAG,"onItemClick-->ad="+ad);
//                    mBottomAdLayout.removeAllViews();
//                    mHander.removeCallbacks(mFetchBottomAdRunnable);
//                    mHander.postDelayed(mFetchBottomAdRunnable,60*1000);
//                }
//            });
//            ad.setDislikeDialog(dislikeDialog);
//            return;
//        }
//        //使用默认模板中默认dislike弹出样式
//        ad.setDislikeCallback((Activity)mContext, new TTAdDislike.DislikeInteractionCallback() {
//            @Override
//            public void onSelected(int position, String value) {
//                LogUtils.i(TAG,"onSelected position="+position+",value="+value);
//                //用户选择不喜欢原因后，移除广告展示
//                ad.destroy();
//                LogUtils.i(TAG,"onSelected ad="+ad);
//                mBottomAdLayout.removeAllViews();
//                mHander.removeCallbacks(mFetchBottomAdRunnable);
//                mHander.postDelayed(mFetchBottomAdRunnable,60*1000);
//            }
//
//            @Override
//            public void onCancel() {
//            }
//
//            @Override
//            public void onRefuse() {
//
//            }
//
//        });
//    }

    //穿山甲激励视频广告
    private TTRewardVideoAd mttRewardVideoAd;
    private boolean mIsExpress = true; //是否请求模板广告
    private void loadTTRewardVideoAd(String codeId) {
        //step4:创建广告请求参数AdSlot,具体参数含义参考文档
        AdSlot adSlot;
        if (mIsExpress) {
            //个性化模板广告需要传入期望广告view的宽、高，单位dp，
            adSlot = new AdSlot.Builder()
                    .setCodeId(codeId)
                    .setSupportDeepLink(true)
                    .setRewardName("金币") //奖励的名称
                    .setRewardAmount(3)  //奖励的数量
                    //模板广告需要设置期望个性化模板广告的大小,单位dp,激励视频场景，只要设置的值大于0即可
                    .setExpressViewAcceptedSize(500,500)
                    .setUserID("user123")//用户id,必传参数
                    .setMediaExtra("media_extra") //附加参数，可选
                    .setOrientation(TTAdConstant.VERTICAL) //必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
                    .build();
        } else {
            //模板广告需要设置期望个性化模板广告的大小,单位dp,代码位是否属于个性化模板广告，请在穿山甲平台查看
            adSlot = new AdSlot.Builder()
                    .setCodeId(codeId)
                    .setSupportDeepLink(true)
                    .setRewardName("金币") //奖励的名称
                    .setRewardAmount(3)  //奖励的数量
                    .setUserID("user123")//用户id,必传参数
                    .setMediaExtra("media_extra") //附加参数，可选
                    .setOrientation(TTAdConstant.VERTICAL) //必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
                    .build();
        }
        //step5:请求广告
        mTTAdNative.loadRewardVideoAd(adSlot, new TTAdNative.RewardVideoAdListener() {
            @Override
            public void onError(int code, String message) {
                LogUtils.i(TAG, "Callback --> onError: " + code + ", " + String.valueOf(message));
            }

            //视频广告加载后，视频资源缓存到本地的回调，在此回调后，播放本地视频，流畅不阻塞。
            @Override
            public void onRewardVideoCached() {
                LogUtils.i(TAG, "Callback --> onRewardVideoCached");
            }

            //视频广告的素材加载完毕，比如视频url等，在此回调后，可以播放在线视频，网络不好可能出现加载缓冲，影响体验。
            @Override
            public void onRewardVideoAdLoad(TTRewardVideoAd ad) {
                LogUtils.i(TAG, "Callback --> onRewardVideoAdLoad");

                mttRewardVideoAd = ad;
                mttRewardVideoAd.setRewardAdInteractionListener(new TTRewardVideoAd.RewardAdInteractionListener() {

                    @Override
                    public void onAdShow() {
                        Log.d(TAG, "Callback --> rewardVideoAd show");
                    }

                    @Override
                    public void onAdVideoBarClick() {
                        Log.d(TAG, "Callback --> rewardVideoAd bar click");
                    }

                    @Override
                    public void onAdClose() {
                        Log.d(TAG, "Callback --> rewardVideoAd close");
                    }

                    //视频播放完成回调
                    @Override
                    public void onVideoComplete() {
                        Log.d(TAG, "Callback --> rewardVideoAd complete");
                    }

                    @Override
                    public void onVideoError() {
                        LogUtils.i(TAG, "Callback --> rewardVideoAd error");
                    }

                    //视频播放完成后，奖励验证回调，rewardVerify：是否有效，rewardAmount：奖励梳理，rewardName：奖励名称
                    @Override
                    public void onRewardVerify(boolean rewardVerify, int rewardAmount, String rewardName) {
                        String logString = "verify:" + rewardVerify + " amount:" + rewardAmount +
                                " name:" + rewardName;
                        LogUtils.i(TAG, "Callback --> " + logString);
                        dealRewardVerify();
                    }

                    @Override
                    public void onSkippedVideo() {
                        LogUtils.i(TAG, "Callback --> rewardVideoAd has onSkippedVideo");
                    }
                });
                mttRewardVideoAd.setDownloadListener(new TTAppDownloadListener() {
                    @Override
                    public void onIdle() {
                    }

                    @Override
                    public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                        Log.d("DML", "onDownloadActive==totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);
                    }

                    @Override
                    public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
                        Log.d("DML", "onDownloadPaused===totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);
                    }

                    @Override
                    public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
                        Log.d("DML", "onDownloadFailed==totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);
                    }

                    @Override
                    public void onDownloadFinished(long totalBytes, String fileName, String appName) {
                        Log.d("DML", "onDownloadFinished==totalBytes=" + totalBytes + ",fileName=" + fileName + ",appName=" + appName);
                    }

                    @Override
                    public void onInstalled(String fileName, String appName) {
                        Log.d("DML", "onInstalled==" + ",fileName=" + fileName + ",appName=" + appName);
                    }
                });
            }
        });
    }



    public void showTTRewardVideoAd() {
        if (mttRewardVideoAd != null) {
            //step6:在获取到广告后展示,强烈建议在onRewardVideoCached回调后，展示广告，提升播放体验
            //展示广告，并传入广告展示的场景
            mttRewardVideoAd.showRewardVideoAd(mActivity, TTAdConstant.RitScenes.CUSTOMIZE_SCENES, "scenes_test");
            mttRewardVideoAd = null;
        } else {
            Toast.makeText(mContext, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
            loadRewardVideoAd();
        }
    }

    private void dealRewardVerify() {
        mSharedPreUtils.setAdStatus(false);
        mSharedPreUtils.putLong(Constant.KEY_AD_OFF_TIME, System.currentTimeMillis());
//        hideBottomAd();
        mChapterAdLayout.removeAllViews();
        mChapterAdLayout.setVisibility(View.INVISIBLE);
        updatePages();
        mPageView.postDelayed(mResetAdRunnable, Constant.MAX_AD_FREE_TIME);
        AdRemoveDialog adRemoveDialog = new AdRemoveDialog(mContext);
        adRemoveDialog.show();
    }


    private void updatePages() {
        // 取消缓存
        mPrePageList = null;
        mNextPageList = null;

        // 如果当前已经显示数据
        if (isChapterListPrepare && mStatus == STATUS_FINISH) {
            // 重新计算当前页面
            dealLoadPageList(mCurChapterPos);

            // 防止在最后一页，通过修改字体，以至于页面数减少导致崩溃的问题
            if (mCurPage.position >= mCurPageList.size()) {
                mCurPage.position = mCurPageList.size() - 1;
            }

            // 重新获取指定页面
            mCurPage = mCurPageList.get(mCurPage.position);
        }

        mPageView.drawCurPage(false);
    }

    private View getAdLoginView() {
        View view = LayoutInflater.from(mContext).inflate(R.layout.view_chapter_ad_login_tip, null);
        return view;
    }

    private View getAdEx1View() {
        View view = LayoutInflater.from(mContext).inflate(R.layout.view_chapter_last_ad_ex1, null);
        return view;
    }

    // 限时Vip书籍
    private Runnable mResetVipFreeRunnable = () -> {
        LogUtils.i("yy", "mResetVipFreeRunnable");
        isVipFreeBook = false;
    };
    private void checkBookFreeVip() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            String bookFreeVipStartTime = mCollBook.getStart_vip_ts();
            String bookFreeVipEndtime = mCollBook.getEnd_vip_ts();
            if (TextUtils.isEmpty(bookFreeVipStartTime) || TextUtils.isEmpty(bookFreeVipEndtime)) {
                LogUtils.i("yy", "checkBookFreeVip() time = null");
                isVipFreeBook = false;
            } else {
                Date startDate = format.parse(bookFreeVipStartTime);
                Date endDate = format.parse(bookFreeVipEndtime);
                Date now = new Date(System.currentTimeMillis());
                if (now.after(startDate) && now.before(endDate)) { //在限免时间内
                    long restTime = endDate.getTime() - System.currentTimeMillis();
                    isVipFreeBook = true;
                    LogUtils.i("yy", "checkBookFreeVip() -->freeVipVert restTime=" + restTime);
                    mPageView.postDelayed(mResetVipFreeRunnable, restTime);
                } else {
                    LogUtils.i("yy", "checkBookFreeVip() out of time range");
                    isVipFreeBook = false;
                }
            }

        } catch (ParseException e) {
            e.printStackTrace();
        }
    }


    // 新用户免3天广告
    private boolean mShowAd;
    private Runnable mResetShowAdRunnable = () -> {
        LogUtils.i("yy", "mResetShowAdRunnable");
        prepareAd();
    };

    // 限时book免广告-->新用户免三天广告-->积分兑换免广告
    private void checkBookShowAd() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            String bookFreeStartTime = mCollBook.getStart_ad_ts();
            String bookFreeEndtime = mCollBook.getEnd_ad_ts();
            if (TextUtils.isEmpty(bookFreeStartTime) || TextUtils.isEmpty(bookFreeEndtime)) {
                LogUtils.i("yy", "checkBookShowAd() -->checkNewUserShowAd() time = null");
                checkNewUserShowAd();
            } else {
                Date startDate = format.parse(bookFreeStartTime);
                Date endDate = format.parse(bookFreeEndtime);
                Date now = new Date(System.currentTimeMillis());
                if (now.after(startDate) && now.before(endDate)) { //在限免时间内
                    long restTime = endDate.getTime() - System.currentTimeMillis();
                    mShowAd = false;
                    LogUtils.i("yy", "checkBookShowAd() -->freeAdVert restTime=" + restTime);
                    mPageView.postDelayed(mResetShowAdRunnable, restTime);
                } else {
                    LogUtils.i("yy", "checkBookShowAd() -->checkNewUserShowAd() out of time range");
                    checkNewUserShowAd();
                }
            }

        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    //新用户免三天广告
    private void checkNewUserShowAd() {
        if (TextUtils.isEmpty(mToken)) {
            LogUtils.i("yy", "checkNewUserShowAd() -->prepareAd() token = null");
            prepareAd();
        } else {
            if (NetworkUtils.isAvailable(mContext)) {
                JSONObject root = new JSONObject();
                try {
                    root.put("token", mToken);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                LogUtils.i("yy", "checkNewUserShowAd() freeAdVert root=" + root);
                RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), root.toString());
                RemoteRepository.getInstance().freeAdVert(requestBody)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(new SingleObserver<FreeAdVertBean>() {
                            Disposable disposable;

                            @Override
                            public void onSubscribe(Disposable d) {
                                disposable = d;
                            }

                            @Override
                            public void onSuccess(FreeAdVertBean value) {
                                LogUtils.i("yy", "freeAdVert onSuccess value=" + value.toString());
                                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                                try {
                                    Date date = format.parse(value.getData());
                                    long passTime = System.currentTimeMillis() - date.getTime();
                                    LogUtils.i("yy", "freeAdVert passTime=" + passTime);
                                    if (passTime >= Constant.THREE_DAY) {
                                        LogUtils.i("yy", "checkNewUserShowAd() -->checkIntegralShowAd() out of time");
                                        checkIntegralShowAd();
                                    } else {
                                        long restTime = Constant.THREE_DAY - passTime;
                                        mShowAd = false;
                                        LogUtils.i("yy", "checkNewUserShowAd() freeAdVert restTime=" + restTime);
                                        mPageView.postDelayed(mResetShowAdRunnable, restTime);
                                    }
                                } catch (ParseException e) {
                                    e.printStackTrace();
                                }

                                disposable.dispose();
                            }

                            @Override
                            public void onError(Throwable e) {
                                LogUtils.i("yy", "checkNewUserShowAd() freeAdVert onError e=" + e.toString());
                                disposable.dispose();
                            }
                        });
            }
        }
    }

    // 积分兑换免广告
    private void checkIntegralShowAd() {
        if (mUserFreeEndtime == 0) {
            LogUtils.i("yy", "checkIntegralShowAd() -->prepareAd() time = null");
            prepareAd();
        } else {
            long currentTimeMillis = System.currentTimeMillis();
            long userFreeEndTimeMillis = ((long)mUserFreeEndtime) * 1000;
            LogUtils.i("yy","checkIntegralShowAd()--> currentTimeMillis="+currentTimeMillis+",userFreeEndTimeMillis="+userFreeEndTimeMillis);
            if (currentTimeMillis <= userFreeEndTimeMillis) { //在兑换end_time时间内
                long restTime = userFreeEndTimeMillis - currentTimeMillis;
                mShowAd = false;
                LogUtils.i("yy", "checkIntegralShowAd() --> freeAdVert restTime=" + restTime);
                mPageView.postDelayed(mResetShowAdRunnable, restTime);
            } else {
                LogUtils.i("yy", "checkIntegralShowAd() -->prepareAd() out of time");
                prepareAd();
            }
        }
    }


    private void prepareAd() {
        //如果用户是VIP，免广告
        mShowAd = true;
        LogUtils.i("yy","prepareAd() token="+mToken+",isVip="+isVip);
        if(!TextUtils.isEmpty(mToken) && isVip == 1) {
            mShowAd = false;
            return;
        }

        // 若广告已被关闭
        if (!mSharedPreUtils.getAdStatus()) {
            long adOffTime = mSharedPreUtils.getLong(Constant.KEY_AD_OFF_TIME, 0);
            long passTime = System.currentTimeMillis() - adOffTime;
            LogUtils.i("yy", "prepareAd() 111 passTime=" + passTime);
            if (passTime >= Constant.MAX_AD_FREE_TIME) {
                resetAdOffTime();
            } else {
                long restTime = Constant.MAX_AD_FREE_TIME - passTime;
                LogUtils.i("yy", "prepareAd() 222 restTime=" + restTime);
                mPageView.postDelayed(mResetAdRunnable, restTime);
            }
        }

        //加载章节中广告、底部banner广告，激励视频广告
        loadAllAd();
    }

    private Runnable mResetAdRunnable = () -> resetAdOffTime();

    private void resetAdOffTime() {
        LogUtils.i("yy", "mResetAdRunnable()");
        mSharedPreUtils.setAdStatus(true);
        mSharedPreUtils.putLong(Constant.KEY_AD_OFF_TIME, 0);
        updatePages();
        loadAllAd();
    }

    // loading anim
    private void showLoading() {
        mLoadingView.setVisibility(View.VISIBLE);
        mLoadingAnimationDrawable.start();
    }

    private void hideLoading() {
        mLoadingAnimationDrawable.stop();
        mLoadingView.setVisibility(View.GONE);

    }

//    private void hideBottomAd() {
//        changeBottomAdBgColor();
//        mBottomAdLayout.removeAllViews();
//    }

//    private void changeBottomAdBgColor() {
//        int bottomAdBgColor = mBgColor;
//        switch(mPageStyle.getBgColor()) {
//            case R.color.nb_read_bg_1:
//                bottomAdBgColor = ContextCompat.getColor(mContext, R.color.nb_read_bottom_ad_bg_1);
//                break;
//            case R.color.nb_read_bg_2:
//                bottomAdBgColor = ContextCompat.getColor(mContext, R.color.nb_read_bottom_ad_bg_2);
//                break;
//            case R.color.nb_read_bg_3:
//                bottomAdBgColor = ContextCompat.getColor(mContext, R.color.nb_read_bottom_ad_bg_3);
//                break;
//        }
//        mBottomAdLayoutBg.setBackgroundColor(bottomAdBgColor);
//    }

    public boolean isFront() {
        return isFront;
    }

    public void setFront(boolean front) {
        isFront = front;
    }

    public RectF getSignInRect() {
        return mSignInRect;
    }

    public boolean getSignStatus() {
        return mSignStatus;
    }

    public void setSignStatus(boolean signStatus) {
        mSignStatus = signStatus;
    }

    public RectF getMusicRect() {
        return mMusicRect;
    }

    public RectF getHotbeanRect(){
        return mHotbeanRect;
    }

    public void refreshPlaySort() {
        if(mPlaySort == PLAY_SORT_ORDER) {
            if (isNightMode) {
                mMusicPlaySortImage.setBackground(mContext.getResources().getDrawable(R.drawable.ic_order_play_night));
                mMusicPlaySortText.setTextColor(mContext.getResources().getColor(R.color.night_widget_font_color));
            } else {
                mMusicPlaySortImage.setBackground(mContext.getResources().getDrawable(R.drawable.ic_order_play));
                mMusicPlaySortText.setTextColor(mContext.getResources().getColor(R.color.black));
            }
            mMusicPlaySortText.setText(mContext.getResources().getText(R.string.music_order_play));

        } else {
            if (isNightMode) {
                mMusicPlaySortImage.setBackground(mContext.getResources().getDrawable(R.drawable.ic_single_loop_play_night));
                mMusicPlaySortText.setTextColor(mContext.getResources().getColor(R.color.night_widget_font_color));
            } else {
                mMusicPlaySortImage.setBackground(mContext.getResources().getDrawable(R.drawable.ic_single_loop_play));
                mMusicPlaySortText.setTextColor(mContext.getResources().getColor(R.color.black));
            }
            mMusicPlaySortText.setText(mContext.getResources().getText(R.string.music_single_loop));
        }
    }

    private void refreshChangeAllStatus() {
        if(mAllMusic.size() > 3) {
            mMusicChangeAll.setEnabled(true);
            if(isNightMode) {
                mMusicChangeAllImage.setBackground(mContext.getDrawable(R.drawable.ic_change_all_night));
                mMusicChangeAllText.setTextColor(mContext.getResources().getColor(R.color.night_widget_font_color));
            } else {
                mMusicChangeAllImage.setBackground(mContext.getDrawable(R.drawable.ic_change_all_enable));
                mMusicChangeAllText.setTextColor(mContext.getResources().getColor(R.color.black));
            }

        } else {
            mMusicChangeAll.setEnabled(false);
            if(isNightMode) {
                mMusicChangeAllImage.setBackground(mContext.getDrawable(R.drawable.ic_change_all_night_disable));
                mMusicChangeAllText.setTextColor(mContext.getResources().getColor(R.color.music_change_one_night_disable));
            } else {
                mMusicChangeAllImage.setBackground(mContext.getDrawable(R.drawable.ic_change_all_disable));
                mMusicChangeAllText.setTextColor(mContext.getResources().getColor(R.color.music_change_one_disable));
            }

        }
    }

    //*/vip
    private View getVipStep1View() {
        View view = LayoutInflater.from(mContext).inflate(R.layout.view_vip_step_1, null);
        return view;
    }
    private View getVipStep2View() {
        View view = LayoutInflater.from(mContext).inflate(R.layout.view_vip_step_2, null);
        return view;
    }
    private void drawVipContent(Canvas canvas){
        //对vip提示进行绘制
        int bottomBatteryHeight = mMarginHeight + ScreenUtils.dpToPx(2);
        int vipLayoutBottom = mDisplayHeight - bottomBatteryHeight ;
        int vipLayoutTop = vipLayoutBottom - VIP_LAYOUT_HEIGHT + ScreenUtils.dpToPx(14);
        //左横线
        int leftLineLeft = mMarginWidth;
        int leftLineTop = vipLayoutTop + VIP_LINE_MARGIN_TOP;
        int leftLineRight = leftLineLeft + VIP_LINE_WIDTH;
        int leftLineBottom = leftLineTop + ScreenUtils.dpToPx(1);
        canvas.drawLine(leftLineLeft, leftLineTop, leftLineRight, leftLineBottom, mTipPaint);
        //右横线
        int rightLineTop = vipLayoutTop + VIP_LINE_MARGIN_TOP;
        int rightLineRight = mDisplayWidth - mMarginWidth;
        int rightLineBottom = leftLineTop + ScreenUtils.dpToPx(1);
        int rightLineLeft = rightLineRight - VIP_LINE_WIDTH;
        canvas.drawLine(rightLineLeft, rightLineTop, rightLineRight, rightLineBottom, mTipPaint);

        Paint.FontMetrics tipFontMetrics = mTipPaint.getFontMetrics();
        float tipTextHeight = tipFontMetrics.bottom - tipFontMetrics.top;
        //vipText1
        String vipText1 = "VIP章节";
        float vipText1Width = mTipPaint.measureText(vipText1);
        float vipText1PivotX = (mDisplayWidth - vipText1Width) / 2;
        float vipText1PivotY = vipLayoutTop + tipTextHeight;
        canvas.drawText(vipText1, vipText1PivotX, vipText1PivotY, mTipPaint);
        //vipText2
        String vipText2 = "感谢支持作家，支持正版阅读";
        float vipText2Width = mTipPaint.measureText(vipText2);
        float vipText2PivotX = (mDisplayWidth - vipText2Width) / 2;
        float vipText2PivotY = vipText1PivotY + ScreenUtils.dpToPx(5) + tipTextHeight;
        canvas.drawText(vipText2, vipText2PivotX, vipText2PivotY, mTipPaint);
        //vipText3
        Paint.FontMetrics vipText3FontMetrics = mVipTip3Paint.getFontMetrics();
        float vipText3TextHeight = vipText3FontMetrics.bottom - vipText3FontMetrics.top;
        String vipText3 = "为了保证您账户安全，请先登录再购买";
        float vipText3Width = mVipTip3Paint.measureText(vipText3);
        float vipText3PivotX = (mDisplayWidth - vipText3Width) / 2;
        float vipText3PivotY = vipText2PivotY + ScreenUtils.dpToPx(38) + vipText3TextHeight;

        //vipStep1
        if(TextUtils.isEmpty(mToken)) {//若没有登录，则提示登录并开通vip
            canvas.drawText(vipText3, vipText3PivotX, vipText3PivotY, mVipTip3Paint);
            Bitmap vipStep1ViewBitmap = BitmapUtils.getViewBitmap(getVipStep1View());
            if (vipStep1ViewBitmap != null) {
                int vipStep1ViewHeight = vipStep1ViewBitmap.getHeight();
                mCurPage.vipStep1Left = (mDisplayWidth - VIP_STEP_WIDTH) / 2;
                mCurPage.vipStep1Top = vipText3PivotY + ScreenUtils.dpToPx(8);
                mCurPage.vipStep1Right = mCurPage.vipStep1Left + VIP_STEP_WIDTH;
                mCurPage.vipStep1Bottom = mCurPage.vipStep1Top + vipStep1ViewHeight;
                canvas.drawBitmap(vipStep1ViewBitmap, mCurPage.vipStep1Left, mCurPage.vipStep1Top, mAdBgPaint);
            }
        } else {//若已登录但未开通vip，则提示开通vip
            Bitmap vipStep2ViewBitmap = BitmapUtils.getViewBitmap(getVipStep2View());
            if (vipStep2ViewBitmap != null) {
                int vipStep2ViewHeight = vipStep2ViewBitmap.getHeight();
                mCurPage.vipStep2Left = (mDisplayWidth - VIP_STEP_WIDTH) / 2;
                mCurPage.vipStep2Top = vipText3PivotY + ScreenUtils.dpToPx(8);
                mCurPage.vipStep2Right = mCurPage.vipStep2Left + VIP_STEP_WIDTH;
                mCurPage.vipStep2Bottom = mCurPage.vipStep2Top + vipStep2ViewHeight;
                canvas.drawBitmap(vipStep2ViewBitmap, mCurPage.vipStep2Left, mCurPage.vipStep2Top, mAdBgPaint);
            }
        }
    }
    //*/


    //*/获取用户当前阅读时长
    private int mTodayReadTs = 0;
    private int totalReadTime = 0;
    private int curPageReadTime = 0;

    private void getTodayReadTs(){
        if(!TextUtils.isEmpty(mToken) && NetworkUtils.isAvailable(mContext)) {
            JSONObject root = new JSONObject();
            try {
                root.put("token", mToken);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            LogUtils.i("yy", "getTodayReadTs root=" + root);
            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), root.toString());
            RemoteRepository.getInstance().todayReadTs(requestBody)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(new SingleObserver<TodayReadTsBean>() {
                        Disposable disposable;

                        @Override
                        public void onSubscribe(Disposable d) {
                            disposable = d;
                        }

                        @Override
                        public void onSuccess(TodayReadTsBean value) {
                            LogUtils.i("yy","todayReadTs onSuccess ts=" + value.getTs());
                            mTodayReadTs = value.getTs();
                            disposable.dispose();
                        }

                        @Override
                        public void onError(Throwable e) {
                            LogUtils.i("yy", "todayReadTs onError e=" + e.toString());
                            disposable.dispose();
                        }
                    });
        }
    }

    private void showReadHotbeansInfoDialog(int taskType){
        HotbeanGetDialog dialog = new HotbeanGetDialog(mContext, taskType);
        dialog.show();
    }

    private void readHotbeansInfo(int taskType){
        if(!TextUtils.isEmpty(mToken) && NetworkUtils.isAvailable(mContext)) {
            JSONObject root = new JSONObject();
            try {
                root.put("token", mToken);
                root.put("task_type", taskType);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            LogUtils.i("yy", "readHotbeansInfo root=" + root);
            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), root.toString());
            RemoteRepository.getInstance().readHotbeansInfo(requestBody)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(new SingleObserver<ReadHotbeansInfoBean>() {
                        Disposable disposable;

                        @Override
                        public void onSubscribe(Disposable d) {
                            disposable = d;
                        }

                        @Override
                        public void onSuccess(ReadHotbeansInfoBean value) {
                            LogUtils.i("yy","readHotbeansInfo onSuccess ts=" + value.getTip());
                            showReadHotbeansInfoDialog(taskType);
                            disposable.dispose();
                        }

                        @Override
                        public void onError(Throwable e) {
                            LogUtils.i("yy", "readHotbeansInfo onError e=" + e.toString());
                            disposable.dispose();
                        }
                    });
        }
    }

    private Runnable mCurPageReadTimeRunnable = new Runnable() {
        @Override
        public void run() {
            curPageReadTime++;
            long readTime = mTodayReadTs + totalReadTime + curPageReadTime;
//            LogUtils.i("yy","curPageReadTime="+curPageReadTime+",readTime="+readTime);
            if(readTime == 30*60){
                readHotbeansInfo(5);
            }else if(readTime == 60*60){
                readHotbeansInfo(6);
            }else if(readTime == 120*60){
                readHotbeansInfo(7);
            }else if(readTime == 180*60){
                readHotbeansInfo(18);
            }

            if(curPageReadTime < 5 * 60){//5分钟后不再统计阅读时长，超出部分按5分钟计算
                mHander.postDelayed(mCurPageReadTimeRunnable, 1000);
            }

        }
    };
    //*/

}
