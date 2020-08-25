package com.droi.reader.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Message;
import android.support.annotation.MainThread;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.RelativeLayout;
import android.os.Handler;
import android.os.Looper;
import android.widget.TextView;
import android.widget.Toast;

import com.droi.reader.MainActivity;
import com.droi.reader.R;
import com.droi.reader.utils.Constant;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.utils.TTAdManagerHolder;
import com.droi.reader.utils.WeakHandler;
import com.droi.reader.utils.CommonUtils;
import com.droi.reader.utils.UIUtils;
import com.droi.reader.utils.LogUtils;

import com.qq.e.ads.splash.SplashAD;
import com.qq.e.ads.splash.SplashADListener;
import com.qq.e.comm.util.AdError;

import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAppDownloadListener;
import com.bytedance.sdk.openadsdk.TTSplashAd;


import android.Manifest;
import android.app.AlertDialog;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.widget.FrameLayout;


import com.droi.reader.utils.PermissionsChecker;

import com.umeng.analytics.MobclickAgent;

import java.util.ArrayList;

import com.bytedance.sdk.openadsdk.TTAdNative;

import com.qq.e.ads.splash.SplashAD;
import com.qq.e.ads.splash.SplashADListener;
import com.qq.e.comm.util.AdError;

public class SplashActivity extends AppCompatActivity {
    private static final String TAG = "yy";
    public static SplashActivity instance;
    public FrameLayout mSplashContainer;

    //穿山甲开屏广告
    private TTAdNative mTTAdNative;
    //是否强制跳转到主页面
    private boolean mForceGoMain;
    //开屏广告加载超时时间,建议大于3000,这里为了冷启动第一次加载到广告并且展示,示例设置了3000ms
    private static final int AD_TIME_OUT = 3000;
    private boolean mIsExpress = false; //是否请求模板广告


    //广点通开屏广告
    private SplashAD splashAD;
    private TextView skipView;
    public boolean canJump = false;
    /**
     * 为防止无广告时造成视觉上类似于"闪退"的情况，设定无广告时页面跳转根据需要延迟一定时间，demo
     * 给出的延时逻辑是从拉取广告开始算开屏最少持续多久，仅供参考，开发者可自定义延时逻辑，如果开发者采用demo
     * 中给出的延时逻辑，也建议开发者考虑自定义minSplashTimeWhenNoAD的值（单位ms）
     **/
    private int minSplashTimeWhenNoAD = 2000;
    /**
     * 记录拉取广告的时间
     */
    private long fetchSplashADTime = 0;
    private Handler handler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        instance = this;
        mSplashContainer = (FrameLayout)findViewById(R.id.splash_container);

        //判断权限
        mSharedPreUtils = SharedPreUtils.getInstance();
        if (mPermissionsChecker == null) {
            mPermissionsChecker = new PermissionsChecker(this);
        }

