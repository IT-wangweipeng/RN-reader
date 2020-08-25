package com.droi.reader;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import cn.jpush.android.api.JPushInterface;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.os.Handler;
import android.os.Message;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.view.Window;
import android.graphics.Color;

import com.droi.reader.model.local.ReadSettingManager;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.utils.Constant;
import com.droi.reader.ui.activity.StartupActivity;
import com.droi.reader.ui.activity.SplashActivity;
import com.droi.reader.update.CheckUpdateTask;
import com.droi.reader.utils.NetworkUtils;
import com.droi.reader.model.local.ReadSettingManager;
import com.droi.reader.utils.BrightnessUtils;
import com.droi.reader.utils.LogUtils;

import com.umeng.analytics.MobclickAgent;
import com.droi.sdk.analytics.DroiAnalytics;

public class MainActivity extends ReactActivity {
    public static MainActivity instance;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "reader";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    public void finish() {
        //先退出splash页面
        if (SplashActivity.instance != null && !SplashActivity.instance.isDestroyed()) {
            LogUtils.i("yy","MainActivity finish() 11");
            SplashActivity.instance.finish();
        }

        super.finish();
    }

    ///////////////////////////////////////////////////////////////
    private static final int MSG_EXIT_FULLSCREEN = 1000;
    private static final int MSG_UPDATE_NIGHTMODE = 1001;
    private static final int MSG_CHECK_UPDATE = 1002;
    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            if (MSG_EXIT_FULLSCREEN == msg.what) {
                fullScreen(false);
                handler.postDelayed(() -> {
                    LogUtils.i("yy","setBackgroundDrawableResource white");
                    //getWindow().setBackgroundDrawableResource(R.color.white);
                    getWindow().getDecorView().setBackgroundColor(Color.WHITE);
                   if (SplashActivity.instance != null && !SplashActivity.instance.isDestroyed()) {
                       SplashActivity.instance.finish();
                   }

                    doCheckUpdateTask(1);
                },1000);
            } else if(MSG_UPDATE_NIGHTMODE == msg.what) {
                updateNightMode();
            } else if( MSG_CHECK_UPDATE == msg.what) {
                doCheckUpdateTask(0);
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
        instance = this;
        fullScreen(true);
        initMaskView();
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
        DroiAnalytics.onPause(this);
        MobclickAgent.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateNightMode();
        JPushInterface.onResume(this);
        DroiAnalytics.onResume(this);
        MobclickAgent.onResume(this);
    }

    public void hideSplash(){
        handler.sendEmptyMessage(MSG_EXIT_FULLSCREEN);
    }

    public void sendUpdateNightModeMsg(){
        handler.sendEmptyMessage(MSG_UPDATE_NIGHTMODE);
    }

    public void sendCheckUpdateMsg() {
        handler.sendEmptyMessage(MSG_CHECK_UPDATE);
    }

    public void fullScreen(boolean enable) {
        LogUtils.i("yy","fullScreen enable="+enable);
        if (enable){//设置为全屏
            getWindow().getDecorView().
                    setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN);
        }else{//设置为非全屏
            getWindow().getDecorView().
                    setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
        }
    }

    private ViewGroup maskRootView;
    private FrameLayout maskView;

    private void initMaskView() {
        ViewGroup contentView = getWindow().findViewById(Window.ID_ANDROID_CONTENT);
        maskRootView = new FrameLayout(this);
        maskRootView.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        contentView.addView(maskRootView);

        maskView = new FrameLayout(this);
        maskView.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        maskView.setBackgroundColor(getResources().getColor(R.color.night_mask));//背景设置灰色透明
    }

    public void updateNightMode() {
        boolean isNightMode = ReadSettingManager.getInstance().isNightMode();
        maskRootView.removeAllViews();
        if (isNightMode) {
            maskRootView.addView(maskView);
        }
    }

    private void doCheckUpdateTask(int type) {
        if(NetworkUtils.isAvailable(MainActivity.this)) {
            new CheckUpdateTask(MainActivity.this, type).execute();
        }
    }
}
