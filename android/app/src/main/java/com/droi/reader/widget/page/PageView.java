package com.droi.reader.widget.page;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.RectF;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import com.droi.reader.R;

import com.droi.reader.MainApplication;
import com.droi.reader.model.bean.CollBookBean;
import com.droi.reader.model.bean.SignBean;
import com.droi.reader.model.remote.RemoteRepository;
import com.droi.reader.ui.activity.ReadActivity;
import com.droi.reader.ui.dialog.HotbeanTipDialog;
import com.droi.reader.ui.dialog.RuleDialog;
import com.droi.reader.utils.AnimationUtils;
import com.droi.reader.utils.CommonUtils;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.NetworkUtils;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.widget.animation.CoverPageAnim;
import com.droi.reader.widget.animation.HorizonPageAnim;
import com.droi.reader.widget.animation.NonePageAnim;
import com.droi.reader.widget.animation.PageAnimation;
import com.droi.reader.widget.animation.ScrollPageAnim;
import com.droi.reader.widget.animation.SimulationPageAnim;
import com.droi.reader.widget.animation.SlidePageAnim;

import org.json.JSONException;
import org.json.JSONObject;

import io.reactivex.SingleObserver;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.RequestBody;

/**
 * 原作者的GitHub Project Path:(https://github.com/PeachBlossom/treader)
 * 绘制页面显示内容的类
 */
public class PageView extends View {

    private final static String TAG = "BookPageWidget";

    private int mViewWidth = 0; // 当前View的宽
    private int mViewHeight = 0; // 当前View的高

    private int mStartX = 0;
    private int mStartY = 0;
    private boolean isMove = false;
    // 初始化参数
    private int mBgColor = 0xFFCEC29C;
    private PageMode mPageMode = PageMode.SIMULATION;
    // 是否允许点击
    private boolean canTouch = true;
    // 唤醒菜单的区域
    private RectF mCenterRect = null;
    // 广告的区域
    private RectF mLastAdRect = null;
    private RectF mAdRect = null;
    private RectF mAdEx1Rect = null;
    private RectF mAdEx2Rect = null;
    private RectF mAdTipRect = null;
    private RectF mAdLoginTipRect = null;

    // vip_step区域
    private RectF mVipStep1Rect = null;
    private RectF mVipStep2Rect = null;

    private boolean isPrepare;
    // 动画类
    private PageAnimation mPageAnim;
    // 动画监听类
    private PageAnimation.OnPageChangeListener mPageAnimListener = new PageAnimation.OnPageChangeListener() {
        @Override
        public boolean hasPrev() {
            return PageView.this.hasPrevPage();
        }

        @Override
        public boolean hasNext() {
            return PageView.this.hasNextPage();
        }

        @Override
        public void pageCancel() {
            PageView.this.pageCancel();
        }
    };

    //点击监听
    private TouchListener mTouchListener;
    //内容加载器
    private PageLoader mPageLoader;

    public PageView(Context context) {
        this(context, null);
    }

    public PageView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public PageView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    // loading anim
    private ImageView mLoading;
    public void setLoadingView(ImageView imageView) {
        mLoading = imageView;
    }

    public ImageView getLoadingView() {
        return mLoading;
    }
    // bottom ad layout
//    private FrameLayout mBottomAdLayoutBg;
//    public void setBottomAdLayoutBg(FrameLayout bottomAdLayoutBg) {
//        mBottomAdLayoutBg = bottomAdLayoutBg;
//    }
//    public FrameLayout getBottomAdLayoutBg() {
//        return mBottomAdLayoutBg;
//    }

    // chapter ad container
    private FrameLayout mChapterAdLayout;
    public void setChapterAdLayout(FrameLayout chapterAdLayhout) {
        mChapterAdLayout = chapterAdLayhout;
    }
    public FrameLayout getChapterAdLayout() {
        return mChapterAdLayout;
    }
    // night mask
    private FrameLayout mNightMask;
    public void setNightMask(FrameLayout nightMask) {
        mNightMask = nightMask;
    }
    public FrameLayout getNightMask() {
        return mNightMask;
    }