        if (mPermissionsChecker.lacksPermissions(PERMISSIONS)) {
            ActivityCompat.requestPermissions(this, PERMISSIONS, PERMISSIONS_REQUEST);
        } else {
            prepareJumToSplash();
        }
    }

    @Override
        protected void onResume() {
            super.onResume();
            MobclickAgent.onResume(this);
            switch(curAdType){
                case Constant.AD_TYPE_TT:
                    //判断是否该跳转到主页面
                    if (mForceGoMain) {
                        goToMainActivity();
                    }
                    break;
                case Constant.AD_TYPE_GDT:
                    if (canJump) {
                        next();
                    }
                    //canJump = true;
                    break;
            }
            canJump = true;
            LogUtils.i(TAG,"onResume canJump="+canJump+",curAdType="+curAdType);

        }

        @Override
        protected void onPause() {
            super.onPause();
            MobclickAgent.onPause(this);
            if(curAdType == Constant.AD_TYPE_GDT){
                canJump = false;
            }
        }

        @Override
        protected void onStop() {
            super.onStop();
            if(curAdType == Constant.AD_TYPE_TT){
                mForceGoMain = true;
            }

        }

        @Override
        protected void onDestroy() {
            super.onDestroy();
            if(curAdType == Constant.AD_TYPE_GDT){
                handler.removeCallbacksAndMessages(null);
            }
        }

    @Override
    public void onBackPressed() {
//        super.onBackPressed();
    }



    private static final int PERMISSIONS_REQUEST = 1;
    static final String[] PERMISSIONS = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.ACCESS_FINE_LOCATION,
    };
    private PermissionsChecker mPermissionsChecker;
    private SharedPreUtils mSharedPreUtils;
    private void gotoSetting() {
        Intent intent = new Intent();
        if (Build.VERSION.SDK_INT >= 26) {
            // android 8.0引导
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            intent.putExtra("android.provider.extra.APP_PACKAGE", getPackageName());
        } else if (Build.VERSION.SDK_INT >= 21) {
            // android 5.0-7.0
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            intent.putExtra("app_package", getPackageName());
            intent.putExtra("app_uid", getApplicationInfo().uid);
        } else {
            // 其他
            intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            intent.setData(Uri.fromParts("package", getPackageName(), null));
        }
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finish();
    }

    private void prepareJumToSplash() {
        if (SharedPreUtils.getInstance().getBoolean(Constant.KEY_NOTIFICATION_IS_FIRST, true)) {
            SharedPreUtils.getInstance().putBoolean(Constant.KEY_NOTIFICATION_IS_FIRST, false);
            if (NotificationManagerCompat.from(SplashActivity.this).areNotificationsEnabled()) {
                jumpToSplash();
            } else {
                AlertDialog.Builder builder =new AlertDialog.Builder(this);
                builder.setTitle(R.string.notificatino_title);
                builder.setPositiveButton(R.string.settings, (dialogInterface, i) -> gotoSetting());
                builder.setNegativeButton(R.string.cancel, (dialogInterface, i) -> jumpToSplash());
                AlertDialog alertDialog = builder.create();
                //设置点击屏幕不消失
                alertDialog.setCanceledOnTouchOutside(false);
                //设置点击返回键不消失
                alertDialog.setCancelable(false);
                alertDialog.show();

            }
        } else {
            jumpToSplash();
        }
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        prepareJumToSplash();
    }

    private void jumpToSplash() {
        LogUtils.i("yy","SplashActivity jumpToSplash()");
        loadSplashAd();
    }

    /**
     * 跳转到主页面
     */
    private void goToMainActivity() {
        LogUtils.i("yy","goToMainActivity");
        Intent intent = new Intent(SplashActivity.this, MainActivity.class);
        startActivity(intent);
        //this.finish();
    }

    private int curAdType = 0;
    private void loadSplashAd(){
        int adType = CommonUtils.getRandomAdType();
        LogUtils.i(TAG,"SplashActivity-->loadSplashAd adType="+adType);
        curAdType = adType;
        switch(adType){
            case Constant.AD_TYPE_TT:
                loadTTSplashAd(CommonUtils.getTTAdSplashSlotId());
                break;
            case Constant.AD_TYPE_GDT:
                loadGDTSplashAd(CommonUtils.getGDTAdSplashSlotId());
                break;
            default:
                goToMainActivity();
                break;
        }
    }

    //加载广点通开屏广告
    private void loadGDTSplashAd(String codeId){
        fetchSplashADTime = System.currentTimeMillis();
        splashAD = new SplashAD(SplashActivity.this, skipView, codeId, new SplashADListener() {
            @Override
            public void onADDismissed() {
                LogUtils.i(TAG,"loadGDTSplashAd-->onADDismissed");
                next();
            }

            @Override
            public void onNoAD(AdError error) {
                String str = String.format("LoadSplashADFail, eCode=%d, errorMsg=%s", error.getErrorCode(),
                        error.getErrorMsg());
                LogUtils.i(TAG,"loadGDTSplashAd-->onNoAD msg="+str);
                /**
                 * 为防止无广告时造成视觉上类似于"闪退"的情况，设定无广告时页面跳转根据需要延迟一定时间，demo
                 * 给出的延时逻辑是从拉取广告开始算开屏最少持续多久，仅供参考，开发者可自定义延时逻辑，如果开发者采用demo
                 * 中给出的延时逻辑，也建议开发者考虑自定义minSplashTimeWhenNoAD的值
                 **/
                long alreadyDelayMills = System.currentTimeMillis() - fetchSplashADTime;//从拉广告开始到onNoAD已经消耗了多少时间
                long shouldDelayMills = alreadyDelayMills > minSplashTimeWhenNoAD ? 0 : minSplashTimeWhenNoAD
                        - alreadyDelayMills;//为防止加载广告失败后立刻跳离开屏可能造成的视觉上类似于"闪退"的情况，根据设置的minSplashTimeWhenNoAD
                // 计算出还需要延时多久
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        SplashActivity.this.startActivity(new Intent(SplashActivity.this, MainActivity.class));
                        //SplashActivity.this.finish();
                    }
                }, shouldDelayMills);
            }

            @Override
            public void onADPresent() {
                LogUtils.i(TAG,"loadGDTSplashAd-->onADPresent");
            }

            @Override
            public void onADClicked() {
                LogUtils.i(TAG,"loadGDTSplashAd-->onADClicked clickUrl="+(splashAD.getExt() != null ? splashAD.getExt().get("clickUrl") : ""));
            }

            @Override
            public void onADTick(long millisUntilFinished) {
                LogUtils.i(TAG,"loadGDTSplashAd-->onADTick restTime="+millisUntilFinished+"ms");
            }

            @Override
            public void onADExposure() {
                LogUtils.i(TAG,"loadGDTSplashAd-->onADExposure");
            }

            @Override
            public void onADLoaded(long expireTimestamp) {
                LogUtils.i(TAG,"loadGDTSplashAd-->onADLoaded expireTimestamp="+expireTimestamp);

            }
        }, 0);
        splashAD.fetchAndShowIn(mSplashContainer);
    }
    /**
     * 设置一个变量来控制当前开屏页面是否可以跳转，当开屏广告为普链类广告时，点击会打开一个广告落地页，此时开发者还不能打开自己的App主页。当从广告落地页返回以后，
     * 才可以跳转到开发者自己的App主页；当开屏广告是App类广告时只会下载App。
     */
    private void next() {
        LogUtils.i(TAG,"next-->canJump="+canJump);
        if (canJump) {
            this.startActivity(new Intent(this, MainActivity.class));
            //this.finish();
        } else {
            canJump = true;
        }
    }



    //加载穿山甲开屏广告
    private void loadTTSplashAd(String codeId) {
        //step2:创建TTAdNative对象
        mTTAdNative = TTAdManagerHolder.get().createAdNative(this);
        //在开屏时候申请不太合适，因为该页面倒计时结束或者请求超时会跳转，在该页面申请权限，体验不好
        // TTAdManagerHolder.getInstance(this).requestPermissionIfNecessary(this);
        //step3:创建开屏广告请求参数AdSlot,具体参数含义参考文档
        AdSlot adSlot = null;
        if (mIsExpress) {
            //个性化模板广告需要传入期望广告view的宽、高，单位dp，请传入实际需要的大小，
            //比如：广告下方拼接logo、适配刘海屏等，需要考虑实际广告大小
            float expressViewWidth = UIUtils.getScreenWidthDp(this);
            float expressViewHeight = UIUtils.getHeight(this);
            adSlot = new AdSlot.Builder()
                    .setCodeId(codeId)
                    .setSupportDeepLink(true)
                    .setImageAcceptedSize(1080, 1920)
                    //模板广告需要设置期望个性化模板广告的大小,单位dp,代码位是否属于个性化模板广告，请在穿山甲平台查看
                    .setExpressViewAcceptedSize(expressViewWidth, expressViewHeight)
                    .build();
        } else {
            adSlot = new AdSlot.Builder()
                    .setCodeId(codeId)
                    .setSupportDeepLink(true)
                    .setImageAcceptedSize(1080, 1920)
                    .build();
        }

        //step4:请求广告，调用开屏广告异步请求接口，对请求回调的广告作渲染处理
        mTTAdNative.loadSplashAd(adSlot, new TTAdNative.SplashAdListener() {
            @Override
            @MainThread
            public void onError(int code, String message) {
                LogUtils.d(TAG, String.valueOf(message));
                goToMainActivity();
            }

            @Override
            @MainThread
            public void onTimeout() {
                goToMainActivity();
            }

            @Override
            @MainThread
            public void onSplashAdLoad(TTSplashAd ad) {
                LogUtils.d(TAG, "开屏广告请求成功");
                if (ad == null) {
                    return;
                }
                //获取SplashView
                View view = ad.getSplashView();
                if (view != null && mSplashContainer != null && !SplashActivity.this.isFinishing()) {
                    mSplashContainer.removeAllViews();
                    //把SplashView 添加到ViewGroup中,注意开屏广告view：width >=70%屏幕宽；height >=50%屏幕高
                    mSplashContainer.addView(view);
                    //设置不开启开屏广告倒计时功能以及不显示跳过按钮,如果这么设置，您需要自定义倒计时逻辑
                    //ad.setNotAllowSdkCountdown();
                }else {
                    goToMainActivity();
                }

                //设置SplashView的交互监听器
                ad.setSplashInteractionListener(new TTSplashAd.AdInteractionListener() {
                    @Override
                    public void onAdClicked(View view, int type) {
                        LogUtils.d(TAG, "onAdClicked");
                    }

                    @Override
                    public void onAdShow(View view, int type) {
                        LogUtils.d(TAG, "onAdShow");
                    }

                    @Override
                    public void onAdSkip() {
                        LogUtils.d(TAG, "onAdSkip");
                        goToMainActivity();

                    }

                    @Override
                    public void onAdTimeOver() {
                        LogUtils.d(TAG, "onAdTimeOver");
                        goToMainActivity();
                    }
                });
                if(ad.getInteractionType() == TTAdConstant.INTERACTION_TYPE_DOWNLOAD) {
                    ad.setDownloadListener(new TTAppDownloadListener() {
                        boolean hasShow = false;

                        @Override
                        public void onIdle() {
                        }

                        @Override
                        public void onDownloadActive(long totalBytes, long currBytes, String fileName, String appName) {
                            if (!hasShow) {
                                hasShow = true;
                            }
                        }

                        @Override
                        public void onDownloadPaused(long totalBytes, long currBytes, String fileName, String appName) {

                        }

                        @Override
                        public void onDownloadFailed(long totalBytes, long currBytes, String fileName, String appName) {

                        }

                        @Override
                        public void onDownloadFinished(long totalBytes, String fileName, String appName) {

                        }

                        @Override
                        public void onInstalled(String fileName, String appName) {

                        }
                    });
                }
            }
        }, AD_TIME_OUT);

    }
}
