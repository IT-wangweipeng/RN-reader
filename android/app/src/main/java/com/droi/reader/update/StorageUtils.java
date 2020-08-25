package com.droi.reader.update;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import com.droi.reader.MainApplication;

import java.io.File;

final class StorageUtils {
    private static final String DIR_DOWNLOAD = "update_download";

    /**
     * 获取应用的缓存目录
     */
    private static File getCacheDirectory(Context context) {
        File appCacheDir = context.getCacheDir();
        if (appCacheDir == null) {
            Log.w("StorageUtils", "Can't define system cache directory! The app should be re-installed.");
        }
        return appCacheDir;
    }

    /**
     * 获取文件下载父目录
     *
     * @return 文件下载父目录
     */
    public static File getDownloadParentFile() {
        File appDir = new File(getCacheDirectory(MainApplication.getContext()), DIR_DOWNLOAD);
        if (!appDir.exists()) {
            appDir.mkdir();
        }
        return appDir;
    }



}
