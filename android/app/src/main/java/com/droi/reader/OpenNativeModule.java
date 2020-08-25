package com.droi.reader;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.os.SystemClock;
import android.widget.Button;
import android.text.TextUtils;
import android.widget.Toast;

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

import com.droi.reader.model.bean.CollBookBean;
import com.droi.reader.ui.activity.ReadActivity;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.utils.NetworkUtils;
import com.droi.reader.utils.Constant;
import com.droi.reader.utils.ScreenUtils;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.model.local.ReadSettingManager;
import com.droi.reader.widget.page.PageStyle;
import com.droi.reader.utils.CommonUtils;
import com.droi.reader.utils.TTAdManagerHolder;
import com.droi.reader.utils.LogUtils;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Callback;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.FilterWord;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdDislike;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTNativeExpressAd;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;

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

public class OpenNativeModule extends ReactContextBaseJavaModule {
    private static final String TAG = "OpenNativeModule";
    private static final String KEY_ID = "id";
    private static final String KEY_NAME = "name";
    private static final String KEY_AUTHOR = "author";
    private static final String KEY_WORD_COUNT = "word_count";
    private static final String KEY_COVER = "cover";
    private static final String KEY_BRIEF = "brief";
    private static final String KEY_KEYWORDS = "keywords";
    private static final String KEY_COMPLETE_STATUS = "complete_status";
    private static final String KEY_PRICE = "price";
    private static final String KEY_ISVIP = "isvip";
    private static final String KEY_CREATE_TIME = "create_time";
    private static final String KEY_CATEGORY_NAME = "category_name";
    private static final String KEY_CHAPTER_COUNT = "chapter_count";
    private static final String KEY_SPECIAL_CHAPTER_POS = "special_chapter_pos";
    private static final String KEY_BOOK_FREE_AD_STARTTIME = "start_ad_ts";
    private static final String KEY_BOOK_FREE_AD_ENDTIME = "end_ad_ts";
    private static final String KEY_USER_FREE_AD_ENDTIME = "free_ad_expirets";
    private static final String KEY_BOOK_FREE_VIP_STARTTIME = "start_vip_ts";
    private static final String KEY_BOOK_FREE_VIP_ENDTIME = "end_vip_ts";
    //login params
    private static final String KEY_IS_COLLECTED = "is_collected";
    private static final String KEY_SEX = "sex";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_USER_IS_VIP = "user_is_vip";

    //章节名称
    private static final String KEY_CHAPTER_TITLE = "chapter_title";
    private static final String KEY_CHAPTER_ID = "chapter_id";
    private static final String KEY_CHAPTER_SORT = "chapter_sort";

    private static final String KEY_IS_NIGHT_MODE ="is_night_mode";

    private ReactContext mReactContext;
    private SharedPreUtils mSharedPreUtils;

    public OpenNativeModule(ReactApplicationContext context) {
        super(context);
        this.mReactContext = context;
        mSharedPreUtils = SharedPreUtils.getInstance();
    }

    @Override
    public String getName() {
        return "OpenNativeModule";
    }

    @ReactMethod
    public void checkUpdate() {
        MainActivity.instance.sendCheckUpdateMsg();
    }

    @ReactMethod
    public void getMusicPlayFeature(Callback callback) {
        boolean musicPlayFeature = mSharedPreUtils.getMusicPlayFeature();
        callback.invoke(musicPlayFeature);
    }

    @ReactMethod
    public void setMusicPlayFeature(boolean musicPlayFeature) {
        mSharedPreUtils.setMusicPlayFeature(musicPlayFeature);
    }

    @ReactMethod
    public void getNightMode(Callback callback) {
        boolean isNightMode = ReadSettingManager.getInstance().isNightMode();
        callback.invoke(isNightMode);
    }

    @ReactMethod
    public void setNightMode(boolean isNightMode) {
        ReadSettingManager.getInstance().setNightMode(isNightMode);
        MainActivity.instance.sendUpdateNightModeMsg();
        if (isNightMode) {
          // do nothing
          ReadSettingManager.getInstance().setPageStyle(PageStyle.NIGHT);
        } else {
            PageStyle pageStyle = ReadSettingManager.getInstance().getLastPageStyle();
            ReadSettingManager.getInstance().setPageStyle(pageStyle);
        }
    }

