package com.droi.reader.adview;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.FilterWord;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdDislike;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTNativeExpressAd;
import com.droi.reader.R;
import com.droi.reader.utils.BitmapUtils;
import com.droi.reader.utils.CommonUtils;
import com.droi.reader.utils.Constant;
import com.droi.reader.utils.DislikeDialog;
import com.droi.reader.utils.LogUtils;
import com.droi.reader.utils.ScreenUtils;
import com.droi.reader.utils.TTAdManagerHolder;
import com.droi.reader.utils.Util;
import com.qq.e.ads.nativ.express2.AdEventListener;
import com.qq.e.ads.nativ.express2.MediaEventListener;
import com.qq.e.ads.nativ.express2.NativeExpressAD2;
import com.qq.e.ads.nativ.express2.NativeExpressADData2;
import com.qq.e.ads.nativ.express2.VideoOption2;
import com.qq.e.comm.util.AdError;

import java.util.List;

public class AdView extends FrameLayout {
    private static final String TAG ="yy";
    private Context mContext;
    private AdViewLoadCallback mAdViewLoadCallback;

    private FrameLayout mAdContainer;


    public AdView(Context context, AdViewLoadCallback adViewLoadCallback) {
        super(context);
        mContext = context;
        mAdViewLoadCallback = adViewLoadCallback;
        LayoutInflater.from(context).inflate(R.layout.view_detail_ad_container, this);
        mAdContainer = findViewById(R.id.ad_container);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        LogUtils.i(TAG,"AdView-->onAttachedToWindow parent="+getParent());
        loadInfoAd();
    }

    private void loadInfoAd() {
        int adType = CommonUtils.getRandomAdType();
        LogUtils.i(TAG,"AdView-->loadInfoAd adType="+adType);
        switch(adType){
            case Constant.AD_TYPE_TT:
                loadTTExpressInfoAd(CommonUtils.getTTAdInfo2SlotId());//左图右文
                break;
            case Constant.AD_TYPE_GDT:
                loadGDTExpressInfoAd(CommonUtils.getGDTAdInfo2SlotId());
                break;
        }
    }

    @Override
    protected void onDetachedFromWindow(){
        super.onDetachedFromWindow();
        LogUtils.i(TAG,"AdView-->onDetachedFromWindow");
        //穿山甲信息流广告
        if(mTTInfoAd != null){
            mTTInfoAd.destroy();
        }
        //广点通信息流广告
        destroyAd();
    }


    //穿山甲信息流广告
    private TTAdNative mTTAdNative;
    private TTNativeExpressAd mTTInfoAd;//信息流模板广告
    private void loadTTExpressInfoAd(String codeId) {
        LogUtils.i(TAG,"loadExpressInfoAd codeId="+codeId);
        //step2:创建TTAdNative对象，createAdNative(Context context) banner广告context需要传入Activity对象
        mTTAdNative = TTAdManagerHolder.get().createAdNative(mContext.getApplicationContext());
        //step3:(可选，强烈建议在合适的时机调用):申请部分权限，如read_phone_state,防止获取不了imei时候，下载类广告没有填充的问题。
        TTAdManagerHolder.get().requestPermissionIfNecessary(mContext);
        mAdContainer.removeAllViews();
        float expressViewWidth = Util.getScreenWidthDp(mContext);//600;
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
                mAdContainer.removeAllViews();
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
                LogUtils.i(TAG,"onAdShow");
            }

            @Override
            public void onRenderFail(View view, String msg, int code) {
                LogUtils.e(TAG,"onRenderFail:"+(System.currentTimeMillis() - startTime));
                mAdViewLoadCallback.onLoadFail();
            }

