package com.droi.reader.adview;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
import android.util.Log;
import android.view.LayoutInflater;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.Color;
import android.support.annotation.Nullable;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.droi.reader.R;
import com.droi.reader.utils.ScreenUtils;
import com.droi.reader.utils.TTAdManagerHolder;
import com.droi.reader.MainApplication;
import com.droi.reader.utils.Constant;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.utils.Util;
import com.droi.reader.utils.LogUtils;

import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.List;
import java.util.Map;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.droi.reader.MainActivity;

public class RCTAdView extends SimpleViewManager<AdView> {
    private static final String TAG = "yy";

    private ThemedReactContext mReactContext;
    private AdView mAdView;

    private static final String AD_DID_LOAD = "adDidLoad";
    private static final String AD_LOAD_FAILED = "adLoadFailed";
    private static final String ON_NATIVE_AD_DID_LOAD = "onNativeAdDidLoad";
    private static final String ON_NATIVE_AD_LOAD_FAILED = "onNativeAdLoadFailed";

    @Override
    public String getName() {
        return "RCTAdView";
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        builder.put(AD_DID_LOAD,MapBuilder.of("registrationName",ON_NATIVE_AD_DID_LOAD));
        builder.put(AD_LOAD_FAILED,MapBuilder.of("registrationName", ON_NATIVE_AD_LOAD_FAILED));
        return builder.build();
    }

    private void sendDidLoadEvent(String height) {
        WritableMap data = Arguments.createMap();
        data.putString("height", height);
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mAdView.getId(), AD_DID_LOAD, data);
    }

    private void sendLoadFailedEvent() {
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(mAdView.getId(), AD_LOAD_FAILED, null);
    }


    @Override
    protected AdView createViewInstance(ThemedReactContext reactContext) {
        this.mReactContext = reactContext;
        AdViewLoadCallback adViewLoadCallback = new AdViewLoadCallback() {
                @Override
                public void onLoadSuccess(String height) {
                    LogUtils.i(TAG,"onLoadSuccess height="+height);
                    sendDidLoadEvent(height);
                }

                @Override
                public void onLoadFail() {
                    LogUtils.i(TAG,"onLoadFail");
                    sendLoadFailedEvent();
                }
            };
        mAdView = new AdView(reactContext.getCurrentActivity(), adViewLoadCallback);
        return mAdView;
    }


}