    //加载激励视频广告
    private int curLoadRewardVideoType = 0;
    @ReactMethod
    private void loadRewardeVideo(Promise promise){
        int adType = CommonUtils.getRandomAdType();
        LogUtils.i(TAG,"loadChapterAd adType="+adType);
        curLoadRewardVideoType = adType;
        switch(adType){
            case Constant.AD_TYPE_TT:
                loadTTRewardVideoAd(promise, CommonUtils.getTTAdRewardSlotId());
                break;
            case Constant.AD_TYPE_GDT:
                loadGDTRewardVideoAd(promise, CommonUtils.getGDTAdRewardSlotId());
                break;
        }
    }
    //显示激励视频广告
    @ReactMethod
    public void playRewardeVideo(){
        switch(curLoadRewardVideoType){
            case Constant.AD_TYPE_TT:
                showTTRewardVideoAd();
                break;
            case Constant.AD_TYPE_GDT:
                showGDTRewardVideoAd();
                break;
            default:
                Toast.makeText(MainActivity.instance, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
                break;
        }
    }

    @ReactMethod
    public void saveApiAddress(String apiAddress) {
        String lastApiAddress = mSharedPreUtils.getApiAddress();
        if (!TextUtils.equals(apiAddress, lastApiAddress)) {
            mSharedPreUtils.setApiAddress(apiAddress);
        }
    }

    @ReactMethod
    public void saveAdsSource(String adsSource) {
        SharedPreUtils.getInstance().saveAdsSource(adsSource);
    }

    @ReactMethod
    public void saveWechatShareWebpageUrl(String webpageUrl) {
        String lastWebpageUrl = mSharedPreUtils.getWechatShareWebpageUrl();
        if (!TextUtils.equals(webpageUrl, lastWebpageUrl)) {
            mSharedPreUtils.setWechatShareWebpageUrl(webpageUrl);
        }
    }

    @ReactMethod
    public void hideSplash() {
        LogUtils.i("yy","start hide");
        if (MainActivity.instance != null && !MainActivity.instance.isDestroyed()) {
            MainActivity.instance.hideSplash();
        }
    }

    @ReactMethod
    public void openNativeReaderPage(ReadableMap bookDetail, boolean isCollected, int specialChapterPos, int sex, String token, int userFreeAdEndTime, int userIsVip) {
        long id = (long)bookDetail.getDouble(KEY_ID);
        String name = bookDetail.getString(KEY_NAME);
        String author = bookDetail.getString(KEY_AUTHOR);
        //int wordCount = bookDetail.getInt(KEY_WORD_COUNT);
        String cover = bookDetail.getString(KEY_COVER);
        String brief = bookDetail.getString(KEY_BRIEF);
        //String keywords = bookDetail.getString(KEY_KEYWORDS);
        int completeStatus = bookDetail.getInt(KEY_COMPLETE_STATUS);
        //int price = bookDetail.getInt(KEY_PRICE);
        //int isVip = bookDetail.getInt(KEY_ISVIP);
        String createTime = bookDetail.getString(KEY_CREATE_TIME);
        //String categoryName = bookDetail.getString(KEY_CATEGORY_NAME);
        //int chapterCount = bookDetail.getInt(KEY_CHAPTER_COUNT);
        String bookFreeAdStartTime = bookDetail.getString(KEY_BOOK_FREE_AD_STARTTIME);
        String bookFreeAdEndTime = bookDetail.getString(KEY_BOOK_FREE_AD_ENDTIME);
        String bookFreeVipStartTime = bookDetail.getString(KEY_BOOK_FREE_VIP_STARTTIME);
        String bookFreeVipEndTime = bookDetail.getString(KEY_BOOK_FREE_VIP_ENDTIME);
        LogUtils.i("yy","id="+id);
        LogUtils.i("yy","name="+name);
        LogUtils.i("yy","author="+author);
        //LogUtils.i("yy","wordCount="+wordCount);
        LogUtils.i("yy","cover="+cover);
        LogUtils.i("yy","brief="+brief);
        //LogUtils.i("yy","keywords="+keywords);
        LogUtils.i("yy","completeStatus="+completeStatus);
        //LogUtils.i("yy","price="+price);
        //LogUtils.i("yy","isVip="+isVip);
        LogUtils.i("yy","createTime="+createTime);
        //LogUtils.i("yy","categoryName="+categoryName);
        //LogUtils.i("yy","chapterCount="+chapterCount);
        LogUtils.i("yy","specialChapterPos="+specialChapterPos);
        LogUtils.i("yy","sex="+sex);
        LogUtils.i("yy","token="+token);
        LogUtils.i("yy","userIsVip="+userIsVip);
        LogUtils.i("yy","bookFreeAdStartTime="+bookFreeAdStartTime);
        LogUtils.i("yy","bookFreeAdEndTime="+bookFreeAdEndTime);
        LogUtils.i("yy","userFreeAdEndTime="+userFreeAdEndTime);
        LogUtils.i("yy","bookFreeVipStartTime="+bookFreeVipStartTime);
        LogUtils.i("yy","bookFreeVipEndTime="+bookFreeVipEndTime);

        CollBookBean bean = new CollBookBean();
        bean.setId(id);
        bean.setName(name);
        bean.setAuthor(author);
        //bean.setWord_count(wordCount);
        bean.setCover(cover);
        bean.setBrief(brief);
        //bean.setKeywords(keywords);
        bean.setComplete_status(completeStatus);
        //bean.setPrice(price);
        //bean.setIsvip(isVip);
        bean.setCreate_time(createTime);
        bean.setStart_ad_ts(bookFreeAdStartTime);
        bean.setEnd_ad_ts(bookFreeAdEndTime);
        //bean.setCategory_name(categoryName);
        //bean.setChapter_count(chapterCount);
        bean.setSpecialChapterPos(specialChapterPos);
        bean.setStart_vip_ts(bookFreeVipStartTime);
        bean.setEnd_vip_ts(bookFreeVipEndTime);

        Intent intent = new Intent();
        intent.setClass(mReactContext, ReadActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra(ReadActivity.EXTRA_COLL_BOOK, bean);
        intent.putExtra(ReadActivity.EXTRA_IS_COLLECTED, isCollected);
        intent.putExtra(ReadActivity.EXTRA_SEX, sex);
        intent.putExtra(ReadActivity.EXTRA_TOKEN, token);
        intent.putExtra(ReadActivity.EXTRA_USER_IS_VIP, userIsVip);

        intent.putExtra(ReadActivity.EXTRA_USER_FREE_AD_ENDTIME, userFreeAdEndTime);
        mReactContext.startActivity(intent);
    }

    public void sendEvent(String eventName) {
        String dataToRN = "加入书架，更新书籍详情页中加入书架的button";
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, dataToRN);
    }

    public void sendEvent(String eventName, WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void sendRecordEvent(String eventName, CollBookBean bean, String chapterTitle, long chapterId, int chapterSort) {
        WritableMap params = Arguments.createMap();
        params.putDouble(KEY_ID, bean.getId());
        params.putString(KEY_NAME, bean.getName());
        params.putString(KEY_AUTHOR, bean.getAuthor());
        //params.putInt(KEY_WORD_COUNT, bean.getWord_count());
        params.putString(KEY_COVER, bean.getCover());
        params.putString(KEY_BRIEF, bean.getBrief());
        //params.putString(KEY_KEYWORDS, bean.getKeywords());
        params.putInt(KEY_COMPLETE_STATUS, bean.getComplete_status());
        //params.putInt(KEY_PRICE, bean.getPrice());
        //params.putInt(KEY_ISVIP, bean.getIsvip());
        params.putString(KEY_CREATE_TIME, bean.getCreate_time());
        //params.putString(KEY_CATEGORY_NAME, bean.getCategory_name());
        //params.putInt(KEY_CHAPTER_COUNT, bean.getChapter_count());
        params.putInt(KEY_SPECIAL_CHAPTER_POS, bean.getSpecialChapterPos());
        // 添加章节名称
        params.putString(KEY_CHAPTER_TITLE, chapterTitle);
        params.putDouble(KEY_CHAPTER_ID, chapterId);
        params.putInt(KEY_CHAPTER_SORT, chapterSort);
        // 添加书籍限时免广告starttime,endtime
        params.putString(KEY_BOOK_FREE_AD_STARTTIME, bean.getStart_ad_ts());
        params.putString(KEY_BOOK_FREE_AD_ENDTIME, bean.getEnd_ad_ts());
        // 添加书籍VIP限时免费starttime,endtime
        params.putString(KEY_BOOK_FREE_VIP_STARTTIME, bean.getStart_vip_ts());
        params.putString(KEY_BOOK_FREE_VIP_ENDTIME, bean.getEnd_vip_ts());

        sendEvent(eventName, params);
    }


    public void sendSyncFinishReadBookEvent(String eventName, double bookId) {
            WritableMap params = Arguments.createMap();
            params.putDouble("book_id", bookId);

            sendEvent(eventName, params);
    }

    public void sendLoginEvent(String eventName, CollBookBean bean, boolean isCollected, int specialChapterPos, int sex, String token, int userFreeAdEndTime, int userIsVip) {
            WritableMap params = Arguments.createMap();
            params.putDouble(KEY_ID, bean.getId());
            params.putString(KEY_NAME, bean.getName());
            params.putString(KEY_AUTHOR, bean.getAuthor());
            //params.putInt(KEY_WORD_COUNT, bean.getWord_count());
            params.putString(KEY_COVER, bean.getCover());
            params.putString(KEY_BRIEF, bean.getBrief());
            //params.putString(KEY_KEYWORDS, bean.getKeywords());
            params.putInt(KEY_COMPLETE_STATUS, bean.getComplete_status());
            //params.putInt(KEY_PRICE, bean.getPrice());
            //params.putInt(KEY_ISVIP, bean.getIsvip());
            params.putString(KEY_CREATE_TIME, bean.getCreate_time());
            //params.putString(KEY_CATEGORY_NAME, bean.getCategory_name());
            //params.putInt(KEY_CHAPTER_COUNT, bean.getChapter_count());
            params.putInt(KEY_SPECIAL_CHAPTER_POS, bean.getSpecialChapterPos());
            // 添加isCollected，sex，token等参数
            params.putBoolean(KEY_IS_COLLECTED, isCollected);
            params.putInt(KEY_SEX, sex);
            params.putString(KEY_TOKEN, token);
            params.putInt(KEY_USER_IS_VIP, userIsVip);

            // 添加书籍限时免广告starttime,endtime
            params.putString(KEY_BOOK_FREE_AD_STARTTIME, bean.getStart_ad_ts());
            params.putString(KEY_BOOK_FREE_AD_ENDTIME, bean.getEnd_ad_ts());
            // 添加用户积分兑换免广告endtime
            params.putInt(KEY_USER_FREE_AD_ENDTIME, userFreeAdEndTime);
            // 添加书籍VIP限时免费starttime,endtime
            params.putString(KEY_BOOK_FREE_VIP_STARTTIME, bean.getStart_vip_ts());
            params.putString(KEY_BOOK_FREE_VIP_ENDTIME, bean.getEnd_vip_ts());

            sendEvent(eventName, params);
    }

    public void sendNightModeEvent(String eventName, boolean isNightMode) {
            WritableMap params = Arguments.createMap();
            params.putBoolean(KEY_IS_NIGHT_MODE, isNightMode);
            sendEvent(eventName, params);
    }

    public void sendShareEvent(String shareType, String title , String description, String webpageUrl, String imageUrl) {
            WritableMap params = Arguments.createMap();
            params.putString("shareType", shareType);
            params.putString("title", title);
            params.putString("description", description);
            params.putString("webpageUrl", webpageUrl);
            params.putString("imageUrl", imageUrl);
            LogUtils.i("gg","sendShareEvent");
            sendEvent("onShare", params);
    }

    public void sendCommentEvent(int tag, CollBookBean bean, boolean isCollected, int specialChapterPos, int sex, String token, int userFreeAdEndTime, int userIsVip) {
            WritableMap params = Arguments.createMap();
            params.putDouble(KEY_ID, bean.getId());
            params.putString(KEY_NAME, bean.getName());
            params.putString(KEY_AUTHOR, bean.getAuthor());
            //params.putInt(KEY_WORD_COUNT, bean.getWord_count());
            params.putString(KEY_COVER, bean.getCover());
            params.putString(KEY_BRIEF, bean.getBrief());
            //params.putString(KEY_KEYWORDS, bean.getKeywords());
            params.putInt(KEY_COMPLETE_STATUS, bean.getComplete_status());
            //params.putInt(KEY_PRICE, bean.getPrice());
            //params.putInt(KEY_ISVIP, bean.getIsvip());
            params.putString(KEY_CREATE_TIME, bean.getCreate_time());
            //params.putString(KEY_CATEGORY_NAME, bean.getCategory_name());
            //params.putInt(KEY_CHAPTER_COUNT, bean.getChapter_count());
            params.putInt(KEY_SPECIAL_CHAPTER_POS, bean.getSpecialChapterPos());
            // 添加isCollected，sex，token等参数
            params.putBoolean(KEY_IS_COLLECTED, isCollected);
            params.putInt(KEY_SEX, sex);
            params.putString(KEY_TOKEN, token);
            params.putInt(KEY_USER_IS_VIP, userIsVip);
            // 添加书籍限时免广告starttime,endtime
            params.putString(KEY_BOOK_FREE_AD_STARTTIME, bean.getStart_ad_ts());
            params.putString(KEY_BOOK_FREE_AD_ENDTIME, bean.getEnd_ad_ts());
            // 添加用户积分兑换免广告endtime
            params.putInt(KEY_USER_FREE_AD_ENDTIME, userFreeAdEndTime);
            // 添加书籍VIP限时免费starttime,endtime
            params.putString(KEY_BOOK_FREE_VIP_STARTTIME, bean.getStart_vip_ts());
            params.putString(KEY_BOOK_FREE_VIP_ENDTIME, bean.getEnd_vip_ts());
            params.putInt("tag",tag);
            sendEvent("onCommentAction", params);
    }

    public void sendVipCenterEvent(CollBookBean bean, boolean isCollected, int specialChapterPos, int sex, String token, int userFreeAdEndTime, int userIsVip) {
            WritableMap params = Arguments.createMap();
            params.putDouble(KEY_ID, bean.getId());
            params.putString(KEY_NAME, bean.getName());
            params.putString(KEY_AUTHOR, bean.getAuthor());
            //params.putInt(KEY_WORD_COUNT, bean.getWord_count());
            params.putString(KEY_COVER, bean.getCover());
            params.putString(KEY_BRIEF, bean.getBrief());
            //params.putString(KEY_KEYWORDS, bean.getKeywords());
            params.putInt(KEY_COMPLETE_STATUS, bean.getComplete_status());
            //params.putInt(KEY_PRICE, bean.getPrice());
            //params.putInt(KEY_ISVIP, bean.getIsvip());
            params.putString(KEY_CREATE_TIME, bean.getCreate_time());
            //params.putString(KEY_CATEGORY_NAME, bean.getCategory_name());
            //params.putInt(KEY_CHAPTER_COUNT, bean.getChapter_count());
            params.putInt(KEY_SPECIAL_CHAPTER_POS, bean.getSpecialChapterPos());
            // 添加isCollected，sex，token等参数
            params.putBoolean(KEY_IS_COLLECTED, isCollected);
            params.putInt(KEY_SEX, sex);
            params.putString(KEY_TOKEN, token);
            params.putInt(KEY_USER_IS_VIP, userIsVip);
            // 添加书籍限时免广告starttime,endtime
            params.putString(KEY_BOOK_FREE_AD_STARTTIME, bean.getStart_ad_ts());
            params.putString(KEY_BOOK_FREE_AD_ENDTIME, bean.getEnd_ad_ts());
            // 添加用户积分兑换免广告endtime
            params.putInt(KEY_USER_FREE_AD_ENDTIME, userFreeAdEndTime);
            // 添加书籍VIP限时免费starttime,endtime
            params.putString(KEY_BOOK_FREE_VIP_STARTTIME, bean.getStart_vip_ts());
            params.putString(KEY_BOOK_FREE_VIP_ENDTIME, bean.getEnd_vip_ts());
            sendEvent("onVipCenterAction", params);
    }

    public void sendReadTimeEvent(int duration){
        WritableMap params = Arguments.createMap();
        params.putInt("duration", duration);
        sendEvent("readTime", params);
    }


    //穿山甲激励视频广告
    private TTAdNative mTTAdNative;
    private TTRewardVideoAd mttRewardVideoAd;
    private boolean mIsExpress = true; //是否请求模板广告
    private void loadTTRewardVideoAd(Promise promise, String codeId) {
        //step4:创建广告请求参数AdSlot,具体参数含义参考文档
        //step2:创建TTAdNative对象，createAdNative(Context context) banner广告context需要传入Activity对象
        mTTAdNative = TTAdManagerHolder.get().createAdNative(MainActivity.instance.getApplicationContext());
        //step3:(可选，强烈建议在合适的时机调用):申请部分权限，如read_phone_state,防止获取不了imei时候，下载类广告没有填充的问题。
        TTAdManagerHolder.get().requestPermissionIfNecessary(MainActivity.instance);
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
                        LogUtils.i(TAG, "Callback --> rewardVideoAd show");
                    }

                    @Override
                    public void onAdVideoBarClick() {
                        LogUtils.i(TAG, "Callback --> rewardVideoAd bar click");
                    }

                    @Override
                    public void onAdClose() {
                        LogUtils.i(TAG, "Callback --> rewardVideoAd close");
                         promise.resolve("onAdClose");
                    }

                    //视频播放完成回调
                    @Override
                    public void onVideoComplete() {
                        LogUtils.i(TAG, "Callback --> rewardVideoAd complete");
                        promise.resolve("onVideoComplete");
                    }

                    @Override
                    public void onVideoError() {
                        LogUtils.i(TAG, "Callback --> rewardVideoAd error");
                        promise.reject("激励视频加载失败");
                    }

                    //视频播放完成后，奖励验证回调，rewardVerify：是否有效，rewardAmount：奖励梳理，rewardName：奖励名称
                    @Override
                    public void onRewardVerify(boolean rewardVerify, int rewardAmount, String rewardName) {
                        String logString = "verify:" + rewardVerify + " amount:" + rewardAmount +
                                " name:" + rewardName;
                        LogUtils.i(TAG, "Callback --> " + logString);

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
                        LogUtils.i("DML", "onDownloadActive==totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);
                    }

                    @Override
                    public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {
                        LogUtils.i("DML", "onDownloadPaused===totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);
                    }

                    @Override
                    public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {
                        LogUtils.i("DML", "onDownloadFailed==totalBytes=" + totalBytes + ",currBytes=" + currBytes + ",fileName=" + fileName + ",appName=" + appName);
                    }

                    @Override
                    public void onDownloadFinished(long totalBytes, String fileName, String appName) {
                        LogUtils.i("DML", "onDownloadFinished==totalBytes=" + totalBytes + ",fileName=" + fileName + ",appName=" + appName);
                    }

                    @Override
                    public void onInstalled(String fileName, String appName) {
                        LogUtils.i("DML", "onInstalled==" + ",fileName=" + fileName + ",appName=" + appName);
                    }
                });
            }
        });
    }



    public void showTTRewardVideoAd() {
        if (mttRewardVideoAd != null) {
            //step6:在获取到广告后展示,强烈建议在onRewardVideoCached回调后，展示广告，提升播放体验
            //展示广告，并传入广告展示的场景
            MainActivity.instance.runOnUiThread(() -> {
                mttRewardVideoAd.showRewardVideoAd(MainActivity.instance, TTAdConstant.RitScenes.CUSTOMIZE_SCENES, "scenes_test");
                mttRewardVideoAd = null;
            });

        } else {
            Toast.makeText(MainActivity.instance, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
        }
    }


    //广点通激励视频广告
    private RewardVideoAD rewardVideoAD;
    private boolean adLoaded;//广告加载成功标志
    private void loadGDTRewardVideoAd(Promise promise, String codeId){
        boolean volumeOn = false;
        rewardVideoAD = new RewardVideoAD(MainActivity.instance, codeId, new RewardVideoADListener() {
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
                promise.resolve("onVideoComplete");
            }

            @Override
            public void onADClose() {
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onADClose");
                promise.resolve("onAdClose");
            }

            @Override
            public void onError(AdError adError) {
                String msg = String.format(Locale.getDefault(), "onError, error code: %d, error msg: %s",
                        adError.getErrorCode(), adError.getErrorMsg());
                LogUtils.i(TAG,"loadGDTRewardVideoAd-->onError msg="+msg);
                promise.reject(msg);
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
                    rewardVideoAD.showAD(MainActivity.instance);
                } else {
                    LogUtils.i(TAG,"showGDTRewardVideoAd-->激励视频广告已过期，请再次请求广告后进行广告展示！");
                    Toast.makeText(MainActivity.instance, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
//                    Toast.makeText(MainActivity.instance, "激励视频广告已过期，请再次请求广告后进行广告展示！", Toast.LENGTH_LONG).show();
                }
            } else {
                LogUtils.i(TAG,"showGDTRewardVideoAd-->此条广告已经展示过，请再次请求广告后进行广告展示！");
                Toast.makeText(MainActivity.instance, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
//                Toast.makeText(MainActivity.instance, "此条广告已经展示过，请再次请求广告后进行广告展示！", Toast.LENGTH_LONG).show();
            }
        } else {
            LogUtils.i(TAG,"showGDTRewardVideoAd-->成功加载广告后再进行广告展示！");
            Toast.makeText(MainActivity.instance, R.string.toast_no_reward_ad, Toast.LENGTH_SHORT).show();
//            Toast.makeText(MainActivity.instance, "成功加载广告后再进行广告展示！", Toast.LENGTH_LONG).show();
        }
    }


}
