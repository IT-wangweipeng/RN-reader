package com.droi.reader.utils;

import android.app.Activity;
import android.content.Context;

/**
 * Created by lenovo on 2018/6/17.
 * Albert
 * 工具类
 */

public class PublicUtile {

    private static PublicUtile mPublicUtile;

    public static PublicUtile getInstance() {
        if (mPublicUtile == null) {
            mPublicUtile = new PublicUtile();
        }
        return mPublicUtile;
    }

    public static String TestApkName = "test.apk";//存放apk的名字

    /**
     * 下载apk的地址，使用这个下载地址可以不需要 WRITE_EXTERNAL_STORAGE 权限。 具体路径为SDCard/Android/data/你的应用包名/cache/目录。
     *
     * @param mContext
     */
    public static String getApkDownPath(Context mContext) {
        return mContext.getExternalCacheDir().getPath() + "/myApk/";
    }


    private Activity mActivity;

    public Activity getmActivity() {
        return mActivity;
    }

    public void setmActivity(Activity mActivity) {
        this.mActivity = mActivity;
    }
}