    // music layout
    private RelativeLayout mMusicLayout;
    private RecyclerView mMusicRecyclerView;
    private LinearLayout mMusicChangeAll;
    private ImageView mMusicChangeAllImage;
    private TextView mMusicChangeAllText;
    private ImageView mMusicPlayImage;
    private LinearLayout mMusicPlaySort;
    private ImageView mMusicPlaySortImage;
    private TextView mMusicPlaySortText;
    public void setMusicLayout(RelativeLayout musicLayout) {
        mMusicLayout = musicLayout;
    }
    public void setMusicRecyclerView(RecyclerView musicRecyclerView) {
        mMusicRecyclerView = musicRecyclerView;
    }
    public RecyclerView getMusicRecyclerView() {
        return mMusicRecyclerView;
    }
    public void setMusicChangeAll(LinearLayout musicChangeAll){
        mMusicChangeAll = musicChangeAll;
    }
    public LinearLayout getMusicChangeAll(){
        return mMusicChangeAll;
    }
    public void setMusicChangeAllImage(ImageView musicChangeAllImage){
        mMusicChangeAllImage = musicChangeAllImage;
    }
    public ImageView getMusicChangeAllImage(){
        return mMusicChangeAllImage;
    }
    public void setMusicChangeAllText(TextView musicChangeAllText){
        mMusicChangeAllText = musicChangeAllText;
    }
    public TextView getMusicChangeAllText(){
        return mMusicChangeAllText;
    }
    public void setMusicPlayImage(ImageView musicPlayImage){
        mMusicPlayImage = musicPlayImage;
    }
    public ImageView getMusicPlayImage(){
        return mMusicPlayImage;
    }
    public void setMusicPlaySort(LinearLayout musicPlaySort) {
        mMusicPlaySort = musicPlaySort;
    }
    public LinearLayout getMusicPlaySort() {
        return mMusicPlaySort;
    }
    public void setMusicPlaySortImage(ImageView musicPlaySortImage) {
        mMusicPlaySortImage = musicPlaySortImage;
    }
    public ImageView getMusicPlaySortImage() {
        return mMusicPlaySortImage;
    }
    public void setMusicPlaySortText(TextView musicPlaySortText) {
        mMusicPlaySortText = musicPlaySortText;
    }
    public TextView getMusicPlaySortText() {
        return mMusicPlaySortText;
    }


    // token
    private String mToken;
    public void setToken(String token) {
        mToken = token;
    }
    public String getToken() {
        return mToken;
    }

    // userFreeAdEndtime
    private int mUserFreeAdEndtime;
    public void setUserFreeAdEndtime(int userFreeAdEndtime) {
        mUserFreeAdEndtime = userFreeAdEndtime;
    }
    public int getUserFreeAdEndtime() {
        return mUserFreeAdEndtime;
    }

    // isVip
    private int isVip;
    public void setUserIsVip(int isVip) {
        this.isVip = isVip;
    }
    public int getUserIsVip() {
        return this.isVip;
    }

    // activity
    private Activity mActivity;
    public void setActivity(Activity activity){
        mActivity = activity;
    }
    public Activity getActivity(){
        return mActivity;
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        mViewWidth = w;
        mViewHeight = h;

        isPrepare = true;

        if (mPageLoader != null) {
            mPageLoader.prepareDisplay(w, h);
        }
    }

    //设置翻页的模式
    void setPageMode(PageMode pageMode) {
        mPageMode = pageMode;
        //视图未初始化的时候，禁止调用
        if (mViewWidth == 0 || mViewHeight == 0) return;

        switch (mPageMode) {
            case SIMULATION:
                mPageAnim = new SimulationPageAnim(mViewWidth, mViewHeight, this, mPageAnimListener);
                break;
            case COVER:
                mPageAnim = new CoverPageAnim(mViewWidth, mViewHeight, this, mPageAnimListener);
                break;
            case SLIDE:
                mPageAnim = new SlidePageAnim(mViewWidth, mViewHeight, this, mPageAnimListener);
                break;
            case NONE:
                mPageAnim = new NonePageAnim(mViewWidth, mViewHeight, this, mPageAnimListener);
                break;
            case SCROLL:
                mPageAnim = new ScrollPageAnim(mViewWidth, mViewHeight, 0,
                        mPageLoader.getMarginHeight(), this, mPageAnimListener);
                break;
            default:
                mPageAnim = new SimulationPageAnim(mViewWidth, mViewHeight, this, mPageAnimListener);
        }
    }

    public Bitmap getNextBitmap() {
        if (mPageAnim == null) return null;
        return mPageAnim.getNextBitmap();
    }

    public Bitmap getBgBitmap() {
        if (mPageAnim == null) return null;
        return mPageAnim.getBgBitmap();
    }