            @Override
            public void onRenderSuccess(View view, float width, float height) {
                LogUtils.e(TAG,"onRenderSuccess:"+(System.currentTimeMillis() - startTime));
                //返回view的宽高 单位 dp
                mAdContainer.removeAllViews();
                mAdContainer.addView(view);
                mAdViewLoadCallback.onLoadSuccess(String.valueOf(height));
            }
        });
        //dislike设置
        bindDislikeInfoAd(ad, false);
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
                    mAdContainer.removeAllViews();
                    mAdViewLoadCallback.onLoadFail();
                }
            });
            ad.setDislikeDialog(dislikeDialog);
            return;
        }
        //使用默认模板中默认dislike弹出样式
        ad.setDislikeCallback((Activity) mContext, new TTAdDislike.DislikeInteractionCallback() {
            @Override
            public void onSelected(int position, String value) {
                mAdContainer.removeAllViews();
                mAdViewLoadCallback.onLoadFail();
            }

            @Override
            public void onCancel() {
            }

            @Override
            public void onRefuse() {

            }
        });
    }



    //广点通信息流广告
    private NativeExpressAD2 mNativeExpressAD2;
    private NativeExpressADData2 mNativeExpressADData2;
    private void loadGDTExpressInfoAd(String codeId) {
        // 创建广告
        mNativeExpressAD2 = new NativeExpressAD2(mContext, codeId, new NativeExpressAD2.AdLoadListener() {
            @Override
            public void onNoAD(AdError error) {
                String errorMsg = String
                        .format("onNoAD, error code: %d, error msg: %s", error.getErrorCode(), error.getErrorMsg());
                LogUtils.i(TAG, "onNoAD: " + errorMsg);
                mAdViewLoadCallback.onLoadFail();
            }

            @Override
            public void onLoadSuccess(List<NativeExpressADData2> adDataList) {
                LogUtils.i(TAG,"onLoadSuccess adDataList.size="+adDataList.size());
                renderAd(adDataList);
            }
        });
        int expressViewWidth = (int)Util.getScreenWidthDp(mContext);//600;
        int expressViewHeight = 0;
        mNativeExpressAD2.setAdSize(expressViewWidth, expressViewHeight); // 单位dp

        // 如果您在平台上新建原生模板广告位时，选择了支持视频，那么可以进行个性化设置（可选）
//        VideoOption2.Builder builder = new VideoOption2.Builder();
        /**
         * 如果广告位支持视频广告，强烈建议在调用loadData请求广告前设置setAutoPlayPolicy，有助于提高视频广告的eCPM值 <br/>
         * 如果广告位仅支持图文广告，则无需调用
         */
//        builder.setAutoPlayPolicy(getValueFromInt(VideoOption2.AutoPlayPolicy.WIFI.getPolicy())) // WIFI 环境下可以自动播放视频
//                .setAutoPlayMuted(true) // 自动播放时为静音
//                .setDetailPageMuted(false)  // 视频详情页播放时不静音
//                .setMaxVideoDuration(0) // 设置返回视频广告的最大视频时长（闭区间，可单独设置），单位:秒，默认为 0 代表无限制，合法输入为：5<=maxVideoDuration<=60. 此设置会影响广告填充，请谨慎设置
//                .setMinVideoDuration(0); // 设置返回视频广告的最小视频时长（闭区间，可单独设置），单位:秒，默认为 0 代表无限制， 此设置会影响广告填充，请谨慎设置
//        mNativeExpressAD2.setVideoOption2(builder.build());
        mNativeExpressAD2.loadAd(1);
        destroyAd();
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
            mAdContainer.removeAllViews();
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
                    LogUtils.i(TAG, "onImpression: " + mNativeExpressADData2);
                }

                @Override
                public void onRenderSuccess() {
                    LogUtils.i(TAG, "onRenderSuccess: " + mNativeExpressADData2);
                    mAdContainer.removeAllViews();
                    if (mNativeExpressADData2.getAdView() != null) {
                        mAdContainer.addView(mNativeExpressADData2.getAdView());

                        Bitmap viewBitmap = BitmapUtils.getViewBitmap(mAdContainer);
                        if(viewBitmap != null){
                            int height = viewBitmap.getHeight();
                            int heightInDp = ScreenUtils.pxToDp(height);
                            LogUtils.i("yy","00 height="+height+",heightInDp="+heightInDp);
                            mAdViewLoadCallback.onLoadSuccess(String.valueOf(heightInDp));
                        }else{
                            LogUtils.i("yy","11 height=120");
                            mAdViewLoadCallback.onLoadSuccess(String.valueOf(100));
                        }
                    }
                }

                @Override
                public void onRenderFail() {
                    LogUtils.i(TAG, "onRenderFail: " + mNativeExpressADData2);
                    mAdViewLoadCallback.onLoadFail();
                }

                @Override
                public void onAdClosed() {
                    LogUtils.i(TAG, "onAdClosed: " + mNativeExpressADData2);
                    mAdContainer.removeAllViews();
                    mNativeExpressADData2.destroy();
                    mAdViewLoadCallback.onLoadSuccess(String.valueOf(0));
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



}
