package com.droi.reader;

import android.support.multidex.MultiDexApplication;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;

import com.facebook.react.ReactApplication;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import com.henninghall.date_picker.DatePickerPackage;
import cn.reactnative.modules.qq.QQPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.learnta.clear.ClearCachePackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import io.realm.react.RealmReactPackage;
import com.theweflex.react.WeChatPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cn.jpush.reactnativejpush.JPushPackage;
import com.droi.reader.module.DplusReactPackage;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.example.react_native_baas.BaasPackage;
import com.droi.sdk.core.Core;
import com.droi.sdk.analytics.DroiAnalytics;

import java.util.Arrays;
import java.util.List;

import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.droi.reader.utils.Constant;
import com.droi.reader.utils.SharedPreUtils;
import com.droi.reader.utils.TTAdManagerHolder;
import com.droi.reader.utils.LogUtils;


import android.app.ActivityManager;
import android.webkit.WebView;
import com.qq.e.comm.managers.GDTADManager;
import com.qq.e.comm.managers.setting.GlobalSetting;

public class MainApplication extends MultiDexApplication implements ReactApplication {
  private boolean SHUTDOWN_TOAST = true;
  private boolean SHUTDOWN_LOG = false;
  private static final OpenNativePackage openNativePackage = new OpenNativePackage();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AMapGeolocationPackage(),
            new DatePickerPackage(),
            new QQPackage(),
            new SvgPackage(),
            new RNCWebViewPackage(),
            new ClearCachePackage(),
            new ImagePickerPackage(),
            new NetInfoPackage(),
            new SplashScreenReactPackage(),
            new RealmReactPackage(),
            new WeChatPackage(),
            new RNGestureHandlerPackage(),
            new RNDeviceInfo(),
            new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
            new DplusReactPackage(),
            new BaasPackage(),
            openNativePackage
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  private static Context sInstance;
  @Override
  public void onCreate() {
    super.onCreate();
    sInstance = this;
    SoLoader.init(this, /* native exopackage */ false);

    //umeng推送升级到8.0.0
    String umeng_appkey = "5cdcbe3d0cafb2c772000771";
    String umeng_channel = getAppMetaData(this, "UMENG_CHANNEL");//获取app当前的渠道号
    LogUtils.i("yy","umeng_channel="+umeng_channel);
    UMConfigure.setLogEnabled(true);
    //初始化组件化基础库, 统计SDK/推送SDK/分享SDK都必须调用此初始化接口
    UMConfigure.init(this, umeng_appkey, umeng_channel, UMConfigure.DEVICE_TYPE_PHONE, null);
    //统计SDK是否支持采集在子进程中打点的自定义事件，默认不支持
    UMConfigure.setProcessEvent(true);//支持多进程打点
    MobclickAgent.setPageCollectionMode(MobclickAgent.PageMode.AUTO);
    //MobclickAgent.openActivityDurationTrack(false);


    Core.initialize(this);
    DroiAnalytics.initialize(this);


    //穿山甲SDK初始化
    //强烈建议在应用对应的Application#onCreate()方法中调用，避免出现content为null的异常
    TTAdManagerHolder.init(this);

    //广点通SDK初始化
    config(this);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        String processName = getProcessName(this);
        String packageName = this.getPackageName();
        if (!packageName.equals(processName)) {
            WebView.setDataDirectorySuffix(processName);
        }
    }
  }

  public static Context getContext() {
      return sInstance;
  }

    void config(Context context) {
        // 通过调用此方法初始化 SDK。如果需要在多个进程拉取广告，每个进程都需要初始化 SDK。
        GDTADManager.getInstance().initWith(context, Constant.GDT_AD_APP_ID);

        GlobalSetting.setChannel(1);
        GlobalSetting.setEnableMediationTool(true);
    }

  private String getProcessName(Context context) {
      if (context == null) return null;
      ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
      for (ActivityManager.RunningAppProcessInfo processInfo : manager.getRunningAppProcesses()) {
          if (processInfo.pid == android.os.Process.myPid()) {
              return processInfo.processName;
          }
      }
      return null;
  }


  public static OpenNativePackage getOpenNativePackage() {
    return openNativePackage;
  }

  /**
   * 获取app当前的渠道号或application中指定的meta-data
   *
   * @return 如果没有获取成功(没有对应值，或者异常)，则返回值为空
   */
  public static String getAppMetaData(Context context, String key) {
      if (context == null || TextUtils.isEmpty(key)) {
          return null;
      }
      String channelNumber = null;
      try {
          PackageManager packageManager = context.getPackageManager();
          if (packageManager != null) {
              ApplicationInfo applicationInfo = packageManager.getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA);
              if (applicationInfo != null) {
                  if (applicationInfo.metaData != null) {
                      channelNumber = applicationInfo.metaData.getString(key);
                  }
              }
          }
      } catch (PackageManager.NameNotFoundException e) {
          e.printStackTrace();
      }
      return channelNumber;
  }

}
