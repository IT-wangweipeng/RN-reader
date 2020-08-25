package com.droi.reader.utils;

import android.app.ActivityManager;
import android.app.DownloadManager;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Environment;
import android.os.StatFs;
import android.text.format.Formatter;
import android.util.DisplayMetrics;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

public class Util {

    public static final int[] getScreenSizeInDP(Context context) {
        DisplayMetrics dm = context.getResources().getDisplayMetrics();
        float density = dm.density;
        return new int[]{(int) (dm.widthPixels / density + 0.5), (int) (dm.heightPixels / density + 0.5)};
    }

    public static float getScreenWidthDp(Context context){
        final float scale = context.getResources().getDisplayMetrics().density;
        float width = context.getResources().getDisplayMetrics().widthPixels;
        return width / (scale <= 0 ? 1 : scale) + 0.5f;
    }

    private void testDownloadManager(Context context) {
        /**
         * 下载Apk, 并设置Apk地址,
         * 默认位置: /storage/sdcard0/Download
         *
         * @param context    上下文
         * @param downLoadUrl 下载地址
         * @param infoName   通知名称
         * @param description  通知描述
         */

        DownloadManager.Request request;
        try {
            request = new DownloadManager.Request(Uri.parse("http://openbox.mobilem.360.cn/index/d/sid/3779166"));
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        request.setTitle("测试下载apk1");
        request.setDescription("测试下载apk2");

        //在通知栏显示下载进度
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.HONEYCOMB) {
            request.allowScanningByMediaScanner();
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        }

        //设置保存下载apk保存路径
        request.setDestinationInExternalPublicDir("adroi_test", "test.apk");

        DownloadManager manager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
        //进入下载队列
        manager.enqueue(request);

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
    }

    //GB
    public static int getPhoneRomSize() {
        Log.e("adroicore", "root path: " + Environment.getDataDirectory().getParentFile().getAbsolutePath());
        final StatFs statFs = new StatFs(Environment.getDataDirectory().getParentFile().getAbsolutePath());
        long blockSize = 0;
        long availavleBlocks = 0;
        if (android.os.Build.VERSION.SDK_INT < 18) {
            blockSize = statFs.getBlockSize();
            availavleBlocks = statFs.getAvailableBlocks();
        } else {
            blockSize = statFs.getBlockSizeLong();
            availavleBlocks = statFs.getAvailableBlocksLong();
        }
        return (int) ((availavleBlocks * blockSize) / 1024 / 1024 / 1024);
    }

    //MB
    public static int getKYPhoneRamSize(Context context) {
        //获取运行内存的信息
        ActivityManager manager = (ActivityManager) context.getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
        ActivityManager.MemoryInfo info = new ActivityManager.MemoryInfo();
        manager.getMemoryInfo(info);
        Log.e("adroicore", Formatter.formatFileSize(context.getApplicationContext(), info.availMem));
        return (int) (info.availMem / 1024 / 1024);
    }

    //获取total运行内存 mb
    public static int getPhoneRam(Context context) {
        //获取运行内存的信息
        ActivityManager manager = (ActivityManager) context.getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
        ActivityManager.MemoryInfo info = new ActivityManager.MemoryInfo();
        manager.getMemoryInfo(info);
        Log.e("adroicore", Formatter.formatFileSize(context.getApplicationContext(), info.totalMem));
        return (int) (info.totalMem / 1024 / 1024);
    }

    //获取total内存 GB
    public static int getPhoneRom() {
        //获取ROM内存信息
        //调用该类来获取磁盘信息（而getDataDirectory就是内部存储）
        Log.e("adroicore", "rom path:" + Environment.getDataDirectory().getAbsolutePath());
        final StatFs statFs = new StatFs(Environment.getDataDirectory().getAbsolutePath());
        long blockSize = 0;
        long totalBlocks = 0;
        if (android.os.Build.VERSION.SDK_INT < 18) {
            blockSize = statFs.getBlockSize();
            totalBlocks = statFs.getBlockCount();
        } else {
            blockSize = statFs.getBlockSizeLong();
            totalBlocks = statFs.getBlockCountLong();
        }
        return (int) ((totalBlocks * blockSize) / 1024 / 1024 / 1024);
    }

    private void initCopy(Context context, String str) {
        //获取剪贴板管理器：
        ClipboardManager cm = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        // 创建普通字符型ClipData
        ClipData mClipData = ClipData.newPlainText("Label", str);
        // 将ClipData内容放到系统剪贴板里。
        if (android.os.Build.VERSION.SDK_INT >= 11) {
            cm.setPrimaryClip(mClipData);
        } else {
            cm.setText(str);
        }
    }

    /**
     * 根据ip通过百度api去获取城市
     *
     * @param ip
     * @return
     */
    public static String Ip2LocationByBaiduApi(String ip) {
        try {
            URL url = new URL("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=" + ip);
            URLConnection connection = url.openConnection();
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
            String line = null;
            StringBuffer res = new StringBuffer();
            while ((line = reader.readLine()) != null) {
                res.append(line);
            }
            reader.close();
            String ipAddr = res.toString();
            JSONObject jsonObject = new JSONObject(ipAddr);
            if ("1".equals(jsonObject.get("ret").toString())) {
                return jsonObject.get("city").toString();
            } else {
                return "读取失败";
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return "读取失败 e -- " + e.getMessage();
        } catch (IOException e) {
            e.printStackTrace();
            return "读取失败 e -- " + e.getMessage();
        } catch (JSONException e) {
            e.printStackTrace();
            return "读取失败 e -- " + e.getMessage();
        }
    }

    /**
     * 复制单个文件
     *
     * @param oldPath$Name String 原文件路径+文件名 如：data/user/0/com.test/files/abc.txt
     * @param newPath$Name String 复制后路径+文件名 如：data/user/0/com.test/cache/abc.txt
     * @return <code>true</code> if and only if the file was copied;
     * <code>false</code> otherwise
     */
    public boolean copyFile(String oldPath$Name, String newPath$Name) {
        try {
            Log.e("adroiad", "newPath$Name:  " + newPath$Name);

            File oldFile = new File(oldPath$Name);
            if (!oldFile.exists()) {
                Log.e("adroiad", "copyFile:  oldFile not exist.");
                return false;
            } else if (!oldFile.isFile()) {
                Log.e("adroiad", "copyFile:  oldFile not file.");
                return false;
            } else if (!oldFile.canRead()) {
                Log.e("adroiad", "copyFile:  oldFile cannot read.");
                return false;
            }

            File newFile = new File(newPath$Name);

            if (newFile.exists()) {
                newFile.delete();
            }
            newFile.createNewFile();

            FileInputStream fileInputStream = new FileInputStream(oldPath$Name);
            FileOutputStream fileOutputStream = new FileOutputStream(newPath$Name);
            byte[] buffer = new byte[1024];
            int byteRead;
            while (-1 != (byteRead = fileInputStream.read(buffer))) {
                fileOutputStream.write(buffer, 0, byteRead);
            }
            fileInputStream.close();
            fileOutputStream.flush();
            fileOutputStream.close();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