    public boolean autoPrevPage() {
        //滚动暂时不支持自动翻页
        if (mPageAnim instanceof ScrollPageAnim) {
            return false;
        } else {
            startPageAnim(PageAnimation.Direction.PRE);
            return true;
        }
    }

    public boolean autoNextPage() {
        if (mPageAnim instanceof ScrollPageAnim) {
            return false;
        } else {
            startPageAnim(PageAnimation.Direction.NEXT);
            return true;
        }
    }

    private void startPageAnim(PageAnimation.Direction direction) {
        if (mTouchListener == null) return;
        //是否正在执行动画
        abortAnimation();
        if (direction == PageAnimation.Direction.NEXT) {
            int x = mViewWidth;
            int y = mViewHeight;
            //初始化动画
            mPageAnim.setStartPoint(x, y);
            //设置点击点
            mPageAnim.setTouchPoint(x, y);
            //设置方向
            Boolean hasNext = hasNextPage();

            mPageAnim.setDirection(direction);
            if (!hasNext) {
                return;
            }
        } else {
            int x = 0;
            int y = mViewHeight;
            //初始化动画
            mPageAnim.setStartPoint(x, y);
            //设置点击点
            mPageAnim.setTouchPoint(x, y);
            mPageAnim.setDirection(direction);
            //设置方向方向
            Boolean hashPrev = hasPrevPage();
            if (!hashPrev) {
                return;
            }
        }
        mPageAnim.startAnim();
        this.postInvalidate();
    }

    public void setBgColor(int color) {
        mBgColor = color;
    }

    @Override
    protected void onDraw(Canvas canvas) {

        //绘制背景
        canvas.drawColor(mBgColor);

        //绘制动画
        mPageAnim.draw(canvas);

//        LogUtils.i("yy","onDraw isRunning="+mPageAnim.isRunning());
        if(mPageAnim.isRunning()){
            mChapterAdLayout.clearAnimation();
            if(mPageLoader.mChapterAdLayout.getVisibility() == View.VISIBLE){
                LogUtils.i("yy","=================>onDraw invisible");
                mPageLoader.mChapterAdLayout.setVisibility(View.INVISIBLE);
            }
        } else{
            if(mPageLoader.getCurPage() != null){
//                LogUtils.i("yy","curPage position="+mPageLoader.getCurPage().position+",hasChapterAd="+mPageLoader.getCurPage().hasChapterAd);
                if(mPageLoader.getCurPage().hasChapterAd){
                    if(mChapterAdLayout.getVisibility() == View.INVISIBLE){
                        LogUtils.i("yy","=================>onDraw visible");
                        mChapterAdLayout.clearAnimation();
                        AnimationUtils.showAndHiddenAnimation(mChapterAdLayout, AnimationUtils.AnimationState.STATE_SHOW,1500);
                    }
                }
            }
        }
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        super.onTouchEvent(event);
        if (!canTouch && event.getAction() != MotionEvent.ACTION_DOWN) return true;

        int x = (int) event.getX();
        int y = (int) event.getY();

        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                mStartX = x;
                mStartY = y;
                isMove = false;
                canTouch = mTouchListener.onTouch();
                mPageAnim.onTouchEvent(event);
                break;
            case MotionEvent.ACTION_MOVE:
                // 判断是否大于最小滑动值。
                int slop = ViewConfiguration.get(getContext()).getScaledTouchSlop();
                if (!isMove) {
                    isMove = Math.abs(mStartX - event.getX()) > slop || Math.abs(mStartY - event.getY()) > slop;
                }

                // 如果滑动了，则进行翻页。
                if (isMove) {
                    mPageAnim.onTouchEvent(event);
                }
                break;
            case MotionEvent.ACTION_UP:
                if (!isMove) {
                    //设置中间区域范围
                    if (mCenterRect == null) {
                        mCenterRect = new RectF(mViewWidth / 5, mViewHeight / 3,
                                mViewWidth * 4 / 5, mViewHeight * 2 / 3);
                    }

                    //设置章节末广告区域范围
                    TxtPage curPage = mPageLoader.getCurPage();
                    if (SharedPreUtils.getInstance().getAdStatus() && curPage != null) {
                        mAdRect = new RectF(curPage.adLeft, curPage.adTop, curPage.adRight, curPage.adBottom);
                        if (curPage.hasChapterLastAd) {
//                            mLastAdRect = new RectF(curPage.adLeft, curPage.adTop, curPage.adRight, curPage.adBottom);
                            mAdEx1Rect = new RectF(curPage.adEx1Left, curPage.adEx1Top, curPage.adEx1Right, curPage.adEx1Bottom);
                            mAdEx2Rect = new RectF(curPage.adEx2Left, curPage.adEx2Top, curPage.adEx2Right, curPage.adEx2Bottom);

                            //是否点击的广告
//                            if (mLastAdRect.contains(x, y)) {
//                                LogUtils.i("yy","click last ad");
//                                curPage.adView.performClick();
//                                return true;
//                            } else
                            if (mAdEx1Rect.contains(x, y)) {
                                LogUtils.i("yy","click ex1 ad");
                                mPageLoader.showRewardVideo();
                                return true;
                            } else if (mAdEx2Rect.contains(x, y)) {
                                LogUtils.i("yy","click ex2 ad");
                                RuleDialog ruleDialog = new RuleDialog(getContext());
                                ruleDialog.show();
                                return true;
                            }
                        } else if (curPage.hasChapterAd) {
//                            mAdRect = new RectF(curPage.adLeft, curPage.adTop, curPage.adRight, curPage.adBottom);
                            mAdEx1Rect = new RectF(curPage.adEx1Left, curPage.adEx1Top, curPage.adEx1Right, curPage.adEx1Bottom);
                            mAdTipRect = new RectF(curPage.adTipLeft, curPage.adTipTop, curPage.adTipRight, curPage.adTipBottom);
                            mAdLoginTipRect = new RectF(curPage.adLoginTipLeft, curPage.adLoginTipTop, curPage.adLoginTipRight, curPage.adLoginTipBottom);
                            //是否点击的广告
                            if (mAdRect.contains(x, y)) {
                                LogUtils.i("yy","click middle ad down event="+event.getAction()+",x="+event.getX()+",y="+event.getY()+",status="+mChapterAdLayout.getVisibility());
//                                if(mChapterAdLayout.getVisibility() == View.INVISIBLE){
//                                    MotionEvent motionEvent = MotionEvent.obtain(event);
//                                    motionEvent.offsetLocation(0,-mPageLoader.mChapterAdMarginTop);
//                                    curPage.adView.dispatchTouchEvent(motionEvent);
//                                }
                                return true;
                            } else if(mAdEx1Rect.contains(x,y)){
                                LogUtils.i("yy","click ex1 ad");
                                mPageLoader.showRewardVideo();
                                return true;
                            } else if (mAdTipRect.contains(x, y)) {
                                LogUtils.i("yy","click tip ad");
                                return true;
                            } else if(TextUtils.isEmpty(mToken) && mAdLoginTipRect.contains(x, y)) {
                                LogUtils.i("yy", "click login ad tip");
                                if(ReadActivity.instance != null && !ReadActivity.instance.isDestroyed()) {
                                    ReadActivity.instance.finish();
                                    MainApplication.getOpenNativePackage().openNativeModule.sendLoginEvent("nativeLogin",
                                    ReadActivity.instance.mCollBook,
                                    ReadActivity.instance.isCollected,
                                    ReadActivity.instance.mCollBook.getSpecialChapterPos(),
                                    ReadActivity.instance.sex,
                                    ReadActivity.instance.token,
                                    ReadActivity.instance.userFreeAdEndtime,
                                    ReadActivity.instance.isVip);
                                }
                                return true;
                            }
                        }
                        }

                    // 点击vip_step按钮
                    if (curPage != null && curPage.isVip) {
                        if(TextUtils.isEmpty(mToken)) {
                            mVipStep1Rect = new RectF(curPage.vipStep1Left, curPage.vipStep1Top, curPage.vipStep1Right, curPage.vipStep1Bottom);
                            if(mVipStep1Rect.contains(x, y)) {
                                LogUtils.i("yy","click vip_step1");
                                if(ReadActivity.instance != null && !ReadActivity.instance.isDestroyed()) {
                                    ReadActivity.instance.finish();
                                    MainApplication.getOpenNativePackage().openNativeModule.sendVipCenterEvent(
                                        ReadActivity.instance.mCollBook,
                                        ReadActivity.instance.isCollected,
                                        ReadActivity.instance.mCollBook.getSpecialChapterPos(),
                                        ReadActivity.instance.sex,
                                        ReadActivity.instance.token,
                                        ReadActivity.instance.userFreeAdEndtime,
                                        ReadActivity.instance.isVip);
                                }
                                return true;
                            }
                        } else {
                            mVipStep2Rect = new RectF(curPage.vipStep2Left, curPage.vipStep2Top, curPage.vipStep2Right, curPage.vipStep2Bottom);
                            if(mVipStep2Rect.contains(x, y)) {
                                LogUtils.i("yy","click vip_step2");
                                if(ReadActivity.instance != null && !ReadActivity.instance.isDestroyed()) {
                                    ReadActivity.instance.finish();
                                    MainApplication.getOpenNativePackage().openNativeModule.sendVipCenterEvent(
                                        ReadActivity.instance.mCollBook,
                                        ReadActivity.instance.isCollected,
                                        ReadActivity.instance.mCollBook.getSpecialChapterPos(),
                                        ReadActivity.instance.sex,
                                        ReadActivity.instance.token,
                                        ReadActivity.instance.userFreeAdEndtime,
                                        ReadActivity.instance.isVip);
                                }
                                return true;
                            }
                        }
                    }

                    //是否点击了中间
                    if (mCenterRect.contains(x, y)) {
                        if (mTouchListener != null) {
                            mTouchListener.center();
                        }
                        return true;
                    } else if(mPageLoader.getHotbeanRect().contains(x, y)) {
                        HotbeanTipDialog hotbeanTipDialog = new HotbeanTipDialog(getContext());
                        hotbeanTipDialog.show();
                        return true;
                    } else if(mPageLoader.mAllMusic.size() > 0 && mPageLoader.getMusicRect().contains(x, y)) {
                        LogUtils.i("yy","onTouch music");
                        mMusicLayout.setVisibility(View.VISIBLE);
                        return true;
                    }
                }
                mPageAnim.onTouchEvent(event);
                break;
        }
        return true;
    }

    /**
     * 判断是否存在上一页
     *
     * @return
     */
    private boolean hasPrevPage() {
        mTouchListener.prePage();
        return mPageLoader.prev();
    }

    /**
     * 判断是否下一页存在
     *
     * @return
     */
    private boolean hasNextPage() {
        mTouchListener.nextPage();
        return mPageLoader.next();
    }

    private void pageCancel() {
        mTouchListener.cancel();
        mPageLoader.pageCancel();
    }

    @Override
    public void computeScroll() {
        //进行滑动
        mPageAnim.scrollAnim();
        super.computeScroll();
    }

    //如果滑动状态没有停止就取消状态，重新设置Anim的触碰点
    public void abortAnimation() {
        mPageAnim.abortAnim();
    }

    public boolean isRunning() {
        if (mPageAnim == null) {
            return false;
        }
        return mPageAnim.isRunning();
    }

    public boolean isPrepare() {
        return isPrepare;
    }

    public void setTouchListener(TouchListener mTouchListener) {
        this.mTouchListener = mTouchListener;
    }

    public void drawNextPage() {
        if (!isPrepare) return;

        if (mPageAnim instanceof HorizonPageAnim) {
            ((HorizonPageAnim) mPageAnim).changePage();
        }
        mPageLoader.drawPage(getNextBitmap(), false);
    }

    /**
     * 绘制当前页。
     *
     * @param isUpdate
     */
    public void drawCurPage(boolean isUpdate) {
        if (!isPrepare) return;

        if (!isUpdate){
            if (mPageAnim instanceof ScrollPageAnim) {
                ((ScrollPageAnim) mPageAnim).resetBitmap();
            }
        }

        mPageLoader.drawPage(getNextBitmap(), isUpdate);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (mPageAnim != null) {
            mPageAnim.abortAnim();
            mPageAnim.clear();
        }

        mPageLoader = null;
        mPageAnim = null;
    }

    /**
     * 获取 PageLoader
     *
     * @param collBook
     * @return
     */
    public PageLoader getPageLoader(CollBookBean collBook) {
        // 判是否已经存在
        if (mPageLoader != null) {
            return mPageLoader;
        }
        // 根据书籍类型，获取具体的加载器

        mPageLoader = new NetPageLoader(this, collBook);
        // 判断是否 PageView 已经初始化完成
        if (mViewWidth != 0 || mViewHeight != 0) {
            // 初始化 PageLoader 的屏幕大小
            mPageLoader.prepareDisplay(mViewWidth, mViewHeight);
        }

        return mPageLoader;
    }

    public interface TouchListener {
        boolean onTouch();

        void center();

        void prePage();

        void nextPage();

        void cancel();
    }
}
